import { useEffect, useRef } from 'react';
import { api, JobStatus } from './api';

interface UseJobStreamOptions {
  /** Job to follow. Pass null to disconnect / idle. */
  jobId: string | null;
  onStatus: (jobId: string, data: Partial<JobStatus>) => void;
  onDone: (jobId: string) => void;
  onFailed: (jobId: string, message: string) => void;
  onNotFound: (jobId: string) => void;
  retryLimit?: number;
}

type StreamMessage = Partial<Omit<JobStatus, 'status'>> & {
  status?: JobStatus['status'] | 'not_found';
};

/**
 * Subscribes to the backend SSE stream for a job and auto-reconnects on drop.
 *
 * The EventSource is closed whenever `jobId` changes or the component unmounts,
 * so a previous connection can never leak or keep updating state for a stale job.
 * Every callback receives the originating `jobId` so callers can ignore messages
 * that belong to a superseded connection.
 */
export function useJobStream({ jobId, onStatus, onDone, onFailed, onNotFound, retryLimit = 5 }: UseJobStreamOptions) {
  const sourceRef = useRef<EventSource | null>(null);
  const retryRef = useRef(0);
  const timerRef = useRef<number | null>(null);
  const activeJobRef = useRef<string | null>(null);

  // Hold the latest callbacks in a ref so re-renders don't force a reconnect.
  const cbRef = useRef({ onStatus, onDone, onFailed, onNotFound });
  cbRef.current = { onStatus, onDone, onFailed, onNotFound };

  useEffect(() => {
    if (!jobId) return;
    let disposed = false;
    activeJobRef.current = jobId;

    const disconnect = () => {
      if (sourceRef.current) {
        sourceRef.current.close();
        sourceRef.current = null;
      }
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };

    const connect = () => {
      if (disposed) return;
      disconnect();
      const source = new EventSource(api.streamUrl(jobId));
      sourceRef.current = source;

      source.onmessage = (event) => {
        // Ignore events from a superseded connection (job changed or unmounted).
        if (activeJobRef.current !== jobId) return;

        let data: StreamMessage;
        try {
          data = JSON.parse(event.data);
        } catch {
          return;
        }
        retryRef.current = 0; // got data — connection is alive

        if (data.status === 'not_found') {
          cbRef.current.onNotFound(jobId);
          disconnect();
        } else if (data.status === 'done') {
          cbRef.current.onDone(jobId);
          disconnect();
        } else if (data.status === 'failed') {
          cbRef.current.onFailed(jobId, data.error || 'Xử lý thất bại');
          disconnect();
        } else {
          // Ở đây status chắc chắn là queued/running (đã loại not_found/done/failed)
          cbRef.current.onStatus(jobId, data as Partial<JobStatus>);
        }
      };

      source.onerror = () => {
        source.close();
        sourceRef.current = null;
        retryRef.current += 1;
        if (retryRef.current <= retryLimit) {
          timerRef.current = window.setTimeout(connect, 2000);
        } else {
          cbRef.current.onFailed(jobId, 'Mất kết nối tới server sau nhiều lần thử lại!');
        }
      };
    };

    connect();
    return () => {
      disposed = true;
      activeJobRef.current = null;
      disconnect();
    };
  }, [jobId, retryLimit]);

  return {
    disconnect() {
      activeJobRef.current = null;
      if (sourceRef.current) {
        sourceRef.current.close();
        sourceRef.current = null;
      }
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    },
  };
}

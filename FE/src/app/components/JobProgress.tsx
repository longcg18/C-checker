import { useEffect, useState } from 'react';

interface JobProgressProps {
  progress: string | null;       // "3/12"
  currentSentence: string | null;
  status: 'queued' | 'running';
  startTime: number;
}

export function JobProgress({ progress, currentSentence, status, startTime }: JobProgressProps) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [startTime]);

  const [current, total] = (progress || '0/0').split('/').map(Number);
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return m > 0 ? `${m}m ${sec}s` : `${sec}s`;
  };

  return (
    <div className="c-job-progress">
      {/* Header */}
      <div className="c-progress-header">
        <div className="c-progress-spinner">
          <div className="c-spinner-ring" />
        </div>
        <div>
          <div className="c-progress-title">
            {status === 'queued' ? '⏳ Đang xếp hàng...' : '⚙️ Đang phân tích văn bản...'}
          </div>
          <div className="c-progress-sub">
            Sử dụng MiniLM semantic + DDGS search · Thời gian: {formatTime(elapsed)}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      {total > 0 && (
        <div className="c-progress-section">
          <div className="c-progress-meta">
            <span>Câu {current} / {total}</span>
            <span className="c-progress-pct">{pct}%</span>
          </div>
          <div className="c-progress-track">
            <div
              className="c-progress-fill"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      )}

      {/* Current sentence */}
      {currentSentence && (
        <div className="c-current-sentence">
          <div className="c-sentence-label">🔍 Đang kiểm tra câu:</div>
          <div className="c-sentence-text">{currentSentence}</div>
        </div>
      )}

      {/* Info pills */}
      <div className="c-info-pills">
        <div className="c-pill">
          <span className="c-pill-dot c-pill-dot--blue" />
          LCS + N-gram
        </div>
        <div className="c-pill">
          <span className="c-pill-dot c-pill-dot--purple" />
          Semantic MiniLM
        </div>
        <div className="c-pill">
          <span className="c-pill-dot c-pill-dot--green" />
          DDGS Web Search
        </div>
      </div>
    </div>
  );
}

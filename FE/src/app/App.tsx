import { useState, useCallback } from 'react';
import { api, JobStatus, JobResult } from './lib/api';
import { UploadSection } from './components/UploadSection';
import { AnalysisResults } from './components/AnalysisResults';
import { HistoryPanel } from './components/HistoryPanel';
import { JobProgress } from './components/JobProgress';

// ── Types ──────────────────────────────────────────────────────────────────

export interface HistoryEntry {
  job_id: string;
  fileName: string;
  timestamp: Date;
  verdict: 'HIGH' | 'MEDIUM' | 'LOW';
  verdict_text: string;
  max_score: number;
  matches_found: number;
  result: JobResult;
}

type AppState =
  | { phase: 'idle' }
  | { phase: 'submitting' }
  | { phase: 'polling'; job_id: string; status: JobStatus; startTime: number }
  | { phase: 'done'; result: JobResult }
  | { phase: 'error'; message: string };

// ── App ────────────────────────────────────────────────────────────────────

export default function App() {
  const [appState, setAppState] = useState<AppState>({ phase: 'idle' });
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const handleAnalyze = useCallback(async (fileName: string, text: string) => {
    setAppState({ phase: 'submitting' });

    try {
      // 1. Submit job
      const submitRes = await api.submitCheck(text);
      const { job_id } = submitRes;

      const startTime = Date.now();

      // 2. Initial status
      const initialStatus = await api.pollStatus(job_id);
      setAppState({ phase: 'polling', job_id, status: initialStatus, startTime });

      // 3. Poll loop
      const poll = async (): Promise<void> => {
        await new Promise((r) => setTimeout(r, 2000));
        try {
          const status = await api.pollStatus(job_id);
          if (status.status === 'done') {
            const result = await api.getResult(job_id);
            setAppState({ phase: 'done', result });
            setHistory((prev) => [
              {
                job_id,
                fileName,
                timestamp: new Date(),
                verdict: result.verdict,
                verdict_text: result.verdict_text,
                max_score: result.max_score,
                matches_found: result.matches_found,
                result,
              },
              ...prev,
            ]);
          } else if (status.status === 'failed') {
            setAppState({ phase: 'error', message: status.error || 'Xử lý thất bại' });
          } else {
            setAppState((prev) =>
              prev.phase === 'polling'
                ? { ...prev, status }
                : prev
            );
            await poll();
          }
        } catch (e: unknown) {
          const msg = e instanceof Error ? e.message : String(e);
          setAppState({ phase: 'error', message: msg });
        }
      };

      await poll();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setAppState({ phase: 'error', message: msg });
    }
  }, []);

  const handleSelectHistory = useCallback((entry: HistoryEntry) => {
    setAppState({ phase: 'done', result: entry.result });
  }, []);

  const handleReset = useCallback(() => {
    setAppState({ phase: 'idle' });
  }, []);

  const isAnalyzing = appState.phase === 'submitting' || appState.phase === 'polling';

  return (
    <div className="c-app">
      {/* ── Header ── */}
      <header className="c-header">
        <div className="c-header-inner">
          <div className="c-logo">
            <div className="c-logo-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
            </div>
            <div>
              <div className="c-logo-title">C-checker</div>
              <div className="c-logo-sub">Chinese Plagiarism Detection · v5</div>
            </div>
          </div>
          <div className="c-header-badges">
            <span className="c-badge c-badge--blue">MiniLM Semantic</span>
            <span className="c-badge c-badge--purple">LCS · N-gram</span>
            <span className="c-badge c-badge--green">DDGS Search</span>
          </div>
        </div>
      </header>

      {/* ── Main Layout ── */}
      <main className="c-main">
        <div className="c-layout">
          {/* Left panel */}
          <div className="c-left-panel">
            <UploadSection
              onAnalyze={handleAnalyze}
              isAnalyzing={isAnalyzing}
              onReset={handleReset}
              currentPhase={appState.phase}
            />
            <HistoryPanel
              history={history}
              onSelectEntry={handleSelectHistory}
              currentJobId={appState.phase === 'done' ? appState.result.job_id : undefined}
            />
          </div>

          {/* Right panel */}
          <div className="c-right-panel">
            {appState.phase === 'idle' && (
              <div className="c-empty-state">
                <div className="c-empty-icon">
                  <svg viewBox="0 0 64 64" fill="none">
                    <circle cx="32" cy="32" r="30" stroke="var(--c-border)" strokeWidth="2" />
                    <path d="M20 32h24M32 20v24" stroke="var(--c-accent)" strokeWidth="2.5" strokeLinecap="round" />
                    <circle cx="32" cy="32" r="8" stroke="var(--c-accent2)" strokeWidth="2" />
                  </svg>
                </div>
                <h2 className="c-empty-title">Sẵn sàng kiểm tra</h2>
                <p className="c-empty-desc">
                  Nhập hoặc upload văn bản tiếng Trung để bắt đầu phân tích đạo văn với độ chính xác cao.
                </p>
                <div className="c-empty-features">
                  <div className="c-feature-item">
                    <span className="c-feature-dot" style={{ background: 'var(--c-accent)' }} />
                    Phát hiện theo từng câu
                  </div>
                  <div className="c-feature-item">
                    <span className="c-feature-dot" style={{ background: 'var(--c-accent2)' }} />
                    So sánh ngữ nghĩa MiniLM
                  </div>
                  <div className="c-feature-item">
                    <span className="c-feature-dot" style={{ background: '#44c98a' }} />
                    Tìm kiếm web tự động
                  </div>
                </div>
              </div>
            )}

            {appState.phase === 'submitting' && (
              <div className="c-empty-state">
                <div className="c-submitting-spinner" />
                <h2 className="c-empty-title">Đang gửi văn bản...</h2>
                <p className="c-empty-desc">Kết nối với server phân tích</p>
              </div>
            )}

            {appState.phase === 'polling' && (
              <JobProgress
                progress={appState.status.progress}
                currentSentence={appState.status.current_sentence}
                status={appState.status.status as 'queued' | 'running'}
                startTime={appState.startTime}
              />
            )}

            {appState.phase === 'done' && (
              <AnalysisResults
                result={appState.result}
                onReset={handleReset}
              />
            )}

            {appState.phase === 'error' && (
              <div className="c-error-state">
                <div className="c-error-icon">❌</div>
                <h2 className="c-error-title">Đã xảy ra lỗi</h2>
                <p className="c-error-msg">{appState.message}</p>
                <p className="c-error-hint">
                  Hãy đảm bảo backend đang chạy tại <code> Hugging Face </code>
                </p>
                <button className="c-btn c-btn--primary" onClick={handleReset}>
                  Thử lại
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
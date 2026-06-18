import { useState, useCallback, useEffect } from 'react';
import { api, JobStatus, JobResult, getToken } from './lib/api';
import { UploadSection } from './components/UploadSection';
import { AnalysisResults } from './components/AnalysisResults';
import { HistoryPanel } from './components/HistoryPanel';
import { JobProgress } from './components/JobProgress';
import { Login } from './components/Login';
import { DashboardTable } from './components/DashboardTable';

// ── Types ──────────────────────────────────────────────────────────────────

export interface HistoryEntry {
  job_id: string;
  fileName: string;
  timestamp: Date;
  status: 'queued' | 'running' | 'done' | 'failed';
  verdict?: 'HIGH' | 'MEDIUM' | 'LOW';
  verdict_text?: string;
  max_score?: number;
  matches_found?: number;
  progress?: string;
  current_sentence?: string;
  error?: string;
  result?: JobResult;
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
  const [user, setUser] = useState<any>(null);

  const loadHistory = useCallback(async () => {
    try {
      const data = await api.getHistory();
      setHistory(data.map((d) => ({
        ...d,
        timestamp: new Date(d.timestamp)
      })));
    } catch (e) {
      console.error("Failed to load history", e);
    }
  }, []);

  useEffect(() => {
    if (getToken()) {
      const storedUser = localStorage.getItem('c_checker_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      loadHistory();
    }
  }, [loadHistory]);

  const handleLogin = (userData: any) => {
    setUser(userData);
    localStorage.setItem('c_checker_user', JSON.stringify(userData));
    loadHistory();
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('c_checker_user');
    setHistory([]);
    setAppState({ phase: 'idle' });
  };

  const handleAnalyze = useCallback(async (fileName: string, text: string) => {
    if (!getToken()) {
      setAppState({ phase: 'error', message: 'Vui lòng đăng nhập trước khi kiểm tra!' });
      return;
    }

    setAppState({ phase: 'submitting' });

    try {
      // 1. Submit job
      const submitRes = await api.submitCheck(text, fileName);
      const { job_id } = submitRes;
      const startTime = Date.now();

      // Set initial status to show progress UI
      setAppState({ phase: 'polling', job_id, status: { job_id, status: 'queued', progress: '0/0', current_sentence: null, created_at: new Date().toISOString(), finished_at: null, error: null }, startTime });

      // 2. Use SSE to listen to progress
      const source = new EventSource(api.streamUrl(job_id));

      source.onmessage = async (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.status === 'not_found') {
            source.close();
            setAppState({ phase: 'error', message: 'Không tìm thấy Job' });
            return;
          }

          if (data.status === 'done') {
            source.close();
            const result = await api.getResult(job_id);
            setAppState({ phase: 'done', result });

            loadHistory();
          } else if (data.status === 'failed') {
            source.close();
            setAppState({ phase: 'error', message: data.error || 'Xử lý thất bại' });
          } else {
            setAppState((prev) =>
              prev.phase === 'polling'
                ? { ...prev, status: { ...prev.status, ...data } }
                : prev
            );
          }
        } catch (e) {
          console.error("Error parsing SSE data", e);
        }
      };

      source.onerror = (err) => {
        console.error("SSE Error", err);
        source.close();
        setAppState({ phase: 'error', message: 'Mất kết nối tới server!' });
      };

    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setAppState({ phase: 'error', message: msg });
    }
  }, [loadHistory]);

  const handleSelectHistory = useCallback((entry: HistoryEntry) => {
    if (!entry.result) return;
    setAppState({
      phase: 'done',
      result: {
        ...entry.result,
        job_id: entry.job_id
      }
    });
  }, []);

  const handleSelectProgress = useCallback((job_id: string, fileName: string, startTimeMs: number) => {
    setAppState({
      phase: 'polling',
      job_id,
      status: {
        job_id,
        status: 'running',
        progress: '0/0',
        current_sentence: null,
        created_at: new Date(startTimeMs).toISOString(),
        finished_at: null,
        error: null
      },
      startTime: startTimeMs
    });

    const source = new EventSource(api.streamUrl(job_id));

    source.onmessage = async (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.status === 'not_found') {
          source.close();
          setAppState({ phase: 'error', message: 'Không tìm thấy Job' });
          return;
        }

        if (data.status === 'done') {
          source.close();
          const result = await api.getResult(job_id);
          setAppState({ phase: 'done', result });
          loadHistory();
        } else if (data.status === 'failed') {
          source.close();
          setAppState({ phase: 'error', message: data.error || 'Xử lý thất bại' });
        } else {
          setAppState((prev) =>
            prev.phase === 'polling'
              ? { ...prev, status: { ...prev.status, ...data } }
              : prev
          );
        }
      } catch (e) {
        console.error("Error parsing SSE data", e);
      }
    };

    source.onerror = (err) => {
      console.error("SSE Error", err);
      source.close();
      setAppState({ phase: 'error', message: 'Mất kết nối tới server!' });
    };
  }, [loadHistory]);

  // Auto-poll history if there are pending jobs (queued or running)
  useEffect(() => {
    if (!user || appState.phase !== 'idle') return;

    const hasPendingJobs = history.some(
      (h) => h.status === 'queued' || h.status === 'running'
    );

    if (!hasPendingJobs) return;

    const interval = setInterval(() => {
      loadHistory();
    }, 5000);

    return () => clearInterval(interval);
  }, [user, appState.phase, history, loadHistory]);

  const handleReset = useCallback(() => {
    setAppState({ phase: 'idle' });
  }, []);

  const isAnalyzing = appState.phase === 'submitting' || appState.phase === 'polling';

  if (!user && !getToken()) {
    return (
      <div className="c-landing">
        {/* Left: Advertisement */}
        <div className="c-landing-left">
          <h1 className="c-landing-title">
            Phát hiện đạo văn tiếng Trung <span>chính xác &amp; toàn diện</span>
          </h1>
          <p className="c-landing-desc">
            Hệ thống <strong>C-checker</strong> là giải pháp tiên phong trong việc phát hiện đạo văn
            văn bản tiếng Trung, kết hợp sử dụng AI (MiniLM) và các công cụ tìm kiếm online để rà soát hàng ngàn nguồn tài liệu.
            Hãy đảm bảo bài viết của bạn là duy nhất!
          </p>
          <div className="c-landing-features">
            <div className="c-landing-feature">
              <div className="c-landing-feature-icon c-landing-feature-icon--blue">🚀</div>
              <div>
                <div className="c-landing-feature-title">Multiple File Types</div>
                <p className="c-landing-feature-desc">Xử lý các tài liệu định dạng txt, docx, pdf và phân tích hàng trăm câu, hàng ngàn kí tự.</p>
              </div>
            </div>
            <div className="c-landing-feature">
              <div className="c-landing-feature-icon c-landing-feature-icon--purple">🧠</div>
              <div>
                <div className="c-landing-feature-title">AI Ngữ Nghĩa sâu</div>
                <p className="c-landing-feature-desc">Không chỉ so khớp từ ngữ, C-checker phân tích cấu trúc và ý nghĩa tiềm ẩn, đảm bảo không một phần nào bị bỏ sót.</p>
              </div>
            </div>
            <div className="c-landing-feature">
              <div className="c-landing-feature-icon c-landing-feature-icon--green">🌐</div>
              <div>
                <div className="c-landing-feature-title">Quét đa nền tảng</div>
                <p className="c-landing-feature-desc">Tự động tra cứu nội dung trên Internet, đa dạng nguồn để đối chiếu.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Login */}
        <div className="c-landing-right">
          <div className="c-login-box">
            <div className="c-login-box-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="var(--c-accent)" strokeWidth="2" width="68" height="68" style={{ margin: '0 auto', display: 'block' }}>
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
            </div>
            <h2 className="c-login-box-title">Tham gia C-checker</h2>
            <p className="c-login-box-desc">
              C-checker hiện tại đang hoàn toàn miễn phí
            </p>
            <div className="c-login-box-google">
              <Login onLogin={handleLogin} onLogout={handleLogout} currentUser={user} />
            </div>
            <p className="c-login-box-terms">
              Đăng nhập để kiểm tra tài liệu ngay.
            </p>
          </div>
        </div>
      </div>
    );
  }

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
          <div className="c-header-badges" style={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
            <span className="c-badge c-badge--blue">MiniLM Semantic</span>
            <span className="c-badge c-badge--purple">LCS · N-gram</span>
            <span className="c-badge c-badge--green">DDGS Search</span>
          </div>
          <div className="c-header-auth">
            <Login onLogin={handleLogin} onLogout={handleLogout} currentUser={user} />
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
              history={history.filter(h => h.status === 'done')}
              onSelectEntry={handleSelectHistory}
              currentJobId={appState.phase === 'done' ? appState.result.job_id : undefined}
            />
          </div>

          {/* Right panel */}
          <div className="c-right-panel">
            {appState.phase === 'idle' && (
              <DashboardTable
                history={history}
                onSelectEntry={handleSelectHistory}
                onSelectProgress={handleSelectProgress}
                onRefresh={loadHistory}
              />
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
                  Hãy đảm bảo backend đang chạy và bạn đã đăng nhập.
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
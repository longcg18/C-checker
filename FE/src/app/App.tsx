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
    if (!getToken()) return;
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
    const isUserLoggedIn = !!user || !!getToken();
    if (!isUserLoggedIn) {
      if (text.length > 300) {
        setAppState({ phase: 'error', message: 'Vui lòng đăng nhập để kiểm tra văn bản lớn hơn 300 ký tự!' });
        return;
      }
    }

    setAppState({ phase: 'submitting' });

    try {
      // 1. Submit job
      const submitRes = await api.submitCheck(text, fileName);
      const { job_id } = submitRes;
      const startTime = Date.now();

      setAppState({
        phase: 'polling',
        job_id,
        status: {
          job_id, status: 'queued', progress: '0/0',
          current_sentence: null, created_at: new Date().toISOString(),
          finished_at: null, error: null
        },
        startTime
      });

      // 2. SSE với auto-reconnect
      let retryCount = 0;
      const MAX_RETRIES = 5;
      let source: EventSource;

      const connect = () => {
        source = new EventSource(api.streamUrl(job_id));

        source.onmessage = async (event) => {
          try {
            const data = JSON.parse(event.data);
            retryCount = 0; // reset khi nhận được data thành công

            if (data.status === 'not_found') {
              source.close();
              setAppState({ phase: 'error', message: 'Không tìm thấy Job' });
              return;
            }

            if (data.status === 'done') {
              source.close();
              const result = await api.getResult(job_id);
              setAppState({ phase: 'done', result });
              if (!!getToken()) {
                loadHistory();
              }
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

        source.onerror = () => {
          source.close();
          retryCount++;

          if (retryCount <= MAX_RETRIES) {
            console.warn(`SSE mất kết nối, đang thử lại lần ${retryCount}/${MAX_RETRIES}...`);
            setTimeout(connect, 2000); // tự nối lại sau 2s
          } else {
            setAppState({ phase: 'error', message: 'Mất kết nối tới server sau nhiều lần thử lại!' });
          }
        };
      };

      connect();

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
          if (!!getToken()) {
            loadHistory();
          }
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
  const isLoggedIn = !!user || !!getToken();

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
          <div className="c-header-auth">
            <Login onLogin={handleLogin} onLogout={handleLogout} currentUser={user} />
          </div>
        </div>
      </header>

      {/* ── Main Layout ── */}
      <main className="c-main">
        {appState.phase === 'idle' && (
          <div className="c-workspace-layout">
            <div className="c-workspace-content">
              <UploadSection
                onAnalyze={handleAnalyze}
                isAnalyzing={isAnalyzing}
                onReset={handleReset}
                currentPhase={appState.phase}
                isLoggedIn={isLoggedIn}
              />
              
              {isLoggedIn ? (
                <div className="c-workspace-dashboard">
                  <DashboardTable
                    history={history}
                    onSelectEntry={handleSelectHistory}
                    onSelectProgress={handleSelectProgress}
                    onRefresh={loadHistory}
                  />
                </div>
              ) : (
                <div className="c-public-intro">
                  <div className="c-intro-hero">
                    <h1 className="c-intro-title">
                      Phát hiện đạo văn tiếng Trung thông minh
                    </h1>
                    <p className="c-intro-subtitle">
                      Hệ thống <strong>C-checker</strong> là giải pháp tiên phong tại Việt Nam hỗ trợ sinh viên, giảng viên và nhà nghiên cứu rà soát mức độ trùng lặp của văn bản tiếng Trung bằng AI (MiniLM) và các thuật toán chuyên sâu.
                    </p>
                  </div>
                  
                  <div className="c-intro-grid">
                    <div className="c-intro-card">
                      <h3 className="c-intro-card-title c-text-blue">
                        <span className="c-intro-card-icon">🚀</span> Dùng thử miễn phí
                      </h3>
                      <p className="c-intro-card-desc">
                        Không cần tài khoản, bạn có thể dán đoạn văn bản trực tiếp để kiểm tra tính nguyên bản lên tới <strong>300 ký tự</strong>.
                      </p>
                    </div>
                    <div className="c-intro-card">
                      <h3 className="c-intro-card-title c-text-purple">
                        <span className="c-intro-card-icon">🧠</span> AI ngữ nghĩa sâu
                      </h3>
                      <p className="c-intro-card-desc">
                        Phân tích ngữ cảnh bằng MiniLM kết hợp thuật toán so khớp LCS & N-gram giúp phát hiện các hình thức chỉnh sửa tinh vi.
                      </p>
                    </div>
                    <div className="c-intro-card">
                      <h3 className="c-intro-card-title c-text-green">
                        <span className="c-intro-card-icon">🌐</span> So khớp Internet
                      </h3>
                      <p className="c-intro-card-desc">
                        Tìm kiếm và đối chiếu trực tiếp dữ liệu theo thời gian thực trên các kho lưu trữ web để phát hiện nguồn sao chép.
                      </p>
                    </div>
                    <div className="c-intro-card">
                      <h3 className="c-intro-card-title c-text-amber">
                        <span className="c-intro-card-icon">📂</span> Mở khóa đầy đủ
                      </h3>
                      <p className="c-intro-card-desc">
                        Đăng nhập bằng tài khoản Google để tải lên các tệp <code>.docx</code>, <code>.pdf</code>, <code>.txt</code> và lưu trữ lịch sử kiểm tra.
                      </p>
                    </div>
                  </div>
                  
                  <div className="c-intro-faq">
                    <h2 className="c-faq-heading">
                      Các câu hỏi thường gặp (FAQs)
                    </h2>
                    <div className="c-faq-list">
                      <div className="c-faq-item">
                        <h4 className="c-faq-q">
                          Q: Tôi có cần trả phí để sử dụng C-checker không?
                        </h4>
                        <p className="c-faq-a">
                          A: Không. C-checker được cung cấp hoàn toàn miễn phí nhằm hỗ trợ tối đa việc nghiên cứu và học thuật.
                        </p>
                      </div>
                      <div className="c-faq-item">
                        <h4 className="c-faq-q">
                          Q: Cách thức quét tài liệu lớn hơn 300 ký tự?
                        </h4>
                        <p className="c-faq-a">
                          A: Bạn chỉ cần đăng nhập bằng tài khoản Google thông qua nút Đăng nhập ở góc trên cùng bên phải màn hình.
                        </p>
                      </div>
                      <div className="c-faq-item">
                        <h4 className="c-faq-q">
                          Q: Dữ liệu của tôi có được bảo mật không?
                        </h4>
                        <p className="c-faq-a">
                          A: Chúng tôi cam kết bảo mật nội dung bạn đăng tải. Đối với phiên bản dùng thử của khách, văn bản sẽ không lưu vào cơ sở dữ liệu.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {appState.phase === 'submitting' && (
          <div className="c-workspace-layout c-workspace-layout--center">
            <div className="c-empty-state">
              <div className="c-submitting-spinner" />
              <h2 className="c-empty-title">Đang gửi văn bản...</h2>
              <p className="c-empty-desc">Kết nối với server phân tích</p>
            </div>
          </div>
        )}

        {appState.phase === 'polling' && (
          <div className="c-workspace-layout c-workspace-layout--center">
            <div className="c-workspace-content c-workspace-content--state">
              <JobProgress
                progress={appState.status.progress}
                currentSentence={appState.status.current_sentence}
                status={appState.status.status as 'queued' | 'running'}
                startTime={appState.startTime}
              />
            </div>
          </div>
        )}

        {appState.phase === 'done' && (
          <div className="c-results-layout">
            <div className="c-results-container">
              <AnalysisResults
                result={appState.result}
                onReset={handleReset}
              />
            </div>
          </div>
        )}

        {appState.phase === 'error' && (
          <div className="c-workspace-layout c-workspace-layout--center">
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
          </div>
        )}
      </main>
    </div>
  );
}
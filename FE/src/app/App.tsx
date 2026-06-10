import { useState, useCallback, useEffect } from 'react';
import { api, JobStatus, JobResult, getToken } from './lib/api';
import { UploadSection } from './components/UploadSection';
import { AnalysisResults } from './components/AnalysisResults';
import { HistoryPanel } from './components/HistoryPanel';
import { JobProgress } from './components/JobProgress';
import { Login } from './components/Login';

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
  const [user, setUser] = useState<any>(null);

  const loadHistory = useCallback(async () => {
    try {
      const data = await api.getHistory();
      setHistory(data.map((d: any) => ({
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
    setAppState({ phase: 'done', result: entry.result });
  }, []);

  const handleReset = useCallback(() => {
    setAppState({ phase: 'idle' });
  }, []);

  const isAnalyzing = appState.phase === 'submitting' || appState.phase === 'polling';

  if (!user && !getToken()) {
    return (
      <div className="c-app" style={{ display: 'flex', height: '100vh', background: 'var(--c-bg)' }}>
        {/* Left side: Advertisement / Features */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '10%', background: 'linear-gradient(135deg, var(--c-surface), var(--c-bg))', borderRight: '1px solid var(--c-border)' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--c-text)', marginBottom: '24px', lineHeight: '1.2' }}>
            Phát hiện đạo văn tiếng Trung <span style={{ color: 'var(--c-accent)' }}>chính xác & toàn diện</span>
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--c-text-dim)', marginBottom: '40px', maxWidth: '600px', lineHeight: '1.6' }}>
            Hệ thống <strong>C-checker v5</strong> là giải pháp hàng đầu kết hợp công nghệ AI (MiniLM) và tìm kiếm Web DDGS để rà soát hàng ngàn nguồn tài liệu chỉ trong vài giây. Bảo vệ chất lượng bài viết của bạn ngay hôm nay!
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ background: 'rgba(59, 130, 246, 0.1)', width: '56px', height: '56px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--c-accent)', fontSize: '24px' }}>
                🚀
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--c-text)', marginBottom: '4px' }}>Kiểm tra siêu tốc</h3>
                <p style={{ fontSize: '0.95rem', color: 'var(--c-text-dim)', margin: 0 }}>Hỗ trợ txt, docx, pdf và phân tích hàng trăm câu trong nháy mắt.</p>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ background: 'rgba(139, 92, 246, 0.1)', width: '56px', height: '56px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--c-accent2)', fontSize: '24px' }}>
                🧠
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--c-text)', marginBottom: '4px' }}>AI Ngữ Nghĩa sâu</h3>
                <p style={{ fontSize: '0.95rem', color: 'var(--c-text-dim)', margin: 0 }}>Không chỉ so khớp từ ngữ, chúng tôi phân tích cấu trúc và ý nghĩa tiềm ẩn.</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', width: '56px', height: '56px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981', fontSize: '24px' }}>
                🌐
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--c-text)', marginBottom: '4px' }}>Quét đa nền tảng</h3>
                <p style={{ fontSize: '0.95rem', color: 'var(--c-text-dim)', margin: 0 }}>Tự động tra cứu nội dung trên hệ thống Internet khổng lồ để đối chiếu nguồn.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side: Login box */}
        <div style={{ width: '40%', minWidth: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px', background: 'var(--c-surface)' }}>
          <div style={{ width: '100%', maxWidth: '360px', textAlign: 'center' }}>
            <div style={{ marginBottom: '32px' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="var(--c-accent)" strokeWidth="2" width="72" height="72" style={{ margin: '0 auto' }}>
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
            </div>
            <h2 style={{ fontFamily: 'var(--c-serif)', fontSize: '28px', color: 'var(--c-text)', marginBottom: '12px' }}>Tham gia C-checker</h2>
            <p style={{ color: 'var(--c-text-dim)', marginBottom: '40px', fontSize: '1.05rem' }}>
              Vui lòng đăng nhập bằng Google để bắt đầu sử dụng công cụ miễn phí ngay hôm nay.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Login onLogin={handleLogin} onLogout={handleLogout} currentUser={user} />
            </div>
            
            <p style={{ marginTop: '32px', fontSize: '0.85rem', color: 'var(--c-text-dim)', lineHeight: '1.5' }}>
              Bằng cách đăng nhập, bạn xác nhận đã đồng ý với Điều khoản dịch vụ và Chính sách bảo mật của chúng tôi.
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
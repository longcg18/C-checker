import { useState, useCallback, useEffect } from 'react';
import { api, JobStatus, JobResult, getToken } from './lib/api';
import { useJobStream } from './lib/useJobStream';
import { UploadSection } from './components/UploadSection';
import { AnalysisResults } from './components/AnalysisResults';
import { JobProgress } from './components/JobProgress';
import { Login } from './components/Login';
import { DashboardTable } from './components/DashboardTable';
import { InfoModal, ModalType } from './components/InfoModal';
import { Footer } from './components/Footer';

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

type ViewMode = 'workspace' | 'progress' | 'result' | 'error';

interface ActiveJob {
  job_id: string;
  fileName: string;
  startTime: number;
  status: JobStatus;
}

interface ToastState {
  id: string;
  type: 'success' | 'error';
  title: string;
  desc?: string;
  result?: JobResult;
}

// ── App ────────────────────────────────────────────────────────────────────

export default function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('workspace');
  const [activeJob, setActiveJob] = useState<ActiveJob | null>(null);
  const [currentResult, setCurrentResult] = useState<JobResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [modalType, setModalType] = useState<ModalType>(null);
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

  // Stream active job via SSE in background regardless of current viewMode
  useJobStream({
    jobId: activeJob ? activeJob.job_id : null,
    onStatus: (jobId, data) => {
      setActiveJob((prev) =>
        prev && prev.job_id === jobId
          ? { ...prev, status: { ...prev.status, ...data } }
          : prev
      );
    },
    onDone: async (jobId) => {
      let result: JobResult;
      try {
        result = await api.getResult(jobId);
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        setViewMode((currentView) => {
          if (currentView === 'progress') {
            setErrorMessage(msg);
            return 'error';
          }
          return currentView;
        });
        setToast({ id: String(Date.now()), type: 'error', title: 'Lỗi lấy kết quả', desc: msg });
        setActiveJob(null);
        return;
      }

      if (getToken()) {
        loadHistory();
      }

      const completedFileName = activeJob?.fileName || 'văn bản';
      setActiveJob(null);

      setViewMode((currentView) => {
        if (currentView === 'progress') {
          setCurrentResult({ ...result, job_id: jobId });
          return 'result';
        } else {
          setToast({
            id: String(Date.now()),
            type: 'success',
            title: 'Hoàn tất kiểm tra đạo văn',
            desc: `Tài liệu "${completedFileName}" đã phân tích xong.`,
            result: { ...result, job_id: jobId }
          });
          return currentView;
        }
      });
    },
    onFailed: (jobId, message) => {
      setViewMode((currentView) => {
        if (currentView === 'progress') {
          setErrorMessage(message);
          return 'error';
        }
        return currentView;
      });
      setToast({ id: String(Date.now()), type: 'error', title: 'Phân tích thất bại', desc: message });
      setActiveJob(null);
    },
    onNotFound: (jobId) => {
      const msg = `Không tìm thấy Job ${jobId}`;
      setViewMode((currentView) => {
        if (currentView === 'progress') {
          setErrorMessage(msg);
          return 'error';
        }
        return currentView;
      });
      setToast({ id: String(Date.now()), type: 'error', title: 'Lỗi hệ thống', desc: msg });
      setActiveJob(null);
    },
  });

  const handleLogin = (userData: any) => {
    setUser(userData);
    localStorage.setItem('c_checker_user', JSON.stringify(userData));
    loadHistory();
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('c_checker_user');
    setHistory([]);
    setViewMode('workspace');
    setActiveJob(null);
    setCurrentResult(null);
  };

  const handleAnalyze = useCallback(async (fileName: string, text: string) => {
    const isUserLoggedIn = !!user || !!getToken();
    if (!isUserLoggedIn) {
      if (text.length > 300) {
        setErrorMessage('Vui lòng đăng nhập để kiểm tra văn bản lớn hơn 300 ký tự!');
        setViewMode('error');
        return;
      }
    }

    setIsSubmitting(true);
    setViewMode('progress');

    try {
      const submitRes = await api.submitCheck(text, fileName);
      const { job_id } = submitRes;
      const startTime = Date.now();

      setActiveJob({
        job_id,
        fileName,
        startTime,
        status: {
          job_id,
          status: 'queued',
          progress: '0/0',
          current_sentence: null,
          created_at: new Date().toISOString(),
          finished_at: null,
          error: null
        }
      });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setErrorMessage(msg);
      setViewMode('error');
    } finally {
      setIsSubmitting(false);
    }
  }, [user]);

  const handleSelectHistory = useCallback((entry: HistoryEntry) => {
    if (!entry.result) return;
    setCurrentResult({
      ...entry.result,
      job_id: entry.job_id
    });
    setViewMode('result');
  }, []);

  const handleSelectProgress = useCallback((job_id: string, fileName: string, startTimeMs: number) => {
    setActiveJob({
      job_id,
      fileName: fileName || 'Văn bản',
      startTime: startTimeMs,
      status: {
        job_id,
        status: 'running',
        progress: '0/0',
        current_sentence: null,
        created_at: new Date(startTimeMs).toISOString(),
        finished_at: null,
        error: null
      }
    });
    setViewMode('progress');
  }, []);

  // Auto-poll history if there are pending jobs
  useEffect(() => {
    if (!user) return;

    const hasPendingJobs = history.some(
      (h) => h.status === 'queued' || h.status === 'running'
    );

    if (!hasPendingJobs && !activeJob) return;

    const interval = setInterval(() => {
      loadHistory();
    }, 5000);

    return () => clearInterval(interval);
  }, [user, activeJob, history, loadHistory]);

  const handleReset = useCallback(() => {
    setViewMode('workspace');
    setErrorMessage(null);
  }, []);

  const isAnalyzing = isSubmitting || activeJob !== null;
  const isLoggedIn = !!user || !!getToken();

  return (
    <div className="c-app">
      {/* ── Header ── */}
      <header className="c-header">
        <div className="c-header-inner">
          <div className="c-logo" style={{ cursor: 'pointer' }} onClick={() => setViewMode('workspace')}>
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
          <nav className="c-header-nav">
            <button className="c-nav-link" onClick={() => setViewMode('workspace')}>Trang chủ</button>
            <button className="c-nav-link" onClick={() => setModalType('guide')}>📖 Hướng dẫn sử dụng</button>
            <button className="c-nav-link" onClick={() => setModalType('about')}>ℹ️ Giới thiệu</button>
          </nav>

          <div className="c-header-auth">
            <Login onLogin={handleLogin} onLogout={handleLogout} currentUser={user} />
          </div>
        </div>
      </header>

      {/* ── Main Layout ── */}
      <main className="c-main">
        {viewMode === 'workspace' && (
          <div className="c-workspace-layout">
            <div className="c-workspace-content">
              {/* Floating Mini Progress Banner if background job is running */}
              {activeJob && (
                <div className="c-mini-progress-banner">
                  <div className="c-mini-progress-main">
                    <div className="c-mini-progress-spinner" />
                    <div className="c-mini-progress-info">
                      <div className="c-mini-progress-title">
                        <span>⚙️ Đang kiểm tra: <strong>{activeJob.fileName}</strong></span>
                        <span className="c-mini-progress-badge">
                          {activeJob.status.status === 'queued' ? 'Đang xếp hàng' : `Quét ${activeJob.status.progress || '0/0'}`}
                        </span>
                      </div>
                      {activeJob.status.current_sentence && (
                        <div className="c-mini-progress-sub">
                          Đang quét: {activeJob.status.current_sentence}
                        </div>
                      )}
                    </div>
                    {activeJob.status.progress && activeJob.status.progress !== '0/0' && (() => {
                      const [cur, tot] = activeJob.status.progress.split('/').map(Number);
                      const p = tot > 0 ? Math.round((cur / tot) * 100) : 0;
                      return (
                        <div className="c-mini-progress-track" title={`${p}%`}>
                          <div className="c-mini-progress-fill" style={{ width: `${p}%` }} />
                        </div>
                      );
                    })()}
                  </div>
                  <div className="c-mini-progress-actions">
                    <button
                      className="c-btn c-btn--primary c-btn--sm"
                      onClick={() => setViewMode('progress')}
                    >
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              )}

              <UploadSection
                onAnalyze={handleAnalyze}
                isAnalyzing={isAnalyzing}
                onReset={handleReset}
                currentPhase={activeJob ? 'polling' : isSubmitting ? 'submitting' : 'idle'}
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

        {viewMode === 'progress' && (
          <div className="c-workspace-layout c-workspace-layout--center">
            <div className="c-workspace-content c-workspace-content--state">
              {isSubmitting ? (
                <div className="c-empty-state">
                  <div className="c-submitting-spinner" />
                  <h2 className="c-empty-title">Đang gửi văn bản...</h2>
                  <p className="c-empty-desc">Kết nối với server phân tích</p>
                </div>
              ) : activeJob ? (
                <JobProgress
                  progress={activeJob.status.progress}
                  currentSentence={activeJob.status.current_sentence}
                  status={(activeJob.status.status as 'queued' | 'running') || 'running'}
                  startTime={activeJob.startTime}
                  onMinimize={() => setViewMode('workspace')}
                />
              ) : (
                <div className="c-empty-state">
                  <h2 className="c-empty-title">Không có công việc đang chạy</h2>
                  <button className="c-btn c-btn--primary" onClick={() => setViewMode('workspace')}>
                    Quay lại trang chủ
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {viewMode === 'result' && currentResult && (
          <div className="c-results-layout">
            <div className="c-results-container">
              <AnalysisResults
                result={currentResult}
                onReset={handleReset}
              />
            </div>
          </div>
        )}

        {viewMode === 'error' && (
          <div className="c-workspace-layout c-workspace-layout--center">
            <div className="c-error-state">
              <div className="c-error-icon">❌</div>
              <h2 className="c-error-title">Đã xảy ra lỗi</h2>
              <p className="c-error-msg">{errorMessage || 'Đã xảy ra lỗi không xác định'}</p>
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

      {/* Footer */}
      <Footer onOpenModal={(type) => setModalType(type)} onGoHome={() => setViewMode('workspace')} />

      {/* Info Modal Popup */}
      <InfoModal type={modalType} onClose={() => setModalType(null)} />

      {/* Toast Notification Container */}
      {toast && (
        <div className="c-toast-container">
          <div className={`c-toast-notification ${toast.type === 'error' ? 'c-toast-notification--error' : ''}`}>
            <div className="c-toast-content">
              <div className="c-toast-icon">{toast.type === 'success' ? '✅' : '❌'}</div>
              <div className="c-toast-text">
                <div className="c-toast-title">{toast.title}</div>
                {toast.desc && <div className="c-toast-desc">{toast.desc}</div>}
              </div>
            </div>
            <div className="c-toast-action">
              {toast.result && (
                <button
                  className="c-btn c-btn--primary c-btn--sm"
                  style={{ marginRight: 8 }}
                  onClick={() => {
                    setCurrentResult(toast.result!);
                    setViewMode('result');
                    setToast(null);
                  }}
                >
                  Xem kết quả
                </button>
              )}
              <button className="c-toast-close" onClick={() => setToast(null)} title="Đóng">
                ✕
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
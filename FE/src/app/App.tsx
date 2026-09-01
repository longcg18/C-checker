import { useState, useCallback, useEffect } from 'react';
import { Routes, Route, Link, NavLink, useNavigate, useLocation, Navigate } from 'react-router';
import { api, JobStatus, JobResult, getToken } from './lib/api';
import { useJobStream } from './lib/useJobStream';
import { UploadSection } from './components/UploadSection';
import { AnalysisResults } from './components/AnalysisResults';
import { JobProgress } from './components/JobProgress';
import { Login } from './components/Login';
import { DashboardTable } from './components/DashboardTable';
import { InfoModal, ModalType } from './components/InfoModal';
import { Footer } from './components/Footer';
import { GuidePage } from './components/GuidePage';
import { AboutPage } from './components/AboutPage';
import { PrivacyPage } from './components/PrivacyPage';
import { TermsPage } from './components/TermsPage';
import { ContactPage } from './components/ContactPage';
import { KnowledgePage } from './components/KnowledgePage';
import { ReportReadingArticle } from './components/ReportReadingArticle';
import { LimitationsArticle } from './components/LimitationsArticle';
import { AlgorithmsArticle } from './components/AlgorithmsArticle';
import { ChinesePlagiarismChallengesArticle } from './components/ChinesePlagiarismChallengesArticle';
import { RecognizeChinesePlagiarismArticle } from './components/RecognizeChinesePlagiarismArticle';
import { SimilarityThresholdArticle } from './components/SimilarityThresholdArticle';
import { ResearchTrendsArticle } from './components/ResearchTrendsArticle';
import { ChineseComparisonArticle } from './components/ChineseComparisonArticle';
import { IntentionalPlagiarismArticle } from './components/IntentionalPlagiarismArticle';
import { ThesisSectionsArticle } from './components/ThesisSectionsArticle';
import { SimilarityVsPlagiarismArticle } from './components/SimilarityVsPlagiarismArticle';
import { FlaggedSentenceArticle } from './components/FlaggedSentenceArticle';
import { ThesisChecklistArticle } from './components/ThesisChecklistArticle';
import { ChineseParaphraseArticle } from './components/ChineseParaphraseArticle';

// ── Types ──────────────────────────────────────────────────────────────────

export interface HistoryEntry {
  job_id: string;
  fileName: string;
  timestamp: Date;
  status: 'queued' | 'running' | 'done' | 'failed';
  verdict?: 'HIGH' | 'MEDIUM' | 'LOW';
  verdict_text?: string;
  max_score?: number;
  avg_score?: number;
  runtime?: number;
  sentences_checked?: number;
  matches_found?: number;
  text_length?: number;
  progress?: string;
  current_sentence?: string;
  error?: string;
  result?: JobResult;
}

type ViewMode = 'workspace' | 'progress' | 'result' | 'error';

const SITE_URL = 'https://www.c-checker.io.vn';

const PAGE_META: Record<string, { title: string; description: string }> = {
  '/': {
    title: 'C-checker — Kiểm tra đạo văn tiếng Trung',
    description: 'C-checker giúp phát hiện trùng lặp và nguồn tham khảo trong văn bản tiếng Trung bằng so khớp ngữ nghĩa, LCS và N-gram.',
  },
  '/guide': {
    title: 'Hướng dẫn sử dụng C-checker',
    description: 'Hướng dẫn nhập văn bản, tải tài liệu, theo dõi tiến trình và đọc báo cáo kiểm tra trùng lặp tiếng Trung trên C-checker.',
  },
  '/about': {
    title: 'Giới thiệu C-checker',
    description: 'Tìm hiểu mục tiêu, phạm vi và các phương pháp MiniLM, LCS, N-gram được C-checker sử dụng để đối chiếu văn bản tiếng Trung.',
  },
  '/privacy': {
    title: 'Chính sách bảo mật — C-checker',
    description: 'Thông tin về dữ liệu tài khoản, tài liệu tải lên, cookie, quảng cáo và quyền yêu cầu xóa dữ liệu tại C-checker.',
  },
  '/terms': {
    title: 'Điều khoản dịch vụ — C-checker',
    description: 'Điều kiện sử dụng, giới hạn trách nhiệm và quyền của người dùng khi sử dụng dịch vụ C-checker.',
  },
  '/contact': {
    title: 'Liên hệ C-checker',
    description: 'Kênh liên hệ hỗ trợ kỹ thuật, góp ý và gửi yêu cầu liên quan đến quyền riêng tư tại C-checker.',
  },
  '/kien-thuc': {
    title: 'Kiến thức kiểm tra trùng lặp tiếng Trung — C-checker',
    description: 'Tài liệu chuyên sâu về cách đọc báo cáo, phương pháp, hạn chế và sai số khi kiểm tra trùng lặp tiếng Trung bằng C-checker.',
  },
  '/kien-thuc/bao-nhieu-phan-tram-trung-lap-thi-yen-tam': {
    title: 'Bao nhiêu % trùng lặp thì có thể yên tâm? — C-checker',
    description: 'Tìm hiểu các mốc tỷ lệ trùng lặp tham khảo, cách đọc vị trí trùng và quy trình đánh giá bài viết trước khi nộp.',
  },
  '/kien-thuc/xu-huong-nghien-cuu-ngon-ngu-van-hoa-trung-quoc': {
    title: 'Xu hướng nghiên cứu ngôn ngữ và văn hóa Trung Quốc — C-checker',
    description: 'Khám phá các hướng nghiên cứu về khối liệu tiếng Trung, AI, nhân văn số, diễn ngôn mạng xã hội và ứng dụng xuyên ngành.',
  },
  '/kien-thuc/vi-sao-kiem-tra-dao-van-tieng-trung-kho-hon': {
    title: 'Vì sao kiểm tra đạo văn tiếng Trung khó hơn? — C-checker',
    description: 'So sánh những khó khăn khi kiểm tra tiếng Trung với tiếng Anh, tiếng Việt về tách từ, hệ chữ, ngữ nghĩa và nguồn dữ liệu.',
  },
  '/kien-thuc/dao-van-vo-y-va-co-y': {
    title: 'Phân biệt đạo văn vô ý và cố ý — C-checker',
    description: 'Hiểu sự khác nhau giữa đạo văn vô ý và cố ý, các tình huống thường gặp và cách phòng tránh sai sót trích dẫn.',
  },
  '/kien-thuc/nhung-phan-nao-trong-luan-van-thuong-bi-bao-trung': {
    title: 'Những phần nào trong luận văn thường bị báo trùng? — C-checker',
    description: 'Tìm hiểu vì sao tổng quan, định nghĩa, phương pháp, phụ lục và tài liệu tham khảo thường tạo nội dung tương đồng.',
  },
  '/kien-thuc/ty-le-tuong-dong-va-dao-van-khac-nhau-nhu-the-nao': {
    title: 'Tỷ lệ tương đồng và đạo văn khác nhau thế nào? — C-checker',
    description: 'Phân biệt chỉ số tương đồng kỹ thuật với đánh giá đạo văn dựa trên nguồn, ngữ cảnh và quy định học thuật.',
  },
  '/kien-thuc/cach-xu-ly-tung-cau-bi-c-checker-danh-dau': {
    title: 'Cách xử lý từng câu bị C-checker đánh dấu',
    description: 'Hướng dẫn giữ nguyên, bổ sung trích dẫn, paraphrase hoặc loại bỏ từng câu sau khi kiểm tra nguồn đối chiếu.',
  },
  '/kien-thuc/checklist-kiem-tra-luan-van-tieng-trung-truoc-khi-nop': {
    title: 'Checklist luận văn tiếng Trung trước khi nộp — C-checker',
    description: 'Checklist rà soát trích dẫn, hệ chữ, cấu trúc, dữ liệu, định dạng và báo cáo tương đồng trước khi nộp luận văn.',
  },
  '/kien-thuc/cach-paraphrase-tieng-trung-dung-cach': {
    title: 'Cách paraphrase tiếng Trung đúng cách — C-checker',
    description: 'Học cách paraphrase tiếng Trung mà không làm sai ý, giữ đúng mức độ khẳng định và trích dẫn nguồn minh bạch.',
  },
  '/kien-thuc/huong-dan-doc-bao-cao': {
    title: 'Hướng dẫn đọc báo cáo C-checker',
    description: 'Hiểu điểm trùng lặp toàn bài, điểm câu, LCS, N-gram, Semantic, Contiguous và cách kiểm chứng nguồn trong báo cáo C-checker.',
  },
  '/kien-thuc/han-che-va-sai-so': {
    title: 'Hạn chế và sai số của C-checker',
    description: 'Tìm hiểu dương tính giả, âm tính giả, giới hạn nguồn và cách diễn giải có trách nhiệm kết quả kiểm tra của C-checker.',
  },
  '/kien-thuc/cach-nhan-biet-dao-van-tieng-trung': {
    title: 'Cách nhận biết đạo văn tiếng Trung — C-checker',
    description: 'Nhận biết sao chép nguyên văn, diễn đạt lại hời hợt, sử dụng ý tưởng thiếu nguồn và cách kiểm tra văn bản tiếng Trung.',
  },
  '/kien-thuc/lcs-ngram-semantic-similarity': {
    title: 'LCS, N-gram và Semantic Similarity trong C-checker',
    description: 'Giải thích cách C-checker kết hợp LCS, N-gram, MiniLM Semantic và Contiguous để tìm nguồn tương đồng tiếng Trung.',
  },
  '/kien-thuc/kho-khan-kiem-tra-dao-van-tieng-trung': {
    title: 'Vì sao kiểm tra tài liệu tiếng Trung khó? — C-checker',
    description: 'Những trở ngại về kho dữ liệu, quyền truy cập, token hóa và cách đánh giá tỷ lệ tương đồng trong tài liệu tiếng Trung.',
  },
};

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
  const navigate = useNavigate();
  const location = useLocation();
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

  // Stream active job via SSE in background regardless of current route/viewMode
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
    navigate('/');

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
  }, [user, navigate]);

  const handleSelectHistory = useCallback(async (entry: HistoryEntry) => {
    try {
      const result = await api.getResult(entry.job_id);
      setCurrentResult({ ...result, job_id: entry.job_id });
      setViewMode('result');
      navigate('/');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setToast({ id: String(Date.now()), type: 'error', title: 'Lỗi lấy kết quả', desc: msg });
    }
  }, [navigate]);

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
    navigate('/');
  }, [navigate]);

  const handleDeleteHistory = useCallback(async (entry: HistoryEntry) => {
    await api.deleteHistory(entry.job_id);
    setHistory((items) => items.filter((item) => item.job_id !== entry.job_id));
    if (currentResult?.job_id === entry.job_id) {
      setCurrentResult(null);
      setViewMode('workspace');
    }
    setToast({
      id: String(Date.now()),
      type: 'success',
      title: 'Đã xóa tài liệu',
      desc: `Lịch sử và kết quả của "${entry.fileName}" đã được xóa.`,
    });
  }, [currentResult]);

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

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [location.pathname]);

  useEffect(() => {
    if (viewMode === 'result') {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }
  }, [viewMode, currentResult?.job_id]);

  useEffect(() => {
    const pathname = location.pathname === '/home' ? '/' : location.pathname;
    const meta = PAGE_META[pathname] || PAGE_META['/'];
    const canonicalUrl = `${SITE_URL}${pathname === '/' ? '/' : pathname}`;

    document.title = meta.title;
    document.querySelector<HTMLMetaElement>('meta[name="description"]')?.setAttribute('content', meta.description);
    document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.setAttribute('href', canonicalUrl);
    document.querySelector<HTMLMetaElement>('meta[property="og:title"]')?.setAttribute('content', meta.title);
    document.querySelector<HTMLMetaElement>('meta[property="og:description"]')?.setAttribute('content', meta.description);
    document.querySelector<HTMLMetaElement>('meta[property="og:url"]')?.setAttribute('content', canonicalUrl);
    document.querySelector<HTMLMetaElement>('meta[name="twitter:title"]')?.setAttribute('content', meta.title);
    document.querySelector<HTMLMetaElement>('meta[name="twitter:description"]')?.setAttribute('content', meta.description);
  }, [location.pathname]);

  // Workspace / Main Checker View
  const renderWorkspaceView = () => {
    return (
      <div className="c-workspace-layout">
        <div className="c-workspace-content">
          {/* Floating Mini Progress Banner if background job is running */}
          {activeJob && viewMode !== 'progress' && (
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

          {viewMode === 'workspace' && (
            <>
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
                    onDelete={handleDeleteHistory}
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
                      Hệ thống <strong>C-checker</strong> là một trong những công cụ tiên phong tại Việt Nam hỗ trợ sinh viên, giảng viên và nhà nghiên cứu rà soát mức độ trùng lặp của văn bản tiếng Trung bằng MiniLM và các thuật toán so khớp.
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
            </>
          )}

          {viewMode === 'progress' && (
            <div className="c-workspace-layout c-workspace-layout--center" style={{ marginTop: 24 }}>
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
                  key={currentResult.job_id}
                  result={currentResult}
                  fileName={history.find((entry) => entry.job_id === currentResult.job_id)?.fileName || activeJob?.fileName || 'Văn bản đã kiểm tra'}
                  onReset={handleReset}
                />
              </div>
            </div>
          )}

          {viewMode === 'error' && (
            <div className="c-workspace-layout c-workspace-layout--center" style={{ marginTop: 24 }}>
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
        </div>
      </div>
    );
  };

  return (
    <div className="c-app">
      {/* ── Header ── */}
      <header className="c-header">
        <div className="c-header-inner">
          <Link to="/" className="c-logo" onClick={() => setViewMode('workspace')}>
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
          </Link>

          <nav className="c-header-nav">
            <NavLink
              to="/"
              end
              className={({ isActive }) => `c-nav-link ${isActive ? 'c-nav-link--active' : ''}`}
              onClick={() => setViewMode('workspace')}
            >
              Trang chủ
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) => `c-nav-link ${isActive ? 'c-nav-link--active' : ''}`}
            >
              Giới thiệu
            </NavLink>
            <NavLink
              to="/kien-thuc"
              className={({ isActive }) => `c-nav-link ${isActive ? 'c-nav-link--active' : ''}`}
            >
              Kiến thức
            </NavLink>
            <NavLink
              to="/guide"
              className={({ isActive }) => `c-nav-link ${isActive ? 'c-nav-link--active' : ''}`}
            >
              Hướng dẫn sử dụng
            </NavLink>
          </nav>

          <div className="c-header-auth">
            <Login onLogin={handleLogin} onLogout={handleLogout} currentUser={user} />
          </div>
        </div>
      </header>

      {/* ── Main Routing Layout ── */}
      <main className={`c-main ${viewMode === 'result' && (location.pathname === '/' || location.pathname === '/home') ? 'c-main--results' : ''}`}>
        <Routes>
          <Route path="/" element={renderWorkspaceView()} />
          <Route path="/home" element={renderWorkspaceView()} />
          <Route path="/guide" element={<GuidePage onBack={() => { setViewMode('workspace'); navigate('/'); }} />} />
          <Route path="/about" element={<AboutPage onBack={() => { setViewMode('workspace'); navigate('/'); }} />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/kien-thuc" element={<KnowledgePage />} />
          <Route path="/kien-thuc/bao-nhieu-phan-tram-trung-lap-thi-yen-tam" element={<SimilarityThresholdArticle />} />
          <Route path="/kien-thuc/xu-huong-nghien-cuu-ngon-ngu-van-hoa-trung-quoc" element={<ResearchTrendsArticle />} />
          <Route path="/kien-thuc/vi-sao-kiem-tra-dao-van-tieng-trung-kho-hon" element={<ChineseComparisonArticle />} />
          <Route path="/kien-thuc/dao-van-vo-y-va-co-y" element={<IntentionalPlagiarismArticle />} />
          <Route path="/kien-thuc/nhung-phan-nao-trong-luan-van-thuong-bi-bao-trung" element={<ThesisSectionsArticle />} />
          <Route path="/kien-thuc/ty-le-tuong-dong-va-dao-van-khac-nhau-nhu-the-nao" element={<SimilarityVsPlagiarismArticle />} />
          <Route path="/kien-thuc/cach-xu-ly-tung-cau-bi-c-checker-danh-dau" element={<FlaggedSentenceArticle />} />
          <Route path="/kien-thuc/checklist-kiem-tra-luan-van-tieng-trung-truoc-khi-nop" element={<ThesisChecklistArticle />} />
          <Route path="/kien-thuc/cach-paraphrase-tieng-trung-dung-cach" element={<ChineseParaphraseArticle />} />
          <Route path="/kien-thuc/huong-dan-doc-bao-cao" element={<ReportReadingArticle />} />
          <Route path="/kien-thuc/han-che-va-sai-so" element={<LimitationsArticle />} />
          <Route path="/kien-thuc/cach-nhan-biet-dao-van-tieng-trung" element={<RecognizeChinesePlagiarismArticle />} />
          <Route path="/kien-thuc/lcs-ngram-semantic-similarity" element={<AlgorithmsArticle />} />
          <Route path="/kien-thuc/kho-khan-kiem-tra-dao-van-tieng-trung" element={<ChinesePlagiarismChallengesArticle />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Footer */}
      <Footer onOpenModal={(type) => setModalType(type)} onGoHome={() => { setViewMode('workspace'); navigate('/'); }} />

      {/* Info Modal Popup (if triggered) */}
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
                    navigate('/');
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

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';

interface WalkthroughStep {
  id: number;
  label: string;
  tag: string;
  title: string;
  desc: string;
  tab: 'input' | 'upload' | 'progress' | 'report';
}

const WALKTHROUGH_STEPS: WalkthroughStep[] = [
  {
    id: 1,
    label: 'Tổng quan Bàn Khảo Duyệt',
    tag: 'BƯỚC 1 · KHỞI TẠO',
    title: 'Giao diện Bàn Khảo Duyệt tiếng Trung',
    desc: 'Chọn chế độ Nhập văn bản trực tiếp (miễn phí, không cần đăng nhập) hoặc Tải tệp DOCX/PDF.',
    tab: 'input',
  },
  {
    id: 2,
    label: 'Nhập văn bản & Đoạn mẫu',
    tag: 'BƯỚC 2 · NHẬP LIỆU',
    title: 'Dán chữ Hán hoặc nạp nhanh đoạn mẫu',
    desc: 'Hỗ trợ cả Giản thể và Phồn thể (tối đa 300 ký tự cho khách), tự động đếm ký tự trước khi quét.',
    tab: 'input',
  },
  {
    id: 3,
    label: 'Đăng nhập & Tải tệp DOCX/PDF',
    tag: 'BƯỚC 3 · TẢI TỆP LỚN',
    title: 'Phân tích toàn văn luận văn qua Google OAuth',
    desc: 'Đăng nhập Google để mở khóa tải tệp .docx, .pdf, .txt và lưu lịch sử đối soát cá nhân.',
    tab: 'upload',
  },
  {
    id: 4,
    label: 'Theo dõi AI phân tích ngầm',
    tag: 'BƯỚC 4 · XỬ LÝ AI',
    title: 'Bóc tách câu với MiniLM, LCS & N-gram',
    desc: 'Hệ thống hiển thị % tiến độ theo thời gian thực và cho phép thu nhỏ để làm việc khác.',
    tab: 'progress',
  },
  {
    id: 5,
    label: 'Giải mã báo cáo & Đối soát câu',
    tag: 'BƯỚC 5 · BÁO CÁO',
    title: 'Đánh dấu câu trùng lặp kèm nguồn đối chứng',
    desc: 'Xem tỷ lệ tương đồng toàn bài, nhấp từng câu tô màu để kiểm tra đoạn văn gốc tương ứng.',
    tab: 'report',
  },
];

export function VisualGuideArticle() {
  const navigate = useNavigate();
  const [activeStepTab, setActiveStepTab] = useState<'all' | 'input' | 'upload' | 'progress' | 'report'>('all');
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  const activeScene = WALKTHROUGH_STEPS[currentStepIdx];

  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      setCurrentStepIdx((prev) => (prev + 1) % WALKTHROUGH_STEPS.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  const handleSelectStep = (idx: number) => {
    setCurrentStepIdx(idx);
    setIsAutoPlaying(false);
  };

  return (
    <article className="c-page-layout c-article-layout">
      <div className="c-page-container">
        {/* Nút quay lại */}
        <button className="c-page-back-btn" onClick={() => navigate('/kien-thuc')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16" aria-hidden="true">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Quay lại danh mục Kiến thức
        </button>

        {/* Tiêu đề trang */}
        <header className="c-page-hero">
          <div className="c-seal-mark" style={{ marginBottom: 14 }}>
            <span className="c-seal-text">指南</span>
            <span className="c-seal-sub">HƯỚNG DẪN THỰC HÀNH TRỰC QUAN</span>
          </div>
          <h1 className="c-page-title">
            Hướng dẫn sử dụng C-checker chi tiết từ A-Z (Kèm hình ảnh &amp; Minh họa tương tác)
          </h1>
          <p className="c-page-subtitle">
            Cẩm nang thao tác trực quan từng bước: từ nạp tài liệu tiếng Trung, theo dõi tiến trình bóc tách ngữ nghĩa AI thời gian thực cho đến cách đọc hiểu và đối soát từng câu trong báo cáo tương đồng.
          </p>
          <div className="c-article-byline">
            Ban Học thuật C-checker · Cập nhật tháng 11/2026 · 10 phút đọc · Minh họa giao diện từng bước
          </div>
        </header>

        {/* Thanh điều hướng nhanh theo bước */}
        <nav className="c-visual-step-nav" aria-label="Điều hướng các bước">
          <button
            type="button"
            className={`c-visual-step-btn ${activeStepTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveStepTab('all')}
          >
            📋 Tất cả các bước
          </button>
          <button
            type="button"
            className={`c-visual-step-btn ${activeStepTab === 'input' ? 'active' : ''}`}
            onClick={() => setActiveStepTab('input')}
          >
            1. Nhập văn bản nhanh
          </button>
          <button
            type="button"
            className={`c-visual-step-btn ${activeStepTab === 'upload' ? 'active' : ''}`}
            onClick={() => setActiveStepTab('upload')}
          >
            2. Tải tệp tài liệu lớn
          </button>
          <button
            type="button"
            className={`c-visual-step-btn ${activeStepTab === 'progress' ? 'active' : ''}`}
            onClick={() => setActiveStepTab('progress')}
          >
            3. Theo dõi tiến trình AI
          </button>
          <button
            type="button"
            className={`c-visual-step-btn ${activeStepTab === 'report' ? 'active' : ''}`}
            onClick={() => setActiveStepTab('report')}
          >
            4. Đọc &amp; Đối soát báo cáo
          </button>
        </nav>

        <div className="c-page-content c-article-content">

          {/* ═══════════════════════════════════════════════════════════════
              KHUNG MINH HỌA TƯƠNG TÁC TỪNG BƯỚC (INTERACTIVE WALKTHROUGH)
          ═══════════════════════════════════════════════════════════════ */}
          <section className="c-visual-media-box" aria-label="Minh họa quy trình sử dụng C-checker">
            <div className="c-media-box-header">
              <div className="c-media-badge">
                <span className="c-media-dot" />
                MINH HỌA TƯƠNG TÁC TỪNG BƯỚC
              </div>
              <span className="c-media-duration">
                Bước {activeScene.id} / {WALKTHROUGH_STEPS.length}
              </span>
            </div>

            <div className="c-mock-player-container">
              {/* Màn hình minh họa tương tác */}
              <div className="c-mock-video-screen">
                <div className="c-walkthrough-stage">
                  <div className="c-walkthrough-topbar">
                    <span className="c-playing-tag">{activeScene.tag}</span>
                    <span className="c-walkthrough-url">c-checker.io.vn</span>
                  </div>

                  <div className="c-walkthrough-caption">
                    <h3>{activeScene.title}</h3>
                    <p>{activeScene.desc}</p>
                  </div>

                  {/* Cảnh giao diện tương ứng từng bước */}
                  <div className="c-walkthrough-canvas">
                    {activeScene.id === 1 && (
                      <div className="c-wt-card">
                        <div className="c-wt-tabs">
                          <span className="c-wt-tab c-wt-tab--on">✍️ Nhập văn bản</span>
                          <span className="c-wt-tab">📄 Tải tệp DOCX / PDF</span>
                        </div>
                        <div className="c-wt-placeholder">
                          Dán đoạn văn bản tiếng Trung (Giản thể hoặc Phồn thể) để kiểm tra nhanh...
                        </div>
                        <div className="c-wt-chips">
                          <span className="c-wt-chip">Đoạn mẫu 1</span>
                          <span className="c-wt-chip">Đoạn mẫu 2</span>
                        </div>
                      </div>
                    )}

                    {activeScene.id === 2 && (
                      <div className="c-wt-card">
                        <div className="c-wt-zh">
                          随着中越经贸合作的不断深化，跨境电商已成为推动两国双边贸易增长的核心引擎之一...
                        </div>
                        <div className="c-wt-footer">
                          <span className="c-wt-counter">88 / 300 ký tự</span>
                          <span className="c-wt-btn">Tiến hành đối soát →</span>
                        </div>
                      </div>
                    )}

                    {activeScene.id === 3 && (
                      <div className="c-wt-card">
                        <div className="c-wt-dropzone">
                          <div className="c-wt-drop-icon">📂</div>
                          <div className="c-wt-drop-title">Luan_van_Thac_si_2026.docx</div>
                          <div className="c-wt-drop-sub">Hỗ trợ .docx, .pdf, .txt · Đã xác thực Google OAuth</div>
                        </div>
                      </div>
                    )}

                    {activeScene.id === 4 && (
                      <div className="c-wt-card">
                        <div className="c-wt-progress-head">
                          <span>Đang phân tích câu 14 / 22</span>
                          <strong>64%</strong>
                        </div>
                        <div className="c-wt-progress-bar">
                          <div className="c-wt-progress-fill" style={{ width: '64%' }} />
                        </div>
                        <div className="c-wt-algo-row">
                          <span className="c-wt-algo">MiniLM 384d</span>
                          <span className="c-wt-algo">LCS</span>
                          <span className="c-wt-algo">N-gram</span>
                        </div>
                      </div>
                    )}

                    {activeScene.id === 5 && (
                      <div className="c-wt-card">
                        <div className="c-wt-report-head">
                          <span className="c-badge-red">78.5% Trùng lặp</span>
                          <span className="c-wt-source">Nguồn: 百度学术 / Tạp chí Kinh tế TQ</span>
                        </div>
                        <div className="c-wt-zh">
                          “随着中越经贸合作的不断深化，跨境电商已成为推动两国双边贸易增长的核心引擎之一。”
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Thanh điều khiển trình diễn từng bước */}
                <div className="c-mock-player-controls">
                  <button
                    type="button"
                    className="c-ctrl-btn"
                    onClick={() => setIsAutoPlaying((prev) => !prev)}
                    title={isAutoPlaying ? 'Tạm dừng tự động chuyển bước' : 'Tự động chạy qua các bước'}
                    aria-label={isAutoPlaying ? 'Tạm dừng' : 'Phát tự động'}
                  >
                    {isAutoPlaying ? (
                      <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                    )}
                  </button>
                  <button
                    type="button"
                    className="c-ctrl-step-btn"
                    onClick={() => handleSelectStep((currentStepIdx - 1 + WALKTHROUGH_STEPS.length) % WALKTHROUGH_STEPS.length)}
                  >
                    ‹ Trước
                  </button>
                  <div className="c-ctrl-timeline" aria-hidden="true">
                    <div
                      className="c-ctrl-timeline-fill"
                      style={{ width: `${((currentStepIdx + 1) / WALKTHROUGH_STEPS.length) * 100}%` }}
                    />
                  </div>
                  <button
                    type="button"
                    className="c-ctrl-step-btn"
                    onClick={() => handleSelectStep((currentStepIdx + 1) % WALKTHROUGH_STEPS.length)}
                  >
                    Tiếp ›
                  </button>
                  <span className="c-ctrl-tag">
                    {isAutoPlaying ? 'ĐANG CHẠY' : 'TƯƠNG TÁC'}
                  </span>
                </div>
              </div>

              {/* Danh sách các bước */}
              <div className="c-mock-player-chapters">
                <div className="c-chapters-title">CÁC BƯỚC THAO TÁC</div>
                <div className="c-chapters-list">
                  {WALKTHROUGH_STEPS.map((step, idx) => (
                    <button
                      key={step.id}
                      type="button"
                      className={`c-chapter-item ${currentStepIdx === idx ? 'c-chapter-item--active' : ''}`}
                      onClick={() => handleSelectStep(idx)}
                    >
                      <span className="c-chapter-time">0{step.id}</span>
                      <span className="c-chapter-label">{step.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ═══════════════════════════════════════════════════════════════
              BƯỚC 1: NHẬP VĂN BẢN TRỰC TIẾP HOẶC DÙNG ĐOẠN MẪU
          ═══════════════════════════════════════════════════════════════ */}
          {(activeStepTab === 'all' || activeStepTab === 'input') && (
            <section className="c-guide-step-section">
              <div className="c-step-header-box">
                <div className="c-step-number">01</div>
                <div>
                  <span className="c-step-sub">GIAI ĐOẠN KHỞI TẠO</span>
                  <h2 className="c-step-title">Khảo nghiệm nhanh đoạn văn bản ngắn (Tối đa 300 ký tự)</h2>
                </div>
              </div>

              <p>
                Nếu bạn vừa viết xong một đoạn diễn giải (paraphrase), một định nghĩa học thuật hoặc trích dẫn ngắn trong khóa luận và muốn xem ngay độ an toàn, tính năng <strong>Khảo nghiệm nhanh</strong> tại trang chủ là lựa chọn nhanh nhất: <em>không cần đăng ký, không mất phí và cho kết quả sau vài chục giây</em>.
              </p>

              <div className="c-instruction-steps">
                <div className="c-inst-step">
                  <div className="c-inst-index">1</div>
                  <div className="c-inst-text">
                    <strong>Chọn tab "Nhập văn bản":</strong> Ngay tại Bàn Khảo Duyệt trang chủ, tab này được kích hoạt mặc định.
                  </div>
                </div>
                <div className="c-inst-step">
                  <div className="c-inst-index">2</div>
                  <div className="c-inst-text">
                    <strong>Dán văn bản hoặc bấm "Thử đoạn mẫu":</strong> Dán đoạn chữ Hán cần kiểm tra (hỗ trợ cả chữ Giản thể lẫn Phồn thể). Nếu bạn lần đầu trải nghiệm, bấm nút <em>"Thử đoạn mẫu 1"</em> hoặc <em>"Thử đoạn mẫu 2"</em> để nạp văn bản đối chứng thực tế.
                  </div>
                </div>
                <div className="c-inst-step">
                  <div className="c-inst-index">3</div>
                  <div className="c-inst-text">
                    <strong>Bấm "Tiến hành đối soát văn bản":</strong> Hệ thống sẽ tự động tách câu, loại bỏ ký tự trắng thừa và kích hoạt luồng tìm kiếm nguồn dữ liệu.
                  </div>
                </div>
              </div>

              {/* HÌNH ẢNH MÔ PHỎNG GIAO DIỆN BƯỚC 1 */}
              <div className="c-screenshot-mockup">
                <div className="c-mockup-browser-bar">
                  <span className="c-browser-dot c-browser-dot--red" />
                  <span className="c-browser-dot c-browser-dot--yellow" />
                  <span className="c-browser-dot c-browser-dot--green" />
                  <span className="c-browser-address">https://www.c-checker.io.vn/#workspace</span>
                </div>
                <div className="c-mockup-body">
                  <div className="c-mockup-header-title">BÀN KHẢO DUYỆT C-CHECKER</div>
                  
                  {/* Tabs */}
                  <div className="c-mockup-tabs">
                    <div className="c-mockup-tab c-mockup-tab--active">
                      ✍️ Nhập văn bản (Tối đa 300 chữ)
                    </div>
                    <div className="c-mockup-tab">
                      📄 Tải tệp văn bản (DOCX / PDF)
                    </div>
                  </div>

                  {/* Input area */}
                  <div className="c-mockup-input-box">
                    <div className="c-mockup-text-zh">
                      随着中越经贸合作的不断深化，两国的双边贸易额近年来实现了跨越式增长。特别是在数字经济与跨境电商领域，双边产业链和供应链的深度融合为区域经济繁荣注入了强劲动力。
                    </div>
                    <div className="c-mockup-input-footer">
                      <div className="c-mockup-samples">
                        <span className="c-sample-label">Nạp nhanh:</span>
                        <span className="c-sample-chip">Đoạn mẫu 1 (Kinh tế)</span>
                        <span className="c-sample-chip">Đoạn mẫu 2 (Văn hóa)</span>
                      </div>
                      <div className="c-mockup-counter">88 / 300 ký tự</div>
                    </div>
                  </div>

                  {/* Action button */}
                  <div className="c-mockup-action-center">
                    <button type="button" className="c-mockup-submit-btn">
                      🔍 Tiến hành đối soát văn bản →
                    </button>
                  </div>
                </div>
                <div className="c-mockup-caption">
                  <strong>Hình 1:</strong> Giao diện Bàn Khảo Duyệt khi nhập đoạn văn bản tiếng Trung hoặc nạp văn bản mẫu kiểm tra nhanh.
                </div>
              </div>

              <div className="c-article-note">
                <strong>Mẹo thao tác:</strong> Bạn có thể dùng tổ hợp phím <code>Ctrl + Enter</code> (hoặc <code>Cmd + Enter</code> trên macOS) trong ô văn bản để tiến hành đối soát ngay mà không cần nhấp chuột.
              </div>
            </section>
          )}

          {/* ═══════════════════════════════════════════════════════════════
              BƯỚC 2: ĐĂNG NHẬP GOOGLE & TẢI TỆP LUẬN VĂN LỚN
          ═══════════════════════════════════════════════════════════════ */}
          {(activeStepTab === 'all' || activeStepTab === 'upload') && (
            <section className="c-guide-step-section">
              <div className="c-step-header-box">
                <div className="c-step-number">02</div>
                <div>
                  <span className="c-step-sub">QUY MÔ TOÀN BÀI</span>
                  <h2 className="c-step-title">Tải tệp văn bản lớn: Luận văn, Khóa luận, Bài báo (.docx, .pdf, .txt)</h2>
                </div>
              </div>

              <p>
                Đối với các bài tiểu luận cuối kỳ từ 5.000 đến 15.000 chữ hoặc luận văn thạc sĩ hoàn chỉnh, bạn cần chuyển sang tab <strong>"Tải tệp văn bản"</strong>. Tính năng này yêu cầu đăng nhập bằng Google để hệ thống cấp quyền xử lý tệp lớn và lưu kết quả vào lịch sử cá nhân của bạn.
              </p>

              <div className="c-feature-cards-grid">
                <div className="c-feature-card">
                  <div className="c-feature-icon">📁</div>
                  <h3>Đa dạng định dạng</h3>
                  <p>Hỗ trợ trực tiếp tệp Microsoft Word (<code>.docx</code>), tệp tài liệu số (<code>.pdf</code>) và tệp văn bản thô (<code>.txt</code>).</p>
                </div>
                <div className="c-feature-card">
                  <div className="c-feature-icon">🧹</div>
                  <h3>Tự lọc sạch định dạng</h3>
                  <p>Bộ trích xuất thông minh tự động loại bỏ bảng biểu, mã điều khiển, hình ảnh và chỉ giữ lại thuần văn bản chữ Hán để quét.</p>
                </div>
                <div className="c-feature-card">
                  <div className="c-feature-icon">☁️</div>
                  <h3>Lưu trữ đám mây</h3>
                  <p>Báo cáo đối soát được gắn vào tài khoản Google, giúp bạn dễ dàng xem lại tiến trình và so sánh phiên bản sau khi sửa.</p>
                </div>
              </div>

              {/* HÌNH ẢNH MÔ PHỎNG GIAO DIỆN BƯỚC 2 */}
              <div className="c-screenshot-mockup">
                <div className="c-mockup-browser-bar">
                  <span className="c-browser-dot c-browser-dot--red" />
                  <span className="c-browser-dot c-browser-dot--yellow" />
                  <span className="c-browser-dot c-browser-dot--green" />
                  <span className="c-browser-address">https://www.c-checker.io.vn/#upload</span>
                </div>
                <div className="c-mockup-body">
                  <div className="c-mockup-user-bar">
                    <span className="c-mockup-user-email">👤 nguyenvana@hust.edu.vn</span>
                    <span className="c-mockup-user-badge">ĐÃ LIÊN KẾT GOOGLE</span>
                  </div>

                  <div className="c-mockup-tabs">
                    <div className="c-mockup-tab">
                      ✍️ Nhập văn bản
                    </div>
                    <div className="c-mockup-tab c-mockup-tab--active">
                      📄 Tải tệp văn bản (DOCX / PDF / TXT)
                    </div>
                  </div>

                  {/* Dropzone */}
                  <div className="c-mockup-dropzone">
                    <div className="c-dropzone-icon">📥</div>
                    <div className="c-dropzone-title">Kéo &amp; thả tệp luận văn vào đây</div>
                    <div className="c-dropzone-sub">Hoặc bấm vào để chọn tệp từ máy tính của bạn</div>

                    {/* File preview card */}
                    <div className="c-dropzone-file-item">
                      <span className="c-file-badge">DOCX</span>
                      <div className="c-file-info">
                        <strong>Luan_van_Tot_nghiep_Han_ngu_NguyenVanA.docx</strong>
                        <span>Dung lượng: 1.4 MB · Ước tính ~14.200 chữ Hán</span>
                      </div>
                      <span className="c-file-ready-tag">✓ Sẵn sàng khảo duyệt</span>
                    </div>
                  </div>

                  <div className="c-mockup-action-center">
                    <button type="button" className="c-mockup-submit-btn">
                      🚀 Bắt đầu phân tích tài liệu toàn bài →
                    </button>
                  </div>
                </div>
                <div className="c-mockup-caption">
                  <strong>Hình 2:</strong> Khu vực tải lên tệp tài liệu luận văn đã được trích xuất sẵn sàng để đưa vào luồng kiểm tra.
                </div>
              </div>

              <div className="c-article-note">
                <strong>Lưu ý về phông chữ Hán:</strong> Khi xuất tệp Word hoặc PDF, hãy ưu tiên sử dụng các bộ phông chữ Unicode Hán ngữ chuẩn mực như <em>SimSun (宋体), SimHei (黑体), KaiTi (楷体)</em> để tránh lỗi mã hóa ký tự khi hệ thống trích xuất.
              </div>
            </section>
          )}

          {/* ═══════════════════════════════════════════════════════════════
              BƯỚC 3: THEO DÕI TIẾN TRÌNH PHÂN TÍCH AI REAL-TIME
          ═══════════════════════════════════════════════════════════════ */}
          {(activeStepTab === 'all' || activeStepTab === 'progress') && (
            <section className="c-guide-step-section">
              <div className="c-step-header-box">
                <div className="c-step-number">03</div>
                <div>
                  <span className="c-step-sub">XỬ LÝ DỮ LIỆU</span>
                  <h2 className="c-step-title">Theo dõi tiến trình phân tích ngầm thời gian thực (SSE Stream)</h2>
                </div>
              </div>

              <p>
                Khác với các công cụ kiểm tra thông thường bắt bạn phải treo máy, C-checker ứng dụng công nghệ <strong>Server-Sent Events (SSE)</strong> kết hợp mô hình AI nhúng vector đa ngữ <code>MiniLM</code>. Hệ thống sẽ phân tích song song từng câu và cập nhật trực tiếp tiến trình theo thời gian thực.
              </p>

              <div className="c-timeline-flow">
                <div className="c-flow-step">
                  <div className="c-flow-bullet">1</div>
                  <h4>Bóc tách câu &amp; Tiền xử lý</h4>
                  <p>Văn bản được tách theo các dấu câu tiếng Trung (<code>。？！；</code>) và gom cụm tối ưu 80-120 ký tự.</p>
                </div>
                <div className="c-flow-step">
                  <div className="c-flow-bullet">2</div>
                  <h4>Truy vấn nguồn học thuật</h4>
                  <p>Hệ thống tự động phát sinh từ khóa trích lọc và gửi truy vấn tìm kiếm tới các nguồn tài liệu mở trực tuyến.</p>
                </div>
                <div className="c-flow-step">
                  <div className="c-flow-bullet">3</div>
                  <h4>Chấm điểm 4 lớp thuật toán</h4>
                  <p>Mỗi câu đối chiếu được tính toán đồng thời: <strong>LCS (35%)</strong>, <strong>N-gram (20%)</strong>, <strong>Semantic MiniLM (35%)</strong> và <strong>Contiguous (10%)</strong>.</p>
                </div>
              </div>

              {/* HÌNH ẢNH MÔ PHỎNG GIAO DIỆN BƯỚC 3 */}
              <div className="c-screenshot-mockup">
                <div className="c-mockup-browser-bar">
                  <span className="c-browser-dot c-browser-dot--red" />
                  <span className="c-browser-dot c-browser-dot--yellow" />
                  <span className="c-browser-dot c-browser-dot--green" />
                  <span className="c-browser-address">https://www.c-checker.io.vn/#progress</span>
                </div>
                <div className="c-mockup-body">
                  <div className="c-mockup-progress-card">
                    <div className="c-progress-header">
                      <div>
                        <div className="c-progress-status-badge">⚡ ĐANG KHẢO DUYỆT NGỮ NGHĨA</div>
                        <h3 className="c-progress-job-title">Luan_van_Tot_nghiep_Han_ngu_NguyenVanA.docx</h3>
                      </div>
                      <button type="button" className="c-progress-minimize-btn">
                        ↙ Thu nhỏ cửa sổ
                      </button>
                    </div>

                    {/* Progress bar */}
                    <div className="c-progress-bar-wrap">
                      <div className="c-progress-bar-track">
                        <div className="c-progress-bar-fill" style={{ width: '68%' }} />
                      </div>
                      <div className="c-progress-bar-info">
                        <span>Đã hoàn thành: <strong>68%</strong> (58 / 85 câu)</span>
                        <span>Ước tính còn lại: <strong>~25 giây</strong></span>
                      </div>
                    </div>

                    {/* Live active sentence */}
                    <div className="c-progress-current-sentence">
                      <span className="c-live-label">Câu đang đối soát:</span>
                      <p className="c-live-text">
                        "在汉越词汇对比研究中，同形同义词占有较大比重，这直接影响了学习者的负迁移现象..."
                      </p>
                    </div>
                  </div>
                </div>
                <div className="c-mockup-caption">
                  <strong>Hình 3:</strong> Màn hình theo dõi tiến trình phân tích trực tiếp. Người dùng có thể nhấn nút "Thu nhỏ" để tiếp tục làm các công việc khác.
                </div>
              </div>

              <div className="c-article-note">
                <strong>Tính năng chạy ngầm:</strong> Bạn hoàn toàn có thể nhấn nút <em>"Thu nhỏ"</em> để thanh tiến độ co lại thành một thanh trạng thái mỏng trên đầu trang. Bạn có thể sang tab khác đọc bài viết hoặc chuẩn bị tài liệu mà không sợ đứt tiến trình.
              </div>
            </section>
          )}

          {/* ═══════════════════════════════════════════════════════════════
              BƯỚC 4: GIẢI MÃ BÁO CÁO & ĐỐI SOÁT CÂU TƯƠNG TÁC
          ═══════════════════════════════════════════════════════════════ */}
          {(activeStepTab === 'all' || activeStepTab === 'report') && (
            <section className="c-guide-step-section">
              <div className="c-step-header-box">
                <div className="c-step-number">04</div>
                <div>
                  <span className="c-step-sub">KẾT QUẢ &amp; HIỆU ĐÍNH</span>
                  <h2 className="c-step-title">Đọc báo cáo đối soát, kiểm tra nguồn &amp; phương pháp xử lý câu bị trùng</h2>
                </div>
              </div>

              <p>
                Khi phân tích hoàn tất, C-checker sẽ hiển thị bảng báo cáo toàn diện. Đây là bước quan trọng nhất để bạn rà soát lại mức độ tương đồng và tiến hành hiệu đính trước khi nộp bài.
              </p>

              {/* 3 mức màu */}
              <div className="c-color-rules-grid">
                <div className="c-color-rule-card c-color-rule-card--red">
                  <div className="c-rule-header">
                    <span className="c-color-dot red" />
                    <strong>Đỏ: Trùng lặp cao (&gt; 70%)</strong>
                  </div>
                  <p>
                    Câu gần như sao chép nguyên văn cấu trúc câu hoặc trật tự từ vựng. <strong>Giải pháp:</strong> Nếu là trích dẫn, bắt buộc đưa vào dấu ngoặc kép và ghi rõ số trang. Nếu là diễn giải, cần viết lại hoàn toàn.
                  </p>
                </div>

                <div className="c-color-rule-card c-color-rule-card--yellow">
                  <div className="c-rule-header">
                    <span className="c-color-dot yellow" />
                    <strong>Vàng: Tương đồng ngữ nghĩa (40% - 70%)</strong>
                  </div>
                  <p>
                    Câu đã được đổi từ nhưng cấu trúc lập luận vẫn còn bám rất sát nguồn gốc. <strong>Giải pháp:</strong> Bổ sung trích dẫn nguồn gián tiếp (in-text citation) hoặc tái cấu trúc đoạn văn theo góc nhìn riêng.
                  </p>
                </div>

                <div className="c-color-rule-card c-color-rule-card--green">
                  <div className="c-rule-header">
                    <span className="c-color-dot green" />
                    <strong>Xanh lục: Độc lập (&lt; 40%)</strong>
                  </div>
                  <p>
                    Đoạn văn có mức độ nguyên bản cao, cấu trúc độc lập hoặc chứa các phân tích sáng tạo của chính bạn.
                  </p>
                </div>
              </div>

              {/* HÌNH ẢNH MÔ PHỎNG BÁO CÁO KẾT QUẢ & SO SÁNH SONG SONG */}
              <div className="c-screenshot-mockup">
                <div className="c-mockup-browser-bar">
                  <span className="c-browser-dot c-browser-dot--red" />
                  <span className="c-browser-dot c-browser-dot--yellow" />
                  <span className="c-browser-dot c-browser-dot--green" />
                  <span className="c-browser-address">https://www.c-checker.io.vn/#results</span>
                </div>
                <div className="c-mockup-body">
                  {/* Bảng chỉ số tổng quan */}
                  <div className="c-mockup-stat-row">
                    <div className="c-mockup-stat-box">
                      <span className="c-stat-label">TRÙNG LẶP TOÀN BÀI</span>
                      <span className="c-stat-value c-stat-value--yellow">14.8%</span>
                      <span className="c-stat-sub">Mức cảnh báo: Trung bình</span>
                    </div>
                    <div className="c-mockup-stat-box">
                      <span className="c-stat-label">CÂU TRÙNG CAO NHẤT</span>
                      <span className="c-stat-value c-stat-value--red">78.4%</span>
                      <span className="c-stat-sub">Cần xem xét hiệu đính</span>
                    </div>
                    <div className="c-mockup-stat-box">
                      <span className="c-stat-label">TỔNG SỐ CÂU ĐỐI SOÁT</span>
                      <span className="c-stat-value">85 câu</span>
                      <span className="c-stat-sub">Đã quét toàn bộ tài liệu</span>
                    </div>
                  </div>

                  {/* Panel đối chiếu song song */}
                  <div className="c-mockup-diff-box">
                    <div className="c-diff-box-title">
                      <span>🔍 BẢNG ĐỐI CHIẾU SONG SONG KHI BẤM VÀO CÂU BỊ ĐÁNH DẤU</span>
                      <span className="c-diff-score">Final: 78.4%</span>
                    </div>

                    <div className="c-diff-columns">
                      {/* Cột trái: Câu của bạn */}
                      <div className="c-diff-col c-diff-col--mine">
                        <div className="c-col-tag">Văn bản trong bài của bạn</div>
                        <p className="c-col-content">
                          随着中越经贸合作的不断深化，两国的双边贸易额近年来实现了跨越式增长，
                          <mark className="c-mark-match">在数字经济与跨境电商领域</mark>
                          ，双边产业链和供应链的深度融合
                          <mark className="c-mark-match">为区域经济繁荣注入了强劲动力</mark>。
                        </p>
                      </div>

                      {/* Cột phải: Đoạn nguồn tìm thấy */}
                      <div className="c-diff-col c-diff-col--source">
                        <div className="c-col-tag">Nguồn đối chiếu tìm thấy trên mạng</div>
                        <p className="c-col-content">
                          伴随中越两国全面战略合作伙伴关系持续推进，
                          <mark className="c-mark-match">在数字经济与跨境电商领域</mark>
                          ，双方供应链与产业链深度互补，
                          <mark className="c-mark-match">为区域经济繁荣注入了强劲动力</mark>。
                        </p>
                        <div className="c-col-source-link">
                          🔗 Nguồn: <em>Báo cáo Thường niên Thương mại ASEAN - Trung Quốc (2025)</em>
                        </div>
                      </div>
                    </div>

                    {/* Thanh điểm 4 chỉ số */}
                    <div className="c-diff-metrics-bar">
                      <div className="c-metric-pill">LCS: <strong>72.5%</strong></div>
                      <div className="c-metric-pill">N-gram: <strong>68.0%</strong></div>
                      <div className="c-metric-pill">Semantic MiniLM: <strong>86.4%</strong></div>
                      <div className="c-metric-pill">Contiguous: <strong>55.0%</strong></div>
                    </div>
                  </div>
                </div>
                <div className="c-mockup-caption">
                  <strong>Hình 4:</strong> Cửa sổ đối chiếu trực quan: Nhấp chuột vào bất kỳ câu nào có tô màu để xem so sánh song song với tài liệu gốc và 4 chỉ số chi tiết.
                </div>
              </div>

              <div className="c-article-note">
                <strong>Quy tắc vàng hiệu đính:</strong> Khi phát hiện câu có chỉ số Semantic cao (&gt; 80%) nhưng LCS thấp, điều đó chứng tỏ bạn đã diễn giải đúng ý nhưng tư tưởng lập luận vẫn thuộc về tác giả gốc. Lúc này, điều bạn cần làm không phải là cố gắng tráo đổi từ đồng nghĩa, mà là <strong>bổ sung tên tác giả và năm xuất bản vào cuối câu</strong>.
              </div>
            </section>
          )}

          {/* ═══════════════════════════════════════════════════════════════
              BƯỚC 5: XUẤT BÁO CÁO & CHECKLIST TRƯỚC KHI NỘP
          ═══════════════════════════════════════════════════════════════ */}
          <section className="c-guide-step-section">
            <div className="c-step-header-box">
              <div className="c-step-number">05</div>
              <div>
                <span className="c-step-sub">HOÀN TẤT HỌC THUẬT</span>
                <h2 className="c-step-title">Xuất báo cáo đối soát &amp; Các bài viết bổ trợ nên đọc</h2>
              </div>
            </div>

            <p>
              Sau khi đã rà soát và chỉnh sửa bản thảo, bạn có thể chạy lại lượt kiểm tra lần 2 để đảm bảo tỷ lệ tương đồng toàn bài về mức an toàn theo yêu cầu của trường hoặc tạp chí nghiên cứu.
            </p>

            <div className="c-guide-resource-grid">
              <Link to="/kien-thuc/cach-giam-ty-le-trung-lap-ma-khong-lam-sai-y" className="c-resource-card">
                <span className="c-resource-badge">Phương pháp</span>
                <h4>Cách giảm tỷ lệ trùng lặp mà không làm sai ý bài viết</h4>
                <p>Quy trình 4 bước xử lý câu bị trùng, kỹ thuật biến đổi câu tiếng Trung học thuật an toàn.</p>
              </Link>

              <Link to="/kien-thuc/checklist-kiem-tra-luan-van-tieng-trung-truoc-khi-nop" className="c-resource-card">
                <span className="c-resource-badge">Bảng kiểm</span>
                <h4>Checklist kiểm tra luận văn tiếng Trung trước khi nộp</h4>
                <p>Bảng kiểm tra 6 hạng mục quan trọng: hệ chữ, định dạng trích dẫn, tài liệu tham khảo và phụ lục.</p>
              </Link>

              <Link to="/kien-thuc/cach-trich-dan-tai-lieu-tieng-trung-theo-apa" className="c-resource-card">
                <span className="c-resource-badge">Chuẩn APA</span>
                <h4>Cách trích dẫn tài liệu tiếng Trung theo chuẩn APA 7</h4>
                <p>Quy tắc ghi Pinyin, chữ Hán và dịch nghĩa tiêu đề cho sách báo, luận văn tiếng Trung.</p>
              </Link>
            </div>
          </section>

        </div>
      </div>
    </article>
  );
}

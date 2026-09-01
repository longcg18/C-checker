import { useNavigate } from 'react-router';

interface AboutPageProps {
  onBack?: () => void;
}

export function AboutPage({ onBack }: AboutPageProps) {
  const navigate = useNavigate();
  const handleBack = onBack || (() => navigate('/'));

  return (
    <div className="c-page-layout">
      <div className="c-page-container">
        <button className="c-page-back-btn" onClick={handleBack}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Quay lại trang chủ
        </button>

        <header className="c-page-hero">
          <h1 className="c-page-title">Giới thiệu C-checker</h1>
          <p className="c-page-subtitle">
            Một trong những công cụ tiên phong tại Việt Nam hỗ trợ đối chiếu và phát hiện trùng lặp trong văn bản tiếng Trung
          </p>
        </header>

        <div className="c-page-content">

          <section className="c-about-section">
            <h2 className="c-page-section-title">Sứ mệnh của chúng tôi</h2>
            <div className="c-about-mission">
              <p className="c-about-text">
                Trong bối cảnh học thuật tiếng Trung ngày càng phát triển tại Việt Nam, việc kiểm tra tính nguyên bản của các tài liệu, luận văn và bài nghiên cứu là một thách thức lớn do đặc thù ngôn ngữ tượng hình phức tạp.
              </p>
              <p className="c-about-text">
                <strong>C-checker</strong> ra đời với mục tiêu cung cấp một công cụ hỗ trợ kiểm tra trùng lặp tiếng Trung dễ tiếp cận. Kết quả là tín hiệu tham khảo để người dùng xem xét nguồn và cách trích dẫn, không thay thế kết luận chuyên môn của giảng viên hoặc cơ sở đào tạo.
              </p>
            </div>
          </section>

          <section className="c-about-section">
            <h2 className="c-page-section-title">Công nghệ cốt lõi</h2>
            <div className="c-about-tech-grid">
              <article className="c-about-tech-card c-about-tech-card--blue">
                <div className="c-about-tech-icon">🧠</div>
                <h3>MiniLM Semantic AI</h3>
                <p>Mô hình học sâu phân tích ngữ nghĩa câu. Phát hiện viết lại (paraphrase), thay từ đồng nghĩa và thay đổi cấu trúc câu tinh vi mà các phương pháp truyền thống bỏ qua.</p>
              </article>
              <article className="c-about-tech-card c-about-tech-card--purple">
                <div className="c-about-tech-icon">🔗</div>
                <h3>Thuật toán LCS</h3>
                <p>Longest Common Subsequence — Tìm chuỗi ký tự / từ con chung dài nhất giữa hai đoạn văn, xác định chính xác các đoạn sao chép nguyên bản.</p>
              </article>
              <article className="c-about-tech-card c-about-tech-card--green">
                <div className="c-about-tech-icon">📊</div>
                <h3>Phân tích N-gram</h3>
                <p>So khớp các tổ hợp N từ liên tiếp giữa văn bản đầu vào và các nguồn đối chiếu, giúp phát hiện trùng lặp theo từng cụm từ đặc trưng.</p>
              </article>
              <article className="c-about-tech-card c-about-tech-card--amber">
                <div className="c-about-tech-icon">🌐</div>
                <h3>DDGS Web Search</h3>
                <p>Tìm kiếm các trang web công khai có thể chứa cụm từ tương đồng để tạo danh sách nguồn tham khảo. Phạm vi kết quả phụ thuộc vào khả năng lập chỉ mục và phản hồi của dịch vụ tìm kiếm.</p>
              </article>
            </div>
          </section>

          <section className="c-about-section">
            <h2 className="c-page-section-title">Đối tượng sử dụng</h2>
            <div className="c-about-audience">
              <div className="c-about-audience-item">
                <span className="c-about-audience-icon">🎓</span>
                <div>
                  <strong>Sinh viên</strong>
                  <p>Tự kiểm tra luận văn, bài tập lớn tiếng Trung trước khi nộp cho giảng viên.</p>
                </div>
              </div>
              <div className="c-about-audience-item">
                <span className="c-about-audience-icon">👨‍🏫</span>
                <div>
                  <strong>Giảng viên & Giáo viên</strong>
                  <p>Rà soát và đối chiếu tính nguyên bản các bài thi, bài luận của học sinh.</p>
                </div>
              </div>
              <div className="c-about-audience-item">
                <span className="c-about-audience-icon">🔬</span>
                <div>
                  <strong>Nhà nghiên cứu</strong>
                  <p>Kiểm tra tính độc đáo của bài báo khoa học và tài liệu nghiên cứu tiếng Trung.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="c-about-section c-about-contact">
            <h2 className="c-page-section-title">Liên hệ & Góp ý</h2>
            <p className="c-about-text">
              Chúng tôi luôn lắng nghe phản hồi từ cộng đồng người dùng để liên tục cải thiện C-checker.
            </p>
            <div className="c-about-contact-info">
              <a href="mailto:nguyenphuclong.work@gmail.com" className="c-about-contact-link">
                <span className="c-about-contact-icon">✉️</span>
                nguyenphuclong.work@gmail.com
              </a>
              <a href="https://www.c-checker.io.vn" className="c-about-contact-link">
                <span className="c-about-contact-icon">🌐</span>
                https://www.c-checker.io.vn
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61593965732839"
                className="c-about-contact-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="c-about-contact-icon" aria-hidden="true">f</span>
                Fanpage C-checker
              </a>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}

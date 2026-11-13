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
          <div className="c-seal-mark" style={{ marginBottom: 16 }}>
            <span className="c-seal-text">考证</span>
            <span className="c-seal-sub">TỔNG QUAN HỆ THỐNG C-CHECKER</span>
          </div>
          <h1 className="c-page-title">Hệ thống khảo chứng &amp; đối soát văn bản tiếng Trung</h1>
          <p className="c-page-subtitle">
            Nền tảng công nghệ học thuật tiên phong tại Việt Nam hỗ trợ phân tích ngữ liệu, nhận diện mức độ tương đồng và bảo tồn sự liêm chính học thuật trong nghiên cứu Hán ngữ.
          </p>
        </header>

        <div className="c-page-content">
          {/* Mission Section */}
          <section className="c-about-section">
            <h2 className="c-page-section-title">Sứ mệnh vì sự Liêm chính Học thuật</h2>
            <div className="c-about-mission">
              <p className="c-about-text">
                Trong bối cảnh hợp tác giáo dục và nghiên cứu Hán học ngày càng sâu rộng tại Việt Nam, nhu cầu thẩm định tính nguyên bản của các công trình nghiên cứu, khóa luận tốt nghiệp và bản thảo học thuật ngày càng trở nên cấp thiết. Đặc thù của chữ tượng hình (方块字) — không có khoảng trắng phân định ranh giới từ và cấu trúc ngữ nghĩa hàm súc — khiến các công cụ quét chuỗi phương Tây thông thường khó lòng đáp ứng chuẩn xác.
              </p>
              <p className="c-about-text">
                <strong>C-checker</strong> được nghiên cứu và phát triển nhằm mang đến một giải pháp đối soát Hán văn chuyên biệt, minh bạch và hoàn toàn miễn phí. Chúng tôi xây dựng hệ thống như một người trợ lý học thuật đắc lực giúp người học tự hoàn thiện tác phẩm, tôn trọng chuẩn mực trích dẫn và nâng cao giá trị nghiên cứu khoa học.
              </p>
            </div>
          </section>

          {/* Core Technologies */}
          <section className="c-about-section">
            <h2 className="c-page-section-title">Nền tảng Công nghệ &amp; Thuật toán Kép</h2>
            <div className="c-about-tech-grid">
              <article className="c-about-tech-card">
                <span className="c-tech-label">SEMANTIC AI</span>
                <h3>Mô hình Ngôn ngữ MiniLM</h3>
                <p>
                  Mô hình Transformer nhúng vector không gian 384 chiều, phân tích ngữ nghĩa sâu của từng phát ngôn. Có khả năng phát hiện các hình thức diễn đạt lại (paraphrase), thay thế từ đồng nghĩa và biến đổi cấu trúc ngữ pháp mà các thuật toán so chuỗi đơn thuần bỏ sót.
                </p>
              </article>

              <article className="c-about-tech-card">
                <span className="c-tech-label">LEXICAL MATCH</span>
                <h3>Thuật toán LCS (Chuỗi con dài nhất)</h3>
                <p>
                  Longest Common Subsequence — Đo lường chuỗi ký tự chung dài nhất giữa văn bản khảo sát và ngữ liệu đối sánh. Nhận diện chuẩn xác các phân đoạn sao chép nguyên văn kể cả khi bị chèn thêm các hư từ hoặc trợ từ tiếng Trung.
                </p>
              </article>

              <article className="c-about-tech-card">
                <span className="c-tech-label">N-GRAM ANALYSIS</span>
                <h3>Phân tích Tổ hợp N-gram</h3>
                <p>
                  So khớp các khối cụm 3-gram và 4-gram ký tự Hán tự liên tiếp, giúp phát hiện sự xáo trộn trật tự từ ngữ và các cụm thành ngữ (成语), quán dụng ngữ đặc trưng trong tiếng Trung học thuật.
                </p>
              </article>

              <article className="c-about-tech-card">
                <span className="c-tech-label">DUAL-SYSTEM</span>
                <h3>Liên thông Giản thể &amp; Phồn thể</h3>
                <p>
                  Thuật toán chuẩn hóa tự động liên kết ngữ nghĩa giữa hai hệ chữ Hán giản thể (简体) và phồn thể (繁體), đảm bảo tính công bằng khi đối soát tài liệu trích lục từ các nguồn tư liệu cổ điển hoặc khu vực sử dụng phồn thể.
                </p>
              </article>
            </div>
          </section>

          {/* Target Audience */}
          <section className="c-about-section">
            <h2 className="c-page-section-title">Đối tượng Đồng hành</h2>
            <div className="c-about-audience">
              <div className="c-about-audience-item">
                <div className="c-audience-badge">I</div>
                <div>
                  <strong>Sinh viên &amp; Học viên Cao học</strong>
                  <p>Tự rà soát luận văn tốt nghiệp, tiểu luận chuyên ngành trước khi trình hội đồng, chủ động khắc phục sai sót trích dẫn vô thức.</p>
                </div>
              </div>

              <div className="c-about-audience-item">
                <div className="c-audience-badge">II</div>
                <div>
                  <strong>Giảng viên &amp; Hội đồng Thẩm định</strong>
                  <p>Hỗ trợ công tác đánh giá tính độc lập của các báo cáo học thuật, bài thu hoạch và công trình nghiên cứu của học viên.</p>
                </div>
              </div>

              <div className="c-about-audience-item">
                <div className="c-audience-badge">III</div>
                <div>
                  <strong>Nhà nghiên cứu &amp; Tác giả</strong>
                  <p>Kiểm chứng nguồn trích dẫn sơ cấp/thứ cấp, đối soát mức độ nguyên bản của bản thảo trước khi gửi đến các tạp chí khoa học chuyên ngành.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Statement of Principle */}
          <section className="c-about-section">
            <div className="c-article-note" style={{ borderLeftColor: 'var(--c-accent)' }}>
              <strong>Tuyên bố về Giới hạn Kỹ thuật:</strong> Kết quả điểm tương đồng do C-checker cung cấp là chỉ số tính toán hỗ trợ tham khảo. Tỷ lệ % tương đồng không đồng nhất với kết luận về mặt đạo văn, và không thay thế phán quyết chuyên môn của giảng viên, hội đồng nghiệm thu hoặc cơ quan học thuật có thẩm quyền.
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

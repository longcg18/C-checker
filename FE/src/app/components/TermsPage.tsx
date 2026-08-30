import { useNavigate } from 'react-router';

export function TermsPage() {
  const navigate = useNavigate();

  return (
    <div className="c-page-layout">
      <div className="c-page-container">
        <button className="c-page-back-btn" onClick={() => navigate('/')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Quay lại trang chủ
        </button>

        <header className="c-page-hero">
          <h1 className="c-page-title">Điều khoản dịch vụ</h1>
          <p className="c-page-subtitle">
            Quy định sử dụng và điều kiện dịch vụ hệ thống kiểm tra đạo văn C-checker (www.c-checker.io.vn).
          </p>
        </header>

        <div className="c-page-content">
          <section className="c-about-section">
            <h2 className="c-page-section-title">1. Chấp thuận điều khoản</h2>
            <div className="c-about-mission">
              <p className="c-about-text">
                Bằng việc truy cập, tạo tài khoản hoặc sử dụng bất kỳ tính năng nào của hệ thống <strong>C-checker</strong>, bạn xác nhận rằng bạn đã đọc, hiểu và đồng ý bị ràng buộc bởi các Điều khoản dịch vụ này cùng Chính sách bảo mật của chúng tôi.
              </p>
              <p className="c-about-text">
                Nếu bạn không đồng ý với bất kỳ phần nào của điều khoản, vui lòng ngừng sử dụng dịch vụ.
              </p>
            </div>
          </section>

          <section className="c-about-section">
            <h2 className="c-page-section-title">2. Mục đích sử dụng hợp pháp</h2>
            <div className="c-about-tech-grid">
              <article className="c-about-tech-card c-about-tech-card--blue">
                <div className="c-about-tech-icon">🎓</div>
                <h3>Học thuật & Nghiên cứu</h3>
                <p>
                  C-checker được xây dựng nhằm phục vụ mục đích giáo dục, học tập, nghiên cứu khoa học và nâng cao tính nguyên bản của các tác phẩm tiếng Trung.
                </p>
              </article>
              <article className="c-about-tech-card c-about-tech-card--purple">
                <div className="c-about-tech-icon">⚖️</div>
                <h3>Trách nhiệm nội dung</h3>
                <p>
                  Người dùng chịu hoàn toàn trách nhiệm pháp lý đối với nội dung văn bản và tài liệu mà mình tải lên hoặc quét trên hệ thống.
                </p>
              </article>
            </div>
          </section>

          <section className="c-about-section">
            <h2 className="c-page-section-title">3. Quy định cấm khi sử dụng</h2>
            <p className="c-about-text">Người dùng cam kết tuyệt đối không thực hiện các hành vi sau:</p>
            <ul className="c-guide-list">
              <li>Tải lên các tài liệu có nội dung vi phạm pháp luật, kích động bạo lực, phỉ báng hoặc xâm phạm quyền riêng tư của cá nhân, tổ chức.</li>
              <li>Sử dụng các công cụ tự động hóa (botnet, spider, scraper trái phép) gửi yêu cầu quá mức gây quá tải hoặc phá hoại hệ thống máy chủ C-checker.</li>
              <li>Cố tình can thiệp, dịch ngược mã nguồn (reverse engineer) hoặc khai thác lỗ hổng bảo mật của hệ thống.</li>
              <li>Giả mạo danh tính cá nhân hoặc tổ chức khác khi sử dụng dịch vụ.</li>
            </ul>
          </section>

          <section className="c-about-section">
            <h2 className="c-page-section-title">4. Quyền sở hữu trí tuệ</h2>
            <div className="c-about-mission">
              <p className="c-about-text">
                <strong>Quyền sở hữu tài liệu của bạn:</strong> Bạn giữ nguyên 100% quyền tác giả và quyền sở hữu trí tuệ đối với các bài viết, bài luận và tài liệu bạn đưa vào kiểm tra. C-checker không bao giờ tuyên bố quyền sở hữu hay sử dụng thương mại tác phẩm của bạn.
              </p>
              <p className="c-about-text">
                <strong>Tài sản trí tuệ của C-checker:</strong> Giao diện, logo, nhãn hiệu, thuật toán và mã nguồn của C-checker thuộc quyền sở hữu độc quyền của ban phát triển dự án C-checker.
              </p>
            </div>
          </section>

          <section className="c-about-section">
            <h2 className="c-page-section-title">5. Tuyên bố miễn trừ trách nhiệm</h2>
            <div className="c-about-tech-grid">
              <article className="c-about-tech-card c-about-tech-card--amber">
                <div className="c-about-tech-icon">⚠️</div>
                <h3>Giá trị tham khảo học thuật</h3>
                <p>
                  Kết quả phân tích từ AI (MiniLM) và các thuật toán so khớp LCS, N-gram mang tính chất hỗ trợ và tham khảo. Báo cáo không cấu thành chứng thư pháp lý chính thức. Quyết định cuối cùng về việc công nhận tính nguyên bản thuộc về người dùng và cơ sở đào tạo.
                </p>
              </article>
              <article className="c-about-tech-card c-about-tech-card--green">
                <div className="c-about-tech-icon">🔄</div>
                <h3>Tính sẵn sàng của dịch vụ</h3>
                <p>
                  Chúng tôi nỗ lực duy trì hệ thống hoạt động ổn định 24/7. Tuy nhiên, dịch vụ có thể tạm dừng để bảo trì định kỳ hoặc nâng cấp thuật toán mà không cần thông báo trước.
                </p>
              </article>
            </div>
          </section>

          <section className="c-about-section c-about-contact">
            <h2 className="c-page-section-title">Liên hệ giải đáp điều khoản</h2>
            <p className="c-about-text">
              Nếu bạn có bất kỳ câu hỏi nào về Điều khoản dịch vụ này, xin vui lòng liên hệ với ban quản trị:
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
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

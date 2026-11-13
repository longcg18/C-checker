import { useNavigate } from 'react-router';

export function ContactPage() {
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
          <div className="c-seal-mark" style={{ marginBottom: 16 }}>
            <span className="c-seal-text">考证</span>
            <span className="c-seal-sub">KÊNH HỖ TRỢ HỌC THUẬT</span>
          </div>
          <h1 className="c-page-title">Liên hệ với Ban quản trị C-checker</h1>
          <p className="c-page-subtitle">
            Chúng tôi luôn trân trọng lắng nghe mọi đóng góp, phản hồi về thuật toán và yêu cầu hỗ trợ kỹ thuật từ cộng đồng nghiên cứu.
          </p>
        </header>

        <div className="c-page-content">
          <section className="c-about-section">
            <h2 className="c-page-section-title">Kênh Tiếp nhận Chính thức</h2>
            <div className="c-contact-grid">
              <article className="c-contact-card">
                <span className="c-contact-dept">BỘ PHẬN KỸ THUẬT &amp; THUẬT TOÁN</span>
                <h3 className="c-contact-title">Hỗ trợ Phân tích &amp; Lỗi hệ thống</h3>
                <p className="c-contact-desc">
                  Giải đáp thắc mắc về cơ chế tính điểm MiniLM, thuật toán LCS/N-gram, phản hồi sự cố tải tệp hoặc yêu cầu tính năng học thuật mới.
                </p>
                <div className="c-contact-email-box">
                  <span className="c-contact-email-label">Email trực tiếp:</span>
                  <a href="mailto:nguyenphuclong.work@gmail.com" className="c-contact-email-link">
                    nguyenphuclong.work@gmail.com
                  </a>
                </div>
              </article>

              <article className="c-contact-card">
                <span className="c-contact-dept">BAN QUẢN TRỊ DỮ LIỆU &amp; PHÁP LÝ</span>
                <h3 className="c-contact-title">Bảo mật Tác quyền &amp; Quyền riêng tư</h3>
                <p className="c-contact-desc">
                  Tiếp nhận các yêu cầu tra soát quyền tác giả bản thảo, yêu cầu hủy bỏ vĩnh viễn dữ liệu tài khoản hoặc các thỏa ước hợp tác nghiên cứu.
                </p>
                <div className="c-contact-email-box">
                  <span className="c-contact-email-label">Email trực tiếp:</span>
                  <a href="mailto:nguyenphuclong.work@gmail.com" className="c-contact-email-link">
                    nguyenphuclong.work@gmail.com
                  </a>
                </div>
              </article>
            </div>
          </section>

          <section className="c-about-section">
            <h2 className="c-page-section-title">Thời hạn &amp; Cam kết Phản hồi</h2>
            <div className="c-about-mission">
              <p className="c-about-text">
                Mọi thư từ điện tử gửi đến C-checker sẽ được ban quản trị xem xét và phúc đáp trong vòng <strong>24 đến 48 giờ làm việc</strong> (từ Thứ Hai đến Thứ Sáu, trừ các ngày nghỉ lễ theo quy định).
              </p>
              <p className="c-about-text">
                Đối với các báo cáo liên quan đến sự cố kỹ thuật hạ tầng nghiêm trọng hoặc khiếu nại bản quyền khẩn cấp, vui lòng thêm tiền tố <code>[KHẨN CẤP]</code> hoặc <code>[URGENT]</code> vào tiêu đề thư để được hệ thống phân luồng ưu tiên xử lý trong ngày.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

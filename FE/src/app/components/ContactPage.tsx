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
          <h1 className="c-page-title">Liên hệ với C-checker</h1>
          <p className="c-page-subtitle">
            Chúng tôi luôn sẵn sàng lắng nghe mọi đóng góp, phản hồi và yêu cầu hỗ trợ từ bạn.
          </p>
        </header>

        <div className="c-page-content">
          <section className="c-about-section">
            <h2 className="c-page-section-title">Kênh liên hệ trực tiếp</h2>
            <div className="c-about-tech-grid">
              <article className="c-about-tech-card c-about-tech-card--blue">
                <div className="c-about-tech-icon">✉️</div>
                <h3>Email Hỗ trợ & Kỹ thuật</h3>
                <p>Gửi câu hỏi về thuật toán, lỗi hệ thống hoặc hướng dẫn sử dụng:</p>
                <p style={{ marginTop: 8 }}>
                  <a href="mailto:nguyenphuclong.work@gmail.com" style={{ color: 'var(--c-accent)', fontWeight: 600 }}>
                    nguyenphuclong.work@gmail.com
                  </a>
                </p>
              </article>

              <article className="c-about-tech-card c-about-tech-card--purple">
                <div className="c-about-tech-icon">🔒</div>
                <h3>Email Bảo mật & Dữ liệu</h3>
                <p>Yêu cầu liên quan đến quyền riêng tư, xóa dữ liệu hoặc báo cáo vi phạm:</p>
                <p style={{ marginTop: 8 }}>
                  <a href="mailto:nguyenphuclong.work@gmail.com" style={{ color: 'var(--c-accent)', fontWeight: 600 }}>
                    nguyenphuclong.work@gmail.com
                  </a>
                </p>
              </article>
            </div>
          </section>

          <section className="c-about-section">
            <h2 className="c-page-section-title">Thời gian phản hồi</h2>
            <div className="c-about-mission">
              <p className="c-about-text">
                ⏱️ Đội ngũ quản trị C-checker sẽ phản hồi qua email trong vòng <strong>24 - 48 giờ làm việc</strong> (Thứ Hai - Thứ Sáu).
              </p>
              <p className="c-about-text">
                Đối với các báo cáo lỗi khẩn cấp hoặc sự cố máy chủ, vui lòng ghi rõ tiêu đề <code>[URGENT]</code> trong email để được ưu tiên xử lý.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

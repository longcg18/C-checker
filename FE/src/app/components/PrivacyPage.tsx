import { useNavigate } from 'react-router';

export function PrivacyPage() {
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
          <h1 className="c-page-title">Chính sách bảo mật</h1>
          <p className="c-page-subtitle">
            Cập nhật lần cuối: Tháng 8, 2026 · Cam kết bảo mật thông tin cá nhân và dữ liệu tài liệu người dùng tại C-checker.
          </p>
        </header>

        <div className="c-page-content">
          <section className="c-about-section">
            <h2 className="c-page-section-title">1. Giới thiệu chung</h2>
            <div className="c-about-mission">
              <p className="c-about-text">
                Chào mừng bạn đến với <strong>C-checker</strong> (<code>https://www.c-checker.io.vn</code>). Chính sách này mô tả loại dữ liệu chúng tôi xử lý, mục đích sử dụng và các lựa chọn của người dùng.
              </p>
              <p className="c-about-text">
                Bằng việc truy cập hoặc sử dụng dịch vụ C-checker, bạn đồng ý với các điều khoản thu thập và xử lý dữ liệu được nêu trong chính sách này.
              </p>
            </div>
          </section>

          <section className="c-about-section">
            <h2 className="c-page-section-title">2. Thu thập dữ liệu & Văn bản kiểm tra</h2>
            <div className="c-about-tech-grid">
              <article className="c-about-tech-card c-about-tech-card--blue">
                <div className="c-about-tech-icon">📝</div>
                <h3>Văn bản & Tài liệu tải lên</h3>
                <p>
                  Dữ liệu văn bản tiếng Trung được sử dụng để phân tích trùng lặp và tạo báo cáo. Để tìm nguồn công khai, hệ thống có thể gửi các cụm từ tìm kiếm được trích từ văn bản tới dịch vụ tìm kiếm trên Internet. Chúng tôi không bán hoặc công khai tài liệu do người dùng tải lên.
                </p>
              </article>
              <article className="c-about-tech-card c-about-tech-card--purple">
                <div className="c-about-tech-icon">👤</div>
                <h3>Thông tin tài khoản Google</h3>
                <p>
                  Khi đăng nhập bằng Google OAuth, chúng tôi chỉ thu thập thông tin cơ bản gồm tên hiển thị, địa chỉ email và ảnh đại diện nhằm mục đích xác thực và quản lý lịch sử kiểm tra cá nhân của bạn.
                </p>
              </article>
            </div>
          </section>

          <section className="c-about-section">
            <h2 className="c-page-section-title">3. Dịch vụ hỗ trợ xử lý</h2>
            <div className="c-about-mission">
              <p className="c-about-text">
                C-checker sử dụng nhà cung cấp hạ tầng lưu trữ, đăng nhập Google OAuth và dịch vụ tìm kiếm web để vận hành các chức năng được mô tả. Các bên này có thể xử lý dữ liệu kỹ thuật cần thiết, như địa chỉ IP, thông tin trình duyệt, thông tin xác thực hoặc cụm từ truy vấn, theo chính sách riêng của họ.
              </p>
            </div>
          </section>

          <section className="c-about-section">
            <h2 className="c-page-section-title">4. Quảng cáo Google AdSense & Cookies bên thứ ba</h2>
            <div className="c-about-mission">
              <p className="c-about-text">
                Website có thể tích hợp dịch vụ quảng cáo từ <strong>Google AdSense</strong> và các mạng quảng cáo đối tác nhằm duy trì chi phí máy chủ phân tích miễn phí cho cộng đồng:
              </p>
              <ul className="c-guide-list">
                <li>
                  Google và các đối tác bên thứ ba sử dụng <strong>Cookies (bao gồm DoubleClick DART cookie)</strong> để phân phối quảng cáo dựa trên các lượt truy cập trước đó của bạn vào website này hoặc các website khác trên Internet.
                </li>
                <li>
                  Người dùng có thể chọn không tham gia sử dụng DART cookie cho quảng cáo dựa trên sở thích bằng cách truy cập{' '}
                  <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--c-accent)', textDecoration: 'underline' }}>
                    Chính sách bảo mật quảng cáo của Google
                  </a>.
                </li>
                <li>
                  Bạn cũng có thể quản lý hoặc tắt cookie quảng cáo cá nhân hóa của nhiều nhà cung cấp bên thứ ba tại{' '}
                  <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--c-accent)', textDecoration: 'underline' }}>
                    www.aboutads.info
                  </a>.
                </li>
              </ul>
            </div>
          </section>

          <section className="c-about-section">
            <h2 className="c-page-section-title">5. Bảo mật truyền tải & Lưu trữ dữ liệu</h2>
            <div className="c-about-tech-grid">
              <article className="c-about-tech-card c-about-tech-card--green">
                <div className="c-about-tech-icon">🛡️</div>
                <h3>Kết nối HTTPS</h3>
                <p>
                  Toàn bộ luồng kết nối giữa trình duyệt của bạn và hệ thống máy chủ C-checker đều được mã hóa bằng chuẩn an toàn HTTPS (SSL). Dữ liệu gửi đi được bảo vệ chống nghe lén và giả mạo.
                </p>
              </article>
              <article className="c-about-tech-card c-about-tech-card--amber">
                <div className="c-about-tech-icon">🗄️</div>
                <h3>Quyền riêng tư lịch sử kiểm tra</h3>
                <p>
                  Dữ liệu lịch sử kiểm tra chỉ hiển thị riêng cho tài khoản của bạn. Đối với người dùng khách dùng thử, đoạn văn bản tạm thời không được lưu vào cơ sở dữ liệu sau khi phiên kiểm tra kết thúc.
                </p>
              </article>
            </div>
          </section>

          <section className="c-about-section">
            <h2 className="c-page-section-title">6. Quyền của người dùng & Thay đổi chính sách</h2>
            <p className="c-about-text">
              Bạn có quyền yêu cầu xóa lịch sử kiểm tra và thông tin tài khoản cá nhân bằng cách liên hệ với chúng tôi. Chúng tôi sẽ xác minh người yêu cầu và phản hồi trong thời gian hợp lý; một số bản ghi kỹ thuật có thể được giữ lại khi pháp luật hoặc yêu cầu bảo mật hệ thống bắt buộc.
            </p>
            <p className="c-about-text">
              Chúng tôi có thể cập nhật chính sách bảo mật này theo thời gian để phù hợp với quy định mới. Mọi cập nhật sẽ được công bố trực tiếp tại trang này.
            </p>
          </section>

          <section className="c-about-section c-about-contact">
            <h2 className="c-page-section-title">Liên hệ về bảo mật dữ liệu</h2>
            <p className="c-about-text">
              Nếu bạn có bất kỳ thắc mắc hoặc yêu cầu liên quan đến quyền riêng tư và dữ liệu cá nhân, vui lòng liên hệ:
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

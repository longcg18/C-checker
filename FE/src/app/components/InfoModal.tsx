import React from 'react';

export type ModalType = 'guide' | 'privacy' | 'terms' | 'about' | 'contact' | null;

interface InfoModalProps {
  type: ModalType;
  onClose: () => void;
}

export function InfoModal({ type, onClose }: InfoModalProps) {
  if (!type) return null;

  const renderContent = () => {
    switch (type) {
      case 'guide':
        return (
          <div className="c-modal-article">
            <h2>📖 Hướng dẫn sử dụng hệ thống C-checker</h2>
            <p className="c-modal-lead">
              C-checker là công cụ hỗ trợ rà soát tính nguyên bản và phát hiện trùng lặp văn bản tiếng Trung hàng đầu tại Việt Nam. Dưới đây là hướng dẫn chi tiết từng bước sử dụng hệ thống.
            </p>

            <h3>1. Chế độ kiểm tra dùng thử (Khách)</h3>
            <ul>
              <li>Không cần đăng nhập tài khoản.</li>
              <li>Hỗ trợ dán trực tiếp đoạn văn bản tiếng Trung tối đa <strong>300 ký tự</strong>.</li>
              <li>Bấm nút <strong>"Phân tích đạo văn"</strong> để hệ thống tiến hành kiểm tra ngay lập tức.</li>
            </ul>

            <h3>2. Chế độ mở khóa đầy đủ (Đã đăng nhập)</h3>
            <ul>
              <li>Nhấp nút <strong>"Đăng nhập Google"</strong> ở góc trên bên phải màn hình.</li>
              <li>Hỗ trợ tải tệp tin tài liệu trực tiếp: <code>.docx</code>, <code>.pdf</code>, <code>.txt</code>.</li>
              <li>Không giới hạn số lần kiểm tra và được lưu trữ tự động vào **Bảng Lịch sử**.</li>
            </ul>

            <h3>3. Đọc và hiểu kết quả báo cáo</h3>
            <ul>
              <li><strong>Mức độ trùng lặp (%):</strong> Tỷ lệ phần trăm các câu trong văn bản có khả năng sao chép cao.</li>
              <li><strong>MiniLM Semantic (AI Ngữ nghĩa):</strong> Phát hiện các đoạn văn được viết lại (paraphrase) hoặc thay đổi từ đồng nghĩa.</li>
              <li><strong>LCS & N-gram:</strong> Phát hiện các chuỗi từ trùng lặp nguyên bản liên tiếp.</li>
              <li><strong>Nguồn so khớp:</strong> Hiển thị đường dẫn (URL) và trích đoạn nguồn đối chiếu trên Internet.</li>
            </ul>

            <h3>4. Tính năng chạy ngầm & Quản lý lịch sử</h3>
            <p>
              Khi bắt đầu quét, bạn có thể bấm nút <em>"Quay lại trang chủ & xem Lịch sử"</em>. Hệ thống sẽ tiếp tục chạy ngầm ở background và hiển thị thanh tiến trình thu gọn. Bạn có thể mở lại chi tiết báo cáo bất kỳ lúc nào từ Bảng Lịch sử.
            </p>
          </div>
        );

      case 'privacy':
        return (
          <div className="c-modal-article">
            <h2>🔒 Chính sách bảo mật (Privacy Policy)</h2>
            <p className="c-modal-subtext">Cập nhật lần cuối: Tháng 8, 2026</p>

            <p>
              Chào mừng bạn đến với <strong>C-checker</strong> (`https://c-checker.io.vn`). Chúng tôi cam kết bảo vệ thông tin cá nhân và dữ liệu tài liệu của người dùng tuân thủ theo các quy định bảo mật quốc tế và chính sách của Google.
            </p>

            <h3>1. Thu thập dữ liệu và Văn bản kiểm tra</h3>
            <ul>
              <li><strong>Văn bản nhập tay / Tệp tin tải lên:</strong> Dữ liệu văn bản tiếng Trung của bạn chỉ được sử dụng cho mục đích phân tích tính nguyên bản và đối chiếu trùng lặp. Chúng tôi **không** bán, công khai hoặc chia sẻ văn bản của bạn cho bất kỳ bên thứ ba nào.</li>
              <li><strong>Thông tin tài khoản:</strong> Khi đăng nhập bằng Google, chúng tôi thu thập tên hiển thị và email đại diện để quản lý lịch sử kiểm tra cá nhân của bạn.</li>
            </ul>

            <h3>2. Quảng cáo Google AdSense & Cookies của bên thứ ba</h3>
            <ul>
              <li>Website này sử dụng dịch vụ quảng cáo **Google AdSense**.</li>
              <li>Google và các đối tác bên thứ ba sử dụng **Cookies (bao gồm DART cookie)** để phục vụ quảng cáo dựa trên các lượt truy cập trước đó của bạn vào website này hoặc các website khác trên Internet.</li>
              <li>Người dùng có thể từ chối sử dụng DART cookie bằng cách truy cập <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer">Chính sách bảo mật quảng cáo của Google</a>.</li>
              <li>Bạn cũng có thể quản lý hoặc tắt quảng cáo cá nhân hóa tại trang <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer">www.aboutads.info</a>.</li>
            </ul>

            <h3>3. Bảo mật dữ liệu</h3>
            <p>
              Tất cả kết nối giữa trình duyệt của bạn và máy chủ C-checker đều được mã hóa qua chuẩn kết nối an toàn HTTPS (SSL). Dữ liệu lịch sử kiểm tra chỉ hiển thị riêng cho tài khoản cá nhân của bạn.
            </p>

            <h3>4. Thay đổi chính sách</h3>
            <p>
              Chúng tôi có thể cập nhật chính sách bảo mật này theo thời gian. Mọi thay đổi sẽ được công bố trực tiếp tại trang này.
            </p>
          </div>
        );

      case 'terms':
        return (
          <div className="c-modal-article">
            <h2>📋 Điều khoản dịch vụ (Terms of Service)</h2>
            
            <p>
              Bằng việc truy cập và sử dụng hệ thống <strong>C-checker</strong>, bạn đồng ý tuân thủ các điều khoản và điều kiện sử dụng dưới đây:
            </p>

            <h3>1. Mục đích sử dụng</h3>
            <p>
              C-checker được cung cấp nhằm mục đích hỗ trợ học thuật, nghiên cứu và giáo dục. Người dùng chịu trách nhiệm cá nhân đối với nội dung văn bản mà mình đăng tải lên hệ thống.
            </p>

            <h3>2. Quy định sử dụng hợp lý</h3>
            <ul>
              <li>Không tải lên các nội dung vi phạm pháp luật, chứa mã độc, nội dung phỉ báng hoặc xâm phạm quyền riêng tư của người khác.</li>
              <li>Không tự động hóa (botnet/scraper) để gửi yêu cầu spam gây quá tải hệ thống máy chủ.</li>
            </ul>

            <h3>3. Quyền sở hữu trí tuệ</h3>
            <p>
              Bạn giữ nguyên 100% quyền sở hữu trí tuệ đối với văn bản và tài liệu mà bạn đăng tải lên C-checker. C-checker không tuyên bố bất kỳ quyền sở hữu nào đối với bài viết của bạn.
            </p>

            <h3>4. Miễn trừ trách nhiệm</h3>
            <p>
              Hệ thống sử dụng AI (MiniLM) và các thuật toán tìm kiếm đối chiếu tự động để đưa ra báo cáo trùng lặp mang tính tham khảo. Kết quả của C-checker không cấu thành văn bản pháp lý chính thức. Quyết định cuối cùng về tính nguyên bản thuộc về người dùng và các cơ sở giáo dục.
            </p>
          </div>
        );

      case 'about':
        return (
          <div className="c-modal-article">
            <h2>ℹ️ Giới thiệu dự án C-checker</h2>
            
            <p className="c-modal-lead">
              <strong>C-checker</strong> là giải pháp tiên phong tại Việt Nam chuyên hỗ trợ phát hiện đạo văn và rà soát trùng lặp văn bản tiếng Trung dành cho sinh viên, giảng viên và các nhà nghiên cứu.
            </p>

            <h3>Sứ mệnh của chúng tôi</h3>
            <p>
              Việc rà soát luận văn và tài liệu tiếng Trung thường gặp nhiều khó khăn do đặc thù ngôn ngữ tượng hình. C-checker ra đời với sứ mệnh cung cấp một công cụ kiểm tra miễn phí, chính xác, tốc độ cao, giúp nâng cao chất lượng học thuật và tính trung thực trong nghiên cứu.
            </p>

            <h3>Công nghệ cốt lõi</h3>
            <ul>
              <li><strong>MiniLM Semantic AI:</strong> Phân tích ngữ cảnh câu bằng mạng nơ-ron học sâu để phát hiện sửa từ, thay đổi cấu trúc câu.</li>
              <li><strong>Thuật toán LCS (Longest Common Subsequence):</strong> Tìm chuỗi con chung dài nhất giữa hai đoạn văn.</li>
              <li><strong>So khớp N-gram & Tìm kiếm Web DDGS:</strong> Tìm kiếm và truy vấn các nguồn đối chiếu thời gian thực trên kho dữ liệu Internet.</li>
            </ul>
          </div>
        );

      case 'contact':
        return (
          <div className="c-modal-article">
            <h2>📫 Thông tin liên hệ & Hỗ trợ</h2>
            <p>
              Nếu bạn có bất kỳ câu hỏi, đóng góp ý kiến hoặc phản hồi về tính năng của C-checker, xin vui lòng liên hệ với đội ngũ phát triển qua các kênh sau:
            </p>

            <div className="c-contact-cards">
              <div className="c-contact-card">
                <div className="c-contact-icon">✉️</div>
                <div className="c-contact-detail">
                  <strong>Email hỗ trợ chính:</strong>
                  <a href="mailto:support@c-checker.io.vn">support@c-checker.io.vn</a>
                </div>
              </div>
              <div className="c-contact-card">
                <div className="c-contact-icon">🌐</div>
                <div className="c-contact-detail">
                  <strong>Website chính thức:</strong>
                  <a href="https://c-checker.io.vn" target="_blank" rel="noopener noreferrer">https://c-checker.io.vn</a>
                </div>
              </div>
            </div>

            <div className="c-contact-form-notice">
              <p>⏱️ Thời gian phản hồi email thông thường: Trong vòng 24 - 48 giờ làm việc.</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="c-modal-backdrop" onClick={onClose}>
      <div className="c-modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="c-modal-close" onClick={onClose} title="Đóng">
          ✕
        </button>
        <div className="c-modal-body">
          {renderContent()}
        </div>
        <div className="c-modal-footer">
          <button className="c-btn c-btn--primary" onClick={onClose}>
            Đóng cửa sổ
          </button>
        </div>
      </div>
    </div>
  );
}

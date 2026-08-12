interface GuidePageProps {
  onBack: () => void;
}

export function GuidePage({ onBack }: GuidePageProps) {
  return (
    <div className="c-page-layout">
      <div className="c-page-container">
        <button className="c-page-back-btn" onClick={onBack}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Quay lại
        </button>

        <header className="c-page-hero">
          <span className="c-page-hero-badge">C-Checker Guide</span>
          <div className="c-page-hero-icon">📖</div>
          <h1 className="c-page-title">Hướng dẫn sử dụng</h1>
          <p className="c-page-subtitle">
            Từ dùng thử miễn phí đến báo cáo chi tiết — bốn bước đơn giản giúp bạn kiểm tra đạo văn tiếng Trung hiệu quả.
          </p>
        </header>

        <div className="c-page-content">
          <div className="c-guide-steps">

            <section className="c-guide-step">
              <div className="c-guide-step-badge">
                <span className="c-guide-step-num">01</span>
              </div>
              <div className="c-guide-step-body">
                <h2 className="c-guide-step-title">
                  Chế độ dùng thử
                  <span className="c-guide-step-tag">Không cần tài khoản</span>
                </h2>
                <p className="c-guide-step-desc">
                  Không cần đăng nhập, bạn có thể dán trực tiếp đoạn văn bản tiếng Trung vào ô nhập liệu và kiểm tra tính nguyên bản miễn phí với giới hạn tối đa <strong>300 ký tự</strong>.
                </p>
                <ul className="c-guide-list">
                  <li>Dán văn bản tiếng Trung vào ô nhập liệu ở trang chủ.</li>
                  <li>Bấm nút <strong>"Phân tích đạo văn"</strong>.</li>
                  <li>Hệ thống sẽ xử lý và trả kết quả trong vài giây đến vài phút.</li>
                </ul>
              </div>
            </section>

            <section className="c-guide-step">
              <div className="c-guide-step-badge">
                <span className="c-guide-step-num">02</span>
              </div>
              <div className="c-guide-step-body">
                <h2 className="c-guide-step-title">
                  Chế độ đầy đủ
                  <span className="c-guide-step-tag">Đăng nhập bằng Google</span>
                </h2>
                <p className="c-guide-step-desc">
                  Sau khi đăng nhập bằng tài khoản Google, bạn mở khóa toàn bộ tính năng nâng cao của C-checker.
                </p>
                <ul className="c-guide-list">
                  <li>Nhấp nút <strong>"Đăng nhập Google"</strong> ở góc trên bên phải.</li>
                  <li>Tải lên tệp tài liệu: <code>.docx</code>, <code>.pdf</code>, <code>.txt</code> không giới hạn dung lượng.</li>
                  <li>Kiểm tra văn bản không giới hạn số lượng ký tự.</li>
                  <li>Toàn bộ kết quả được lưu tự động vào <strong>Bảng Lịch sử kiểm tra</strong> cá nhân.</li>
                </ul>
              </div>
            </section>

            <section className="c-guide-step">
              <div className="c-guide-step-badge">
                <span className="c-guide-step-num">03</span>
              </div>
              <div className="c-guide-step-body">
                <h2 className="c-guide-step-title">
                  Theo dõi tiến trình kiểm tra
                  <span className="c-guide-step-tag">Theo thời gian thực</span>
                </h2>
                <p className="c-guide-step-desc">
                  Hệ thống C-checker phân tích từng câu theo thời gian thực. Bạn không cần ngồi chờ — có thể quay lại trang chủ và theo dõi thanh tiến trình thu gọn trong khi làm việc khác.
                </p>
                <ul className="c-guide-list">
                  <li>Bấm <strong>"Quay lại trang chủ & xem Lịch sử"</strong> để trở về trang chủ.</li>
                  <li>Thanh tiến trình thu gọn sẽ hiển thị % và câu đang quét theo thời gian thực.</li>
                  <li>Bấm <strong>"Xem chi tiết"</strong> bất kỳ lúc nào để mở lại màn hình tiến trình.</li>
                </ul>
              </div>
            </section>

            <section className="c-guide-step">
              <div className="c-guide-step-badge">
                <span className="c-guide-step-num">04</span>
              </div>
              <div className="c-guide-step-body">
                <h2 className="c-guide-step-title">
                  Đọc và hiểu báo cáo kết quả
                  <span className="c-guide-step-tag">Báo cáo chi tiết</span>
                </h2>
                <p className="c-guide-step-desc">
                  Sau khi quét xong, hệ thống xuất báo cáo chi tiết cho từng câu. Dưới đây là giải thích từng chỉ số:
                </p>
                <div className="c-guide-table">
                  <div className="c-guide-table-row c-guide-table-header">
                    <span>Chỉ số</span>
                    <span>Ý nghĩa</span>
                  </div>
                  <div className="c-guide-table-row">
                    <span><strong>Mức độ trùng lặp (%)</strong></span>
                    <span>Tỷ lệ phần trăm các câu có nguy cơ sao chép cao trong toàn văn bản.</span>
                  </div>
                  <div className="c-guide-table-row">
                    <span><strong>MiniLM Semantic</strong></span>
                    <span>Điểm tương đồng ngữ nghĩa do AI phân tích. Phát hiện viết lại (paraphrase) và thay từ đồng nghĩa.</span>
                  </div>
                  <div className="c-guide-table-row">
                    <span><strong>LCS & N-gram</strong></span>
                    <span>Phát hiện các chuỗi từ trùng lặp nguyên bản liên tiếp trong văn bản.</span>
                  </div>
                  <div className="c-guide-table-row">
                    <span><strong>Nguồn so khớp</strong></span>
                    <span>Đường dẫn (URL) và trích đoạn văn bản nguồn đối chiếu tìm được trên Internet.</span>
                  </div>
                </div>
              </div>
            </section>

          </div>

          <div className="c-guide-faq">
            <h2 className="c-page-section-title">Câu hỏi thường gặp (FAQ)</h2>
            <div className="c-faq-list">
              <div className="c-faq-item">
                <h4 className="c-faq-q">Q: Tôi có cần trả phí để sử dụng C-checker không?</h4>
                <p className="c-faq-a">A: Không. C-checker hoàn toàn miễn phí. Dùng thử không cần tài khoản (tối đa 300 ký tự), đăng nhập Google để dùng đầy đủ không giới hạn.</p>
              </div>
              <div className="c-faq-item">
                <h4 className="c-faq-q">Q: Kết quả kiểm tra có chính xác 100% không?</h4>
                <p className="c-faq-a">A: Kết quả được đưa ra bởi AI và các thuật toán đối chiếu tự động nên mang tính tham khảo cao. Quyết định cuối cùng về tính nguyên bản thuộc về người dùng và cơ sở giáo dục.</p>
              </div>
              <div className="c-faq-item">
                <h4 className="c-faq-q">Q: Văn bản của tôi có bị lưu lại không?</h4>
                <p className="c-faq-a">A: Đối với khách (không đăng nhập), văn bản không được lưu vào cơ sở dữ liệu. Đối với tài khoản đã đăng nhập, lịch sử kiểm tra được lưu riêng tư và chỉ bạn mới xem được.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

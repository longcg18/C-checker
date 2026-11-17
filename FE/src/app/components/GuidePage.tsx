import { useNavigate } from 'react-router';

interface GuidePageProps {
  onBack?: () => void;
}

export function GuidePage({ onBack }: GuidePageProps) {
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
            <span className="c-seal-sub">QUY TRÌNH THỰC HIỆN</span>
          </div>
          <h1 className="c-page-title">Cẩm nang hướng dẫn sử dụng C-checker</h1>
          <p className="c-page-subtitle">
            Quy trình 4 giai đoạn từ thao tác nhập liệu, theo dõi phân tích ngữ nghĩa đến cách giải mã và xử lý từng chỉ số trong báo cáo đối soát.
          </p>

          <div style={{ marginTop: 18 }}>
            <a
              href="/kien-thuc/huong-dan-su-dung-c-checker-co-hinh-anh"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 16px',
                background: 'rgba(139, 29, 29, 0.08)',
                border: '1px solid rgba(139, 29, 29, 0.3)',
                borderRadius: 20,
                color: 'var(--c-accent, #8b1d1d)',
                fontSize: 13,
                fontWeight: 600,
                textDecoration: 'none'
              }}
            >
              <span>🎬 Xem bài hướng dẫn trực quan (Kèm hình ảnh UI &amp; Video mô phỏng) →</span>
            </a>
          </div>
        </header>

        <div className="c-page-content">
          <div className="c-guide-steps">

            {/* Step 1 */}
            <section className="c-guide-step">
              <div className="c-guide-step-body">
                <div className="c-guide-meta">
                  <span className="c-guide-index">GIAI ĐOẠN I</span>
                  <span className="c-guide-step-tag">DÙNG THỬ KHÁCH</span>
                </div>
                <h2 className="c-guide-step-title">Khảo nghiệm nhanh đoạn văn ngắn</h2>
                <p className="c-guide-step-desc">
                  Phù hợp khi bạn cần kiểm tra nhanh một đoạn văn trích dẫn, một định nghĩa hoặc một đoạn diễn giải ngắn gọn trước khi đưa vào bản thảo chính thức.
                </p>
                <ul className="c-guide-list">
                  <li>Truy cập trực tiếp trang chủ C-checker mà không cần đăng ký tài khoản.</li>
                  <li>Dán hoặc nhập đoạn văn bản tiếng Trung (tối đa <strong>300 ký tự</strong>) vào ô Bàn Khảo Duyệt. Hoặc bấm vào các nút <em>"Thử nhanh đoạn mẫu"</em> để nạp văn bản đối chứng.</li>
                  <li>Nhấn nút <strong>"Tiến hành đối soát văn bản"</strong> để hệ thống tiến hành bóc tách câu và tính toán ngữ nghĩa.</li>
                </ul>
              </div>
            </section>

            {/* Step 2 */}
            <section className="c-guide-step">
              <div className="c-guide-step-body">
                <div className="c-guide-meta">
                  <span className="c-guide-index">GIAI ĐOẠN II</span>
                  <span className="c-guide-step-tag">TÀI KHOẢN GOOGLE</span>
                </div>
                <h2 className="c-guide-step-title">Khai phóng tính năng tải tệp toàn diện</h2>
                <p className="c-guide-step-desc">
                  Áp dụng cho các công trình nghiên cứu quy mô lớn như khóa luận tốt nghiệp cử nhân, luận văn thạc sĩ hoặc bản thảo bài báo khoa học dài kỳ.
                </p>
                <ul className="c-guide-list">
                  <li>Nhấn nút <strong>"Đăng nhập"</strong> ở góc trên bên phải màn hình để liên kết nhanh qua tài khoản Google.</li>
                  <li>Chuyển sang tab <strong>"Tải tệp văn bản"</strong> để nạp các tệp định dạng <code>.docx</code>, <code>.pdf</code> hoặc <code>.txt</code>.</li>
                  <li>Hệ thống tự động trích xuất toàn bộ văn bản chữ Hán từ tài liệu, loại bỏ các ký tự rác và định dạng thừa.</li>
                  <li>Toàn bộ kết quả phân tích sẽ được lưu trữ an toàn trong <strong>Bảng Lịch sử Khảo duyệt</strong> cá nhân của bạn.</li>
                </ul>
              </div>
            </section>

            {/* Step 3 */}
            <section className="c-guide-step">
              <div className="c-guide-step-body">
                <div className="c-guide-meta">
                  <span className="c-guide-index">GIAI ĐOẠN III</span>
                  <span className="c-guide-step-tag">GIÁM SÁT THỜI GIAN THỰC</span>
                </div>
                <h2 className="c-guide-step-title">Theo dõi tiến trình phân tích ngầm</h2>
                <p className="c-guide-step-desc">
                  Mô hình MiniLM xử lý sâu từng câu học thuật. Bạn không cần giữ màn hình chờ đợi mà có thể tiếp tục thực hiện các công việc khác.
                </p>
                <ul className="c-guide-list">
                  <li>Có thể thu nhỏ màn hình tiến trình bằng nút <strong>"Thu nhỏ"</strong> để trở về trang chủ soạn thảo tiếp các văn bản khác.</li>
                  <li>Thanh trạng thái thu gọn nổi trên đầu trang sẽ cập nhật liên tục tỷ lệ hoàn thành (%) và câu Hán tự đang được máy quét.</li>
                  <li>Khi hoàn tất, hệ thống sẽ phát thông báo nổi để bạn nhấp vào xem ngay báo cáo kết quả chi tiết.</li>
                </ul>
              </div>
            </section>

            {/* Step 4 */}
            <section className="c-guide-step">
              <div className="c-guide-step-body">
                <div className="c-guide-meta">
                  <span className="c-guide-index">GIAI ĐOẠN IV</span>
                  <span className="c-guide-step-tag">ĐỐI SOÁT &amp; HIỆU ĐÍNH</span>
                </div>
                <h2 className="c-guide-step-title">Giải mã báo cáo &amp; Phương pháp hiệu đính</h2>
                <p className="c-guide-step-desc">
                  Báo cáo của C-checker phân loại văn bản theo 3 cấp độ màu sắc trực quan:
                </p>
                <ul className="c-guide-list">
                  <li><strong>Màu đỏ (Trùng lặp cao &gt; 70%):</strong> Khả năng cao là câu sao chép nguyên văn hoặc trùng khớp cấu trúc lớn. Cần bổ sung ngoặc kép trích dẫn hoặc viết lại.</li>
                  <li><strong>Màu vàng (Tương đồng ngữ nghĩa 40% – 70%):</strong> Câu diễn giải lại nhưng ý tưởng hoặc từ ngữ còn bám sát văn bản gốc. Cần kiểm tra lại nguồn tham khảo.</li>
                  <li><strong>Màu xanh lá / Không màu (&lt; 40%):</strong> Đoạn văn mang tính độc lập và nguyên bản cao.</li>
                  <li>Nhấp chuột trực tiếp vào từng câu có màu để đối chiếu song song câu của bạn với văn bản nguồn được tìm thấy trên không gian mạng.</li>
                </ul>
              </div>
            </section>

          </div>

          {/* Quick Checklist Notice */}
          <section className="c-about-section">
            <div className="c-article-note" style={{ borderLeftColor: 'var(--c-accent)' }}>
              <strong>Lời khuyên học thuật:</strong> Sau khi kiểm tra bằng C-checker, bạn nên đối chiếu lại với 
              <a href="/kien-thuc/checklist-kiem-tra-luan-van-tieng-trung-truoc-khi-nop" style={{ color: 'var(--c-accent)', fontWeight: 600, marginLeft: 6 }}>
                Checklist kiểm tra luận văn tiếng Trung trước khi nộp
              </a> để đảm bảo thống nhất hệ chữ Giản/Phồn và hoàn thiện danh mục tài liệu tham khảo theo chuẩn APA 7.
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

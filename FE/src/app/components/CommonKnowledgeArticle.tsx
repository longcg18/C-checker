import { Link, useNavigate } from 'react-router';

export function CommonKnowledgeArticle() {
  const navigate = useNavigate();
  return (
    <article className="c-page-layout c-article-layout">
      <div className="c-page-container">
        <button className="c-page-back-btn" onClick={() => navigate('/kien-thuc')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16" aria-hidden="true">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Quay lại mục Kiến thức
        </button>
        <header className="c-page-hero">
          <div className="c-page-hero-badge">Liêm chính học thuật</div>
          <h1 className="c-page-title">Kiến thức phổ thông có cần trích dẫn không?</h1>
          <p className="c-page-subtitle">
            Tiêu chí xác định kiến thức phổ thông (common knowledge), phân biệt giữa sự thật hiển nhiên và dữ liệu nghiên cứu cần trích dẫn trong văn bản tiếng Trung.
          </p>
          <div className="c-article-byline">Ban biên tập C-checker · Cập nhật 03/09/2026 · 7 phút đọc</div>
        </header>

        <div className="c-page-content c-article-content">
          <section>
            <p>
              &ldquo;Đây có phải kiến thức ai cũng biết không, hay mình cần trích dẫn nguồn?&rdquo; — là câu hỏi mà hầu như người viết luận văn nào cũng từng băn khoăn ít nhất một lần. Thay vì đưa ra định nghĩa chung chung, bài viết này liệt kê các tình huống cụ thể để bạn tự đối chiếu.
            </p>
          </section>

          <section>
            <h2>Kiến thức phổ thông (common knowledge) là gì?</h2>
            <p>
              Kiến thức phổ thông là những thông tin <strong>được biết đến rộng rãi, không gây tranh cãi, và xuất hiện độc lập trong nhiều nguồn khác nhau mà không nguồn nào &ldquo;sở hữu&rdquo; thông tin đó</strong>. Ba tiêu chí thường dùng để xác định:
            </p>
            <ol className="c-article-steps">
              <li>Người đọc thuộc lĩnh vực của bạn (giảng viên, sinh viên cùng ngành) đều biết mà không cần tra cứu.</li>
              <li>Thông tin xuất hiện trong nhiều sách giáo khoa, từ điển, tài liệu phổ thông mà không gắn với một tác giả hay nghiên cứu cụ thể nào.</li>
              <li>Không có tranh cãi học thuật xung quanh thông tin đó — nó được công nhận rộng rãi là đúng.</li>
            </ol>
            <p>Nếu một thông tin không thỏa cả ba tiêu chí trên, cách an toàn nhất là <strong>trích dẫn nguồn</strong>.</p>
          </section>

          <section>
            <h2>Các tình huống cụ thể</h2>

            <h3>Không cần trích dẫn</h3>
            <ul className="c-check-list">
              <li><strong>Sự kiện lịch sử được biết đến rộng rãi:</strong> &ldquo;Trung Quốc có hệ thống chữ viết tượng hình lâu đời nhất còn được sử dụng đến ngày nay.&rdquo; — Đây là kiến thức phổ thông trong ngành Trung Quốc học, không cần gắn với một nguồn cụ thể.</li>
              <li><strong>Định nghĩa từ điển cơ bản của thuật ngữ phổ biến:</strong> &ldquo;Pinyin là hệ thống phiên âm La-tinh hóa tiếng Hán hiện đại.&rdquo; — Có thể viết trực tiếp mà không cần trích dẫn.</li>
              <li><strong>Số liệu địa lý, dân số mang tính tổng quát, ổn định:</strong> &ldquo;Tiếng Hán là ngôn ngữ có số người bản ngữ đông nhất thế giới.&rdquo; — Là kiến thức phổ thông (nhưng nếu trích con số thống kê chính xác tuyệt đối thì nên kèm nguồn).</li>
            </ul>

            <h3>Cần trích dẫn</h3>
            <ul className="c-check-list">
              <li><strong>Số liệu thống kê cụ thể, có thể biến động:</strong> &ldquo;Theo Bộ Giáo dục Trung Quốc (2022), số lượng Học viện Khổng Tử trên toàn cầu là...&rdquo; — Con số cụ thể luôn cần gắn với nguồn công bố.</li>
              <li><strong>Nhận định, đánh giá, phân loại học thuật của riêng tác giả:</strong> &ldquo;Vương Phương (2018) phân loại các lỗi phát âm của người học tiếng Hán thành bốn nhóm chính.&rdquo; — Đây là công trình phân loại riêng, không phải kiến thức mặc nhiên.</li>
              <li><strong>Kết quả nghiên cứu, khảo sát thực nghiệm:</strong> Bất kỳ số liệu nào từ khảo sát đều cần trích dẫn.</li>
              <li><strong>Thông tin bạn phải tra cứu mới biết:</strong> Nếu bản thân bạn phải tra cứu để tìm ra thông tin đó, rất có thể người đọc cũng cần nguồn kiểm chứng.</li>
            </ul>
          </section>

          <section>
            <h2>Trường hợp mơ hồ: Kiến thức phổ thông trong ngành hẹp</h2>
            <p>
              Một số thông tin là &ldquo;phổ thông&rdquo; đối với người trong ngành nhưng xa lạ với người ngoài ngành. Ví dụ, việc bộ thủ trong chữ Hán mang cả yếu tố biểu âm và biểu ý là kiến thức phổ thông với sinh viên ngành Hán ngữ, nhưng lại là thông tin chuyên sâu với người đọc ngoài ngành.
            </p>
            <p>
              Trong trường hợp này, nên căn cứ vào <strong>đối tượng đọc chính của luận văn</strong> (thường là hội đồng chấm cùng chuyên ngành) để quyết định — nếu hội đồng đều là giảng viên chuyên ngành Hán ngữ, thông tin này không cần trích dẫn.
            </p>
          </section>

          <section>
            <h2>Nguyên tắc an toàn khi còn phân vân</h2>
            <div className="c-article-note">
              <strong>Nguyên tắc vàng:</strong> Khi phân vân, hãy chọn <strong>trích dẫn nguồn</strong>. Việc trích dẫn thừa một thông tin đã phổ biến không bị coi là lỗi nghiêm trọng, nhưng bỏ sót trích dẫn cho một thông tin không thực sự phổ thông có thể bị tính là đạo văn vô ý.
            </div>
            <p>
              Khi kiểm tra lại luận văn bằng C-checker, nếu một câu không có trích dẫn bị đánh dấu tương đồng cao với một nguồn cụ thể, đó là dấu hiệu để bạn xem lại: có thể thông tin đó không phổ thông như bạn nghĩ, và cần bổ sung nguồn.
            </p>
          </section>
        </div>
      </div>
    </article>
  );
}

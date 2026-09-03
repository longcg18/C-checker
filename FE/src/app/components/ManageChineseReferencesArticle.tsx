import { Link, useNavigate } from 'react-router';

export function ManageChineseReferencesArticle() {
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
          <div className="c-page-hero-badge">Quản lý trích dẫn</div>
          <h1 className="c-page-title">Cách quản lý tài liệu tham khảo khi viết luận văn tiếng Trung</h1>
          <p className="c-page-subtitle">
            Quy trình 5 bước quản lý nguồn tài liệu, phân biệt ba loại nội dung khi ghi chú và ứng dụng phần mềm quản lý trích dẫn để phòng ngừa đạo văn từ sớm.
          </p>
          <div className="c-article-byline">Ban biên tập C-checker · Cập nhật 03/09/2026 · 8 phút đọc</div>
        </header>

        <div className="c-page-content c-article-content">
          <section>
            <p>
              Rất nhiều trường hợp đạo văn vô ý không đến từ việc cố tình sao chép, mà từ việc <strong>quản lý tài liệu lộn xộn</strong> — đọc nhiều nguồn cùng lúc, ghi chú không rõ ràng, rồi khi viết bài không còn phân biệt được đâu là ý của mình, đâu là câu trích nguyên văn của tác giả gốc. Bài viết này trình bày một quy trình quản lý tài liệu tham khảo cụ thể, phù hợp với đặc thù luận văn có nguồn tiếng Trung.
            </p>
          </section>

          <section>
            <h2>Bước 1: Lưu nguồn ngay khi tìm thấy</h2>
            <p>
              Ngay khi tìm được một tài liệu tiềm năng, hãy lưu lại đầy đủ thông tin trích dẫn ngay lập tức, thay vì để đến lúc viết bài mới quay lại tìm:
            </p>
            <ul className="c-check-list">
              <li>Tên tác giả (chữ Hán + phiên âm), năm xuất bản, tên tài liệu, nơi xuất bản/nguồn.</li>
              <li>Đường link hoặc mã DOI nếu là tài liệu điện tử.</li>
              <li>Với tài liệu lấy từ CNKI hoặc thư viện số, chụp lại hoặc lưu trang thông tin trích dẫn được hệ thống tự sinh ra (nút &ldquo;引用&rdquo; – trích dẫn).</li>
            </ul>
            <div className="c-article-note">
              <strong>Mẹo đặt tên tệp:</strong> Đặt tên file tài liệu theo cấu trúc <code>TácGiả_Năm_TừKhóa</code> (ví dụ: <code>Wang_2018_yufa.pdf</code>) giúp bạn tra cứu nhanh mà không cần mở từng file.
            </div>
          </section>

          <section>
            <h2>Bước 2: Dùng công cụ quản lý trích dẫn</h2>
            <p>
              Các phần mềm như <strong>Zotero, Mendeley, EndNote</strong> đều hỗ trợ lưu trữ tài liệu tiếng Trung:
            </p>
            <ul>
              <li>Zotero hỗ trợ tốt việc nhập chữ Hán trực tiếp vào trường tác giả/tiêu đề, và có thể thêm trường &ldquo;phiên âm&rdquo; thủ công nếu style trích dẫn yêu cầu.</li>
              <li>Khi xuất danh mục tài liệu tham khảo tự động, nên <strong>kiểm tra lại thủ công</strong> phần phiên âm và dịch nghĩa tiêu đề, vì hầu hết các công cụ này không tự động phiên âm Pinyin hay dịch nghĩa.</li>
              <li>Tạo một thư mục (collection) riêng cho tài liệu tiếng Trung để dễ áp dụng quy tắc trình bày riêng khi xuất danh mục.</li>
            </ul>
          </section>

          <section>
            <h2>Bước 3: Ghi chú khi đọc — nguyên tắc quan trọng nhất</h2>
            <p>
              Đây là bước quyết định việc bạn có vô tình đạo văn hay không. Khi đọc tài liệu và ghi chú lại, cần <strong>phân biệt rõ ràng ba loại nội dung</strong> trong ghi chú:
            </p>
            <ol className="c-article-steps">
              <li>
                <strong>Trích nguyên văn:</strong> sao chép y nguyên câu chữ của tác giả — bắt buộc đặt trong ngoặc kép <strong>ngay tại thời điểm ghi chú</strong>, kèm số trang. Đừng đợi đến lúc viết bài mới nhớ lại đâu là câu trích nguyên văn.
              </li>
              <li>
                <strong>Diễn giải theo cách hiểu của bạn:</strong> tóm tắt hoặc diễn giải ý của tác giả bằng lời văn của chính mình — vẫn cần ghi kèm nguồn, nhưng không cần ngoặc kép.
              </li>
              <li>
                <strong>Ghi chú cá nhân:</strong> suy nghĩ, đánh giá, liên hệ của riêng bạn khi đọc tài liệu — không phải nội dung của tác giả, nên tách biệt rõ, ví dụ: <code>[Nhận xét cá nhân: điểm này có thể liên hệ với...]</code>.
              </li>
            </ol>
          </section>

          <section>
            <h2>Bước 4: Ghi trang cụ thể, không chỉ ghi tên tài liệu</h2>
            <p>
              Với tài liệu tiếng Trung, việc lật lại tìm đúng trang khi cần trích dẫn mất nhiều thời gian hơn tài liệu tiếng Việt. Ghi số trang ngay khi đọc giúp bạn:
            </p>
            <ul className="c-check-list">
              <li>Bổ sung số trang khi cần trích dẫn trực tiếp mà không phải đọc lại toàn bộ tài liệu.</li>
              <li>Kiểm tra lại nhanh khi giảng viên hoặc hội đồng yêu cầu đối chiếu nguồn.</li>
            </ul>
          </section>

          <section>
            <h2>Bước 5: Kiểm tra lại toàn bộ trước khi nộp</h2>
            <p>Sau khi hoàn thiện bản thảo, nên rà soát lại theo hai lớp:</p>
            <ol className="c-article-steps">
              <li>
                <strong>Đối chiếu chéo danh mục:</strong> Mọi nguồn được trích dẫn trong bài phải có mặt trong danh mục tham khảo, và ngược lại.
              </li>
              <li>
                <strong>Kiểm tra bằng C-checker:</strong> Chạy toàn văn bản qua C-checker để phát hiện những đoạn có thể đã bị nhầm lẫn giữa ghi chú cá nhân, diễn giải và trích nguyên văn trong quá trình viết.
              </li>
            </ol>
            <p>
              Xem thêm <Link to="/kien-thuc/checklist-kiem-tra-luan-van-tieng-trung-truoc-khi-nop">Checklist kiểm tra luận văn tiếng Trung trước khi nộp</Link> để rà soát toàn diện.
            </p>
          </section>
        </div>
      </div>
    </article>
  );
}

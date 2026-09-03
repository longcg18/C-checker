import { Link, useNavigate } from 'react-router';

export function SecondarySourceCitationArticle() {
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
          <div className="c-page-hero-badge">Phương pháp nghiên cứu</div>
          <h1 className="c-page-title">Cách trích dẫn nguồn thứ cấp đúng cách</h1>
          <p className="c-page-subtitle">
            Khái niệm nguồn sơ cấp và thứ cấp, cách dùng &ldquo;dẫn theo&rdquo; (as cited in / 转引自) trong tài liệu tiếng Trung và các nguyên tắc trích dẫn gián tiếp chuẩn mực.
          </p>
          <div className="c-article-byline">Ban biên tập C-checker · Cập nhật 03/09/2026 · 8 phút đọc</div>
        </header>

        <div className="c-page-content c-article-content">
          <section>
            <p>
              Trong quá trình nghiên cứu, có những lúc bạn đọc được ý tưởng của tác giả A không phải từ chính công trình gốc, mà thông qua bài viết, sách hoặc luận văn của tác giả B trích dẫn lại. Đây gọi là <strong>nguồn thứ cấp</strong> (secondary source), và cách trích dẫn loại nguồn này có quy tắc riêng, khác với trích dẫn trực tiếp.
            </p>
          </section>

          <section>
            <h2>Nguồn thứ cấp là gì?</h2>
            <ul>
              <li><strong>Nguồn sơ cấp (primary source):</strong> công trình gốc, do chính tác giả đưa ra ý tưởng, kết quả nghiên cứu viết ra.</li>
              <li><strong>Nguồn thứ cấp (secondary source):</strong> một tài liệu khác trích dẫn, bàn luận, hoặc diễn giải lại nội dung của nguồn sơ cấp.</li>
            </ul>
            <p>
              Ví dụ: bạn đọc luận văn của tác giả B, trong đó B trích dẫn một nhận định của tác giả A từ một công trình xuất bản năm 1995 mà bạn không tìm được bản gốc. Nếu bạn viết lại nhận định đó dựa trên cách B trình bày, bạn đang trích dẫn nguồn thứ cấp.
            </p>
          </section>

          <section>
            <h2>Khi nào nên dùng trích dẫn nguồn thứ cấp?</h2>
            <ul className="c-check-list">
              <li>Tài liệu gốc <strong>không còn tồn tại, đã tuyệt bản, hoặc không thể tiếp cận</strong> (sách cổ, tài liệu lưu trữ hạn chế).</li>
              <li>Tài liệu gốc <strong>viết bằng ngôn ngữ bạn không đọc được</strong> và chưa có bản dịch, trong khi tác giả B đã trích dẫn và diễn giải đáng tin cậy.</li>
              <li>Tài liệu gốc <strong>quá khó tiếp cận trong thời gian làm luận văn</strong> (chỉ có bản in tại thư viện nước ngoài).</li>
            </ul>
            <p>
              Ngoại trừ các trường hợp trên, <strong>nên ưu tiên tìm đọc nguồn gốc</strong> thay vì trích qua nguồn thứ cấp, vì cách diễn giải của tác giả B có thể đã làm lệch một phần ý nghĩa ban đầu của tác giả A.
            </p>
          </section>

          <section>
            <h2>Cách ghi trích dẫn nguồn thứ cấp</h2>

            <h3>Trích dẫn trong bài (in-text)</h3>
            <p>Theo chuẩn APA, cách ghi phổ biến là dùng cụm &ldquo;as cited in&rdquo; (tiếng Anh) hoặc &ldquo;dẫn theo&rdquo; / &ldquo;được trích dẫn trong&rdquo; (tiếng Việt):</p>
            <div className="c-article-example">
              <code>Theo A (1995, dẫn theo B, 2018), quá trình tiếp thu ngôn ngữ thứ hai chịu ảnh hưởng lớn từ môi trường giao tiếp.</code>
            </div>
            <p>hoặc:</p>
            <div className="c-article-example">
              <code>Một nghiên cứu trước đó (A, 1995, as cited in B, 2018) đã chỉ ra rằng...</code>
            </div>
            <div className="c-article-note">
              <strong>Điểm then chốt:</strong> Bạn <strong>chỉ đưa tác giả B vào danh mục tài liệu tham khảo cuối bài</strong>, vì đó là tài liệu bạn thực sự đọc. Tác giả A chỉ xuất hiện trong phần trích dẫn trong bài, không có mục riêng trong danh mục — trừ khi bạn thực sự đã đọc và kiểm chứng công trình gốc của A.
            </div>

            <h3>Với tài liệu tiếng Trung</h3>
            <p>Nguyên tắc tương tự áp dụng, chỉ khác ở việc phiên âm tên tác giả:</p>
            <div className="c-article-example">
              <code>王 (1995年, 转引自 王李, 2018) 指出... [Vương (1995), dẫn theo Vương Lý (2018), chỉ ra rằng...]</code>
            </div>
            <p>
              Từ <strong>转引自</strong> (zhuǎnyǐn zì) trong tiếng Trung tương đương với &ldquo;dẫn theo&rdquo; trong tiếng Việt hoặc &ldquo;as cited in&rdquo; trong tiếng Anh, thường dùng trong các luận văn, bài báo học thuật tiếng Trung khi trích dẫn nguồn thứ cấp.
            </p>
          </section>

          <section>
            <h2>Khi nào bắt buộc phải tìm nguồn gốc?</h2>
            <ul className="c-check-list">
              <li>Khi ý tưởng đó là <strong>luận điểm trung tâm</strong> của luận văn — không nên xây dựng lập luận chính dựa hoàn toàn trên một trích dẫn thứ cấp chưa kiểm chứng.</li>
              <li>Khi tài liệu gốc <strong>có thể tra cứu được</strong> qua thư viện số, cơ sở dữ liệu học thuật (CNKI, Google Scholar...).</li>
              <li>Khi giảng viên hướng dẫn hoặc quy định của khoa <strong>yêu cầu hạn chế tối đa</strong> việc trích dẫn thứ cấp.</li>
            </ul>
          </section>

          <section>
            <h2>Lỗi thường gặp</h2>
            <ul className="c-check-list">
              <li>Đưa cả tác giả A và B vào danh mục tài liệu tham khảo dù chưa từng đọc công trình gốc của A.</li>
              <li>Lạm dụng trích dẫn thứ cấp cho phần lớn luận văn, khiến bài viết thiếu chiều sâu nghiên cứu độc lập.</li>
              <li>Không ghi rõ &ldquo;dẫn theo&rdquo; trong trích dẫn, khiến người đọc hiểu nhầm bạn đã đọc trực tiếp công trình gốc.</li>
            </ul>
            <p>
              Sau khi hoàn thiện phần trích dẫn, hãy kiểm tra lại bằng C-checker để đảm bảo các đoạn dẫn theo nguồn thứ cấp đã được diễn đạt rõ ràng, không bị lẫn với văn bản gốc của tác giả B.
            </p>
          </section>
        </div>
      </div>
    </article>
  );
}

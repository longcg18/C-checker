import { Link, useNavigate } from 'react-router';

export function QuotesVsCitationsArticle() {
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
          <div className="c-page-hero-badge">Tránh lỗi đạo văn</div>
          <h1 className="c-page-title">Khi nào cần đặt ngoặc kép và khi nào chỉ cần dẫn nguồn?</h1>
          <p className="c-page-subtitle">
            Phân định rõ ràng giữa trích dẫn nguyên văn và diễn giải (paraphrase), các trường hợp bắt buộc đặt dấu ngoặc kép và cách khắc phục lỗi đạo văn vô ý.
          </p>
          <div className="c-article-byline">Ban biên tập C-checker · Cập nhật 03/09/2026 · 8 phút đọc</div>
        </header>

        <div className="c-page-content c-article-content">
          <section>
            <p>
              Đây là một trong những lỗi phổ biến nhất dẫn đến đạo văn vô ý: người viết đã ghi tên tác giả và năm xuất bản, nghĩ rằng như vậy là đủ, nhưng lại giữ nguyên gần như toàn bộ câu chữ gốc mà không đặt trong ngoặc kép. Về mặt học thuật, đây vẫn được xem là sao chép nguyên văn không đúng cách.
            </p>
          </section>

          <section>
            <h2>Hai hình thức sử dụng nguồn</h2>
            <p>Khi đưa ý tưởng của người khác vào bài viết, bạn có hai lựa chọn:</p>
            <ol className="c-article-steps">
              <li>
                <strong>Trích dẫn nguyên văn (quote):</strong> giữ y nguyên câu chữ của tác giả gốc, đặt trong ngoặc kép, kèm nguồn và số trang.
              </li>
              <li>
                <strong>Diễn giải (paraphrase):</strong> viết lại ý tưởng đó bằng cách hành văn, cấu trúc câu của riêng mình, chỉ cần dẫn nguồn (không cần ngoặc kép).
              </li>
            </ol>
            <p>
              Vấn đề nảy sinh khi người viết diễn giải nhưng chỉ đổi vài từ, giữ nguyên cấu trúc câu và phần lớn từ vựng gốc — đây không phải paraphrase thật sự và vẫn cần ngoặc kép nếu muốn giữ nguyên mức độ giống với bản gốc như vậy.
            </p>
          </section>

          <section>
            <h2>Khi nào bắt buộc phải đặt ngoặc kép</h2>
            <ul className="c-check-list">
              <li><strong>Giữ nguyên từ 5–7 từ liên tiếp trở lên</strong> trùng khớp với câu gốc, đặc biệt là cụm từ có tính đặc trưng, không phải cách diễn đạt thông thường.</li>
              <li><strong>Trích dẫn định nghĩa chính thức</strong> của một khái niệm, thuật ngữ chuyên ngành mà tác giả đưa ra — vì định nghĩa cần chính xác tuyệt đối, không nên tự diễn giải vì có thể làm sai lệch nghĩa.</li>
              <li><strong>Trích một câu nhận định, kết luận quan trọng</strong> mà bản thân câu chữ đó có giá trị lập luận (ví dụ một tuyên bố mang tính bước ngoặt trong nghiên cứu).</li>
              <li><strong>Trích số liệu, kết quả nghiên cứu được diễn đạt theo cách đặc trưng</strong> của tác giả gốc, nếu bạn muốn giữ nguyên cách diễn đạt đó thay vì tự tóm tắt lại.</li>
            </ul>
          </section>

          <section>
            <h2>Khi nào chỉ cần dẫn nguồn (paraphrase)</h2>
            <ul className="c-check-list">
              <li>Khi bạn đã <strong>thay đổi hoàn toàn cấu trúc câu và phần lớn từ vựng</strong>, chỉ giữ lại ý chính.</li>
              <li>Khi bạn <strong>tổng hợp thông tin từ nhiều nguồn</strong> để rút ra một luận điểm chung — lúc này không có câu chữ cụ thể nào cần trích nguyên văn.</li>
              <li>Khi bạn trình bày lại <strong>số liệu, dữ kiện khách quan</strong> bằng câu văn của chính mình.</li>
            </ul>
          </section>

          <section>
            <h2>Ví dụ minh họa cụ thể</h2>
            <div className="c-article-note">
              <strong>Câu gốc (tiếng Trung, dịch nghĩa):</strong> &ldquo;Việc học tiếng Hán của lưu học sinh nước ngoài chịu ảnh hưởng sâu sắc bởi môi trường giao tiếp thực tế, không chỉ dừng lại ở kiến thức trên lớp học.&rdquo;
            </div>

            <div className="c-article-example">
              <p><strong>Paraphrase đúng cách:</strong> Theo Vương Phương (2018), quá trình tiếp thu tiếng Hán của sinh viên nước ngoài phụ thuộc nhiều vào việc tiếp xúc thực tế với người bản xứ, chứ không chỉ giới hạn trong nội dung giảng dạy chính khóa.</p>
            </div>

            <div className="c-article-example">
              <p><strong>Diễn giải sai (đổi vài từ, giữ nguyên cấu trúc):</strong> Việc học tiếng Hán của sinh viên nước ngoài chịu tác động sâu sắc bởi bối cảnh giao tiếp thực tế, không chỉ giới hạn ở kiến thức trong lớp học (Vương Phương, 2018). — <em>Đây gần như là câu gốc, cần đặt trong ngoặc kép nếu giữ mức độ này.</em></p>
            </div>

            <div className="c-article-example">
              <p><strong>Trích dẫn nguyên văn đúng cách:</strong> Vương Phương (2018) nhận định: &ldquo;Việc học tiếng Hán của lưu học sinh nước ngoài chịu ảnh hưởng sâu sắc bởi môi trường giao tiếp thực tế, không chỉ dừng lại ở kiến thức trên lớp học&rdquo; (tr. 45).</p>
            </div>
          </section>

          <section>
            <h2>Vì sao lỗi này lại phổ biến?</h2>
            <p>
              Nhiều người viết cho rằng chỉ cần ghi tên tác giả là đủ chứng minh mình không đạo văn, nhưng hội đồng chấm và các công cụ kiểm tra trùng lặp đánh giá dựa trên <strong>mức độ trùng khớp câu chữ</strong>, không chỉ dựa vào việc có trích dẫn hay không. Một đoạn văn dù có ghi nguồn nhưng vẫn giữ nguyên phần lớn cấu trúc câu gốc mà không đặt trong ngoặc kép, khi quét qua hệ thống như C-checker, vẫn sẽ hiện tỷ lệ tương đồng cao. Đọc thêm về <Link to="/kien-thuc/dao-van-vo-y-va-co-y">Phân biệt đạo văn vô ý và cố ý</Link>.
            </p>
          </section>

          <section>
            <h2>Cách kiểm tra lại trước khi nộp</h2>
            <p>
              Sau khi viết xong, hãy đọc lại từng câu có trích dẫn và tự hỏi: nếu bỏ ngoặc kép đi, câu này có còn giống hệt bản gốc không? Nếu có, hãy chọn một trong hai: thêm ngoặc kép hoặc diễn giải sâu hơn. Chạy văn bản qua C-checker sẽ giúp bạn khoanh vùng chính xác những câu nào đang ở tình trạng &ldquo;lửng lơ&rdquo; giữa trích dẫn và diễn giải.
            </p>
          </section>
        </div>
      </div>
    </article>
  );
}

import { Link, useNavigate } from 'react-router';

export function LimitationsArticle() {
  const navigate = useNavigate();

  return (
    <article className="c-page-layout c-article-layout">
      <div className="c-page-container">
        <button className="c-page-back-btn" onClick={() => navigate('/kien-thuc')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16" aria-hidden="true"><path d="M19 12H5M12 19l-7-7 7-7" /></svg> Quay lại mục Kiến thức
        </button>

        <header className="c-page-hero">
          <div className="c-page-hero-badge">Phương pháp & minh bạch</div>
          <h1 className="c-page-title">Hạn chế và sai số của C-checker</h1>
          <p className="c-page-subtitle">
            Vì sao một công cụ tìm kiếm tương đồng có thể bỏ sót nguồn hoặc cảnh báo nhầm, và người dùng nên kiểm chứng kết quả như thế nào.
          </p>
          <div className="c-article-byline">Ban biên tập C-checker · Cập nhật 01/09/2026 · 9 phút đọc</div>
        </header>

        <div className="c-page-content c-article-content">
          <section>
            <h2>1. Phạm vi mà C-checker thực sự kiểm tra</h2>
            <p>
              C-checker chia văn bản thành các câu hoặc khối ngắn, tạo truy vấn tìm kiếm, lấy một số trang công khai làm ứng viên rồi so sánh bằng LCS, N-gram, độ tương đồng ngữ nghĩa và chuỗi liên tiếp. Do đó, hệ thống chỉ có thể phát hiện nội dung trong phạm vi nguồn mà công cụ tìm kiếm tìm thấy và máy chủ có thể truy cập tại thời điểm kiểm tra. Đây không phải cơ sở dữ liệu toàn bộ sách, luận văn hay bài báo trên thế giới.
            </p>
            <div className="c-article-note">
              <strong>Điều cần nhớ:</strong> “Không tìm thấy nguồn tương đồng” chỉ có nghĩa là quy trình hiện tại chưa tìm được ứng viên đạt ngưỡng; không chứng minh văn bản chắc chắn nguyên bản.
            </div>
          </section>

          <section>
            <h2>2. Âm tính giả: có trùng lặp nhưng hệ thống không cảnh báo</h2>
            <p>Âm tính giả có thể xuất hiện trong các trường hợp sau:</p>
            <ul className="c-guide-list">
              <li>Nguồn nằm sau đăng nhập, paywall, CAPTCHA, trong mạng nội bộ hoặc chặn bot truy cập.</li>
              <li>Tài liệu chưa được công cụ tìm kiếm lập chỉ mục, mới xuất bản hoặc đã bị xóa.</li>
              <li>Nguồn chỉ tồn tại trong sách in, cơ sở dữ liệu học thuật đóng, tệp scan hoặc ảnh không có văn bản máy đọc được.</li>
              <li>Người viết diễn đạt lại quá sâu, thay đổi cấu trúc, rút gọn hoặc ghép ý từ nhiều nguồn.</li>
              <li>Văn bản được dịch qua một hoặc nhiều ngôn ngữ, làm giảm cả khớp từ và độ gần ngữ nghĩa.</li>
              <li>Câu quá ngắn hoặc bị tách khỏi ngữ cảnh khiến truy vấn tìm kiếm không đủ đặc trưng.</li>
              <li>Lỗi mạng, giới hạn truy vấn hoặc trang nguồn phản hồi chậm khiến một số ứng viên không được tải.</li>
            </ul>
          </section>

          <section>
            <h2>3. Dương tính giả: hệ thống cảnh báo dù không có hành vi đạo văn</h2>
            <p>Điểm tương đồng có thể cao một cách hợp lý khi hai văn bản cùng sử dụng:</p>
            <ul className="c-guide-list">
              <li>Thành ngữ, tục ngữ, khẩu hiệu, tên luật, tên tổ chức hoặc thuật ngữ chuyên ngành cố định.</li>
              <li>Định nghĩa chuẩn, công thức, mô tả phương pháp nghiên cứu hoặc câu hỏi khảo sát phổ biến.</li>
              <li>Trích dẫn trực tiếp đã có ngoặc kép và dẫn nguồn đầy đủ.</li>
              <li>Danh mục tài liệu tham khảo, tiêu đề tác phẩm hoặc thông tin thư mục.</li>
              <li>Cấu trúc câu thông dụng trong văn phong học thuật tiếng Trung.</li>
            </ul>
            <p>
              Mô hình ngữ nghĩa còn có thể gán điểm cao cho hai câu nói về cùng một sự kiện hoặc khái niệm dù chúng được viết độc lập. Ngược lại, LCS và N-gram có thể tăng vì nhiều từ phổ biến xuất hiện cùng thứ tự. Vì thế, cần đọc cụm từ được đánh dấu thay vì chỉ nhìn màu cảnh báo.
            </p>
          </section>

          <section>
            <h2>4. Sai số đến từ cách xử lý tiếng Trung</h2>
            <p>
              Tiếng Trung không dùng khoảng trắng để phân tách từ một cách ổn định. Kết quả token hóa có thể thay đổi tùy tên riêng, từ mới, thuật ngữ kỹ thuật hoặc cách viết tắt. Nếu một cụm bị tách khác với nguồn, điểm LCS và N-gram có thể giảm; nếu các ký tự phổ biến bị coi là những token giống nhau, điểm có thể tăng không cần thiết.
            </p>
            <p>
              Chuyển đổi giữa giản thể và phồn thể, khác biệt vùng miền, lỗi nhận dạng OCR và dấu câu cũng ảnh hưởng kết quả. Văn bản cổ, thơ, khẩu ngữ hoặc câu pha nhiều ngôn ngữ thường khó đánh giá hơn văn xuôi hiện đại có cấu trúc rõ ràng.
            </p>
          </section>

          <section>
            <h2>5. Giới hạn của điểm số và ngưỡng cảnh báo</h2>
            <p>
              Điểm Final là tổng có trọng số gồm LCS 35%, N-gram 20%, Semantic 35% và Contiguous 10%. Ứng viên dưới 35% không được hiển thị. Kết luận toàn bài dùng các mốc 10%, 15% và 20%, kết hợp với điểm câu 50% hoặc 70%. Những con số này giúp phân loại nhất quán nhưng không phải ranh giới khoa học phổ quát giữa “đạo văn” và “không đạo văn”.
            </p>
            <p>
              Điểm trung bình cũng chịu ảnh hưởng bởi cách chia câu. Một tài liệu có nhiều câu ngắn, nguyên bản có thể làm loãng một đoạn trùng dài; trong khi tài liệu ngắn chỉ có vài câu có thể tăng mạnh vì một cụm giống nguồn. So sánh tỷ lệ giữa hai tài liệu chỉ có ý nghĩa khi xét cả độ dài, thể loại và mục đích viết.
            </p>
          </section>

          <section>
            <h2>6. Độ bao phủ nguồn thay đổi theo thời điểm</h2>
            <p>
              Kết quả hôm nay có thể khác ngày mai vì thứ hạng tìm kiếm, trạng thái lập chỉ mục và nội dung trang web thay đổi. Một URL có thể chuyển hướng, cập nhật bài viết hoặc biến mất. Hệ thống hiện giới hạn số truy vấn, số ứng viên tải về và số kết quả tốt nhất để giữ thời gian xử lý hợp lý; vì thế báo cáo không đại diện cho việc duyệt toàn bộ Internet.
            </p>
            <p>
              Khi cần lưu bằng chứng phục vụ đánh giá học thuật, nên xuất báo cáo, ghi lại ngày kiểm tra và lưu thông tin thư mục của nguồn. Không nên dựa lâu dài vào một liên kết web duy nhất.
            </p>
          </section>

          <section>
            <h2>7. Cách giảm nguy cơ diễn giải sai</h2>
            <ol className="c-article-steps">
              <li><strong>Không dùng một ngưỡng cứng làm phán quyết.</strong> Đọc từng trường hợp có điểm cao và xét quy định của cơ sở đào tạo.</li>
              <li><strong>Kiểm tra thủ công nguồn.</strong> Xác minh tác giả, ngày xuất bản, đoạn văn đầy đủ và nguồn nào có trước.</li>
              <li><strong>Loại trừ phần có tính công thức.</strong> Xem riêng tài liệu tham khảo, tên riêng, định nghĩa chuẩn và trích dẫn hợp lệ.</li>
              <li><strong>Dùng thêm nguồn kiểm chứng.</strong> Với luận văn hoặc công trình quan trọng, kết hợp cơ sở dữ liệu chuyên ngành và đánh giá của giảng viên.</li>
              <li><strong>Lưu phiên bản được kiểm tra.</strong> Một thay đổi nhỏ trong văn bản hoặc dữ liệu web có thể làm kết quả khác đi.</li>
            </ol>
          </section>

          <section>
            <h2>8. Cách diễn đạt kết quả có trách nhiệm</h2>
            <p>
              Thay vì viết “C-checker xác định tài liệu đạo văn 20%”, nên viết: “C-checker ghi nhận điểm tương đồng trung bình 20% trong lần kiểm tra ngày …; các nguồn và đoạn được đánh dấu cần được thẩm định thủ công.” Cách mô tả này phản ánh đúng giới hạn của phép đo và tránh biến kết quả hỗ trợ thành một cáo buộc.
            </p>
            <p>
              Nếu kết quả ảnh hưởng đến điểm số, kỷ luật hoặc uy tín của một cá nhân, quyết định cuối cùng phải do người có chuyên môn xem xét dựa trên văn bản gốc, quy tắc trích dẫn và cơ hội giải trình của tác giả.
            </p>
            <p>Xem thêm: <Link to="/kien-thuc/huong-dan-doc-bao-cao">Hướng dẫn đọc báo cáo C-checker</Link>.</p>
          </section>
        </div>
      </div>
    </article>
  );
}

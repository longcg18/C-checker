import { Link, useNavigate } from 'react-router';

export function ReportReadingArticle() {
  const navigate = useNavigate();

  return (
    <article className="c-page-layout c-article-layout">
      <div className="c-page-container">
        <button className="c-page-back-btn" onClick={() => navigate('/kien-thuc')}>
          <span aria-hidden="true">←</span> Quay lại mục Kiến thức
        </button>

        <header className="c-page-hero">
          <div className="c-page-hero-badge">Hướng dẫn thực hành</div>
          <h1 className="c-page-title">Hướng dẫn đọc báo cáo C-checker</h1>
          <p className="c-page-subtitle">
            Cách diễn giải từng chỉ số, đối chiếu nguồn và đưa ra nhận định thận trọng về mức độ trùng lặp của văn bản tiếng Trung.
          </p>
          <div className="c-article-byline">Ban biên tập C-checker · Cập nhật 01/09/2026 · 10 phút đọc</div>
        </header>

        <div className="c-page-content c-article-content">
          <section>
            <h2>1. Báo cáo đo sự tương đồng, không tự động kết luận đạo văn</h2>
            <p>
              C-checker tìm những nguồn công khai có đoạn chữ hoặc ý nghĩa gần với văn bản được kiểm tra. Báo cáo giúp người đọc xác định vị trí cần xem lại, nhưng không biết người viết đã trích dẫn đúng hay chưa, có được phép sử dụng tài liệu hay không, hoặc sự giống nhau có xuất phát từ một thuật ngữ bắt buộc hay không. Vì vậy, nhãn “cao”, “trung bình” hay “thấp” là mức cảnh báo kỹ thuật, không phải phán quyết học thuật hoặc pháp lý.
            </p>
            <div className="c-article-note">
              <strong>Nguyên tắc đọc:</strong> bắt đầu từ kết luận toàn bài, tìm các câu có điểm cao, mở nguồn gốc rồi đánh giá ngữ cảnh và cách trích dẫn.
            </div>
          </section>

          <section>
            <h2>2. Hiểu phần tổng quan của báo cáo</h2>
            <h3>Trùng lặp cả bài</h3>
            <p>
              Đây là điểm trung bình của các câu đã kiểm tra. Với mỗi câu, hệ thống lấy ứng viên có điểm cao nhất; sau đó tính trung bình trên toàn bộ số câu. Con số này phản ánh mức độ tương đồng phân bố trong tài liệu tốt hơn việc chỉ nhìn một câu đơn lẻ. Nó không phải tỷ lệ phần trăm số chữ đã sao chép theo nghĩa tuyệt đối.
            </p>
            <div className="c-guide-table" role="table" aria-label="Ngưỡng cảnh báo toàn bài">
              <div className="c-guide-table-row c-guide-table-header" role="row"><span>Mức cảnh báo</span><span>Điều kiện hiện tại</span></div>
              <div className="c-guide-table-row" role="row"><span>🔴 Cao</span><span>Điểm trung bình từ 20%; hoặc từ 15% và có câu đạt trên 70%.</span></div>
              <div className="c-guide-table-row" role="row"><span>🟡 Trung bình</span><span>Điểm trung bình từ 10%; hoặc có ít nhất một câu đạt từ 50%.</span></div>
              <div className="c-guide-table-row" role="row"><span>🟢 Thấp</span><span>Không rơi vào hai nhóm trên; không đồng nghĩa chắc chắn không có đạo văn.</span></div>
            </div>

            <h3>Câu đã kiểm tra</h3>
            <p>
              Cho biết số đơn vị văn bản được hệ thống tách và phân tích. Các đoạn dài có thể được chia thành khối tối đa khoảng 120 ký tự, nên “câu” trong báo cáo đôi khi là một phần câu hoặc một khối văn bản chứ không hoàn toàn trùng với dấu câu trong bản gốc.
            </p>

            <h3>Đoạn nghi ngờ và đoạn trùng lặp cao nhất</h3>
            <p>
              “Đoạn nghi ngờ” là tổng số kết quả nguồn đạt ngưỡng hiển thị, không nhất thiết bằng số câu bị nghi ngờ vì một câu có thể dẫn tới nhiều nguồn. “Đoạn trùng lặp cao nhất” là mức Final lớn nhất trong các kết quả được giữ lại. Một đoạn có mức trùng lặp cao cần được kiểm tra kỹ, nhưng không nên dùng nó thay cho đánh giá toàn văn bản.
            </p>
          </section>

          <section>
            <h2>3. Năm chỉ số trong từng thẻ nguồn</h2>
            <p>Mỗi nguồn nghi ngờ được chấm theo bốn phép đo, sau đó kết hợp thành điểm Final:</p>
            <div className="c-about-tech-grid">
              <div className="c-about-tech-card c-about-tech-card--blue"><div className="c-about-tech-icon">L</div><h3>LCS — 35%</h3><p>Đo độ dài chuỗi từ chung theo đúng thứ tự, kể cả khi giữa các từ có phần được chèn thêm. Chỉ số này nhạy với việc giữ nguyên nhiều từ nhưng chỉnh sửa rải rác.</p></div>
              <div className="c-about-tech-card c-about-tech-card--purple"><div className="c-about-tech-icon">N</div><h3>N-gram — 20%</h3><p>So sánh các cặp từ liền nhau. Điểm tăng khi hai đoạn giữ lại nhiều cụm từ ngắn giống nhau và cùng trật tự cục bộ.</p></div>
              <div className="c-about-tech-card c-about-tech-card--green"><div className="c-about-tech-icon">S</div><h3>Semantic — 35%</h3><p>Dùng mô hình MiniLM đa ngôn ngữ để đo độ gần về ý nghĩa. Chỉ số có thể phát hiện diễn đạt lại, nhưng cũng có thể cao với hai câu cùng chủ đề mà không sao chép nhau.</p></div>
              <div className="c-about-tech-card c-about-tech-card--amber"><div className="c-about-tech-icon">C</div><h3>Contiguous — 10%</h3><p>Đo chuỗi token giống nhau dài nhất và liền mạch. Nó hữu ích khi một cụm chữ được chép nguyên văn liên tục.</p></div>
            </div>
            <p>
              Điểm <strong>Final</strong> được tính theo công thức: 35% LCS + 20% N-gram + 35% Semantic + 10% Contiguous. Hiện tại, một ứng viên phải đạt Final từ 35% mới được đưa vào danh sách nguồn nghi ngờ. Các trọng số là quy tắc kỹ thuật của phiên bản hiện tại và có thể được điều chỉnh khi hệ thống được đánh giá trên thêm dữ liệu.
            </p>
          </section>

          <section>
            <h2>4. Cách kiểm tra một kết quả nghi ngờ</h2>
            <ol className="c-article-steps">
              <li><strong>Đọc “Câu gốc”.</strong> Xác định đây là lập luận riêng, kiến thức phổ thông, thuật ngữ chuyên ngành hay câu trích dẫn.</li>
              <li><strong>Xem phần highlight và token trùng.</strong> Cụm dài, đặc thù và liên tiếp đáng chú ý hơn các từ chức năng hoặc cụm phổ biến.</li>
              <li><strong>Đọc đoạn trích từ nguồn.</strong> Không kết luận chỉ từ tiêu đề hoặc tỷ lệ; hãy xem hai đoạn có thực sự cùng lập luận và cấu trúc hay không.</li>
              <li><strong>Mở URL nguồn.</strong> Kiểm tra tác giả, ngày công bố, bối cảnh đầy đủ và liệu trang đó có phải nguồn gốc hay chỉ sao chép từ nơi khác.</li>
              <li><strong>Đối chiếu trích dẫn trong bài.</strong> Một đoạn giống nguồn nhưng có ngoặc kép, chú thích và tài liệu tham khảo phù hợp có thể là sử dụng hợp lệ.</li>
              <li><strong>Sửa và kiểm tra lại.</strong> Nếu thiếu dẫn nguồn, bổ sung trích dẫn; nếu diễn đạt quá sát, viết lại từ sự hiểu biết của chính mình rồi chạy lại báo cáo.</li>
            </ol>
          </section>

          <section>
            <h2>5. Ví dụ diễn giải</h2>
            <p>
              Giả sử báo cáo có điểm toàn bài 12%, một câu cao nhất 74% và ba nguồn nghi ngờ. Hệ thống sẽ xếp mức trung bình vì điểm toàn bài đã vượt 10%. Tuy vậy, câu 74% có thể là tên đầy đủ của một chính sách hoặc định nghĩa bắt buộc. Người đọc cần mở nguồn, kiểm tra xem câu có đặt trong ngoặc kép và có dẫn tài liệu hay không. Nếu trích dẫn đầy đủ, điểm cao không tự nó chứng minh hành vi đạo văn; nếu không có dẫn nguồn và cấu trúc câu được giữ gần như nguyên vẹn, đây là vị trí nên sửa trước.
            </p>
          </section>

          <section>
            <h2>6. Checklist trước khi hoàn tất</h2>
            <ul className="c-guide-list">
              <li>Đã mở và đọc các nguồn có điểm Final cao nhất.</li>
              <li>Đã phân biệt thuật ngữ phổ biến với cách diễn đạt đặc thù của tác giả.</li>
              <li>Đã kiểm tra ngoặc kép, chú thích và danh mục tài liệu tham khảo.</li>
              <li>Đã xem cả điểm trung bình toàn bài lẫn điểm câu cao nhất.</li>
              <li>Đã sửa các đoạn cần thiết và kiểm tra lại phiên bản cuối.</li>
            </ul>
            <p>Xem thêm: <Link to="/kien-thuc/han-che-va-sai-so">Hạn chế và sai số của C-checker</Link>.</p>
          </section>
        </div>
      </div>
    </article>
  );
}

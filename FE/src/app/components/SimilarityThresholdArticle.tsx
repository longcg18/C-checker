import { Link, useNavigate } from 'react-router';

export function SimilarityThresholdArticle() {
  const navigate = useNavigate();

  return (
    <article className="c-page-layout c-article-layout">
      <div className="c-page-container">
        <button className="c-page-back-btn" onClick={() => navigate('/kien-thuc')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16" aria-hidden="true"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
          Quay lại mục Kiến thức
        </button>

        <header className="c-page-hero">
          <div className="c-page-hero-badge">Đọc tỷ lệ đúng cách</div>
          <h1 className="c-page-title">Bao nhiêu % trùng lặp thì có thể yên tâm?</h1>
          <p className="c-page-subtitle">
            Không có một con số an toàn cho mọi tài liệu. Điều quan trọng là nội dung trùng ở đâu, đến từ nguồn nào và đã được trích dẫn đúng hay chưa.
          </p>
          <div className="c-article-byline">Ban biên tập C-checker · Cập nhật 01/09/2026 · 8 phút đọc</div>
        </header>

        <div className="c-page-content c-article-content">
          <section>
            <h2>1. Vì sao không thể dùng một ngưỡng chung?</h2>
            <p>
              Một bài tiểu luận 2.000 chữ và một luận văn 20.000 chữ khác nhau về cấu trúc, lượng tài liệu tham khảo và yêu cầu học thuật. Vì vậy, cùng một tỷ lệ tương đồng có thể mang ý nghĩa rất khác nhau.
            </p>
            <ul className="c-guide-list">
              <li><strong>Loại tài liệu khác nhau:</strong> phần cơ sở lý luận của luận văn thường chứa nhiều định nghĩa và trích dẫn hơn bài blog hoặc báo cáo thực tập.</li>
              <li><strong>Quy định nơi nộp bài khác nhau:</strong> mỗi trường, khoa, giảng viên hoặc tạp chí có thể đặt ngưỡng và cách loại trừ riêng.</li>
              <li><strong>Đặc thù tiếng Trung:</strong> tên lý thuyết, thuật ngữ chuyên ngành và một số cấu trúc học thuật khó tránh khỏi việc lặp lại.</li>
              <li><strong>Cách công cụ tính điểm khác nhau:</strong> cơ sở dữ liệu, thuật toán, cách chia câu và quy tắc loại trừ đều có thể làm tỷ lệ thay đổi.</li>
            </ul>
            <div className="c-article-note">
              <strong>Nguyên tắc quan trọng:</strong> hãy ưu tiên quy định chính thức của nơi nhận bài. Không nên lấy một mốc trên Internet để thay thế yêu cầu của trường hoặc tạp chí.
            </div>
          </section>

          <section>
            <h2>2. Các khoảng tỷ lệ chỉ nên dùng để tham khảo</h2>
            <p>Có thể dùng các khoảng dưới đây như tín hiệu ban đầu để quyết định mức độ cần rà soát, không phải kết luận đạo văn:</p>
            <ul className="c-guide-list">
              <li><strong>Dưới 15%:</strong> thường là mức tương đối thấp, nhưng vẫn cần mở các vị trí được đánh dấu và kiểm tra trích dẫn.</li>
              <li><strong>Từ 15% đến 25%:</strong> nên xem kỹ nguồn và vị trí trùng; kết quả có thể đến từ trích dẫn hợp lệ hoặc nội dung cần viết lại.</li>
              <li><strong>Trên 25% đến 30%:</strong> mức cần ưu tiên rà soát, đặc biệt nếu nhiều nội dung cốt lõi trùng với một nguồn.</li>
              <li><strong>Trên 30%:</strong> rủi ro cao hơn và thường cần chỉnh sửa đáng kể, trừ khi phần tương đồng có lý do hợp lệ và được giải trình rõ.</li>
            </ul>
            <p>
              Một nơi có thể yêu cầu dưới 10%, nơi khác có thể chấp nhận tỷ lệ cao hơn sau khi loại trừ tài liệu tham khảo và trích dẫn trực tiếp. Vì thế, các khoảng trên không phải tiêu chuẩn bắt buộc hay cam kết bài sẽ được chấp nhận.
            </p>
          </section>

          <section>
            <h2>3. Hai bài cùng 20% có thể có rủi ro hoàn toàn khác nhau</h2>
            <ul className="c-guide-list">
              <li><strong>Vị trí trùng:</strong> trùng ở danh mục tài liệu tham khảo thường ít đáng lo hơn trùng trong phần phân tích, bàn luận hoặc kết luận.</li>
              <li><strong>Mức độ tập trung:</strong> 20% đến từ một nguồn duy nhất đáng chú ý hơn 20% phân tán thành các cụm nhỏ trên nhiều nguồn.</li>
              <li><strong>Tình trạng trích dẫn:</strong> đoạn có ngoặc kép và ghi nguồn đầy đủ khác về bản chất với đoạn sao chép không chú thích.</li>
              <li><strong>Loại tương đồng:</strong> khớp nguyên văn dễ nhận biết; tương đồng ngữ nghĩa cao có thể cho thấy hai đoạn truyền đạt cùng ý dù câu chữ đã thay đổi.</li>
            </ul>
            <p>
              C-checker đánh dấu vị trí và nguồn đối chiếu để hỗ trợ bước kiểm tra này. Tỷ lệ toàn bài là bản tóm tắt, còn quyết định sửa hay giữ một đoạn phải dựa trên ngữ cảnh cụ thể.
            </p>
          </section>

          <section>
            <h2>4. Quy trình đánh giá trước khi nộp bài</h2>
            <ol className="c-article-steps">
              <li><strong>Đọc yêu cầu của nơi nhận bài.</strong> Ghi lại ngưỡng, phần được loại trừ và định dạng trích dẫn bắt buộc.</li>
              <li><strong>Xem tỷ lệ toàn bài.</strong> Dùng con số này để ước lượng khối lượng cần rà soát, không dùng làm phán quyết cuối cùng.</li>
              <li><strong>Mở từng vị trí được đánh dấu.</strong> Ưu tiên đoạn dài, điểm cao, nằm trong phần phân tích hoặc cùng trùng với một nguồn.</li>
              <li><strong>Phân loại phần trùng hợp lệ.</strong> Kiểm tra ngoặc kép, chú thích, tên riêng, thuật ngữ, định nghĩa chuẩn và tài liệu tham khảo.</li>
              <li><strong>Sửa phần chưa hợp lệ.</strong> Trích dẫn nguồn, viết lại bằng lập luận thực sự của mình hoặc loại bỏ nội dung không cần thiết.</li>
              <li><strong>Kiểm tra lại bản cuối.</strong> Đảm bảo việc chỉnh sửa không làm sai ý nguồn và danh mục tài liệu tham khảo vẫn đầy đủ.</li>
            </ol>
          </section>

          <section>
            <h2>5. Khi nào có thể tương đối yên tâm?</h2>
            <p>Bạn có cơ sở để yên tâm hơn khi đồng thời đáp ứng các điều kiện sau:</p>
            <ul className="c-guide-list">
              <li>Tỷ lệ nằm trong yêu cầu chính thức của nơi nộp bài.</li>
              <li>Các cụm tương đồng đã được kiểm tra thủ công, không chỉ nhìn con số tổng.</li>
              <li>Trích dẫn trực tiếp, ý tưởng tham khảo và dữ liệu lấy từ nguồn khác đều được ghi nguồn phù hợp.</li>
              <li>Phần phân tích, bàn luận và kết luận thể hiện đóng góp riêng của người viết.</li>
              <li>Không có một nguồn duy nhất chiếm tỷ trọng lớn mà thiếu giải thích hoặc trích dẫn.</li>
            </ul>
            <p>
              Ngược lại, tỷ lệ thấp không bảo đảm an toàn nếu một đoạn quan trọng bị sao chép hoặc ý tưởng được diễn đạt lại mà không dẫn nguồn. Công cụ cũng có thể bỏ sót tài liệu nằm trong cơ sở dữ liệu đóng hoặc chưa được lập chỉ mục.
            </p>
          </section>

          <section>
            <h2>Kết luận</h2>
            <p>
              Không có một con số “thần kỳ” chứng minh bài viết hoàn toàn không có vấn đề. Tỷ lệ tương đồng là điểm bắt đầu của quá trình rà soát. Một bài viết đáng tin cậy là bài đáp ứng quy định nơi nộp, ghi nguồn rõ ràng và có phần nội dung cốt lõi do chính người viết phân tích, lập luận.
            </p>
            <p>
              Xem tiếp <Link to="/kien-thuc/huong-dan-doc-bao-cao">hướng dẫn đọc báo cáo C-checker</Link> và <Link to="/kien-thuc/han-che-va-sai-so">hạn chế, sai số của công cụ</Link> trước khi diễn giải kết quả.
            </p>
          </section>
        </div>
      </div>
    </article>
  );
}

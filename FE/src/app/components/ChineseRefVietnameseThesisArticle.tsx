import { Link, useNavigate } from 'react-router';

export function ChineseRefVietnameseThesisArticle() {
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
          <div className="c-page-hero-badge">Trình bày luận văn</div>
          <h1 className="c-page-title">Cách ghi tài liệu tham khảo tiếng Trung trong luận văn tiếng Việt</h1>
          <p className="c-page-subtitle">
            Giải quyết ba băn khoăn phổ biến: có nên giữ chữ Hán, dùng phiên âm Hán Việt hay Pinyin, và cách sắp xếp danh mục tài liệu đa ngôn ngữ chuẩn mực.
          </p>
          <div className="c-article-byline">Ban biên tập C-checker · Cập nhật 03/09/2026 · 7 phút đọc</div>
        </header>

        <div className="c-page-content c-article-content">
          <section>
            <p>
              Một luận văn viết bằng tiếng Việt nhưng sử dụng nhiều nguồn tiếng Trung — tình huống rất phổ biến với sinh viên ngành Trung Quốc học, Ngôn ngữ Trung, Đông phương học — thường gặp khó khăn ở khâu trình bày danh mục tài liệu tham khảo. Bài viết này giải quyết ba vấn đề cụ thể: có nên giữ chữ Hán không, phiên âm theo hệ nào, và sắp xếp danh mục ra sao.
            </p>
          </section>

          <section>
            <h2>Có nên giữ chữ Hán trong danh mục tài liệu tham khảo không?</h2>
            <p>
              Phần lớn các trường tại Việt Nam yêu cầu <strong>giữ nguyên chữ Hán</strong> của tài liệu gốc, kèm theo phần dịch hoặc phiên âm để người đọc không biết tiếng Trung vẫn hình dung được nội dung. Cách trình bày phổ biến:
            </p>
            <div className="c-article-example">
              <code>王芳 (2018). 汉语语法研究 [Nghiên cứu ngữ pháp tiếng Hán]. Nxb Đại học Bắc Kinh.</code>
            </div>
            <p>
              Nếu quy định của khoa/trường không yêu cầu giữ chữ Hán (ví dụ để thống nhất font chữ khi in ấn), bạn có thể thay chữ Hán bằng phiên âm Pinyin, miễn là áp dụng nhất quán cho toàn bộ danh mục — không trộn lẫn giữa các mục có chữ Hán và mục chỉ có phiên âm.
            </p>
          </section>

          <section>
            <h2>Phiên âm Hán Việt hay Pinyin?</h2>
            <p>Đây là điểm dễ gây băn khoăn nhất. Hai lựa chọn cơ bản:</p>
            <ul>
              <li><strong>Phiên âm Hán Việt</strong> (ví dụ: 王芳 → Vương Phương): quen thuộc với người đọc tiếng Việt, thường dùng khi nhắc tên tác giả trong phần nội dung chính của luận văn.</li>
              <li><strong>Pinyin</strong> (ví dụ: 王芳 → Wáng Fāng): là cách phiên âm quốc tế, giúp người đọc tra cứu lại nguồn gốc trên các cơ sở dữ liệu học thuật quốc tế (CNKI, Google Scholar...).</li>
            </ul>
            <div className="c-article-note">
              <strong>Quy ước xử lý an toàn:</strong> Dùng phiên âm Hán Việt khi trích dẫn trong bài (ví dụ: &ldquo;theo nghiên cứu của Vương Phương (2018)...&rdquo;), nhưng dùng Pinyin hoặc chữ Hán kèm Pinyin trong danh mục tài liệu tham khảo vì đây là phần phục vụ tra cứu, đối chiếu quốc tế. Hãy ghi rõ quy tắc bạn chọn ở phần &ldquo;Quy ước trình bày&rdquo; đầu luận văn để hội đồng nắm rõ.
            </div>
          </section>

          <section>
            <h2>Dịch tiêu đề tài liệu</h2>
            <p>
              Tiêu đề tài liệu tiếng Trung nên được dịch sang tiếng Việt và đặt trong ngoặc vuông ngay sau tiêu đề gốc hoặc phần phiên âm:
            </p>
            <div className="c-article-example">
              <code>李明, 陈静 (2020). 对外汉语教学中的文化因素分析 [Phân tích yếu tố văn hóa trong giảng dạy tiếng Hán cho người nước ngoài]. Tạp chí Giảng dạy và Nghiên cứu Ngôn ngữ, 45(3), 12–20.</code>
            </div>
            <p>
              Bản dịch không cần dịch từng chữ máy móc — mục tiêu là giúp người đọc hiểu tài liệu nói về gì, miễn giữ đúng nghĩa học thuật của thuật ngữ chuyên ngành.
            </p>
          </section>

          <section>
            <h2>Sắp xếp danh mục tài liệu tham khảo</h2>
            <p>Khi luận văn có cả nguồn tiếng Việt, tiếng Trung và tiếng Anh, có hai cách trình bày phổ biến:</p>
            <ol className="c-article-steps">
              <li>
                <strong>Tách riêng theo ngôn ngữ:</strong> Danh mục tài liệu tiếng Việt, tiếp theo là danh mục tài liệu tiếng Trung, cuối cùng là tài liệu tiếng Anh/ngôn ngữ khác. Cách này rõ ràng, dễ tra cứu, được nhiều khoa Trung Quốc học khuyến khích.
              </li>
              <li>
                <strong>Gộp chung một danh mục:</strong> Sắp xếp theo thứ tự chữ cái của phần phiên âm (Hán Việt hoặc Pinyin, tùy quy ước đã chọn). Cách này phù hợp khi số lượng tài liệu tiếng Trung không nhiều.
              </li>
            </ol>
            <p>Dù chọn cách nào, cần áp dụng nhất quán từ đầu đến cuối danh mục và nêu rõ nguyên tắc sắp xếp.</p>
          </section>

          <section>
            <h2>Một số lưu ý khi trình bày</h2>
            <ul className="c-check-list">
              <li>Kiểm tra font chữ hỗ trợ Hán tự khi in ấn (thường dùng SimSun hoặc font Unicode chuẩn) để tránh lỗi hiển thị thành ô vuông.</li>
              <li>Với tài liệu dịch sang tiếng Việt đã xuất bản chính thức, ghi rõ tên dịch giả và năm xuất bản bản dịch, không chỉ ghi năm xuất bản bản gốc.</li>
              <li>Đối với các bài báo lấy từ CNKI hoặc cơ sở dữ liệu học thuật Trung Quốc, nên ghi thêm đường link hoặc mã DOI nếu có, giúp giảng viên đối chiếu nhanh.</li>
            </ul>
            <p>
              Sau khi hoàn thiện phần trích dẫn và danh mục tham khảo, hãy chạy toàn bộ nội dung qua C-checker để xác nhận các đoạn đã trích dẫn không bị tính nhầm là trùng lặp chưa có nguồn.
            </p>
          </section>
        </div>
      </div>
    </article>
  );
}

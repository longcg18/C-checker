import { Link, useNavigate } from 'react-router';

export function ChineseApaCitationArticle() {
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
          <div className="c-page-hero-badge">Chuẩn trích dẫn</div>
          <h1 className="c-page-title">Cách trích dẫn tài liệu tiếng Trung theo APA</h1>
          <p className="c-page-subtitle">
            Nguyên tắc trích dẫn nguồn chữ Hán theo chuẩn APA 7, cách phiên âm Pinyin, dịch nghĩa tiêu đề và ví dụ chuẩn cho sách, bài báo khoa học, luận văn.
          </p>
          <div className="c-article-byline">Ban biên tập C-checker · Cập nhật 03/09/2026 · 8 phút đọc</div>
        </header>

        <div className="c-page-content c-article-content">
          <section>
            <p>
              Khi viết luận văn, khóa luận hay bài báo khoa học có sử dụng nguồn tiếng Trung, nhiều sinh viên lúng túng vì chuẩn APA vốn được xây dựng cho tài liệu chữ Latinh. Bài viết này trình bày nguyên tắc chung và ví dụ cụ thể cho từng loại tài liệu, giúp bạn trích dẫn nhất quán và tránh bị đánh dấu trùng lặp oan khi kiểm tra bằng C-checker.
            </p>
          </section>

          <section>
            <h2>Nguyên tắc chung khi trích dẫn nguồn chữ Hán theo APA</h2>
            <p>
              APA (phiên bản 7) không dùng chữ viết ngoài hệ Latinh trong danh mục tài liệu tham khảo. Vì vậy, với một nguồn tiếng Trung, bạn cần ba thành phần:
            </p>
            <ol className="c-article-steps">
              <li><strong>Tiêu đề gốc bằng chữ Hán</strong> (giản thể hoặc phồn thể theo bản gốc) — có thể giữ hoặc lược bỏ tùy quy định của trường.</li>
              <li><strong>Phiên âm La-tinh hóa (Pinyin)</strong> của tiêu đề — bắt buộc, vì đây là phần thay thế chữ Hán trong danh mục.</li>
              <li><strong>Bản dịch nghĩa tiêu đề sang tiếng Anh hoặc tiếng Việt</strong>, đặt trong ngoặc vuông ngay sau phần phiên âm.</li>
            </ol>
            <div className="c-article-note">
              <strong>Cấu trúc tổng quát:</strong><br />
              <code>Họ tác giả, Chữ viết tắt tên. (Năm). Tiêu đề phiên âm Pinyin [Bản dịch nghĩa tiêu đề]. Nhà xuất bản.</code>
            </div>
            <p>
              Tên tác giả người Trung Quốc thường viết Họ trước, Tên sau trong bản gốc; khi phiên âm sang APA, giữ đúng thứ tự đó nhưng viết hoa chữ cái đầu của cả họ và tên đệm.
            </p>
          </section>

          <section>
            <h2>Ví dụ theo từng loại tài liệu</h2>

            <h3>1. Sách</h3>
            <div className="c-article-example">
              <code>Wang, F. (2018). Hanyu yufa yanjiu [Nghiên cứu ngữ pháp tiếng Hán]. Beijing Daxue Chubanshe.</code>
            </div>
            <p>Nếu sách có tên tiếng Anh chính thức do nhà xuất bản cung cấp, bạn có thể dùng trực tiếp tên đó thay cho phần dịch nghĩa tự làm, miễn là ghi rõ nguồn.</p>

            <h3>2. Bài báo khoa học (journal article)</h3>
            <div className="c-article-example">
              <code>Li, M., &amp; Chen, J. (2020). Duiwai Hanyu jiaoxue zhong de wenhua yinsu fenxi [Phân tích yếu tố văn hóa trong giảng dạy tiếng Hán cho người nước ngoài]. Yuyan Jiaoxue Yu Yanjiu, 45(3), 12–20.</code>
            </div>
            <p>Với bài báo có DOI, thêm DOI vào cuối theo đúng quy tắc APA thông thường.</p>

            <h3>3. Luận văn, luận án</h3>
            <div className="c-article-example">
              <code>Zhang, Y. (2021). Hanyu liuxuesheng kouyu jiaoji nengli yanjiu [Nghiên cứu năng lực giao tiếp khẩu ngữ của lưu học sinh học tiếng Hán] [Luận văn thạc sĩ, Đại học Bắc Kinh]. Kho luận văn của trường.</code>
            </div>
            <p>Ghi rõ loại luận văn (thạc sĩ/tiến sĩ) và tên cơ sở đào tạo trong ngoặc vuông thứ hai, theo đúng cấu trúc APA dành cho luận văn chưa xuất bản hoặc đã lưu trữ.</p>

            <h3>4. Trang web</h3>
            <div className="c-article-example">
              <code>Zhongguo Jiaoyubu. (2022, March 15). Guanyu jiaqiang Hanyu guoji jiaoyu de tongzhi [Thông báo về việc tăng cường giáo dục quốc tế tiếng Hán]. http://www.moe.gov.cn/...</code>
            </div>
            <p>Với trang web, ưu tiên lấy tên tổ chức phát hành làm tác giả nếu không có tên cá nhân cụ thể.</p>

            <h3>5. Tài liệu không có tác giả</h3>
            <p>Khi không xác định được tác giả, đưa tiêu đề (đã phiên âm) lên vị trí đầu câu trích dẫn, thay cho tên tác giả:</p>
            <div className="c-article-example">
              <code>Hanyu shuiping kaoshi dagang [Đề cương kỳ thi trình độ tiếng Hán]. (2019). Beijing Yuyan Daxue Chubanshe.</code>
            </div>
            <p>Trong trích dẫn trong bài (in-text), dùng vài từ đầu của tiêu đề đặt trong ngoặc kép thay cho tên tác giả, ví dụ: (<em>&ldquo;Hanyu shuiping,&rdquo;</em> 2019).</p>
          </section>

          <section>
            <h2>Một số lỗi thường gặp</h2>
            <ul className="c-check-list">
              <li>Chỉ ghi chữ Hán mà không phiên âm, khiến danh mục không thể tra cứu hoặc đối chiếu quốc tế.</li>
              <li>Nhầm lẫn giữa dịch nghĩa và phiên âm — hai phần này bắt buộc phải tách biệt, phiên âm đứng trước, dịch nghĩa để trong ngoặc vuông theo sau.</li>
              <li>Sắp xếp danh mục tài liệu tham khảo theo thứ tự nét chữ Hán thay vì theo thứ tự chữ cái ABC của phần phiên âm.</li>
              <li>Quên ghi loại tài liệu (luận văn, báo cáo, bài trình bày) trong ngoặc vuông đối với các nguồn không phải sách hay bài báo thông thường.</li>
            </ul>
          </section>

          <section>
            <h2>Kiểm tra lại trước khi nộp</h2>
            <p>
              Trích dẫn đúng chuẩn không chỉ giúp bài viết đúng học thuật mà còn giảm nguy cơ bị hệ thống chống đạo văn đánh dấu nhầm những đoạn đã có nguồn tham khảo rõ ràng. Sau khi hoàn thiện danh mục tài liệu tham khảo, bạn có thể dùng C-checker để rà soát lại toàn bộ văn bản tiếng Trung, đối chiếu xem những đoạn trích dẫn đã được diễn đạt đúng cách hay còn trùng lặp với nguồn gốc. Đọc thêm bài viết về <Link to="/kien-thuc/checklist-kiem-tra-luan-van-tieng-trung-truoc-khi-nop">Checklist kiểm tra luận văn tiếng Trung trước khi nộp</Link>.
            </p>
          </section>
        </div>
      </div>
    </article>
  );
}

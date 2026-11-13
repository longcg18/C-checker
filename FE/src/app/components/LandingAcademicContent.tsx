import React from 'react';
import { Link } from 'react-router';

export function LandingAcademicContent() {
  return (
    <section className="c-academic-landing" aria-label="Khảo chứng học thuật và công nghệ C-checker">
      {/* ── 1. Hero Summary & Academic Principles ── */}
      <div className="c-academic-hero">
        <div className="c-seal-mark">
          <span className="c-seal-text">考证</span>
          <span className="c-seal-sub">KIỂM CHỨNG HỌC THUẬT TIẾNG TRUNG</span>
        </div>
        <h2 className="c-academic-hero-title">
          Hệ thống đối soát văn bản &amp; thẩm định tính nguyên bản chữ Hán
        </h2>
        <p className="c-academic-hero-lead">
          Được xây dựng chuyên biệt cho hệ thống chữ tượng hình, C-checker kết hợp mô hình không gian ngữ nghĩa 
          <strong> MiniLM</strong> cùng các thuật toán đối chiếu chuỗi con chung dài nhất 
          <strong> (LCS)</strong> và <strong>N-gram</strong>. Nền tảng hỗ trợ sinh viên, giảng viên và các nhà nghiên cứu 
          nhận diện chuẩn xác mức độ tương đồng, bảo vệ sự liêm chính học thuật trong các công trình Hán học.
        </p>

        {/* 4 Core Pillars - Minimalist & Scholarly */}
        <div className="c-academic-pillars">
          <div className="c-pillar-item">
            <div className="c-pillar-number">I</div>
            <div className="c-pillar-content">
              <h3 className="c-pillar-title">Ngữ nghĩa Đa tầng</h3>
              <p className="c-pillar-desc">
                Nhận dạng câu đồng nghĩa, biến đổi cấu trúc ngữ pháp và paraphrase tinh vi bằng mạng Transformer.
              </p>
            </div>
          </div>

          <div className="c-pillar-item">
            <div className="c-pillar-number">II</div>
            <div className="c-pillar-content">
              <h3 className="c-pillar-title">Giản thể &amp; Phồn thể</h3>
              <p className="c-pillar-desc">
                Xử lý đồng nhất văn bản chữ Hán giản thể (简体) và phồn thể (繁體) theo mạch ngữ cảnh học thuật.
              </p>
            </div>
          </div>

          <div className="c-pillar-item">
            <div className="c-pillar-number">III</div>
            <div className="c-pillar-content">
              <h3 className="c-pillar-title">Quy chuẩn APA 7</h3>
              <p className="c-pillar-desc">
                Phân định rành mạch giữa trích dẫn học thuật hợp quy và hiện tượng sao chép văn bản nguyên văn.
              </p>
            </div>
          </div>

          <div className="c-pillar-item">
            <div className="c-pillar-number">IV</div>
            <div className="c-pillar-content">
              <h3 className="c-pillar-title">Bảo mật Tác quyền</h3>
              <p className="c-pillar-desc">
                Không lưu trữ dữ liệu văn bản dùng thử. Tôn trọng tuyệt đối quyền bảo mật bản thảo của người viết.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. How It Works (Scholarly Pipeline) ── */}
      <div className="c-academic-section">
        <div className="c-section-header">
          <h2 className="c-section-title">Tiến trình phân tích &amp; đối soát 4 giai đoạn</h2>
          <p className="c-section-subtitle">
            Cơ chế đối chiếu khép kín kết hợp giữa phân tích ký tự học (Lexical) và học máy ngữ nghĩa (Semantic Embedding).
          </p>
        </div>

        <div className="c-pipeline-grid">
          <div className="c-pipeline-node">
            <div className="c-node-head">
              <span className="c-node-phase">Giai đoạn 1</span>
              <h3 className="c-node-title">Tiền xử lý Hán tự</h3>
            </div>
            <p className="c-node-desc">
              Chuẩn hóa mã hóa Unicode UTF-8, ngắt phân đoạn câu dựa trên ngữ pháp và hệ dấu câu tiếng Trung chuẩn (。？！；).
            </p>
          </div>

          <div className="c-pipeline-node">
            <div className="c-node-head">
              <span className="c-node-phase">Giai đoạn 2</span>
              <h3 className="c-node-title">Đối soát chuỗi LCS &amp; N-gram</h3>
            </div>
            <p className="c-node-desc">
              Thuật toán LCS nhận diện các cụm ký tự liền kề trùng khớp, kết hợp 3-gram/4-gram phát hiện sự đảo trật tự cụm từ.
            </p>
          </div>

          <div className="c-pipeline-node">
            <div className="c-node-head">
              <span className="c-node-phase">Giai đoạn 3</span>
              <h3 className="c-node-title">Mô hình hóa Vector MiniLM</h3>
            </div>
            <p className="c-node-desc">
              Chuyển hóa câu văn thành không gian vector 384 chiều, đo lường khoảng cách Cosine để nhận diện các câu paraphrase.
            </p>
          </div>

          <div className="c-pipeline-node">
            <div className="c-node-head">
              <span className="c-node-phase">Giai đoạn 4</span>
              <h3 className="c-node-title">Báo cáo kiểm chứng câu</h3>
            </div>
            <p className="c-node-desc">
              Xác lập tỷ lệ phần trăm tương đồng toàn bài, đánh dấu trực quan từng câu trùng lặp kèm trích dẫn văn bản đối chứng.
            </p>
          </div>
        </div>
      </div>

      {/* ── 3. Academic Comparison Matrix ── */}
      <div className="c-academic-section c-academic-section--framed">
        <div className="c-section-header">
          <h2 className="c-section-title">Đặc tính kỹ thuật chuyên biệt cho chữ Hán</h2>
          <p className="c-section-subtitle">
            Khác biệt cơ bản giữa công cụ đối soát tối ưu tiếng Trung và các giải pháp kiểm tra văn bản chữ cái Alphabet thông thường.
          </p>
        </div>

        <div className="c-comparison-table-wrap">
          <table className="c-comparison-table">
            <thead>
              <tr>
                <th scope="col">Tiêu chí đối chiếu</th>
                <th scope="col">Công cụ tìm kiếm thông thường</th>
                <th scope="col">Phần mềm kiểm tra tiếng Anh</th>
                <th scope="col" className="c-col-seal">C-checker (Tối ưu Hán ngữ)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="c-table-criteria"><strong>Phân đoạn ranh giới từ Hán tự</strong></td>
                <td>Khớp chuỗi từ khóa rời rạc</td>
                <td>Gặp lỗi token hóa chữ tượng hình CJK</td>
                <td className="c-col-seal">Phân tích theo câu &amp; cấu trúc Hán tự chuyên sâu</td>
              </tr>
              <tr>
                <td className="c-table-criteria"><strong>Nhận diện câu diễn đạt lại (Paraphrase)</strong></td>
                <td>Không hỗ trợ</td>
                <td>Chỉ chính xác với tiếng Anh</td>
                <td className="c-col-seal">Mô hình nơ-ron Transformer MiniLM đa ngữ</td>
              </tr>
              <tr>
                <td className="c-table-criteria"><strong>Bóc tách từng câu &amp; Nguồn gốc</strong></td>
                <td>Dẫn liên kết website chung</td>
                <td>Đánh dấu theo khối văn bản lớn</td>
                <td className="c-col-seal">Bóc tách chi tiết từng câu kèm nguồn đối chiếu</td>
              </tr>
              <tr>
                <td className="c-table-criteria"><strong>Tương thích Giản thể &amp; Phồn thể</strong></td>
                <td>Yêu cầu đúng tuyệt đối ký tự</td>
                <td>Không hỗ trợ liên thông hệ chữ</td>
                <td className="c-col-seal">Liên kết ngữ nghĩa giữa hai hệ chữ Hán</td>
              </tr>
              <tr>
                <td className="c-table-criteria"><strong>Chính sách tiếp cận học thuật</strong></td>
                <td>Miễn phí nhưng hạn chế tính năng</td>
                <td>Thu phí giấy phép đắt đỏ theo tháng</td>
                <td className="c-col-seal">Hỗ trợ miễn phí vì cộng đồng nghiên cứu</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ── 4. Use Cases ── */}
      <div className="c-academic-section">
        <div className="c-section-header">
          <h2 className="c-section-title">Phạm vi ứng dụng trong nghiên cứu &amp; đào tạo</h2>
          <p className="c-section-subtitle">
            Cung cấp công cụ chuẩn mực cho các cấp bậc đào tạo và nghiên cứu học thuật Hán văn.
          </p>
        </div>

        <div className="c-usecase-grid">
          <div className="c-usecase-card">
            <div className="c-usecase-role">Học viên &amp; Sinh viên</div>
            <h3 className="c-usecase-title">Khóa luận &amp; Luận văn tốt nghiệp</h3>
            <p className="c-usecase-text">
              Hỗ trợ sinh viên ngành Ngôn ngữ Trung Quốc, Sư phạm tiếng Trung tự rà soát văn bản trước khi trình hội đồng, 
              chủ động điều chỉnh các sai sót trích dẫn vô ý.
            </p>
            <ul className="c-usecase-list">
              <li>Rà soát chương Tổng quan tư liệu &amp; Cơ sở lý luận</li>
              <li>Kiểm chứng độ chính xác các đoạn trích dẫn ngữ liệu</li>
              <li>Bảo đảm tỷ lệ tương đồng trong ngưỡng quy định của cơ sở đào tạo</li>
            </ul>
          </div>

          <div className="c-usecase-card">
            <div className="c-usecase-role">Tác giả &amp; Nhà nghiên cứu</div>
            <h3 className="c-usecase-title">Bài báo khoa học &amp; Đề tài NCKH</h3>
            <p className="c-usecase-text">
              Giúp tác giả thẩm định tính nguyên bản của bản thảo trước khi gửi phản biện tại các tạp chí khoa học chuyên ngành 
              hoặc hội thảo quốc tế.
            </p>
            <ul className="c-usecase-list">
              <li>Đối soát nguồn sơ cấp (Primary) và nguồn thứ cấp (Secondary)</li>
              <li>Chuẩn hóa trích dẫn theo định dạng APA 7 / MLA</li>
              <li>Khẳng định tính độc lập của luận cứ và kết quả phân tích</li>
            </ul>
          </div>

          <div className="c-usecase-card">
            <div className="c-usecase-role">Biên phiên dịch học thuật</div>
            <h3 className="c-usecase-title">Dịch thuật &amp; Đối chiếu ngữ liệu Hán - Việt</h3>
            <p className="c-usecase-text">
              Hỗ trợ dịch giả kiểm soát mức độ trùng lặp giữa bản dịch mới và các công trình dịch thuật song ngữ đã công bố.
            </p>
            <ul className="c-usecase-list">
              <li>Tránh trùng lặp diễn đạt vô thức với các bản dịch tiền nhiệm</li>
              <li>Chuẩn hóa thuật ngữ chuyên ngành Hán - Việt</li>
              <li>Bảo toàn văn phong học thuật chuẩn mực</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ── 5. Featured Knowledge Base Articles ── */}
      <div className="c-academic-section c-academic-section--framed">
        <div className="c-section-header">
          <h2 className="c-section-title">Chuyên đề nghiên cứu &amp; Cẩm nang trích dẫn</h2>
          <p className="c-section-subtitle">
            Tuyển tập tài liệu hướng dẫn kỹ năng viết và xử lý văn bản tiếng Trung học thuật do C-checker biên soạn.
          </p>
        </div>

        <div className="c-articles-grid">
          <article className="c-article-card">
            <span className="c-article-category">PHƯƠNG PHÁP VIẾT</span>
            <h3 className="c-article-title">
              <Link to="/kien-thuc/cach-giam-ty-le-trung-lap-ma-khong-lam-sai-y">
                Cách giảm tỷ lệ trùng lặp mà không làm sai ý bài viết
              </Link>
            </h3>
            <p className="c-article-excerpt">
              Quy trình 4 bước xử lý đoạn văn bị trùng lặp, kỹ thuật biến đổi cấu trúc câu tiếng Trung học thuật an toàn và nhận diện cạm bẫy lách máy cần tránh.
            </p>
            <div className="c-article-footer">
              <Link to="/kien-thuc/cach-giam-ty-le-trung-lap-ma-khong-lam-sai-y" className="c-article-link">
                Xem chuyên đề →
              </Link>
            </div>
          </article>

          <article className="c-article-card">
            <span className="c-article-category">CHUẨN TRÍCH DẪN</span>
            <h3 className="c-article-title">
              <Link to="/kien-thuc/cach-trich-dan-tai-lieu-tieng-trung-theo-apa">
                Cách trích dẫn tài liệu tiếng Trung theo chuẩn APA 7
              </Link>
            </h3>
            <p className="c-article-excerpt">
              Nguyên tắc trích dẫn nguồn chữ Hán, cách ghi Pinyin, dịch nghĩa tiêu đề và bộ ví dụ chi tiết cho sách chuyên khảo, bài báo tạp chí và luận văn.
            </p>
            <div className="c-article-footer">
              <Link to="/kien-thuc/cach-trich-dan-tai-lieu-tieng-trung-theo-apa" className="c-article-link">
                Xem chuyên đề →
              </Link>
            </div>
          </article>

          <article className="c-article-card">
            <span className="c-article-category">NGƯỠNG ĐÁNH GIÁ</span>
            <h3 className="c-article-title">
              <Link to="/kien-thuc/bao-nhieu-phan-tram-trung-lap-thi-yen-tam">
                Bao nhiêu % trùng lặp thì có thể yên tâm nộp bài?
              </Link>
            </h3>
            <p className="c-article-excerpt">
              Tìm hiểu các mốc tỷ lệ tương đồng tham khảo tại các cơ sở đào tạo, cách phân biệt trùng lặp kỹ thuật và đạo văn thực chất trước hội đồng.
            </p>
            <div className="c-article-footer">
              <Link to="/kien-thuc/bao-nhieu-phan-tram-trung-lap-thi-yen-tam" className="c-article-link">
                Xem chuyên đề →
              </Link>
            </div>
          </article>

          <article className="c-article-card">
            <span className="c-article-category">KỸ THUẬT PARAPHRASE</span>
            <h3 className="c-article-title">
              <Link to="/kien-thuc/cach-paraphrase-tieng-trung-dung-cach">
                Cách paraphrase tiếng Trung đúng cách và tránh đạo văn
              </Link>
            </h3>
            <p className="c-article-excerpt">
              Phương pháp diễn đạt lại văn bản tiếng Trung mà không làm biến đổi sắc thái khẳng định, nguyên tắc dẫn nguồn và các lỗi sai ngữ nghĩa thường gặp.
            </p>
            <div className="c-article-footer">
              <Link to="/kien-thuc/cach-paraphrase-tieng-trung-dung-cach" className="c-article-link">
                Xem chuyên đề →
              </Link>
            </div>
          </article>

          <article className="c-article-card">
            <span className="c-article-category">TÀI LIỆU THAM KHẢO</span>
            <h3 className="c-article-title">
              <Link to="/kien-thuc/cach-ghi-tai-lieu-tham-khao-tieng-trung-trong-luan-van-tieng-viet">
                Cách ghi tài liệu tham khảo tiếng Trung trong luận văn tiếng Việt
              </Link>
            </h3>
            <p className="c-article-excerpt">
              Hướng dẫn bảo lưu chữ Hán, quy ước lựa chọn giữa âm Hán Việt và Pinyin, dịch tiêu đề tài liệu và trật tự sắp xếp danh mục tài liệu tham khảo chuẩn.
            </p>
            <div className="c-article-footer">
              <Link to="/kien-thuc/cach-ghi-tai-lieu-tham-khao-tieng-trung-trong-luan-van-tieng-viet" className="c-article-link">
                Xem chuyên đề →
              </Link>
            </div>
          </article>

          <article className="c-article-card">
            <span className="c-article-category">BẢNG KIỂM NỘP BÀI</span>
            <h3 className="c-article-title">
              <Link to="/kien-thuc/checklist-kiem-tra-luan-van-tieng-trung-truoc-khi-nop">
                Checklist kiểm tra luận văn tiếng Trung trước khi nộp
              </Link>
            </h3>
            <p className="c-article-excerpt">
              Bảng kiểm rà soát toàn diện: trích dẫn nguồn, tính thống nhất hệ chữ Giản/Phồn, cấu trúc bố cục, phụ lục và các chỉ số trong báo cáo kiểm tra.
            </p>
            <div className="c-article-footer">
              <Link to="/kien-thuc/checklist-kiem-tra-luan-van-tieng-trung-truoc-khi-nop" className="c-article-link">
                Xem chuyên đề →
              </Link>
            </div>
          </article>
        </div>

        <div className="c-section-cta">
          <Link to="/kien-thuc" className="c-btn-scholarly">
            Xem toàn bộ 21 chuyên đề học thuật tiếng Trung →
          </Link>
        </div>
      </div>

      {/* ── 6. Comprehensive FAQs (8 In-Depth Academic Questions) ── */}
      <div className="c-academic-section">
        <div className="c-section-header">
          <h2 className="c-section-title">Giải đáp thắc mắc về kiểm chứng văn bản</h2>
          <p className="c-section-subtitle">
            Làm rõ các vấn đề cốt lõi về bản chất điểm tương đồng, thuật toán và quyền riêng tư dữ liệu học thuật.
          </p>
        </div>

        <div className="c-faq-scholarly-grid">
          <div className="c-faq-entry">
            <h3 className="c-faq-question">
              Điểm tương đồng kỹ thuật (Similarity) khác với đạo văn (Plagiarism) như thế nào?
            </h3>
            <div className="c-faq-answer">
              <p>
                Điểm tương đồng là một chỉ số tính toán khách quan phản ánh tỷ lệ phần trăm ký tự hoặc cấu trúc câu trùng khớp với dữ liệu đối chứng. 
                Đạo văn là kết luận mang tính học thuật về việc có hay không hành vi sử dụng tư tưởng hoặc câu chữ của người khác mà không dẫn nguồn hợp lệ. 
                Một bài viết có tỷ lệ tương đồng 15% nhưng toàn bộ là trích dẫn đúng chuẩn APA thì hoàn toàn liêm chính về mặt học thuật.
              </p>
            </div>
          </div>

          <div className="c-faq-entry">
            <h3 className="c-faq-question">
              Vì sao kiểm tra văn bản tiếng Trung cần phương pháp tách biệt với tiếng Anh hay tiếng Việt?
            </h3>
            <div className="c-faq-answer">
              <p>
                Tiếng Trung là chữ tượng hình khối vuông (方块字), không sử dụng khoảng trắng phân cách từ. Do đó, các công cụ quét chuỗi đơn giản 
                sẽ thất bại trong việc phân định ranh giới từ và nhận diện thành ngữ, quán dụng ngữ. C-checker xử lý kết hợp cả cấp độ câu học thuật, 
                đoạn ngữ nghĩa và đối chiếu linh hoạt giữa Giản thể và Phồn thể.
              </p>
            </div>
          </div>

          <div className="c-faq-entry">
            <h3 className="c-faq-question">
              C-checker kết hợp những thuật toán nào để tính toán kết quả?
            </h3>
            <div className="c-faq-answer">
              <p>
                Hệ thống vận hành cơ chế đa tầng:
              </p>
              <ul>
                <li><strong>MiniLM Semantic Embedding:</strong> Đo lường sự tương đồng về mặt ý niệm qua mô hình mạng nơ-ron Transformer.</li>
                <li><strong>LCS (Longest Common Subsequence):</strong> Bắt chuỗi ký tự chung dài nhất, hiệu quả ngay cả khi bị chèn hư từ.</li>
                <li><strong>N-gram Overlap:</strong> Đo lường mức độ bao phủ cụm ký tự liền kề.</li>
                <li><strong>Contiguous Match:</strong> Phát hiện các trường hợp sao chép nguyên văn từng ký tự.</li>
              </ul>
            </div>
          </div>

          <div className="c-faq-entry">
            <h3 className="c-faq-question">
              Văn bản gửi lên hệ thống có bị lưu lại hoặc rò rỉ bản thảo không?
            </h3>
            <div className="c-faq-answer">
              <p>
                Tuyệt đối không. Đối với lượt kiểm tra nhanh của khách, văn bản chỉ nạp vào bộ nhớ RAM tạm thời để phân tích và tự động hủy bỏ ngay sau đó. 
                Đối với tài khoản cá nhân, kết quả được mã hóa và chỉ duy nhất chủ tài khoản có quyền truy cập hoặc xóa vĩnh viễn khỏi lịch sử.
              </p>
            </div>
          </div>

          <div className="c-faq-entry">
            <h3 className="c-faq-question">
              Nên xử lý như thế nào khi một câu bị hệ thống đánh dấu màu đỏ?
            </h3>
            <div className="c-faq-answer">
              <p>
                Nhấp vào câu được đánh dấu để mở đoạn văn đối chiếu nguồn. Nếu câu đó trích dẫn định nghĩa hay số liệu của tác giả khác, 
                hãy bổ sung dấu ngoặc kép hoặc nguồn tham khảo chuẩn mực. Nếu là câu diễn giải của bạn, hãy tái cấu trúc câu văn bằng cách thay đổi 
                thành phần chủ - vị hoặc dùng từ ngữ của riêng bạn nhưng bảo lưu trọn vẹn ý tứ nghiên cứu.
              </p>
            </div>
          </div>

          <div className="c-faq-entry">
            <h3 className="c-faq-question">
              Hệ thống hỗ trợ những định dạng tệp tài liệu nào?
            </h3>
            <div className="c-faq-answer">
              <p>
                Khi đăng nhập bằng tài khoản Google, bạn có thể tải lên trực tiếp các tệp <strong>.docx (Microsoft Word)</strong>, 
                <strong>.pdf</strong> và <strong>.txt</strong>. Bộ trích xuất ngữ liệu sẽ tự động bóc tách nội dung chữ Hán để tiến hành phân tích.
              </p>
            </div>
          </div>

          <div className="c-faq-entry">
            <h3 className="c-faq-question">
              Nguyên tắc cơ bản để trích dẫn tài liệu chữ Hán theo chuẩn APA 7 là gì?
            </h3>
            <div className="c-faq-answer">
              <p>
                Giữ nguyên họ tên tác giả bằng chữ Hán, ghi năm xuất bản trong ngoặc đơn, tên tài liệu bằng chữ Hán kèm theo bản dịch nghĩa 
                tiếng Việt hoặc tiếng Anh đặt trong dấu ngoặc vuông <code>[...]</code>. Chi tiết từng trường hợp sách chuyên khảo hay bài báo khoa học 
                đều có bài hướng dẫn cụ thể trong mục Kiến thức.
              </p>
            </div>
          </div>

          <div className="c-faq-entry">
            <h3 className="c-faq-question">
              C-checker có phải là dịch vụ thương mại thu phí không?
            </h3>
            <div className="c-faq-answer">
              <p>
                Không. C-checker được duy trì phi thương mại với mục tiêu phụng sự giáo dục và hỗ trợ cộng đồng sinh viên, giảng viên và các nhà nghiên cứu 
                tiếng Trung tại Việt Nam tiếp cận công nghệ kiểm chứng văn bản hiện đại một cách hoàn toàn miễn phí.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

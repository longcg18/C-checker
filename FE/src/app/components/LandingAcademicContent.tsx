import React from 'react';
import { Link } from 'react-router';

export function LandingAcademicContent() {
  return (
    <section className="c-academic-landing" aria-label="Thông tin học thuật và công nghệ C-checker">
      {/* ── 1. Hero Summary & Academic Badges ── */}
      <div className="c-academic-hero">
        <div className="c-academic-badge-pill">
          <span className="c-pulse-dot" />
          <span>Hệ thống phân tích ngữ liệu &amp; đối soát học thuật tiếng Trung</span>
        </div>
        <h2 className="c-academic-hero-title">
          Giải pháp kiểm tra tính nguyên bản &amp; trùng lặp văn bản tiếng Trung chuyên sâu
        </h2>
        <p className="c-academic-hero-lead">
          C-checker kết hợp mô hình ngôn ngữ ngữ nghĩa sâu <strong>MiniLM</strong> cùng các thuật toán đối chiếu cấu trúc chuỗi 
          <strong> LCS (Longest Common Subsequence)</strong> và <strong>N-gram</strong>. Nền tảng được thiết kế riêng nhằm xử lý 
          triệt để những thách thức đặc thù của chữ Hán (Hán tự Giản thể &amp; Phồn thể), giúp người học, giảng viên và nhà nghiên cứu 
          bảo đảm sự liêm chính học thuật trong các công trình nghiên cứu.
        </p>

        {/* 4 Feature Badges */}
        <div className="c-academic-badges-grid">
          <div className="c-academic-badge-card">
            <div className="c-badge-icon c-badge-icon--blue">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <div className="c-badge-content">
              <h3 className="c-badge-title">AI Ngữ nghĩa MiniLM</h3>
              <p className="c-badge-desc">Phát hiện câu đồng nghĩa, đảo ngữ, thay thế từ đồng nghĩa tinh vi trong tiếng Trung.</p>
            </div>
          </div>

          <div className="c-academic-badge-card">
            <div className="c-badge-icon c-badge-icon--green">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            </div>
            <div className="c-badge-content">
              <h3 className="c-badge-title">Giản thể &amp; Phồn thể</h3>
              <p className="c-badge-desc">Hỗ trợ đầy đủ khối ngữ liệu chữ Hán giản thể (简体) và phồn thể (繁體) theo ngữ cảnh.</p>
            </div>
          </div>

          <div className="c-academic-badge-card">
            <div className="c-badge-icon c-badge-icon--purple">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            </div>
            <div className="c-badge-content">
              <h3 className="c-badge-title">Chuẩn Trích dẫn APA 7</h3>
              <p className="c-badge-desc">Phân định rõ ràng giữa trích dẫn học thuật hợp lệ và tình trạng sao chép nguyên văn.</p>
            </div>
          </div>

          <div className="c-academic-badge-card">
            <div className="c-badge-icon c-badge-icon--amber">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <div className="c-badge-content">
              <h3 className="c-badge-title">Bảo mật Tác quyền</h3>
              <p className="c-badge-desc">Không lưu giữ văn bản thử nghiệm của khách. Đảm bảo toàn vẹn quyền riêng tư dữ liệu bài viết.</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. How It Works (4-Step Pipeline) ── */}
      <div className="c-academic-section">
        <div className="c-section-header">
          <span className="c-section-tag">QUY TRÌNH KỸ THUẬT</span>
          <h2 className="c-section-title">Cách thức C-checker phân tích &amp; đối soát văn bản</h2>
          <p className="c-section-subtitle">
            Hệ thống áp dụng kiến trúc phân tích 4 giai đoạn khép kín nhằm bảo đảm độ bao phủ cao và hạn chế tối đa các trường hợp dương tính giả.
          </p>
        </div>

        <div className="c-steps-timeline">
          <div className="c-step-card">
            <div className="c-step-number">01</div>
            <h3 className="c-step-title">Tiền xử lý &amp; Phân tách câu Hán tự</h3>
            <p className="c-step-desc">
              Văn bản được tách câu dựa trên hệ dấu câu tiếng Trung học thuật (。？！；…), lọc bỏ khoảng trắng thừa và chuẩn hóa 
              mã hóa Unicode UTF-8 để nhận diện chính xác từng thành phần câu.
            </p>
          </div>

          <div className="c-step-card">
            <div className="c-step-number">02</div>
            <h3 className="c-step-title">So khớp Song song Lexical &amp; N-gram</h3>
            <p className="c-step-desc">
              Thuật toán <strong>LCS (Longest Common Subsequence)</strong> nhận diện các cụm ký tự liền kề trùng lặp, kết hợp với 
              <strong> 3-gram/4-gram</strong> để phát hiện các phân đoạn chữ Hán bị xáo trộn vị trí.
            </p>
          </div>

          <div className="c-step-card">
            <div className="c-step-number">03</div>
            <h3 className="c-step-title">Phân tích Vector Ngữ nghĩa (Transformer)</h3>
            <p className="c-step-desc">
              Mô hình nhúng đa ngôn ngữ chuyển đổi từng câu thành vector toán học 384 chiều, tính khoảng cách Cosine để nhận dạng 
              kể cả khi câu đã được paraphrase (diễn đạt lại bằng từ đồng nghĩa).
            </p>
          </div>

          <div className="c-step-card">
            <div className="c-step-number">04</div>
            <h3 className="c-step-title">Xuất Báo cáo Trực quan Đa tầng</h3>
            <p className="c-step-desc">
              Tổng hợp điểm tương đồng tổng thể (%), tô màu phân loại từng câu (Đỏ: Trùng lặp cao, Vàng: Nguy cơ paraphrase, 
              Xanh: Nguyên bản), đồng thời hiển thị trích dẫn nguồn đối sánh minh bạch.
            </p>
          </div>
        </div>
      </div>

      {/* ── 3. Academic Comparison Matrix ── */}
      <div className="c-academic-section c-academic-section--alt">
        <div className="c-section-header">
          <span className="c-section-tag">ĐỐI CHIẾU CÔNG NGHỆ</span>
          <h2 className="c-section-title">Vì sao kiểm tra văn bản tiếng Trung cần công nghệ chuyên biệt?</h2>
          <p className="c-section-subtitle">
            Tiếng Trung là ngôn ngữ không có khoảng trắng phân cách giữa các từ như tiếng Việt hay tiếng Anh, do đó các công cụ 
            quét chuỗi thông thường dễ bỏ sót hoặc nhận diện sai lệch.
          </p>
        </div>

        <div className="c-comparison-table-wrap">
          <table className="c-comparison-table">
            <thead>
              <tr>
                <th scope="col">Tiêu chí đánh giá</th>
                <th scope="col">Công cụ tìm kiếm thông thường</th>
                <th scope="col">Phần mềm đạo văn tiếng Anh</th>
                <th scope="col" className="c-col-highlight">C-checker (Tối ưu tiếng Trung)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="c-table-criteria"><strong>Nhận diện ranh giới từ Hán</strong></td>
                <td>Chỉ khớp chính xác cụm từ</td>
                <td>Gặp lỗi token hóa ký tự CJK</td>
                <td className="c-col-highlight"><span className="c-check-icon">✓</span> Phân tích câu &amp; ký tự Hán tự chuyên sâu</td>
              </tr>
              <tr>
                <td className="c-table-criteria"><strong>Phát hiện Paraphrase tiếng Trung</strong></td>
                <td><span className="c-cross-icon">✗</span> Không phát hiện được</td>
                <td><span className="c-cross-icon">✗</span> Chỉ hỗ trợ tiếng Anh tốt</td>
                <td className="c-col-highlight"><span className="c-check-icon">✓</span> Mô hình Transformer MiniLM đa ngữ</td>
              </tr>
              <tr>
                <td className="c-table-criteria"><strong>Báo cáo vị trí câu &amp; Nguồn</strong></td>
                <td>Chỉ hiển thị link web chung</td>
                <td>Báo cáo theo khối đoạn</td>
                <td className="c-col-highlight"><span className="c-check-icon">✓</span> Bóc tách trực quan từng câu có trích đoạn nguồn</td>
              </tr>
              <tr>
                <td className="c-table-criteria"><strong>Hỗ trợ Giản thể &amp; Phồn thể</strong></td>
                <td>Cần gõ chính xác hệ chữ</td>
                <td>Không hỗ trợ chuyển tự</td>
                <td className="c-col-highlight"><span className="c-check-icon">✓</span> Nhận diện tương đương ngữ nghĩa cả 2 hệ chữ</td>
              </tr>
              <tr>
                <td className="c-table-criteria"><strong>Chi phí sử dụng</strong></td>
                <td>Miễn phí nhưng hạn chế</td>
                <td>Đắt đỏ (tính theo lượt/tháng)</td>
                <td className="c-col-highlight"><span className="c-check-icon">✓</span> Miễn phí phục vụ cộng đồng học thuật</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ── 4. Use Cases ── */}
      <div className="c-academic-section">
        <div className="c-section-header">
          <span className="c-section-tag">ỨNG DỤNG THỰC TẾ</span>
          <h2 className="c-section-title">Đồng hành cùng cộng đồng nghiên cứu tiếng Trung</h2>
          <p className="c-section-subtitle">
            C-checker được thiết kế nhằm đáp ứng các tiêu chuẩn khắt khe trong môi trường học viện và cơ sở đào tạo đại học.
          </p>
        </div>

        <div className="c-usecase-grid">
          <div className="c-usecase-card">
            <div className="c-usecase-header">
              <span className="c-usecase-tag">Học viên &amp; Sinh viên</span>
              <h3 className="c-usecase-title">Khóa luận &amp; Luận văn tốt nghiệp</h3>
            </div>
            <p className="c-usecase-text">
              Hỗ trợ sinh viên ngành Ngôn ngữ Trung Quốc, Sư phạm tiếng Trung và Trung Quốc học tự rà soát văn bản trước khi nộp 
              hội đồng chấm luận văn, hạn chế các sơ suất trích dẫn vô ý.
            </p>
            <ul className="c-usecase-list">
              <li>Rà soát chương Tổng quan lý thuyết &amp; Lịch sử vấn đề</li>
              <li>Kiểm tra tính chuẩn xác của các đoạn dịch ngữ liệu</li>
              <li>Bảo đảm tỷ lệ tương đồng nằm trong ngưỡng quy định của trường</li>
            </ul>
          </div>

          <div className="c-usecase-card">
            <div className="c-usecase-header">
              <span className="c-usecase-tag">Nghiên cứu sinh &amp; Tác giả</span>
              <h3 className="c-usecase-title">Bài báo khoa học &amp; Đề tài NCKH</h3>
            </div>
            <p className="c-usecase-text">
              Hỗ trợ tác giả hoàn thiện bản thảo trước khi gửi đến các tạp chí khoa học chuyên ngành, hội thảo quốc tế hoặc cơ quan 
              tài trợ nghiên cứu.
            </p>
            <ul className="c-usecase-list">
              <li>Kiểm chứng nguồn tham khảo gốc (Primary &amp; Secondary sources)</li>
              <li>Đối chiếu trích dẫn theo định dạng chuẩn APA 7 / Chicago</li>
              <li>Bảo đảm sự độc lập của kết quả phân tích và thảo luận</li>
            </ul>
          </div>

          <div className="c-usecase-card">
            <div className="c-usecase-header">
              <span className="c-usecase-tag">Biên phiên dịch</span>
              <h3 className="c-usecase-title">Dịch thuật học thuật Hán - Việt</h3>
            </div>
            <p className="c-usecase-text">
              Giúp biên dịch viên kiểm soát mức độ trùng lặp giữa văn bản dịch và các bản dịch song ngữ đã xuất bản trước đó trên 
              không gian trực tuyến.
            </p>
            <ul className="c-usecase-list">
              <li>Tránh vô tình trùng lặp diễn đạt với các ấn bản cũ</li>
              <li>Tra cứu đối sánh thuật ngữ chuyên ngành chuẩn xác</li>
              <li>Nâng cao chất lượng dịch và tính tự nhiên của câu văn</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ── 5. Featured Knowledge Base Articles ── */}
      <div className="c-academic-section c-academic-section--alt">
        <div className="c-section-header">
          <span className="c-section-tag">CHUYÊN ĐỀ HỌC THUẬT</span>
          <h2 className="c-section-title">Cẩm nang &amp; Kiến thức viết nghiên cứu tiếng Trung</h2>
          <p className="c-section-subtitle">
            Khám phá tuyển tập các bài nghiên cứu và hướng dẫn thực hành trích dẫn, xử lý câu trùng lặp do đội ngũ học thuật biên soạn.
          </p>
        </div>

        <div className="c-articles-grid">
          <article className="c-article-card">
            <div className="c-article-tag">PHƯƠNG PHÁP VIẾT</div>
            <h3 className="c-article-title">
              <Link to="/kien-thuc/cach-giam-ty-le-trung-lap-ma-khong-lam-sai-y">
                Cách giảm tỷ lệ trùng lặp mà không làm sai ý bài viết
              </Link>
            </h3>
            <p className="c-article-excerpt">
              Quy trình 4 bước xử lý đoạn văn bị trùng lặp, kỹ thuật biến đổi cấu trúc câu tiếng Trung học thuật an toàn và nhận diện các cạm bẫy lách máy cần tránh.
            </p>
            <div className="c-article-footer">
              <Link to="/kien-thuc/cach-giam-ty-le-trung-lap-ma-khong-lam-sai-y" className="c-article-link">
                Đọc bài viết →
              </Link>
            </div>
          </article>

          <article className="c-article-card">
            <div className="c-article-tag">CHUẨN TRÍCH DẪN</div>
            <h3 className="c-article-title">
              <Link to="/kien-thuc/cach-trich-dan-tai-lieu-tieng-trung-theo-apa">
                Cách trích dẫn tài liệu tiếng Trung theo chuẩn APA 7
              </Link>
            </h3>
            <p className="c-article-excerpt">
              Nguyên tắc trích dẫn nguồn chữ Hán, cách phiên âm Pinyin, dịch nghĩa tiêu đề và bộ ví dụ chi tiết cho sách chuyên khảo, bài báo tạp chí và luận văn.
            </p>
            <div className="c-article-footer">
              <Link to="/kien-thuc/cach-trich-dan-tai-lieu-tieng-trung-theo-apa" className="c-article-link">
                Đọc bài viết →
              </Link>
            </div>
          </article>

          <article className="c-article-card">
            <div className="c-article-tag">ĐÁNH GIÁ TỶ LỆ</div>
            <h3 className="c-article-title">
              <Link to="/kien-thuc/bao-nhieu-phan-tram-trung-lap-thi-yen-tam">
                Bao nhiêu % trùng lặp thì có thể yên tâm nộp bài?
              </Link>
            </h3>
            <p className="c-article-excerpt">
              Tìm hiểu các mốc tỷ lệ tương đồng tham khảo tại các trường đại học, cách phân biệt trùng lặp kỹ thuật và đạo văn thực chất trước hội đồng.
            </p>
            <div className="c-article-footer">
              <Link to="/kien-thuc/bao-nhieu-phan-tram-trung-lap-thi-yen-tam" className="c-article-link">
                Đọc bài viết →
              </Link>
            </div>
          </article>

          <article className="c-article-card">
            <div className="c-article-tag">KỸ THUẬT PARAPHRASE</div>
            <h3 className="c-article-title">
              <Link to="/kien-thuc/cach-paraphrase-tieng-trung-dung-cach">
                Cách paraphrase tiếng Trung đúng cách và tránh đạo văn
              </Link>
            </h3>
            <p className="c-article-excerpt">
              Phương pháp diễn đạt lại văn bản tiếng Trung mà không làm biến đổi sắc thái khẳng định, nguyên tắc dẫn nguồn và các lỗi diễn đạt thường gặp.
            </p>
            <div className="c-article-footer">
              <Link to="/kien-thuc/cach-paraphrase-tieng-trung-dung-cach" className="c-article-link">
                Đọc bài viết →
              </Link>
            </div>
          </article>

          <article className="c-article-card">
            <div className="c-article-tag">DANH MỤC THAM KHẢO</div>
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
                Đọc bài viết →
              </Link>
            </div>
          </article>

          <article className="c-article-card">
            <div className="c-article-tag">KIỂM TRA TRƯỚC KHI NỘP</div>
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
                Đọc bài viết →
              </Link>
            </div>
          </article>
        </div>

        <div className="c-section-cta">
          <Link to="/kien-thuc" className="c-btn c-btn--outline c-btn--lg">
            Khám phá toàn bộ 21+ chuyên đề học thuật tiếng Trung →
          </Link>
        </div>
      </div>

      {/* ── 6. Comprehensive FAQs (8 In-Depth Academic Questions) ── */}
      <div className="c-academic-section">
        <div className="c-section-header">
          <span className="c-section-tag">HỎI ĐÁP HỌC THUẬT</span>
          <h2 className="c-section-title">Các câu hỏi thường gặp về kiểm tra trùng lặp tiếng Trung</h2>
          <p className="c-section-subtitle">
            Giải đáp chi tiết các thắc mắc về cơ chế tính điểm, tính bảo mật và chuẩn mực học thuật khi sử dụng hệ thống C-checker.
          </p>
        </div>

        <div className="c-faq-accordion-grid">
          <div className="c-faq-box">
            <h3 className="c-faq-box-q">
              1. Điểm tương đồng (Similarity Score) có đồng nghĩa với đạo văn không?
            </h3>
            <div className="c-faq-box-a">
              <p>
                <strong>Không.</strong> Điểm tương đồng là chỉ số kỹ thuật phản ánh tỷ lệ phần trăm các câu hoặc cụm từ trong văn bản 
                của bạn trùng khớp hoặc tương tự về mặt ngữ nghĩa với ngữ liệu đối chiếu. Đạo văn là một phán quyết học thuật dựa trên 
                ngữ cảnh: một đoạn văn có trích dẫn đúng nguồn hợp lệ vẫn có thể có điểm tương đồng kỹ thuật, nhưng hoàn toàn hợp lệ về mặt học thuật.
              </p>
            </div>
          </div>

          <div className="c-faq-box">
            <h3 className="c-faq-box-q">
              2. Vì sao kiểm tra trùng lặp văn bản tiếng Trung lại phức tạp hơn tiếng Anh hay tiếng Việt?
            </h3>
            <div className="c-faq-box-a">
              <p>
                Tiếng Trung là chữ tượng hình (Logogram), không có dấu cách ngăn cách từ như các hệ chữ Alphabet hay Latin. Do đó, một 
                công cụ kiểm tra tốt phải giải quyết đồng thời bài toán phân đoạn từ (Word Segmentation), sự khác biệt giữa Giản thể và 
                Phồn thể, cùng với các biến thể ngữ nghĩa đa dạng của thành ngữ (quán dụng ngữ, thành ngữ 4 chữ 成语).
              </p>
            </div>
          </div>

          <div className="c-faq-box">
            <h3 className="c-faq-box-q">
              3. C-checker kết hợp các thuật toán nào để đưa ra kết luận chính xác?
            </h3>
            <div className="c-faq-box-a">
              <p>
                C-checker tích hợp 4 thước đo:
              </p>
              <ul>
                <li><strong>MiniLM Semantic Embedding:</strong> Đo độ tương đồng ngữ nghĩa bằng mạng nơ-ron Transformer.</li>
                <li><strong>LCS (Longest Common Subsequence):</strong> Bắt chuỗi ký tự chung dài nhất dù bị chèn thêm trợ từ.</li>
                <li><strong>N-gram Overlap:</strong> Đo mức độ phủ cụm từ ngắn.</li>
                <li><strong>Contiguous Match:</strong> Phát hiện câu bị sao chép nguyên văn từng ký tự.</li>
              </ul>
            </div>
          </div>

          <div className="c-faq-box">
            <h3 className="c-faq-box-q">
              4. Tài liệu tôi tải lên C-checker có bị lưu trữ công khai hoặc chia sẻ không?
            </h3>
            <div className="c-faq-box-a">
              <p>
                <strong>Tuyệt đối không.</strong> C-checker tuân thủ chính sách bảo vệ quyền tác giả nghiêm ngặt. Đối với phiên bản 
                dùng thử không đăng nhập, văn bản chỉ được xử lý tạm thời trong bộ nhớ đệm phục vụ phân tích và bị xóa ngay sau khi trả kết quả. 
                Với tài khoản cá nhân, kết quả chỉ hiển thị trong kho lưu trữ riêng của bạn và bạn có quyền xóa vĩnh viễn bất kỳ lúc nào.
              </p>
            </div>
          </div>

          <div className="c-faq-box">
            <h3 className="c-faq-box-q">
              5. Tôi cần làm gì khi một câu bị C-checker đánh dấu màu đỏ (trùng lặp cao)?
            </h3>
            <div className="c-faq-box-a">
              <p>
                Bạn hãy nhấp vào câu đó để xem câu đối chiếu nguồn gốc. Nếu đó là định nghĩa gốc hoặc số liệu của tác giả khác, hãy 
                bổ sung trích dẫn chuẩn (Họ tên tác giả, năm xuất bản). Nếu đó là phân tích của bạn nhưng vô tình trùng lặp diễn đạt, 
                hãy áp dụng kỹ thuật <em>paraphrase</em>: thay đổi cấu trúc chủ - vị, diễn đạt lại bằng vốn từ của bạn nhưng bảo lưu trọn vẹn ý nghĩa học thuật.
              </p>
            </div>
          </div>

          <div className="c-faq-box">
            <h3 className="c-faq-box-q">
              6. Các định dạng tệp nào được C-checker hỗ trợ tải lên?
            </h3>
            <div className="c-faq-box-a">
              <p>
                Khi đăng nhập bằng tài khoản Google, bạn có thể tải lên trực tiếp các tệp văn bản định dạng <strong>.docx (Microsoft Word)</strong>, 
                <strong>.pdf</strong> và <strong>.txt</strong>. Hệ thống tự động trích xuất nội dung văn bản chữ Hán và tiến hành đối soát nhanh chóng.
              </p>
            </div>
          </div>

          <div className="c-faq-box">
            <h3 className="c-faq-box-q">
              7. Làm thế nào để trích dẫn tài liệu tiếng Trung đúng chuẩn APA 7?
            </h3>
            <div className="c-faq-box-a">
              <p>
                Theo chuẩn APA 7, với tài liệu chữ Hán: giữ nguyên tên tác giả bằng chữ Hán (kèm Pinyin nếu viết bằng tiếng Anh), 
                năm xuất bản trong ngoặc đơn, tên bài báo hoặc sách bằng chữ Hán kèm theo bản dịch nghĩa tiếng Việt/tiếng Anh đặt trong dấu ngoặc vuông <code>[...]</code>. 
                Bạn có thể xem hướng dẫn chi tiết tại mục Kiến thức của C-checker.
              </p>
            </div>
          </div>

          <div className="c-faq-box">
            <h3 className="c-faq-box-q">
              8. Dịch vụ của C-checker có thu phí không?
            </h3>
            <div className="c-faq-box-a">
              <p>
                C-checker hoạt động theo tôn chỉ phi lợi nhuận hỗ trợ giáo dục và nghiên cứu học thuật. Hệ thống cung cấp dịch vụ 
                <strong> hoàn toàn miễn phí</strong> cho sinh viên, giảng viên và các nhà nghiên cứu độc lập.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


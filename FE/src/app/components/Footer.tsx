import { Link } from 'react-router';
import { ModalType } from './InfoModal';

interface FooterProps {
  onOpenModal?: (type: ModalType) => void;
  onGoHome?: () => void;
}

export function Footer({ onOpenModal }: FooterProps) {
  return (
    <footer className="c-footer" role="contentinfo">
      <div className="c-footer-inner">
        {/* Mega Footer Top Columns */}
        <div className="c-footer-grid">
          {/* Col 1: About Platform */}
          <div className="c-footer-col c-footer-col--main">
            <div className="c-footer-brand">
              <span className="c-footer-seal-stamp">考证</span>
              <span className="c-footer-brand-name">C-checker</span>
            </div>
            <p className="c-footer-brand-desc">
              Hệ thống công nghệ đối soát và thẩm định tính nguyên bản văn bản tiếng Trung, kết hợp AI ngữ nghĩa MiniLM và các thuật toán cấu trúc chuỗi LCS &amp; N-gram vì sự liêm chính học thuật.
            </p>
            <div className="c-footer-sub-note">
              Phi thương mại · Hỗ trợ cộng đồng nghiên cứu tiếng Trung
            </div>
          </div>

          {/* Col 2: Technology & Engine */}
          <div className="c-footer-col">
            <h4 className="c-footer-heading">Phương pháp &amp; Kỹ thuật</h4>
            <ul className="c-footer-links">
              <li>
                <Link to="/kien-thuc/lcs-ngram-semantic-similarity">MiniLM Semantic Embedding</Link>
              </li>
              <li>
                <Link to="/kien-thuc/lcs-ngram-semantic-similarity">Thuật toán LCS &amp; N-gram</Link>
              </li>
              <li>
                <Link to="/kien-thuc/vi-sao-kiem-tra-dao-van-tieng-trung-kho-hon">Đặc thù phân tách Hán tự</Link>
              </li>
              <li>
                <Link to="/kien-thuc/huong-dan-doc-bao-cao">Bóc tách câu &amp; Truy vết nguồn</Link>
              </li>
              <li>
                <Link to="/kien-thuc/han-che-va-sai-so">Hạn chế &amp; Sai số kỹ thuật</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Academic Resources */}
          <div className="c-footer-col">
            <h4 className="c-footer-heading">Cẩm nang trích dẫn</h4>
            <ul className="c-footer-links">
              <li>
                <Link to="/kien-thuc/cach-trich-dan-tai-lieu-tieng-trung-theo-apa">Chuẩn trích dẫn APA 7 tiếng Trung</Link>
              </li>
              <li>
                <Link to="/kien-thuc/cach-giam-ty-le-trung-lap-ma-khong-lam-sai-y">Kỹ thuật giảm tỷ lệ trùng lặp</Link>
              </li>
              <li>
                <Link to="/kien-thuc/cach-paraphrase-tieng-trung-dung-cach">Paraphrase câu tiếng Trung</Link>
              </li>
              <li>
                <Link to="/kien-thuc/checklist-kiem-tra-luan-van-tieng-trung-truoc-khi-nop">Bảng kiểm trước khi nộp luận văn</Link>
              </li>
              <li>
                <Link to="/kien-thuc/bao-nhieu-phan-tram-trung-lap-thi-yen-tam">Ngưỡng tương đồng tham khảo</Link>
              </li>
              <li>
                <Link to="/kien-thuc" className="c-footer-more-link">Toàn bộ 21 chuyên đề học thuật →</Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Links & Legal */}
          <div className="c-footer-col">
            <h4 className="c-footer-heading">Thông tin &amp; Điều khoản</h4>
            <ul className="c-footer-links">
              <li>
                <Link to="/about">Giới thiệu nền tảng</Link>
              </li>
              <li>
                <Link to="/guide">Hướng dẫn thao tác</Link>
              </li>
              <li>
                <Link to="/privacy">Chính sách bảo mật dữ liệu</Link>
              </li>
              <li>
                <Link to="/terms">Điều khoản sử dụng</Link>
              </li>
              <li>
                <Link to="/contact">Liên hệ học thuật</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright bar */}
        <div className="c-footer-bottom">
          <p className="c-footer-copy">
            © 2026 C-checker. Nền tảng hỗ trợ nghiên cứu và nâng cao chất lượng học thuật văn bản tiếng Trung.
          </p>
          <div className="c-footer-legal-inline">
            <Link to="/privacy">Bảo mật</Link>
            <Link to="/terms">Điều khoản</Link>
            <Link to="/contact">Liên hệ</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

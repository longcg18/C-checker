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
              <div className="c-footer-logo-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
              </div>
              <span className="c-footer-brand-name">C-checker</span>
            </div>
            <p className="c-footer-brand-desc">
              Hệ thống công nghệ đối soát và kiểm tra tính nguyên bản văn bản tiếng Trung tiên phong tại Việt Nam, kết hợp AI ngữ nghĩa MiniLM và các thuật toán cấu trúc chuỗi LCS &amp; N-gram vì sự liêm chính học thuật.
            </p>
            <div className="c-footer-integrity-badge">
              <span className="c-footer-integrity-dot"></span>
              <span>Phi lợi nhuận · Đồng hành cùng nghiên cứu khoa học</span>
            </div>
          </div>

          {/* Col 2: Technology & Engine */}
          <div className="c-footer-col">
            <h4 className="c-footer-heading">Công nghệ &amp; Thuật toán</h4>
            <ul className="c-footer-links">
              <li>
                <Link to="/kien-thuc/lcs-ngram-semantic-similarity">MiniLM Semantic Embedding</Link>
              </li>
              <li>
                <Link to="/kien-thuc/lcs-ngram-semantic-similarity">Thuật toán LCS &amp; N-gram</Link>
              </li>
              <li>
                <Link to="/kien-thuc/vi-sao-kiem-tra-dao-van-tieng-trung-kho-hon">Xử lý Hán tự Giản - Phồn</Link>
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
            <h4 className="c-footer-heading">Tài liệu học thuật</h4>
            <ul className="c-footer-links">
              <li>
                <Link to="/kien-thuc/cach-trich-dan-tai-lieu-tieng-trung-theo-apa">Chuẩn trích dẫn APA 7 tiếng Trung</Link>
              </li>
              <li>
                <Link to="/kien-thuc/cach-giam-ty-le-trung-lap-ma-khong-lam-sai-y">Kỹ thuật giảm tỷ lệ trùng lặp</Link>
              </li>
              <li>
                <Link to="/kien-thuc/cach-paraphrase-tieng-trung-dung-cach">Paraphrase tiếng Trung đúng cách</Link>
              </li>
              <li>
                <Link to="/kien-thuc/checklist-kiem-tra-luan-van-tieng-trung-truoc-khi-nop">Checklist nộp luận văn</Link>
              </li>
              <li>
                <Link to="/kien-thuc/bao-nhieu-phan-tram-trung-lap-thi-yen-tam">Ngưỡng % trùng lặp an toàn</Link>
              </li>
              <li>
                <Link to="/kien-thuc" className="c-footer-more-link">Xem tất cả 21+ chuyên đề →</Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Links & Legal */}
          <div className="c-footer-col">
            <h4 className="c-footer-heading">Thông tin &amp; Điều khoản</h4>
            <ul className="c-footer-links">
              <li>
                <Link to="/about">Giới thiệu C-checker</Link>
              </li>
              <li>
                <Link to="/guide">Hướng dẫn sử dụng</Link>
              </li>
              <li>
                <Link to="/privacy">Chính sách bảo mật dữ liệu</Link>
              </li>
              <li>
                <Link to="/terms">Điều khoản sử dụng dịch vụ</Link>
              </li>
              <li>
                <Link to="/contact">Liên hệ hỗ trợ học thuật</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright bar */}
        <div className="c-footer-bottom">
          <p className="c-footer-copy">
            © 2026 C-checker. All rights reserved. Nền tảng hỗ trợ nghiên cứu và nâng cao chất lượng học thuật văn bản tiếng Trung.
          </p>
          <div className="c-footer-legal-inline">
            <Link to="/privacy">Bảo mật</Link>
            <span className="c-footer-dot">•</span>
            <Link to="/terms">Điều khoản</Link>
            <span className="c-footer-dot">•</span>
            <Link to="/contact">Liên hệ</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

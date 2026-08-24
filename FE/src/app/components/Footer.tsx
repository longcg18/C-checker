import { Link } from 'react-router';
import { ModalType } from './InfoModal';

interface FooterProps {
  onOpenModal?: (type: ModalType) => void;
  onGoHome?: () => void;
}

export function Footer({ onOpenModal }: FooterProps) {
  return (
    <footer className="c-footer">
      <div className="c-footer-inner">
        <div className="c-footer-bottom">
          <p>© 2026 C-checker. All rights reserved.</p>
          <div className="c-footer-legal-inline">
            <Link to="/about">Giới thiệu</Link>
            <span className="c-footer-dot">•</span>
            <Link to="/guide">Hướng dẫn</Link>
            <span className="c-footer-dot">•</span>
            <Link to="/privacy">Chính sách bảo mật</Link>
            <span className="c-footer-dot">•</span>
            <Link to="/terms">Điều khoản dịch vụ</Link>
            <span className="c-footer-dot">•</span>
            <Link to="/contact">Liên hệ</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

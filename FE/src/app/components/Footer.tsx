import React from 'react';
import { ModalType } from './InfoModal';

interface FooterProps {
  onOpenModal: (type: ModalType) => void;
  onGoHome?: () => void;
}

export function Footer({ onOpenModal }: FooterProps) {
  return (
    <footer className="c-footer">
      <div className="c-footer-inner">
        <div className="c-footer-bottom">
          <p>© 2026 C-checker. All rights reserved.</p>
          <div className="c-footer-legal-inline">
            <button onClick={() => onOpenModal('privacy')}>Chính sách bảo mật</button>
            <span className="c-footer-dot">•</span>
            <button onClick={() => onOpenModal('terms')}>Điều khoản dịch vụ</button>
          </div>
        </div>
      </div>
    </footer>
  );
}

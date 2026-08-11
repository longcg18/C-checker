import React from 'react';
import { ModalType } from './InfoModal';

interface FooterProps {
  onOpenModal: (type: ModalType) => void;
  onGoHome: () => void;
}

export function Footer({ onOpenModal, onGoHome }: FooterProps) {
  return (
    <footer className="c-footer">
      <div className="c-footer-inner">
        <div className="c-footer-grid">
          {/* Col 1: Brand & About */}
          <div className="c-footer-col c-footer-col--brand">
            <div className="c-footer-logo" onClick={onGoHome} style={{ cursor: 'pointer' }}>
              <div className="c-footer-logo-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
              </div>
              <span className="c-footer-logo-title">C-checker</span>
            </div>
            <p className="c-footer-desc">
              Hệ thống rà soát và kiểm tra đạo văn tiếng Trung thông minh đầu tiên tại Việt Nam, ứng dụng AI (MiniLM) và thuật toán phân tích ngữ nghĩa sâu.
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div className="c-footer-col">
            <h4 className="c-footer-heading">Liên kết nhanh</h4>
            <ul className="c-footer-links">
              <li>
                <button onClick={onGoHome}>Trang chủ</button>
              </li>
              <li>
                <button onClick={() => onOpenModal('guide')}>📖 Hướng dẫn sử dụng</button>
              </li>
              <li>
                <button onClick={() => onOpenModal('about')}>ℹ️ Giới thiệu dự án</button>
              </li>
            </ul>
          </div>

          {/* Col 3: Legal & Policy */}
          <div className="c-footer-col">
            <h4 className="c-footer-heading">Chính sách & Pháp lý</h4>
            <ul className="c-footer-links">
              <li>
                <button onClick={() => onOpenModal('privacy')}>🔒 Chính sách bảo mật</button>
              </li>
              <li>
                <button onClick={() => onOpenModal('terms')}>📋 Điều khoản dịch vụ</button>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Support */}
          <div className="c-footer-col">
            <h4 className="c-footer-heading">Liên hệ & Hỗ trợ</h4>
            <ul className="c-footer-links">
              <li>
                <button onClick={() => onOpenModal('contact')}>📫 Hỗ trợ & Góp ý</button>
              </li>
              <li className="c-footer-contact-item">
                <span>✉️ Email: <code>support@c-checker.io.vn</code></span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
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

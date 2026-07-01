import { GoogleLogin } from '@react-oauth/google';
import { api, setToken, removeToken } from '../lib/api';
import { useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  picture: string;
}

interface LoginProps {
  onLogin: (user: User) => void;
  onLogout: () => void;
  currentUser: User | null;
}

export function Login({ onLogin, onLogout, currentUser }: LoginProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  // Local login state
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register state
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPassword2, setRegPassword2] = useState('');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regError, setRegError] = useState('');

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      setLoading(true);
      setError('');
      const data = await api.login(credentialResponse.credential);
      setToken(data.access_token);
      onLogin(data.user);
    } catch (err: any) {
      setError(err.message || 'Đăng nhập Google thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleLocalLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginUsername || !loginPassword) {
      setError('Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu');
      return;
    }
    try {
      setLoading(true);
      setError('');
      const data = await api.loginLocal(loginUsername, loginPassword);
      setToken(data.access_token);
      onLogin(data.user);
    } catch (err: any) {
      const msg = err.message || '';
      const match = msg.match(/"detail"\s*:\s*"([^"]+)"/);
      setError(match ? match[1] : 'Tên đăng nhập hoặc mật khẩu không đúng');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');

    if (!regUsername || !regPassword || !regPassword2) {
      setRegError('Vui lòng điền các trường bắt buộc (*)');
      return;
    }

    if (regUsername.length < 3) {
      setRegError('Tên đăng nhập phải có ít nhất 3 ký tự');
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(regUsername)) {
      setRegError('Tên đăng nhập chỉ gồm chữ cái, số và dấu gạch dưới');
      return;
    }

    if (regPassword.length < 6) {
      setRegError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    if (regPassword !== regPassword2) {
      setRegError('Mật khẩu xác nhận không khớp');
      return;
    }

    if (regEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regEmail)) {
      setRegError('Định dạng email không hợp lệ');
      return;
    }

    try {
      setLoading(true);
      const data = await api.register(
        regUsername,
        regPassword,
        regEmail || undefined,
        regName || undefined
      );
      setToken(data.access_token);
      onLogin(data.user);
      setShowRegisterModal(false);
      // Reset register state
      setRegUsername('');
      setRegPassword('');
      setRegPassword2('');
      setRegName('');
      setRegEmail('');
    } catch (err: any) {
      const msg = err.message || '';
      const match = msg.match(/"detail"\s*:\s*"([^"]+)"/);
      setRegError(match ? match[1] : 'Đăng ký thất bại, vui lòng thử lại');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    removeToken();
    onLogout();
  };

  if (currentUser) {
    return (
      <div className="c-user-profile" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {currentUser.picture ? (
          <img src={currentUser.picture} alt="Profile" style={{ width: 32, height: 32, borderRadius: '50%' }} />
        ) : (
          <div style={{
            width: 32, height: 32, borderRadius: '50%', background: 'var(--c-accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '14px', fontWeight: 700, color: '#fff'
          }}>
            {currentUser.name?.[0]?.toUpperCase() || '?'}
          </div>
        )}
        <span style={{ fontSize: '14px', color: 'var(--c-text)' }}>{currentUser.name}</span>
        <button onClick={handleLogout} className="c-btn c-btn--ghost" style={{ padding: '4px 8px', fontSize: '12px' }}>
          Đăng xuất
        </button>
      </div>
    );
  }

  return (
    <div className="c-auth-panel">
      {error && (
        <div className="c-auth-error">
          <span>⚠ {error}</span>
        </div>
      )}

      <div className="c-auth-content">
        {/* Google login */}
        <div className="c-auth-google">
          {loading ? (
            <span className="c-auth-loading">Đang đăng nhập...</span>
          ) : (
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError('Đăng nhập Google thất bại')}
              useOneTap
            />
          )}
        </div>

        <div className="c-auth-divider"><span>hoặc</span></div>

        {/* Username/password login form */}
        <form className="c-auth-form" onSubmit={handleLocalLogin}>
          <div className="c-auth-field">
            <label className="c-auth-label">Tên đăng nhập</label>
            <input
              className="c-auth-input"
              type="text"
              placeholder="Username"
              value={loginUsername}
              onChange={e => setLoginUsername(e.target.value)}
              disabled={loading}
              autoComplete="username"
            />
          </div>
          <div className="c-auth-field">
            <label className="c-auth-label">Mật khẩu</label>
            <input
              className="c-auth-input"
              type="password"
              placeholder="••••••••"
              value={loginPassword}
              onChange={e => setLoginPassword(e.target.value)}
              disabled={loading}
              autoComplete="current-password"
            />
          </div>
          <button
            className="c-btn c-btn--primary c-auth-submit"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Đang xử lý...' : 'Đăng nhập'}
          </button>
        </form>

        <div className="c-auth-register-link" style={{ marginTop: '16px', textAlign: 'center', fontSize: '13px' }}>
          <span style={{ color: 'var(--c-text-dim)' }}>Chưa có tài khoản? </span>
          <button
            type="button"
            className="c-btn-link"
            style={{
              background: 'none', border: 'none', color: 'var(--c-accent)',
              fontWeight: 600, cursor: 'pointer', padding: 0, font: 'inherit',
              textDecoration: 'underline'
            }}
            onClick={() => { setShowRegisterModal(true); setRegError(''); }}
          >
            Đăng ký ngay
          </button>
        </div>
      </div>

      {/* Register Modal */}
      {showRegisterModal && (
        <div className="c-modal-overlay" onClick={() => setShowRegisterModal(false)}>
          <div className="c-modal-container" onClick={e => e.stopPropagation()}>
            <div className="c-modal-header">
              <h3 className="c-modal-title">Tạo tài khoản mới</h3>
              <button
                type="button"
                className="c-modal-close"
                onClick={() => setShowRegisterModal(false)}
              >
                &times;
              </button>
            </div>
            <div className="c-modal-body">
              {regError && (
                <div className="c-auth-error" style={{ marginBottom: '16px' }}>
                  <span>⚠ {regError}</span>
                </div>
              )}
              <form onSubmit={handleRegister} className="c-auth-form">
                <div className="c-auth-field">
                  <label className="c-auth-label">Tên đăng nhập <span style={{ color: 'var(--c-red)' }}>*</span></label>
                  <input
                    className="c-auth-input"
                    type="text"
                    placeholder="Chỉ dùng chữ, số và gạch dưới"
                    value={regUsername}
                    onChange={e => setRegUsername(e.target.value)}
                    disabled={loading}
                    autoComplete="username"
                  />
                </div>
                
                <div className="c-auth-field">
                  <label className="c-auth-label">Mật khẩu <span style={{ color: 'var(--c-red)' }}>*</span> <span style={{ color: 'var(--c-text-dim)', fontWeight: 400 }}>(tối thiểu 6 ký tự)</span></label>
                  <input
                    className="c-auth-input"
                    type="password"
                    placeholder="••••••••"
                    value={regPassword}
                    onChange={e => setRegPassword(e.target.value)}
                    disabled={loading}
                    autoComplete="new-password"
                  />
                </div>

                <div className="c-auth-field">
                  <label className="c-auth-label">Xác nhận mật khẩu <span style={{ color: 'var(--c-red)' }}>*</span></label>
                  <input
                    className="c-auth-input"
                    type="password"
                    placeholder="••••••••"
                    value={regPassword2}
                    onChange={e => setRegPassword2(e.target.value)}
                    disabled={loading}
                    autoComplete="new-password"
                  />
                </div>

                <div className="c-auth-field">
                  <label className="c-auth-label">Họ tên <span style={{ color: 'var(--c-text-dim)', fontWeight: 400 }}>(tùy chọn)</span></label>
                  <input
                    className="c-auth-input"
                    type="text"
                    placeholder="Nguyễn Văn A"
                    value={regName}
                    onChange={e => setRegName(e.target.value)}
                    disabled={loading}
                    autoComplete="name"
                  />
                </div>

                <div className="c-auth-field">
                  <label className="c-auth-label">Email <span style={{ color: 'var(--c-text-dim)', fontWeight: 400 }}>(tùy chọn)</span></label>
                  <input
                    className="c-auth-input"
                    type="text"
                    placeholder="example@domain.com"
                    value={regEmail}
                    onChange={e => setRegEmail(e.target.value)}
                    disabled={loading}
                    autoComplete="email"
                  />
                </div>

                <button
                  className="c-btn c-btn--primary c-auth-submit"
                  type="submit"
                  disabled={loading}
                  style={{ marginTop: '8px' }}
                >
                  {loading ? 'Đang tạo tài khoản...' : 'Đăng ký tài khoản'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

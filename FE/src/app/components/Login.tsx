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

type AuthTab = 'login' | 'register';

export function Login({ onLogin, onLogout, currentUser }: LoginProps) {
  const [tab, setTab] = useState<AuthTab>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Local login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPassword2, setRegPassword2] = useState('');

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
    if (!loginEmail || !loginPassword) {
      setError('Vui lòng nhập đầy đủ email và mật khẩu');
      return;
    }
    try {
      setLoading(true);
      setError('');
      const data = await api.loginLocal(loginEmail, loginPassword);
      setToken(data.access_token);
      onLogin(data.user);
    } catch (err: any) {
      const msg = err.message || '';
      // Extract detail from "API error 401: {"detail":"..."}"
      const match = msg.match(/"detail"\s*:\s*"([^"]+)"/);
      setError(match ? match[1] : 'Email hoặc mật khẩu không đúng');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regEmail || !regPassword) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }
    if (regPassword !== regPassword2) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }
    if (regPassword.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }
    try {
      setLoading(true);
      setError('');
      const data = await api.register(regEmail, regPassword, regName);
      setToken(data.access_token);
      onLogin(data.user);
    } catch (err: any) {
      const msg = err.message || '';
      const match = msg.match(/"detail"\s*:\s*"([^"]+)"/);
      setError(match ? match[1] : 'Đăng ký thất bại, vui lòng thử lại');
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
      {/* Tab switcher */}
      <div className="c-auth-tabs">
        <button
          className={`c-auth-tab${tab === 'login' ? ' c-auth-tab--active' : ''}`}
          onClick={() => { setTab('login'); setError(''); }}
          type="button"
        >
          Đăng nhập
        </button>
        <button
          className={`c-auth-tab${tab === 'register' ? ' c-auth-tab--active' : ''}`}
          onClick={() => { setTab('register'); setError(''); }}
          type="button"
        >
          Đăng ký
        </button>
      </div>

      {error && (
        <div className="c-auth-error">
          <span>⚠ {error}</span>
        </div>
      )}

      {tab === 'login' && (
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

          {/* Email/password login form */}
          <form className="c-auth-form" onSubmit={handleLocalLogin}>
            <div className="c-auth-field">
              <label className="c-auth-label">Email</label>
              <input
                className="c-auth-input"
                type="email"
                placeholder="your@email.com"
                value={loginEmail}
                onChange={e => setLoginEmail(e.target.value)}
                disabled={loading}
                autoComplete="email"
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
        </div>
      )}

      {tab === 'register' && (
        <div className="c-auth-content">
          <form className="c-auth-form" onSubmit={handleRegister}>
            <div className="c-auth-field">
              <label className="c-auth-label">Họ tên</label>
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
              <label className="c-auth-label">Email</label>
              <input
                className="c-auth-input"
                type="email"
                placeholder="your@email.com"
                value={regEmail}
                onChange={e => setRegEmail(e.target.value)}
                disabled={loading}
                autoComplete="email"
              />
            </div>
            <div className="c-auth-field">
              <label className="c-auth-label">Mật khẩu <span style={{ color: 'var(--c-text-dim)', fontWeight: 400 }}>(ít nhất 6 ký tự)</span></label>
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
              <label className="c-auth-label">Xác nhận mật khẩu</label>
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
            <button
              className="c-btn c-btn--primary c-auth-submit"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

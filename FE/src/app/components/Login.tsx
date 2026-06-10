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

  const handleSuccess = async (credentialResponse: any) => {
    try {
      setLoading(true);
      setError('');
      const data = await api.login(credentialResponse.credential);
      setToken(data.access_token);
      onLogin(data.user);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleError = () => {
    setError('Google Login Failed');
  };

  const handleLogout = () => {
    removeToken();
    onLogout();
  };

  if (currentUser) {
    return (
      <div className="c-user-profile" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {currentUser.picture && (
          <img src={currentUser.picture} alt="Profile" style={{ width: 32, height: 32, borderRadius: '50%' }} />
        )}
        <span style={{ fontSize: '14px', color: 'var(--c-text)' }}>{currentUser.name}</span>
        <button onClick={handleLogout} className="c-btn c-btn--ghost" style={{ padding: '4px 8px', fontSize: '12px' }}>
          Đăng xuất
        </button>
      </div>
    );
  }

  return (
    <div className="c-login-container" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      {loading && <span style={{ fontSize: '12px', color: 'var(--c-text-dim)' }}>Đang đăng nhập...</span>}
      {error && <span style={{ fontSize: '12px', color: 'var(--c-red)' }}>{error}</span>}
      {!loading && (
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={handleError}
          useOneTap
        />
      )}
    </div>
  );
}

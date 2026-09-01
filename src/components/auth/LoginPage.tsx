import { FormEvent, useState } from 'react';
import { useAuth } from './AuthContext';

export const LoginPage = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(username, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login gagal.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-card__header">
          <p className="page-header__eyebrow">Rekap Keuangan</p>
          <h1 className="page-header__title" style={{ fontSize: '22px' }}>Dashboard Keuangan</h1>
          <p className="page-header__subtitle">Masuk untuk melanjutkan</p>
        </div>
        <form className="login-form" onSubmit={handleSubmit} noValidate>
          {error && (
            <div className="inline-alert inline-alert--error" role="alert">
              {error}
            </div>
          )}
          <div className="field">
            <label className="field__label" htmlFor="username">
              Username *
            </label>
            <input
              id="username"
              className="field__input"
              type="text"
              autoComplete="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="field">
            <label className="field__label" htmlFor="password">
              Password *
            </label>
            <input
              id="password"
              className="field__input"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>
          <button
            className="btn btn--primary btn--block"
            type="submit"
            disabled={loading || !username || !password}
          >
            {loading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>
      </div>
    </div>
  );
};

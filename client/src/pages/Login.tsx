import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSnackbar } from '../context/SnackbarContext';
import './Login.css';

/**
 * Login Page Component.
 * Enables user sign in via email/password credentials, validating against server API,
 * and routing successfully logged-in accounts to either AdminDashboard (/admin) or Welcome (/welcome).
 *
 * @author akshatnathani
 * @version 1.0.0
 * @component Login
 */
export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { showSuccess, showError } = useSnackbar();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const success = await login(email, password);
      if (success) {
        showSuccess('Logged in successfully!');
        const role = localStorage.getItem('role');
        navigate(role === 'Admin' ? '/admin' : '/welcome');
      } else {
        showError('Invalid email or password');
        setError('Invalid email or password');
      }
    } catch (err: any) {
      showError(err.message || 'Invalid email or password');
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card animate-fade-in">
        <div className="auth-header">
          <div className="auth-logo">UM</div>
          <h1 className="auth-title">Sign in</h1>
          <p className="auth-subtitle">Enter your credentials to access your account</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="field-group">
            <label className="field-label" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="field-input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div className="field-group">
            <label className="field-label" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="field-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account?{' '}
          <Link to="/signup" className="auth-link">Create one</Link>
        </p>
      </div>
    </div>
  );
}

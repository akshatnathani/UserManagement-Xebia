import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Home } from 'lucide-react';

/**
 * Welcome Page Component.
 * Displays a clean welcome view upon successful login, letting the user
 * navigate to their profile page or sign out of their account.
 *
 * @author akshatnathani
 * @version 1.0.0
 * @component Welcome
 */
export default function Welcome() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="page-wrapper">
      <div className="glass form-container animate-fade-in" style={{ maxWidth: '600px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', padding: '1.5rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '50%', marginBottom: '1.5rem' }}>
          <Home size={48} color="var(--accent-primary)" />
        </div>
        <h1 className="page-title">Welcome</h1>
        <p className="page-subtitle" style={{ marginBottom: '2rem' }}>
          You have successfully logged into your account.
        </p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <button className="btn-primary" onClick={() => navigate('/profile')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            View My Profile
          </button>
          
          <button className="btn-secondary" onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', border: '1px solid var(--border-color)', color: '#f87171' }}>
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}

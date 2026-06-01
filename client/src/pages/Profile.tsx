import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Mail, Phone, Shield, Radio, Activity } from 'lucide-react';
import './Profile.css';

/**
 * Profile Page Component.
 * Displays details of the currently authenticated user (name, username, email, phone, role, status).
 * Shows their uploaded profile picture with CORP resolution, falls back to letter initials if no image is set,
 * and provides responsive back-navigation based on role.
 *
 * @author akshatnathani
 * @version 1.0.0
 * @component Profile
 */
export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const API_URL = 'http://localhost:5000';

  const handleBack = () => {
    if (user?.role === 'Admin') {
      navigate('/admin');
    } else {
      navigate('/welcome');
    }
  };

  const getAvatarSrc = () => {
    if (!user?.profilePicture) return null;
    if (user.profilePicture.startsWith('http')) return user.profilePicture;
    return `${API_URL}${user.profilePicture}`;
  };

  if (!user) {
    return (
      <div className="page-wrapper">
        <div className="loading-state">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="glass profile-container animate-fade-in">
        {/* Back Button */}
        <button className="back-btn" onClick={handleBack} title="Go back">
          <ArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </button>

        {/* Profile Card Header */}
        <div className="profile-header-section">
          <div className="profile-avatar-wrapper">
            {getAvatarSrc() ? (
              <img
                src={getAvatarSrc()!}
                alt={user.name || user.fullName}
                className="profile-avatar-img"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            ) : (
              <div className="profile-avatar-fallback">
                {(user.name || user.fullName || 'U').charAt(0).toUpperCase()}
              </div>
            )}
            <span className={`status-dot status-dot--${user.status?.toLowerCase() || 'active'}`} />
          </div>
          <h1 className="profile-name">{user.name || user.fullName}</h1>
          <p className="profile-username">@{user.username}</p>
          <span className={`role-badge role-badge--${user.role?.toLowerCase()}`}>
            <Shield size={12} style={{ marginRight: '4px' }} />
            {user.role}
          </span>
        </div>

        {/* Profile Details List */}
        <div className="profile-details-grid">
          <div className="detail-item">
            <div className="detail-icon">
              <Mail size={18} />
            </div>
            <div className="detail-info">
              <span className="detail-label">Email Address</span>
              <span className="detail-value">{user.email}</span>
            </div>
          </div>

          <div className="detail-item">
            <div className="detail-icon">
              <Phone size={18} />
            </div>
            <div className="detail-info">
              <span className="detail-label">Phone Number</span>
              <span className="detail-value">{user.phone || user.contact || 'Not provided'}</span>
            </div>
          </div>

          <div className="detail-item">
            <div className="detail-icon">
              <Radio size={18} />
            </div>
            <div className="detail-info">
              <span className="detail-label">Account Status</span>
              <span className={`status-tag status-tag--${user.status?.toLowerCase() || 'active'}`}>
                {user.status || 'Active'}
              </span>
            </div>
          </div>

          <div className="detail-item">
            <div className="detail-icon">
              <Activity size={18} />
            </div>
            <div className="detail-info">
              <span className="detail-label">Joined On</span>
              <span className="detail-value">
                {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                }) : 'June 1, 2026'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

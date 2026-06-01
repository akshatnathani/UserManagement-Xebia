import { useState, useRef } from 'react';
import type { ChangeEvent, FormEvent, DragEvent, MouseEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSnackbar } from '../context/SnackbarContext';
import { X, ImagePlus } from 'lucide-react';
import PhoneInput from '../components/PhoneInput';
import './Login.css';
import './Signup.css';

/**
 * Signup Page Component.
 * Enables new user registration with profile image drag-and-drop/upload zone,
 * standard text inputs, and full international phone field formatting using `<PhoneInput />`.
 *
 * @author akshatnathani
 * @version 1.0.0
 * @component Signup
 */
export default function Signup() {
  const [formData, setFormData] = useState({ name: '', email: '', contact: '', password: '' });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleFile = (file: File) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Only JPEG, PNG, GIF, or WEBP images are allowed.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be smaller than 5 MB.');
      return;
    }
    setError('');
    setProfileImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleDrag = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
  };

  const removeImage = (e: MouseEvent) => {
    e.stopPropagation();
    setProfileImage(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const { showSuccess, showError } = useSnackbar();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const data = new FormData();
    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('phone', formData.contact);
    data.append('password', formData.password);
    if (profileImage) data.append('profilePicture', profileImage);

    try {
      const success = await signup(data);
      if (success) {
        showSuccess('Account created successfully! Please sign in.');
        navigate('/');
      } else {
        showError('Registration failed. Please try again.');
        setError('Registration failed. Please try again.');
      }
    } catch (err: any) {
      showError(err.message || 'Registration failed');
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card signup-card animate-fade-in">
        <div className="auth-header">
          <div className="auth-logo">UM</div>
          <h1 className="auth-title">Create account</h1>
          <p className="auth-subtitle">Fill in your details to get started</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          {/* Profile Picture Upload */}
          <div className="field-group">
            <label className="field-label">Profile Picture <span className="optional-tag">optional</span></label>
            <div
              className={`upload-zone ${dragActive ? 'upload-zone--active' : ''} ${previewUrl ? 'upload-zone--filled' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                style={{ display: 'none' }}
              />
              {previewUrl ? (
                <div className="upload-preview">
                  <img src={previewUrl} alt="Preview" className="upload-preview-img" />
                  <button type="button" className="upload-remove-btn" onClick={removeImage}>
                    <X size={14} />
                  </button>
                  <p className="upload-hint">Click to change</p>
                </div>
              ) : (
                <div className="upload-placeholder">
                  <ImagePlus size={24} className="upload-placeholder-icon" />
                  <p className="upload-main-text"><span className="upload-click-text">Click to upload</span> or drag & drop</p>
                  <p className="upload-sub-text">JPEG, PNG, GIF or WEBP — max 5 MB</p>
                </div>
              )}
            </div>
          </div>

          <div className="field-group">
            <label className="field-label" htmlFor="name">Full Name</label>
            <input id="name" type="text" className="field-input" placeholder="John Doe" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="field-group">
            <label className="field-label" htmlFor="email">Email</label>
            <input id="email" type="email" className="field-input" placeholder="you@example.com" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="field-group">
            <label className="field-label" htmlFor="contact">Phone Number</label>
            <PhoneInput
              id="contact"
              value={formData.contact}
              onChange={(val) => setFormData({ ...formData, contact: val })}
              required
            />
          </div>
          <div className="field-group">
            <label className="field-label" htmlFor="password">Password</label>
            <input id="password" type="password" className="field-input" placeholder="Min. 6 characters" value={formData.password} onChange={handleChange} required minLength={6} />
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?{' '}
          <Link to="/" className="auth-link">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

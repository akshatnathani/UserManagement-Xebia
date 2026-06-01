import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import type { User, Status } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useSnackbar } from '../context/SnackbarContext';
import UserTable from '../components/Table/UserTable';
import { Search, Users, ShieldCheck, UserX, LogOut, UserPlus, X, ImagePlus, User as UserIcon } from 'lucide-react';
import PhoneInput from '../components/PhoneInput';
import './AdminDashboard.css';
import './Login.css';
import './Signup.css';

/**
 * AdminDashboard Page Component.
 * Acts as the administrator hub providing stats cards, listing, search, profile linkage,
 * account status adjustments, deletion actions, and an account creation modal with full drag-and-drop
 * image upload and `<PhoneInput />` validation.
 *
 * @author akshatnathani
 * @version 1.1.0
 * @component AdminDashboard
 */
export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { showSuccess, showError } = useSnackbar();

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', contact: '', password: '', role: 'User' });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [modalError, setModalError] = useState('');
  const [modalLoading, setModalLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleModalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleModalFile = (file: File) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setModalError('Only JPEG, PNG, GIF, or WEBP images are allowed.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setModalError('Image must be smaller than 5 MB.');
      return;
    }
    setModalError('');
    setProfileImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleModalDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleModalDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) handleModalFile(e.dataTransfer.files[0]);
  };

  const removeModalImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setProfileImage(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const resetModal = () => {
    setFormData({ name: '', email: '', contact: '', password: '', role: 'User' });
    setProfileImage(null);
    setPreviewUrl(null);
    setModalError('');
    setModalLoading(false);
    setIsCreateModalOpen(false);
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError('');
    setModalLoading(true);

    const data = new FormData();
    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('phone', formData.contact);
    data.append('password', formData.password);
    data.append('role', formData.role);
    if (profileImage) data.append('profilePicture', profileImage);

    try {
      const result = await api.addUser(data);
      if (result.success) {
        const newUserRaw = result.data;
        const newUserFormatted: User = {
          id: newUserRaw._id,
          fullName: newUserRaw.name,
          email: newUserRaw.email,
          username: newUserRaw.username,
          contact: newUserRaw.phone,
          profilePicture: newUserRaw.profilePicture,
          status: newUserRaw.status,
          role: newUserRaw.role,
          joinedDate: new Date(newUserRaw.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
        };
        setUsers(prev => [newUserFormatted, ...prev]);
        showSuccess('User created successfully!');
        resetModal();
      } else {
        showError('Failed to create user. Please try again.');
        setModalError('Failed to create user. Please try again.');
      }
    } catch (err: any) {
      showError(err.message || 'Failed to create user');
      setModalError(err.message || 'Failed to create user');
    } finally {
      setModalLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await api.getUsers();
      setUsers(data ?? []);
    } catch (err) {
      console.error('Failed to fetch users', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this user? This cannot be undone.')) return;
    try {
      await api.deleteUser(id);
      setUsers(prev => prev.filter(u => u.id !== id));
      showSuccess('User deleted successfully!');
    } catch (err: any) {
      showError(err.message || 'Failed to delete user');
      console.error('Failed to delete user', err);
    }
  };

  const handleStatusChange = async (id: string, status: Status) => {
    try {
      await api.updateUserStatus(id, status);
      setUsers(prev => prev.map(u => u.id === id ? { ...u, status } : u));
      showSuccess(`User status updated to ${status}!`);
    } catch (err: any) {
      showError(err.message || 'Failed to update status');
      console.error('Failed to update status', err);
    }
  };

  const filteredUsers = users.filter(u =>
    u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-wrapper animate-fade-in">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="page-title">User Management</h1>
          <p className="page-subtitle">Manage accounts, roles, and access control</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn-outline" onClick={() => navigate('/profile')}>
            <UserIcon size={15} /> My Profile
          </button>
          <button className="btn-outline" onClick={logout} style={{ border: '1px solid var(--border)', color: '#f87171' }}>
            <LogOut size={15} /> Sign out
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-icon"><Users size={18} /></div>
          <div className="stat-info">
            <h3>Total Users</h3>
            <p>{users.length}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><ShieldCheck size={18} /></div>
          <div className="stat-info">
            <h3>Active</h3>
            <p>{users.filter(u => u.status === 'Active').length}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><UserX size={18} /></div>
          <div className="stat-info">
            <h3>Inactive / Deleted</h3>
            <p>{users.filter(u => u.status !== 'Active').length}</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="controls-bar">
        <div className="search-box">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search users…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="actions-right">
          <span className="pagination-info" style={{ marginRight: '0.75rem' }}>
            {filteredUsers.length} result{filteredUsers.length !== 1 ? 's' : ''}
          </span>
          <button className="btn-primary" onClick={() => setIsCreateModalOpen(true)}>
            <UserPlus size={15} style={{ marginRight: '0.25rem' }} /> Create User
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="table-section">
        {loading ? (
          <div className="loading-state">Loading users…</div>
        ) : (
          <UserTable
            users={filteredUsers}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
          />
        )}
      </div>

      {/* Pagination */}
      <div className="pagination">
        <span className="pagination-info">Showing {filteredUsers.length} of {users.length} users</span>
        <div className="page-controls">
          <button>«</button>
          <button>‹</button>
          <button className="active">1</button>
          <button>›</button>
          <button>»</button>
        </div>
      </div>

      {/* Create User Modal */}
      {isCreateModalOpen && (
        <div className="modal-overlay" onClick={resetModal}>
          <div className="modal-content animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Create New User</h2>
              <button className="modal-close" onClick={resetModal}>
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleModalSubmit}>
              <div className="modal-body">
                {modalError && <div className="alert alert-error">{modalError}</div>}
                
                {/* Profile Picture Upload */}
                <div className="field-group" style={{ marginBottom: '1rem' }}>
                  <label className="field-label">Profile Picture <span className="optional-tag">optional</span></label>
                  <div
                    className={`upload-zone ${dragActive ? 'upload-zone--active' : ''} ${previewUrl ? 'upload-zone--filled' : ''}`}
                    onDragEnter={handleModalDrag}
                    onDragLeave={handleModalDrag}
                    onDragOver={handleModalDrag}
                    onDrop={handleModalDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/gif,image/webp"
                      onChange={(e) => e.target.files?.[0] && handleModalFile(e.target.files[0])}
                      style={{ display: 'none' }}
                    />
                    {previewUrl ? (
                      <div className="upload-preview">
                        <img src={previewUrl} alt="Preview" className="upload-preview-img" />
                        <button type="button" className="upload-remove-btn" onClick={removeModalImage}>
                          <X size={14} />
                        </button>
                        <p className="upload-hint">Click to change</p>
                      </div>
                    ) : (
                      <div className="upload-placeholder">
                        <ImagePlus size={24} className="upload-placeholder-icon" style={{ display: 'block', margin: '0 auto 0.5rem auto' }} />
                        <p className="upload-main-text"><span className="upload-click-text">Click to upload</span> or drag & drop</p>
                        <p className="upload-sub-text">JPEG, PNG, GIF or WEBP — max 5 MB</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="field-group">
                  <label className="field-label" htmlFor="name">Full Name</label>
                  <input
                    id="name"
                    type="text"
                    className="field-input"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleModalChange}
                    required
                  />
                </div>

                <div className="field-group">
                  <label className="field-label" htmlFor="email">Email</label>
                  <input
                    id="email"
                    type="email"
                    className="field-input"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleModalChange}
                    required
                  />
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
                  <input
                    id="password"
                    type="password"
                    className="field-input"
                    placeholder="Min. 6 characters"
                    value={formData.password}
                    onChange={handleModalChange}
                    required
                    minLength={6}
                  />
                </div>

                <div className="field-group">
                  <label className="field-label" htmlFor="role">Role</label>
                  <select
                    id="role"
                    className="field-input"
                    value={formData.role}
                    onChange={handleModalChange}
                    required
                  >
                    <option value="User">Regular User</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-outline" onClick={resetModal}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={modalLoading}>
                  {modalLoading ? 'Creating...' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

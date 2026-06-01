import type { User, Status } from '../../types';
import { Pencil, Trash2, UserCheck, UserX } from 'lucide-react';
import './UserTable.css';

interface UserTableProps {
  users: User[];
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: Status) => void;
}

const STATUSES: Status[] = ['Active', 'Inactive', 'Deleted'];

/**
 * UserTable Component.
 * Renders a structured grid listing users, supporting statuses, custom status overlays,
 * quick edit/delete buttons, and action toggles to activate/deactivate statuses.
 *
 * @author akshatnathani
 * @version 1.1.0
 * @component UserTable
 */
export default function UserTable({ users, onDelete, onStatusChange }: UserTableProps) {
  const API_URL = 'http://localhost:5000';

  const getAvatarSrc = (user: User) => {
    if (!user.profilePicture) return null;
    // If already a full URL, use as-is; otherwise prepend server URL
    if (user.profilePicture.startsWith('http')) return user.profilePicture;
    return `${API_URL}${user.profilePicture}`;
  };

  return (
    <div className="table-container">
      <table className="user-table">
        <thead>
          <tr>
            <th><input type="checkbox" className="custom-checkbox" /></th>
            <th>User</th>
            <th>Email</th>
            <th>Username</th>
            <th>Status</th>
            <th>Role</th>
            <th>Joined</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan={8} style={{ textAlign: 'center', color: 'var(--muted-foreground)', padding: '3rem' }}>
                No users found.
              </td>
            </tr>
          ) : users.map((user) => (
            <tr key={user.id}>
              <td><input type="checkbox" className="custom-checkbox" /></td>
              <td>
                <div className="user-info">
                  <div className="avatar">
                    {getAvatarSrc(user) ? (
                      <img
                        src={getAvatarSrc(user)!}
                        alt={user.fullName}
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                    ) : (
                      <span>{user.fullName.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <span className="user-name">{user.fullName}</span>
                </div>
              </td>
              <td className="text-secondary">{user.email}</td>
              <td className="text-secondary">{user.username}</td>
              <td>
                <div className="status-cell">
                  <span className={`status-badge status-badge--${user.status}`}>
                    {user.status}
                  </span>
                  <select
                    className="status-select-overlay"
                    value={user.status}
                    title="Change status"
                    onChange={(e) => onStatusChange(user.id, e.target.value as Status)}
                  >
                    {STATUSES.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </td>
              <td className="text-secondary">{user.role}</td>
              <td className="text-secondary">{user.joinedDate}</td>
              <td>
                <div className="actions">
                  {user.status === 'Active' ? (
                    <button
                      className="action-btn status-deactivate"
                      title="Deactivate User"
                      onClick={() => onStatusChange(user.id, 'Inactive')}
                    >
                      <UserX size={15} />
                    </button>
                  ) : (
                    <button
                      className="action-btn status-activate"
                      title="Activate User"
                      onClick={() => onStatusChange(user.id, 'Active')}
                    >
                      <UserCheck size={15} />
                    </button>
                  )}
                  <button className="action-btn" title="Edit">
                    <Pencil size={15} />
                  </button>
                  <button className="action-btn delete" title="Delete" onClick={() => onDelete(user.id)}>
                    <Trash2 size={15} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

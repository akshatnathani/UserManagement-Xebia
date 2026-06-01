import type { Status } from '../../types';

/**
 * StatusBadge Component.
 * Displays a color-coded capsule badge representing the account status (Active, Inactive, Deleted).
 *
 * @author akshatnathani
 * @version 1.0.0
 * @component StatusBadge
 */
interface StatusBadgeProps {
  status: Status;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const getBadgeStyle = (status: Status) => {
    switch (status) {
      case 'Active':
        return { backgroundColor: 'var(--status-active-bg)', color: 'var(--status-active-text)' };
      case 'Inactive':
        return { backgroundColor: 'var(--status-inactive-bg)', color: 'var(--status-inactive-text)' };
      case 'Deleted':
        return { backgroundColor: 'var(--status-banned-bg)', color: 'var(--status-banned-text)' };
      default:
        return { backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' };
    }
  };

  return (
    <span style={{
      ...getBadgeStyle(status),
      padding: '0.25rem 0.75rem',
      borderRadius: 'var(--radius-full)',
      fontSize: '0.75rem',
      fontWeight: 600,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      textTransform: 'capitalize'
    }}>
      {status}
    </span>
  );
}

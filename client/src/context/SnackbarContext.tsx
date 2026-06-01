import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { X, CheckCircle, XCircle, Info } from 'lucide-react';
import './Snackbar.css';

export type SnackbarType = 'success' | 'error' | 'info';

interface Snackbar {
  id: string;
  message: string;
  type: SnackbarType;
}

interface SnackbarContextType {
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showInfo: (message: string) => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

/**
 * Snackbar Provider Component.
 * Manages active toast notifications, supplying showSuccess, showError, and showInfo
 * triggers globally and rendering the notification box dynamically.
 *
 * @author akshatnathani
 * @version 1.0.0
 * @component SnackbarProvider
 */
export function SnackbarProvider({ children }: { children: ReactNode }) {
  const [snackbars, setSnackbars] = useState<Snackbar[]>([]);

  const addSnackbar = (message: string, type: SnackbarType) => {
    const id = Math.random().toString(36).substring(2, 9);
    setSnackbars((prev) => [...prev, { id, message, type }]);
  };

  const removeSnackbar = (id: string) => {
    setSnackbars((prev) => prev.filter((s) => s.id !== id));
  };

  const showSuccess = (msg: string) => addSnackbar(msg, 'success');
  const showError = (msg: string) => addSnackbar(msg, 'error');
  const showInfo = (msg: string) => addSnackbar(msg, 'info');

  return (
    <SnackbarContext.Provider value={{ showSuccess, showError, showInfo }}>
      {children}
      
      {/* Toast Notification Container */}
      <div className="snackbar-container">
        {snackbars.map((snack) => (
          <SnackbarItem key={snack.id} snack={snack} onClose={() => removeSnackbar(snack.id)} />
        ))}
      </div>
    </SnackbarContext.Provider>
  );
}

/**
 * Individual Snackbar toast item component.
 * Renders an entry toast block with self-dismiss timers.
 *
 * @author akshatnathani
 * @version 1.0.0
 * @component SnackbarItem
 */
function SnackbarItem({ snack, onClose }: { snack: Snackbar; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const getIcon = () => {
    switch (snack.type) {
      case 'success':
        return <CheckCircle size={18} className="snackbar-icon snackbar-icon--success" />;
      case 'error':
        return <XCircle size={18} className="snackbar-icon snackbar-icon--error" />;
      default:
        return <Info size={18} className="snackbar-icon snackbar-icon--info" />;
    }
  };

  return (
    <div className={`snackbar-item snackbar-item--${snack.type} animate-slide-in`}>
      <div className="snackbar-content">
        {getIcon()}
        <span className="snackbar-message">{snack.message}</span>
      </div>
      <button className="snackbar-close" onClick={onClose} aria-label="Dismiss">
        <X size={14} />
      </button>
    </div>
  );
}

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (context === undefined) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
};

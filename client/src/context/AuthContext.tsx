import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { api } from '../services/api';

interface AuthContextType {
  isAuthenticated: boolean;
  userRole: string | null;
  user: any | null;
  login: (email: string, pass: string) => Promise<boolean>;
  signup: (userData: any) => Promise<boolean>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [user, setUser] = useState<any | null>(null);

  const refreshUser = async () => {
    try {
      const data = await api.getMe();
      setUser(data);
      setUserRole(data.role);
    } catch (error) {
      console.error('Failed to fetch user on load', error);
      logout();
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      refreshUser();
    }
  }, []);

  const login = async (email: string, pass: string) => {
    try {
      const response = await api.login({ email, password: pass });
      if (response.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('role', response.data.role);
        setIsAuthenticated(true);
        setUserRole(response.data.role);
        setUser({
          id: response.data._id,
          fullName: response.data.name,
          email: response.data.email,
          username: response.data.username,
          profilePicture: response.data.profilePicture,
          role: response.data.role,
          status: 'Active'
        });
        return true;
      }
      return false;
    } catch (error: any) {
      console.error(error);
      throw error; // Rethrow to catch in component
    }
  };

  const signup = async (userData: FormData) => {
    try {
      await api.register(userData);
      return true;
    } catch (error: any) {
      console.error(error);
      throw error; // Rethrow to catch in component
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsAuthenticated(false);
    setUserRole(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, user, login, signup, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

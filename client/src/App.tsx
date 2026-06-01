import type { ReactNode } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SnackbarProvider } from './context/SnackbarContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Welcome from './pages/Welcome';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';
import './index.css';

/**
 * Core React Application Router.
 * Configures all application routes, route guard protections (ProtectedRoute),
 * and maps routing states onto views (Login, Signup, Welcome, AdminDashboard, Profile).
 *
 * @author akshatnathani
 * @version 1.1.0
 * @component App
 */

// Protected Route wrapper
function ProtectedRoute({ children, requiredRole }: { children: ReactNode, requiredRole?: string }) {
  const { isAuthenticated, userRole } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/welcome" replace />; // Redirect non-admins to welcome
  }

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route 
        path="/welcome" 
        element={
          <ProtectedRoute>
            <Welcome />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute requiredRole="Admin">
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}

function App() {
  return (
    <SnackbarProvider>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </SnackbarProvider>
  );
}

export default App;

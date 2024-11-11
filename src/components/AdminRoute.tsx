import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAdmin, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return isAdmin() ? <>{children}</> : <Navigate to="/" />;
}
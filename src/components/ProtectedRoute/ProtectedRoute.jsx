// components/ProtectedRoute/ProtectedRoute.jsx
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../../context/userContext/user.context';

export default function ProtectedRoute({ children }) {
  const { user } = useContext(UserContext);
  return user ? children : <Navigate to="/auth/login" replace />;
}
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProtectedRoute({ children }) {
    const { sesion } = useAuth();
    if (!sesion) return <Navigate to="/login" replace />;
    return children;
}

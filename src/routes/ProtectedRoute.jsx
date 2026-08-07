import { Navigate, Outlet } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import useAuth from '../hooks/useAuth';

/**
 * Unica responsabilidad: decidir si se puede entrar a una ruta,
 * segun autenticacion y, opcionalmente, rol permitido.
 */
export default function ProtectedRoute({ rolesPermitidos }) {
  const { usuario, estaAutenticado, cargando } = useAuth();

  if (cargando) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!estaAutenticado) {
    return <Navigate to="/login" replace />;
  }

  if (rolesPermitidos && !rolesPermitidos.includes(usuario.rol)) {
    return <Navigate to="/panel" replace />;
  }

  return <Outlet />;
}

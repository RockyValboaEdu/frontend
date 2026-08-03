import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import ProtectedRoute from './ProtectedRoute';
import LoginPage from '../pages/auth/LoginPage';
import RegistroPage from '../pages/auth/RegistroPage';
import DashboardPage from '../pages/dashboard/DashboardPage';
import VehiculosPage from '../pages/vehiculos/VehiculosPage';
import RutasPage from '../pages/rutas/RutasPage';
import EnviosPage from '../pages/envios/EnviosPage';
import EnvioDetallePage from '../pages/envios/EnvioDetallePage';
import UsuariosPage from '../pages/admin/UsuariosPage';
import ReportesPage from '../pages/admin/ReportesPage';
import RegistrarEnvioPresencialPage from '../pages/mostrador/RegistrarEnvioPresencialPage';
import NotFoundPage from '../pages/NotFoundPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registro" element={<RegistroPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/envios" element={<EnviosPage />} />
          <Route path="/envios/:id" element={<EnvioDetallePage />} />

          <Route element={<ProtectedRoute rolesPermitidos={['ADMIN', 'DESPACHADOR']} />}>
            <Route path="/vehiculos" element={<VehiculosPage />} />
            <Route path="/rutas" element={<RutasPage />} />
          </Route>

          <Route element={<ProtectedRoute rolesPermitidos={['ADMIN', 'RECEPCIONISTA']} />}>
            <Route path="/mostrador" element={<RegistrarEnvioPresencialPage />} />
          </Route>

          <Route element={<ProtectedRoute rolesPermitidos={['ADMIN']} />}>
            <Route path="/usuarios" element={<UsuariosPage />} />
            <Route path="/reportes" element={<ReportesPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}
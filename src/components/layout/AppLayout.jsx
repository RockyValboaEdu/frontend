import { Outlet } from 'react-router-dom';
import { AppBar, Toolbar, Box, Typography, IconButton, Menu, MenuItem, Avatar, Chip } from '@mui/material';
import { useState } from 'react';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import Sidebar, { ANCHO_DRAWER } from './Sidebar';
import useAuth from '../../hooks/useAuth';

const ETIQUETA_ROL = {
  ADMIN: 'Administrador',
  DESPACHADOR: 'Despachador',
  CLIENTE: 'Cliente',
};

export default function AppLayout() {
  const { usuario, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: 'background.default' }}>
      <Sidebar />

      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <AppBar
          position="sticky"
          elevation={0}
          sx={{ backgroundColor: 'background.paper', color: 'text.primary', borderBottom: '1px solid #E4E7EC' }}
        >
          <Toolbar sx={{ justifyContent: 'flex-end', gap: 1.5 }}>
            <Chip
              label={ETIQUETA_ROL[usuario?.rol] || usuario?.rol}
              size="small"
              sx={{ backgroundColor: '#EEF2F7', fontWeight: 600 }}
            />
            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} size="small">
              <Avatar sx={{ width: 34, height: 34, bgcolor: 'secondary.main', fontSize: 14, fontWeight: 700 }}>
                {usuario?.nombre?.charAt(0)?.toUpperCase()}
              </Avatar>
            </IconButton>
            <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={() => setAnchorEl(null)}>
              <Box sx={{ px: 2, py: 1 }}>
                <Typography variant="body2" fontWeight={600}>
                  {usuario?.nombre}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {usuario?.email}
                </Typography>
              </Box>
              <MenuItem onClick={logout} sx={{ gap: 1, color: 'error.main' }}>
                <LogoutRoundedIcon fontSize="small" />
                Cerrar sesión
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>

        <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 4 } }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

export { ANCHO_DRAWER };

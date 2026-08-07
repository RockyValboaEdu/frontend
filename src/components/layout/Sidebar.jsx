import { NavLink } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
  Typography,
} from '@mui/material';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import LocalShippingRoundedIcon from '@mui/icons-material/LocalShippingRounded';
import RouteRoundedIcon from '@mui/icons-material/RouteRounded';
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded';
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded';
import StorefrontRoundedIcon from '@mui/icons-material/StorefrontRounded';
import useAuth from '../../hooks/useAuth';

import MyLocationRoundedIcon from '@mui/icons-material/MyLocationRounded';



const ANCHO_DRAWER = 240;

const ITEMS_MENU = [
  { texto: 'Panel', ruta: '/panel', icono: DashboardRoundedIcon, roles: ['ADMIN', 'DESPACHADOR', 'CLIENTE', 'RECEPCIONISTA'] },
  { texto: 'Mostrador', ruta: '/mostrador', icono: StorefrontRoundedIcon, roles: ['RECEPCIONISTA', 'ADMIN'] },
  { texto: 'Modo conductor', ruta: '/modo-conductor', icono: MyLocationRoundedIcon, roles: ['DESPACHADOR', 'ADMIN'] },
  { texto: 'Vehículos', ruta: '/vehiculos', icono: LocalShippingRoundedIcon, roles: ['ADMIN', 'DESPACHADOR'] },
  { texto: 'Rutas', ruta: '/rutas', icono: RouteRoundedIcon, roles: ['ADMIN', 'DESPACHADOR'] },
  { texto: 'Envíos', ruta: '/envios', icono: Inventory2RoundedIcon, roles: ['ADMIN', 'DESPACHADOR', 'CLIENTE', 'RECEPCIONISTA'] },
  { texto: 'Usuarios', ruta: '/usuarios', icono: GroupRoundedIcon, roles: ['ADMIN'] },
  { texto: 'Reportes', ruta: '/reportes', icono: BarChartRoundedIcon, roles: ['ADMIN'] },
];

export default function Sidebar() {
  const { usuario } = useAuth();
  const itemsVisibles = ITEMS_MENU.filter((item) => item.roles.includes(usuario?.rol));

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: ANCHO_DRAWER,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: ANCHO_DRAWER,
          boxSizing: 'border-box',
          backgroundColor: 'primary.dark',
          color: '#fff',
          borderRight: 'none',
        },
      }}
    >
      <Toolbar sx={{ px: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: 0.3 }}>
          Envíos Express
        </Typography>
      </Toolbar>
      <Box sx={{ mt: 1, px: 1.5 }}>
        <List sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {itemsVisibles.map(({ texto, ruta, icono: Icono }) => (
            <ListItemButton
              key={ruta}
              component={NavLink}
              to={ruta}
              end={ruta === '/panel'}
              sx={{
                borderRadius: 2,
                color: 'rgba(255,255,255,0.75)',
                '&.active': {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  color: '#fff',
                },
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.08)' },
              }}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                <Icono fontSize="small" />
              </ListItemIcon>
              <ListItemText primary={texto} primaryTypographyProps={{ fontWeight: 500, fontSize: 14 }} />
            </ListItemButton>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}

export { ANCHO_DRAWER };
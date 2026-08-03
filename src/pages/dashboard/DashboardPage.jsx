import { useEffect, useState } from 'react';
import { Box, Grid, Paper, Typography, CircularProgress } from '@mui/material';
import LocalShippingRoundedIcon from '@mui/icons-material/LocalShippingRounded';
import RouteRoundedIcon from '@mui/icons-material/RouteRounded';
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import vehiculoService from '../../api/vehiculoService';
import rutaService from '../../api/rutaService';
import envioService from '../../api/envioService';
import useAuth from '../../hooks/useAuth';

export default function DashboardPage() {
  const { usuario } = useAuth();
  const [resumen, setResumen] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
  async function cargar() {
    try {
      if (usuario.rol === 'CLIENTE') {
        const envios = await envioService.listar({ clienteId: usuario.id });
        setResumen({
          envios: envios.length,
          entregados: envios.filter((e) => e.estado === 'ENTREGADO').length,
        });
      } else if (usuario.rol === 'RECEPCIONISTA') {
        const envios = await envioService.listar();
        setResumen({
          envios: envios.length,
          entregados: envios.filter((e) => e.estado === 'ENTREGADO').length,
        });
      } else {
        const [vehiculos, rutas, envios] = await Promise.all([
          vehiculoService.listar(),
          rutaService.listar(),
          envioService.listar(),
        ]);
        setResumen({
          vehiculos: vehiculos.length,
          vehiculosDisponibles: vehiculos.filter((v) => v.estado === 'DISPONIBLE').length,
          rutas: rutas.length,
          rutasEnCurso: rutas.filter((r) => r.estado === 'EN_CURSO').length,
          envios: envios.length,
          entregados: envios.filter((e) => e.estado === 'ENTREGADO').length,
        });
      }
    } catch (err) {
      setResumen({});
    } finally {
      setCargando(false);
    }
  }
  cargar();
}, [usuario]);

  if (cargando) {
    return (
      <Box display="flex" justifyContent="center" p={6}>
        <CircularProgress />
      </Box>
    );
  }

  const tarjetas =
    usuario.rol === 'CLIENTE' || usuario.rol === 'RECEPCIONISTA'
      ? [
          { titulo: usuario.rol === 'CLIENTE' ? 'Mis envíos' : 'Envíos totales', valor: resumen.envios, icono: Inventory2RoundedIcon, color: '#132A4C' },
          { titulo: 'Entregados', valor: resumen.entregados, icono: CheckCircleRoundedIcon, color: '#1E8E5A' },
        ]
      : [
          { titulo: 'Vehículos', valor: resumen.vehiculos, sub: `${resumen.vehiculosDisponibles} disponibles`, icono: LocalShippingRoundedIcon, color: '#132A4C' },
          { titulo: 'Rutas', valor: resumen.rutas, sub: `${resumen.rutasEnCurso} en curso`, icono: RouteRoundedIcon, color: '#2472C8' },
          { titulo: 'Envíos', valor: resumen.envios, sub: `${resumen.entregados} entregados`, icono: Inventory2RoundedIcon, color: '#FF6A3D' },
        ];

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 0.5 }}>
        Hola, {usuario.nombre.split(' ')[0]}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Este es el resumen de tu operación.
      </Typography>

      <Grid container spacing={3}>
        {tarjetas.map(({ titulo, valor, sub, icono: Icono, color }) => (
          <Grid item xs={12} sm={6} md={4} key={titulo}>
            <Paper elevation={0} sx={{ p: 3, border: '1px solid #E4E7EC', display: 'flex', gap: 2 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: `${color}1A`,
                  color,
                  flexShrink: 0,
                }}
              >
                <Icono />
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  {titulo}
                </Typography>
                <Typography variant="h4">{valor}</Typography>
                {sub && (
                  <Typography variant="caption" color="text.secondary">
                    {sub}
                  </Typography>
                )}
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
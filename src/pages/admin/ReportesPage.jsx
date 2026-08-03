import { useEffect, useState } from 'react';
import { Box, Typography, Paper, Grid, CircularProgress } from '@mui/material';
import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import vehiculoService from '../../api/vehiculoService';
import rutaService from '../../api/rutaService';
import envioService from '../../api/envioService';
import usuarioService from '../../api/usuarioService';

const COLORES_ESTADO = {
  // Envíos
  PENDIENTE: '#8C93A0',
  ASIGNADO: '#2472C8',
  EN_RUTA: '#2472C8',
  ENTREGADO: '#1E8E5A',
  FALLIDO: '#D6392E',
  // Vehículos / Rutas
  DISPONIBLE: '#1E8E5A',
  MANTENIMIENTO: '#C77700',
  INACTIVO: '#8C93A0',
  PLANIFICADA: '#8C93A0',
  EN_CURSO: '#2472C8',
  FINALIZADA: '#1E8E5A',
  CANCELADA: '#D6392E',
};
const COLOR_DEFECTO = '#132A4C';

function contarPorCampo(lista, campo) {
  const conteo = {};
  lista.forEach((item) => {
    const clave = item[campo];
    conteo[clave] = (conteo[clave] || 0) + 1;
  });
  return Object.entries(conteo).map(([nombre, valor]) => ({ nombre, valor }));
}

function TarjetaGrafica({ titulo, datos, tipo }) {
  if (datos.length === 0) {
    return (
      <Paper elevation={0} sx={{ p: 3, border: '1px solid #E4E7EC', height: '100%' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>{titulo}</Typography>
        <Typography variant="body2" color="text.secondary">Sin datos suficientes todavía.</Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={0} sx={{ p: 3, border: '1px solid #E4E7EC', height: '100%' }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>{titulo}</Typography>
      <ResponsiveContainer width="100%" height={240}>
        {tipo === 'pie' ? (
          <PieChart>
            <Pie data={datos} dataKey="valor" nameKey="nombre" cx="50%" cy="50%" outerRadius={80} label>
              {datos.map((entrada) => (
                <Cell key={entrada.nombre} fill={COLORES_ESTADO[entrada.nombre] || COLOR_DEFECTO} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        ) : (
          <BarChart data={datos}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="nombre" tick={{ fontSize: 12 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="valor" radius={[4, 4, 0, 0]}>
              {datos.map((entrada) => (
                <Cell key={entrada.nombre} fill={COLORES_ESTADO[entrada.nombre] || COLOR_DEFECTO} />
              ))}
            </Bar>
          </BarChart>
        )}
      </ResponsiveContainer>
    </Paper>
  );
}

export default function ReportesPage() {
  const [cargando, setCargando] = useState(true);
  const [datos, setDatos] = useState(null);

  useEffect(() => {
    async function cargar() {
      const [vehiculos, rutas, envios, usuarios] = await Promise.all([
        vehiculoService.listar(),
        rutaService.listar(),
        envioService.listar(),
        usuarioService.listar(),
      ]);
      setDatos({
        enviosPorEstado: contarPorCampo(envios, 'estado'),
        rutasPorEstado: contarPorCampo(rutas, 'estado'),
        vehiculosPorEstado: contarPorCampo(vehiculos, 'estado'),
        usuariosPorRol: contarPorCampo(usuarios, 'rol'),
      });
      setCargando(false);
    }
    cargar();
  }, []);

  if (cargando) {
    return (
      <Box display="flex" justifyContent="center" p={6}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 0.5 }}>Reportes</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Vista general de la operación, visible solo para administradores.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TarjetaGrafica titulo="Envíos por estado" datos={datos.enviosPorEstado} tipo="pie" />
        </Grid>
        <Grid item xs={12} md={6}>
          <TarjetaGrafica titulo="Rutas por estado" datos={datos.rutasPorEstado} tipo="pie" />
        </Grid>
        <Grid item xs={12} md={6}>
          <TarjetaGrafica titulo="Vehículos por estado" datos={datos.vehiculosPorEstado} tipo="bar" />
        </Grid>
        <Grid item xs={12} md={6}>
          <TarjetaGrafica titulo="Usuarios por rol" datos={datos.usuariosPorRol} tipo="bar" />
        </Grid>
      </Grid>
    </Box>
  );
}

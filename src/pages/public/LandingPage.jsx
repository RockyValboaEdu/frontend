import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  Stack,
  Alert,
  Chip,
  Divider,
} from '@mui/material';
import LocalShippingRoundedIcon from '@mui/icons-material/LocalShippingRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import RouteRoundedIcon from '@mui/icons-material/RouteRounded';
import BoltRoundedIcon from '@mui/icons-material/BoltRounded';
import ShieldRoundedIcon from '@mui/icons-material/ShieldRounded';
import envioService from '../../api/envioService';
import EstadoChip from '../../components/common/EstadoChip';
import extraerMensajeError from '../../utils/extraerMensajeError';

export default function LandingPage() {
  const [codigo, setCodigo] = useState('');
  const [buscando, setBuscando] = useState(false);
  const [error, setError] = useState('');
  const [envio, setEnvio] = useState(null);

  const buscar = async (e) => {
    e.preventDefault();
    if (!codigo.trim()) return;
    setError('');
    setEnvio(null);
    setBuscando(true);
    try {
      const encontrado = await envioService.obtenerPorCodigo(codigo.trim());
      setEnvio(encontrado);
    } catch (err) {
      setError(extraerMensajeError(err, 'No encontramos ningún envío con ese código.'));
    } finally {
      setBuscando(false);
    }
  };

  return (
    <Box>
      {/* Barra superior */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: { xs: 3, md: 6 },
          py: 2.5,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <LocalShippingRoundedIcon color="secondary" />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Envíos Express
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1.5}>
          <Button component={RouterLink} to="/login">
            Iniciar sesión
          </Button>
          <Button component={RouterLink} to="/registro" variant="contained" color="secondary">
            Crear cuenta
          </Button>
        </Stack>
      </Box>

      {/* Hero + buscador */}
      <Box
        sx={{
          background: 'linear-gradient(160deg, #0B1B33 0%, #132A4C 60%, #1B3B66 100%)',
          color: '#fff',
          px: { xs: 3, md: 6 },
          py: { xs: 6, md: 10 },
        }}
      >
        <Box sx={{ maxWidth: 640, mx: 'auto', textAlign: 'center' }}>
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
            Cada envío, en su ruta correcta.
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.75)', mb: 4 }}>
            Rastrea tu encomienda en tiempo real con solo tu código de guía, sin necesidad de crear
            una cuenta.
          </Typography>

          <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
            <Box component="form" onSubmit={buscar} sx={{ display: 'flex', gap: 1 }}>
              <TextField
                placeholder="Ej. EE-1785508571349"
                fullWidth
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
              />
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                startIcon={<SearchRoundedIcon />}
                disabled={buscando || !codigo.trim()}
              >
                {buscando ? 'Buscando...' : 'Rastrear'}
              </Button>
            </Box>

            {error && (
              <Alert severity="warning" sx={{ mt: 2, textAlign: 'left' }}>
                {error}
              </Alert>
            )}

            {envio && (
              <Box sx={{ mt: 3, textAlign: 'left' }}>
                <Divider sx={{ mb: 2 }} />
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                  <Typography variant="subtitle1" sx={{ fontFamily: '"IBM Plex Mono", monospace' }}>
                    {envio.codigoSeguimiento}
                  </Typography>
                  <EstadoChip estado={envio.estado} />
                </Stack>
                <InfoLinea etiqueta="Destinatario" valor={envio.destinatarioNombre || '—'} />
                <InfoLinea etiqueta="Dirección de entrega" valor={envio.direccionEntrega} />
              </Box>
            )}
          </Paper>
        </Box>
      </Box>

      {/* Características */}
      <Box sx={{ px: { xs: 3, md: 6 }, py: { xs: 6, md: 8 } }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ maxWidth: 960, mx: 'auto' }}>
          <Caracteristica
            icono={<RouteRoundedIcon />}
            titulo="Rutas optimizadas"
            texto="Planificación y asignación de vehículos centralizada para toda la operación."
          />
          <Caracteristica
            icono={<BoltRoundedIcon />}
            titulo="Seguimiento en vivo"
            texto="Ubicación y estado del envío actualizados en tiempo real, sin recargar la página."
          />
          <Caracteristica
            icono={<ShieldRoundedIcon />}
            titulo="Acceso por roles"
            texto="Cada persona ve solo lo que necesita: cliente, despachador, recepcionista o administrador."
          />
        </Stack>
      </Box>

      <Chip
        label={`© ${new Date().getFullYear()} Envíos Express`}
        variant="outlined"
        sx={{ display: 'block', mx: 'auto', mb: 4, width: 'fit-content' }}
      />
    </Box>
  );
}

function InfoLinea({ etiqueta, valor }) {
  return (
    <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
      <Typography variant="body2" color="text.secondary">
        {etiqueta}
      </Typography>
      <Typography variant="body2" fontWeight={500}>
        {valor}
      </Typography>
    </Stack>
  );
}

function Caracteristica({ icono, titulo, texto }) {
  return (
    <Paper elevation={0} sx={{ p: 3, border: '1px solid #E4E7EC', flex: 1 }}>
      <Box sx={{ color: 'secondary.main', mb: 1.5 }}>{icono}</Box>
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
        {titulo}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {texto}
      </Typography>
    </Paper>
  );
}
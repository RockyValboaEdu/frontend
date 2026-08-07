import { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  MenuItem,
  Button,
  Stack,
  Alert,
  Chip,
  CircularProgress,
} from '@mui/material';
import MyLocationRoundedIcon from '@mui/icons-material/MyLocationRounded';
import StopCircleRoundedIcon from '@mui/icons-material/StopCircleRounded';
import envioService from '../../api/envioService';
import useMiUbicacion from '../../hooks/useMiUbicacion';
import extraerMensajeError from '../../utils/extraerMensajeError';

const ESTADOS_EN_CURSO = ['ASIGNADO', 'EN_RUTA'];

export default function ModoConductorPage() {
  const [envios, setEnvios] = useState([]);
  const [envioId, setEnvioId] = useState('');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [ultimoEnvioOk, setUltimoEnvioOk] = useState(null);

  const { activo, ubicacion, error: errorGps, iniciar, detener } = useMiUbicacion();

  useEffect(() => {
    async function cargar() {
      const todos = await envioService.listar();
      setEnvios(todos.filter((e) => ESTADOS_EN_CURSO.includes(e.estado)));
      setCargando(false);
    }
    cargar();
  }, []);

  // Cada vez que llega una posición nueva del GPS del teléfono se envia al backend
  useEffect(() => {
    if (!activo || !ubicacion || !envioId) return;

    envioService
      .registrarSeguimiento({
        envioId: Number(envioId),
        latitud: ubicacion.lat,
        longitud: ubicacion.lng,
      })
      .then(() => setUltimoEnvioOk(new Date()))
      .catch((err) => setError(extraerMensajeError(err, 'No se pudo enviar la ubicación.')));
  }, [ubicacion, activo, envioId]);

  const alternarTransmision = () => {
    if (activo) {
      detener();
    } else {
      setError('');
      iniciar();
    }
  };

  if (cargando) {
    return (
      <Box display="flex" justifyContent="center" p={6}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 480 }}>
      <Typography variant="h4" sx={{ mb: 0.5 }}>
        Modo conductor
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Usa tu celular como GPS del vehículo mientras haces la entrega.
      </Typography>

      <Paper elevation={0} sx={{ p: 3, border: '1px solid #E4E7EC' }}>
        <Stack spacing={2}>
          <TextField
            select
            label="Envío que estás transportando"
            value={envioId}
            onChange={(e) => setEnvioId(e.target.value)}
            disabled={activo}
            fullWidth
          >
            {envios.length === 0 && (
              <MenuItem value="" disabled>
                No hay envíos asignados o en ruta
              </MenuItem>
            )}
            {envios.map((e) => (
              <MenuItem key={e.id} value={e.id}>
                {e.codigoSeguimiento} — {e.destinatarioNombre || e.direccionEntrega}
              </MenuItem>
            ))}
          </TextField>

          {(error || errorGps) && <Alert severity="error">{error || errorGps}</Alert>}

          {activo && (
            <Alert severity="success" icon={<MyLocationRoundedIcon fontSize="small" />}>
              Transmitiendo ubicación en vivo
              {ultimoEnvioOk && (
                <Chip
                  label={`Último envío: ${ultimoEnvioOk.toLocaleTimeString('es-CO')}`}
                  size="small"
                  sx={{ ml: 1 }}
                />
              )}
            </Alert>
          )}

          <Button
            variant="contained"
            color={activo ? 'error' : 'secondary'}
            startIcon={activo ? <StopCircleRoundedIcon /> : <MyLocationRoundedIcon />}
            onClick={alternarTransmision}
            disabled={!envioId && !activo}
            fullWidth
          >
            {activo ? 'Detener transmisión' : 'Empezar a compartir mi ubicación'}
          </Button>

          <Typography variant="caption" color="text.secondary">
            Mantén esta pantalla abierta mientras conduces. Al llegar, detén la transmisión y
            actualiza el estado del envío a "Entregado" desde la vista de detalle.
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
}
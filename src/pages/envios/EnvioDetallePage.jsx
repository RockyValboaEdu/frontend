import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Stack,
  Chip,
  Divider,
  CircularProgress,
  Button,
  TextField,
  MenuItem,
  Alert,
} from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import CircleRoundedIcon from '@mui/icons-material/CircleRounded';
import FiberManualRecordRoundedIcon from '@mui/icons-material/FiberManualRecordRounded';
import envioService from '../../api/envioService';
import EstadoChip from '../../components/common/EstadoChip';
import useSeguimiento from '../../hooks/useSeguimiento';
import useAuth from '../../hooks/useAuth';
import extraerMensajeError from '../../utils/extraerMensajeError';

import MapaSeguimiento from '../../components/common/MapaSeguimiento';

const ESTADOS_SIGUIENTES = ['ASIGNADO', 'EN_RUTA', 'ENTREGADO', 'FALLIDO'];

export default function EnvioDetallePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const [envio, setEnvio] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [nuevoEstado, setNuevoEstado] = useState('');
  const [comentario, setComentario] = useState('');
  const [enviandoEvento, setEnviandoEvento] = useState(false);
  const [error, setError] = useState('');

  const puedeActualizar = usuario.rol === 'ADMIN' || usuario.rol === 'DESPACHADOR';

  // Se conecta por WebSocket al topico de este envio en particular
  const eventoEnVivo = useSeguimiento(id);

  const ultimaUbicacion =
    eventoEnVivo?.latitud != null
      ? eventoEnVivo
      : [...historial].reverse().find((e) => e.latitud != null);

  const cargarDatos = async () => {
    const [datosEnvio, datosHistorial] = await Promise.all([
      envioService.obtenerPorId(id),
      envioService.historial(id),
    ]);
    setEnvio(datosEnvio);
    setHistorial(datosHistorial);
    setCargando(false);
  };

  useEffect(() => {
    cargarDatos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Cuando llega un evento nuevo por WebSocket, lo agregamos al historial al vuelo
  useEffect(() => {
    if (!eventoEnVivo) return;
    setHistorial((prev) => [...prev, eventoEnVivo]);
    setEnvio((prev) => (prev ? { ...prev, estado: eventoEnVivo.estado } : prev));
  }, [eventoEnVivo]);

  const registrarEvento = async () => {
    if (!nuevoEstado) return;
    setError('');
    setEnviandoEvento(true);
    try {
      await envioService.registrarSeguimiento({
        envioId: Number(id),
        estado: nuevoEstado,
        comentario: comentario || null,
      });
      setNuevoEstado('');
      setComentario('');
      // No hace falta recargar el historial manualmente: llega por WebSocket
    } catch (err) {
      setError(extraerMensajeError(err, 'No se pudo registrar la actualización.'));
    } finally {
      setEnviandoEvento(false);
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
    <Box>
      <Button startIcon={<ArrowBackRoundedIcon />} onClick={() => navigate('/envios')} sx={{ mb: 2 }}>
        Volver a envíos
      </Button>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
        {/* Informacion del envio */}
        <Paper elevation={0} sx={{ p: 3, border: '1px solid #E4E7EC', flex: 1 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
            <Box>
              <Typography variant="overline" color="text.secondary">
                Código de seguimiento
              </Typography>
              <Typography variant="h5" sx={{ fontFamily: '"IBM Plex Mono", monospace' }}>
                {envio.codigoSeguimiento}
              </Typography>
            </Box>
            <EstadoChip estado={envio.estado} size="medium" />
          </Stack>

          <Divider sx={{ my: 2 }} />

          <Stack spacing={1.5}>
            <InfoLinea etiqueta="Destinatario" valor={envio.destinatarioNombre || '—'} />
            <InfoLinea etiqueta="Teléfono" valor={envio.destinatarioTelefono || '—'} />
            <InfoLinea etiqueta="Dirección de entrega" valor={envio.direccionEntrega} />
            <InfoLinea etiqueta="Peso" valor={envio.pesoKg ? `${envio.pesoKg} kg` : '—'} />
          </Stack>

          {puedeActualizar && (
            <>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
                Registrar actualización
              </Typography>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
              <Stack spacing={1.5}>
                <TextField
                  select
                  label="Nuevo estado"
                  size="small"
                  value={nuevoEstado}
                  onChange={(e) => setNuevoEstado(e.target.value)}
                  fullWidth
                >
                  {ESTADOS_SIGUIENTES.map((estado) => (
                    <MenuItem key={estado} value={estado}>
                      {estado.replace('_', ' ')}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  label="Comentario (opcional)"
                  size="small"
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                  fullWidth
                />
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={registrarEvento}
                  disabled={!nuevoEstado || enviandoEvento}
                >
                  {enviandoEvento ? 'Enviando...' : 'Actualizar seguimiento'}
                </Button>
              </Stack>
            </>
          )}
        </Paper>

        {/* Linea de tiempo de seguimiento, en vivo */}
        <Paper elevation={0} sx={{ p: 3, border: '1px solid #E4E7EC', flex: 1 }}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
            <Typography variant="h6">Trazabilidad</Typography>
            <Chip
              icon={<CircleRoundedIcon sx={{ fontSize: '10px !important' }} />}
              label="En vivo"
              size="small"
              color="success"
              variant="outlined"
            />
          </Stack>

          <Paper elevation={0} sx={{ p: 3, border: '1px solid #E4E7EC', flex: 1 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Ubicación en el mapa
            </Typography>
            <MapaSeguimiento
              latitud={ultimaUbicacion?.latitud}
              longitud={ultimaUbicacion?.longitud}
              etiqueta={envio.codigoSeguimiento}
            />
          </Paper>

          {historial.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              Todavía no hay eventos de seguimiento para este envío.
            </Typography>
          ) : (
            <Stack spacing={0}>
              {[...historial].reverse().map((evento, i) => (
                <Box key={`${evento.timestamp}-${i}`} sx={{ display: 'flex', gap: 1.5 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <FiberManualRecordRoundedIcon
                      sx={{ fontSize: 14, color: i === 0 ? 'secondary.main' : '#C7CDD6', mt: 0.5 }}
                    />
                    {i < historial.length - 1 && <Box sx={{ width: '2px', flex: 1, backgroundColor: '#E4E7EC' }} />}
                  </Box>
                  <Box sx={{ pb: 3 }}>
                    <Typography variant="body2" fontWeight={600}>
                      {evento.estado?.replace('_', ' ')}
                    </Typography>
                    {evento.comentario && (
                      <Typography variant="body2" color="text.secondary">
                        {evento.comentario}
                      </Typography>
                    )}
                    <Typography variant="caption" color="text.secondary">
                      {new Date(evento.timestamp).toLocaleString('es-CO')}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Stack>
          )}
        </Paper>
      </Stack>
    </Box>
  );
}

function InfoLinea({ etiqueta, valor }) {
  return (
    <Stack direction="row" justifyContent="space-between">
      <Typography variant="body2" color="text.secondary">
        {etiqueta}
      </Typography>
      <Typography variant="body2" fontWeight={500}>
        {valor}
      </Typography>
    </Stack>
  );
}

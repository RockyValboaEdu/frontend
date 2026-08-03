import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Stack,
  Alert,
  CircularProgress,
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import rutaService from '../../api/rutaService';
import vehiculoService from '../../api/vehiculoService';
import EstadoChip from '../../components/common/EstadoChip';
import useAuth from '../../hooks/useAuth';
import extraerMensajeError from '../../utils/extraerMensajeError';

const RUTA_VACIA = { nombre: '', origen: '', destino: '', vehiculoId: '' };

export default function RutasPage() {
  const { usuario } = useAuth();
  const [rutas, setRutas] = useState([]);
  const [vehiculosDisponibles, setVehiculosDisponibles] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [dialogoAbierto, setDialogoAbierto] = useState(false);
  const [form, setForm] = useState(RUTA_VACIA);
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);

  const cargarDatos = async () => {
    setCargando(true);
    const [listaRutas, listaVehiculos] = await Promise.all([
      rutaService.listar(),
      vehiculoService.listar('DISPONIBLE'),
    ]);
    setRutas(listaRutas);
    setVehiculosDisponibles(listaVehiculos);
    setCargando(false);
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const abrirDialogo = () => {
    setForm(RUTA_VACIA);
    setError('');
    setDialogoAbierto(true);
  };

  const guardar = async () => {
    setError('');
    setGuardando(true);
    try {
      await rutaService.crear({
        ...form,
        vehiculoId: form.vehiculoId || null,
        despachadorId: usuario.id,
      });
      setDialogoAbierto(false);
      await cargarDatos();
    } catch (err) {
      setError(extraerMensajeError(err, 'No se pudo crear la ruta.'));
    } finally {
      setGuardando(false);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4">Rutas</Typography>
          <Typography variant="body2" color="text.secondary">
            Planificación de recorridos y asignación de vehículos.
          </Typography>
        </Box>
        <Button variant="contained" color="secondary" startIcon={<AddRoundedIcon />} onClick={abrirDialogo}>
          Nueva ruta
        </Button>
      </Box>

      <Paper elevation={0} sx={{ border: '1px solid #E4E7EC' }}>
        {cargando ? (
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress />
          </Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Origen → Destino</TableCell>
                <TableCell>Vehículo</TableCell>
                <TableCell>Despachador</TableCell>
                <TableCell>Envíos</TableCell>
                <TableCell>Estado</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rutas.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>{r.nombre}</TableCell>
                  <TableCell>
                    {r.origen} → {r.destino}
                  </TableCell>
                  <TableCell sx={{ fontFamily: '"IBM Plex Mono", monospace' }}>{r.vehiculoPlaca || '—'}</TableCell>
                  <TableCell>{r.despachadorNombre}</TableCell>
                  <TableCell>{r.enviosIds?.length || 0}</TableCell>
                  <TableCell>
                    <EstadoChip estado={r.estado} />
                  </TableCell>
                </TableRow>
              ))}
              {rutas.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                    Aún no hay rutas creadas.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </Paper>

      <Dialog open={dialogoAbierto} onClose={() => setDialogoAbierto(false)} fullWidth maxWidth="xs">
        <DialogTitle>Nueva ruta</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Nombre de la ruta"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              fullWidth
              autoFocus
            />
            <TextField
              label="Origen"
              value={form.origen}
              onChange={(e) => setForm({ ...form, origen: e.target.value })}
              fullWidth
            />
            <TextField
              label="Destino"
              value={form.destino}
              onChange={(e) => setForm({ ...form, destino: e.target.value })}
              fullWidth
            />
            <TextField
              select
              label="Vehículo (opcional)"
              value={form.vehiculoId}
              onChange={(e) => setForm({ ...form, vehiculoId: e.target.value })}
              fullWidth
            >
              <MenuItem value="">Sin asignar aún</MenuItem>
              {vehiculosDisponibles.map((v) => (
                <MenuItem key={v.id} value={v.id}>
                  {v.placa} — {v.tipo}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDialogoAbierto(false)}>Cancelar</Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={guardar}
            disabled={guardando || !form.nombre || !form.origen || !form.destino}
          >
            {guardando ? 'Guardando...' : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

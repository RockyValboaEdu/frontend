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
  Stack,
  Alert,
  CircularProgress,
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import vehiculoService from '../../api/vehiculoService';
import EstadoChip from '../../components/common/EstadoChip';
import extraerMensajeError from '../../utils/extraerMensajeError';

const VEHICULO_VACIO = { placa: '', tipo: '', capacidadKg: '' };

export default function VehiculosPage() {
  const [vehiculos, setVehiculos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [dialogoAbierto, setDialogoAbierto] = useState(false);
  const [form, setForm] = useState(VEHICULO_VACIO);
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);

  const cargarVehiculos = async () => {
    setCargando(true);
    const data = await vehiculoService.listar();
    setVehiculos(data);
    setCargando(false);
  };

  useEffect(() => {
    cargarVehiculos();
  }, []);

  const abrirDialogo = () => {
    setForm(VEHICULO_VACIO);
    setError('');
    setDialogoAbierto(true);
  };

  const guardar = async () => {
    setError('');
    setGuardando(true);
    try {
      await vehiculoService.crear({ ...form, capacidadKg: Number(form.capacidadKg) || null });
      setDialogoAbierto(false);
      await cargarVehiculos();
    } catch (err) {
      setError(extraerMensajeError(err, 'No se pudo crear el vehículo.'));
    } finally {
      setGuardando(false);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4">Vehículos</Typography>
          <Typography variant="body2" color="text.secondary">
            Flota disponible para asignar a rutas.
          </Typography>
        </Box>
        <Button variant="contained" color="secondary" startIcon={<AddRoundedIcon />} onClick={abrirDialogo}>
          Nuevo vehículo
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
                <TableCell>Placa</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Capacidad</TableCell>
                <TableCell>Conductor</TableCell>
                <TableCell>Estado</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {vehiculos.map((v) => (
                <TableRow key={v.id}>
                  <TableCell sx={{ fontFamily: '"IBM Plex Mono", monospace', fontWeight: 600 }}>{v.placa}</TableCell>
                  <TableCell>{v.tipo}</TableCell>
                  <TableCell>{v.capacidadKg ? `${v.capacidadKg} kg` : '—'}</TableCell>
                  <TableCell>{v.conductorNombre || '—'}</TableCell>
                  <TableCell>
                    <EstadoChip estado={v.estado} />
                  </TableCell>
                </TableRow>
              ))}
              {vehiculos.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                    Aún no hay vehículos registrados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </Paper>

      <Dialog open={dialogoAbierto} onClose={() => setDialogoAbierto(false)} fullWidth maxWidth="xs">
        <DialogTitle>Nuevo vehículo</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Placa"
              value={form.placa}
              onChange={(e) => setForm({ ...form, placa: e.target.value })}
              fullWidth
              autoFocus
            />
            <TextField
              label="Tipo (moto, camioneta, camión...)"
              value={form.tipo}
              onChange={(e) => setForm({ ...form, tipo: e.target.value })}
              fullWidth
            />
            <TextField
              label="Capacidad (kg)"
              type="number"
              value={form.capacidadKg}
              onChange={(e) => setForm({ ...form, capacidadKg: e.target.value })}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDialogoAbierto(false)}>Cancelar</Button>
          <Button variant="contained" color="secondary" onClick={guardar} disabled={guardando || !form.placa || !form.tipo}>
            {guardando ? 'Guardando...' : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

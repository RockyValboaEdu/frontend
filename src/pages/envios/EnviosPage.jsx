import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Grid,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import envioService from '../../api/envioService';
import usuarioService from '../../api/usuarioService';
import EstadoChip from '../../components/common/EstadoChip';
import useAuth from '../../hooks/useAuth';
import extraerMensajeError from '../../utils/extraerMensajeError';

const ENVIO_VACIO = { direccionEntrega: '', destinatarioNombre: '', destinatarioTelefono: '', pesoKg: '' };

export default function EnviosPage() {
  const { usuario } = useAuth();
  const navigate = useNavigate();1
  const [envios, setEnvios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [dialogoAbierto, setDialogoAbierto] = useState(false);
  const [form, setForm] = useState(ENVIO_VACIO);
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);

  const esCliente = usuario.rol === 'CLIENTE';
  const puedeBuscarPorCorreo = ['ADMIN', 'RECEPCIONISTA', 'DESPACHADOR'].includes(usuario.rol);

  // --- Búsqueda ---
  const [codigoBusqueda, setCodigoBusqueda] = useState('');
  const [emailBusqueda, setEmailBusqueda] = useState('');
  const [buscandoCodigo, setBuscandoCodigo] = useState(false);
  const [buscandoEmail, setBuscandoEmail] = useState(false);
  const [errorBusqueda, setErrorBusqueda] = useState('');
  const [busquedaActiva, setBusquedaActiva] = useState(null); // null | 'codigo' | 'email'

  const cargarEnvios = async () => {
    setCargando(true);
    const filtros = esCliente ? { clienteId: usuario.id } : {};
    const data = await envioService.listar(filtros);
    setEnvios(data);
    setCargando(false);
  };

  useEffect(() => {
    cargarEnvios();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const limpiarBusqueda = async () => {
    setBusquedaActiva(null);
    setErrorBusqueda('');
    setCodigoBusqueda('');
    setEmailBusqueda('');
    await cargarEnvios();
  };

  const buscarPorCodigo = async (e) => {
    e.preventDefault();
    if (!codigoBusqueda.trim()) return;
    setErrorBusqueda('');
    setBuscandoCodigo(true);
    try {
      const envio = await envioService.obtenerPorCodigo(codigoBusqueda.trim());
      setEnvios([envio]);
      setBusquedaActiva('codigo');
    } catch (err) {
      setErrorBusqueda(extraerMensajeError(err, 'No se encontró ningún envío con ese código.'));
    } finally {
      setBuscandoCodigo(false);
    }
  };

  const buscarPorCorreo = async (e) => {
    e.preventDefault();
    if (!emailBusqueda.trim()) return;
    setErrorBusqueda('');
    setBuscandoEmail(true);
    try {
      const cliente = await usuarioService.buscarPorEmail(emailBusqueda.trim());
      const data = await envioService.listar({ clienteId: cliente.id });
      setEnvios(data);
      setBusquedaActiva('email');
    } catch (err) {
      setErrorBusqueda(extraerMensajeError(err, 'No se encontró ningún cliente con ese correo.'));
    } finally {
      setBuscandoEmail(false);
    }
  };

  const abrirDialogo = () => {
    setForm(ENVIO_VACIO);
    setError('');
    setDialogoAbierto(true);
  };

  const guardar = async () => {
    setError('');
    setGuardando(true);
    try {
      await envioService.crear({
        ...form,
        clienteId: usuario.id,
        pesoKg: Number(form.pesoKg) || null,
      });
      setDialogoAbierto(false);
      await cargarEnvios();
    } catch (err) {
      setError(extraerMensajeError(err, 'No se pudo crear el envío.'));
    } finally {
      setGuardando(false);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4">Envíos</Typography>
          <Typography variant="body2" color="text.secondary">
            {esCliente ? 'Tus encomiendas y su estado actual.' : 'Todas las encomiendas registradas.'}
          </Typography>
        </Box>
        {esCliente && (
          <Button variant="contained" color="secondary" startIcon={<AddRoundedIcon />} onClick={abrirDialogo}>
            Nuevo envío
          </Button>
        )}
      </Box>

      {/* Barra de búsqueda */}
      <Paper elevation={0} sx={{ p: 3, border: '1px solid #E4E7EC', mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={puedeBuscarPorCorreo ? 6 : 12}>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
              Buscar por código de guía
            </Typography>
            <Box component="form" onSubmit={buscarPorCodigo} sx={{ display: 'flex', gap: 1 }}>
              <TextField
                placeholder="EE-1785508571349"
                size="small"
                fullWidth
                value={codigoBusqueda}
                onChange={(e) => setCodigoBusqueda(e.target.value)}
              />
              <Button
                type="submit"
                variant="outlined"
                startIcon={<SearchRoundedIcon />}
                disabled={buscandoCodigo || !codigoBusqueda.trim()}
              >
                {buscandoCodigo ? 'Buscando...' : 'Buscar'}
              </Button>
            </Box>
          </Grid>

          {puedeBuscarPorCorreo && (
            <Grid item xs={12} md={6}>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
                Buscar por correo del cliente
              </Typography>
              <Box component="form" onSubmit={buscarPorCorreo} sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  placeholder="correo@ejemplo.com"
                  type="email"
                  size="small"
                  fullWidth
                  value={emailBusqueda}
                  onChange={(e) => setEmailBusqueda(e.target.value)}
                />
                <Button
                  type="submit"
                  variant="outlined"
                  startIcon={<SearchRoundedIcon />}
                  disabled={buscandoEmail || !emailBusqueda.trim()}
                >
                  {buscandoEmail ? 'Buscando...' : 'Buscar'}
                </Button>
              </Box>
            </Grid>
          )}
        </Grid>

        {errorBusqueda && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            {errorBusqueda}
          </Alert>
        )}

        {busquedaActiva && !errorBusqueda && (
          <Alert
            severity="info"
            sx={{ mt: 2 }}
            action={
              <Tooltip title="Ver todos los envíos">
                <IconButton size="small" onClick={limpiarBusqueda}>
                  <CloseRoundedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            }
          >
            Mostrando resultados de la búsqueda por {busquedaActiva === 'codigo' ? 'código' : 'correo'}.
          </Alert>
        )}
      </Paper>

      <Paper elevation={0} sx={{ border: '1px solid #E4E7EC' }}>
        {cargando ? (
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress />
          </Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Código</TableCell>
                <TableCell>Destinatario</TableCell>
                <TableCell>Dirección de entrega</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell align="right">Detalle</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {envios.map((e) => (
                <TableRow
                  key={e.id}
                  hover
                  sx={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/envios/${e.id}`)}
                >
                  <TableCell sx={{ fontFamily: '"IBM Plex Mono", monospace', fontWeight: 600 }}>
                    {e.codigoSeguimiento}
                  </TableCell>
                  <TableCell>{e.destinatarioNombre || '—'}</TableCell>
                  <TableCell>{e.direccionEntrega}</TableCell>
                  <TableCell>
                    <EstadoChip estado={e.estado} />
                  </TableCell>
                  <TableCell align="right">
                    <Button size="small" onClick={() => navigate(`/envios/${e.id}`)}>
                      Ver seguimiento
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {envios.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                    {busquedaActiva ? 'No hay envíos que coincidan con la búsqueda.' : 'Aún no hay envíos registrados.'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </Paper>

      <Dialog open={dialogoAbierto} onClose={() => setDialogoAbierto(false)} fullWidth maxWidth="xs">
        <DialogTitle>Nuevo envío</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Dirección de entrega"
              value={form.direccionEntrega}
              onChange={(e) => setForm({ ...form, direccionEntrega: e.target.value })}
              fullWidth
              autoFocus
            />
            <TextField
              label="Nombre del destinatario"
              value={form.destinatarioNombre}
              onChange={(e) => setForm({ ...form, destinatarioNombre: e.target.value })}
              fullWidth
            />
            <TextField
              label="Teléfono del destinatario"
              value={form.destinatarioTelefono}
              onChange={(e) => setForm({ ...form, destinatarioTelefono: e.target.value })}
              fullWidth
            />
            <TextField
              label="Peso (kg)"
              type="number"
              value={form.pesoKg}
              onChange={(e) => setForm({ ...form, pesoKg: e.target.value })}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDialogoAbierto(false)}>Cancelar</Button>
          <Button variant="contained" color="secondary" onClick={guardar} disabled={guardando || !form.direccionEntrega}>
            {guardando ? 'Guardando...' : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
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
  Select,
  Stack,
  Alert,
  CircularProgress,
  Chip,
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import usuarioService from '../../api/usuarioService';
import extraerMensajeError from '../../utils/extraerMensajeError';

const ROLES = ['ADMIN', 'DESPACHADOR', 'CLIENTE', 'RECEPCIONISTA'];

const ETIQUETA_ROL = {
  ADMIN: 'Administrador',
  DESPACHADOR: 'Despachador',
  CLIENTE: 'Cliente',
  RECEPCIONISTA: 'Recepcionista',
};

const COLOR_ROL = {
  ADMIN: 'error',
  DESPACHADOR: 'info',
  CLIENTE: 'default',
  RECEPCIONISTA: 'warning',
};

const USUARIO_VACIO = { nombre: '', email: '', password: '', telefono: '', rol: 'DESPACHADOR' };

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Búsqueda por correo
  const [emailBusqueda, setEmailBusqueda] = useState('');
  const [resultadoBusqueda, setResultadoBusqueda] = useState(null);
  const [errorBusqueda, setErrorBusqueda] = useState('');
  const [buscando, setBuscando] = useState(false);
  const [actualizandoRol, setActualizandoRol] = useState(false);

  // Creación de usuario
  const [dialogoAbierto, setDialogoAbierto] = useState(false);
  const [form, setForm] = useState(USUARIO_VACIO);
  const [errorCreacion, setErrorCreacion] = useState('');
  const [guardando, setGuardando] = useState(false);

  const cargarUsuarios = async () => {
    setCargando(true);
    const data = await usuarioService.listar();
    setUsuarios(data);
    setCargando(false);
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const buscarPorEmail = async (e) => {
    e.preventDefault();
    if (!emailBusqueda.trim()) return;
    setErrorBusqueda('');
    setResultadoBusqueda(null);
    setBuscando(true);
    try {
      const usuario = await usuarioService.buscarPorEmail(emailBusqueda.trim());
      setResultadoBusqueda(usuario);
    } catch (err) {
      setErrorBusqueda(extraerMensajeError(err, 'No se encontró ningún usuario con ese correo.'));
    } finally {
      setBuscando(false);
    }
  };

  const cambiarRolDesdeBusqueda = async (nuevoRol) => {
    setActualizandoRol(true);
    try {
      const actualizado = await usuarioService.cambiarRol(resultadoBusqueda.id, nuevoRol);
      setResultadoBusqueda(actualizado);
      await cargarUsuarios();
    } catch (err) {
      setErrorBusqueda(extraerMensajeError(err, 'No se pudo actualizar el rol.'));
    } finally {
      setActualizandoRol(false);
    }
  };

  const cambiarRolDesdeTabla = async (usuario, nuevoRol) => {
    try {
      await usuarioService.cambiarRol(usuario.id, nuevoRol);
      await cargarUsuarios();
    } catch (err) {
      // Se muestra igual el error de la búsqueda como fallback visible
      setErrorBusqueda(extraerMensajeError(err, 'No se pudo actualizar el rol.'));
    }
  };

  const abrirDialogo = () => {
    setForm(USUARIO_VACIO);
    setErrorCreacion('');
    setDialogoAbierto(true);
  };

  const guardar = async () => {
    setErrorCreacion('');
    setGuardando(true);
    try {
      await usuarioService.crear(form);
      setDialogoAbierto(false);
      await cargarUsuarios();
    } catch (err) {
      setErrorCreacion(extraerMensajeError(err, 'No se pudo crear el usuario.'));
    } finally {
      setGuardando(false);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4">Usuarios</Typography>
          <Typography variant="body2" color="text.secondary">
            Administra las cuentas y los roles del sistema.
          </Typography>
        </Box>
        <Button variant="contained" color="secondary" startIcon={<AddRoundedIcon />} onClick={abrirDialogo}>
          Nuevo usuario
        </Button>
      </Box>

      {/* Buscar por correo y cambiar rol */}
      <Paper elevation={0} sx={{ p: 3, border: '1px solid #E4E7EC', mb: 3 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>
          Buscar usuario por correo
        </Typography>
        <Box component="form" onSubmit={buscarPorEmail} sx={{ display: 'flex', gap: 1, maxWidth: 480 }}>
          <TextField
            placeholder="correo@ejemplo.com"
            size="small"
            fullWidth
            value={emailBusqueda}
            onChange={(e) => setEmailBusqueda(e.target.value)}
          />
          <Button type="submit" variant="outlined" startIcon={<SearchRoundedIcon />} disabled={buscando}>
            {buscando ? 'Buscando...' : 'Buscar'}
          </Button>
        </Box>

        {errorBusqueda && (
          <Alert severity="warning" sx={{ mt: 2, maxWidth: 480 }}>
            {errorBusqueda}
          </Alert>
        )}

        {resultadoBusqueda && (
          <Box
            sx={{
              mt: 2,
              p: 2,
              maxWidth: 480,
              border: '1px solid #E4E7EC',
              borderRadius: 2,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Box>
              <Typography variant="body2" fontWeight={600}>
                {resultadoBusqueda.nombre}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {resultadoBusqueda.email}
              </Typography>
            </Box>
            <Select
              size="small"
              value={resultadoBusqueda.rol}
              disabled={actualizandoRol}
              onChange={(e) => cambiarRolDesdeBusqueda(e.target.value)}
            >
              {ROLES.map((r) => (
                <MenuItem key={r} value={r}>
                  {ETIQUETA_ROL[r]}
                </MenuItem>
              ))}
            </Select>
          </Box>
        )}
      </Paper>

      {/* Tabla completa */}
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
                <TableCell>Email</TableCell>
                <TableCell>Teléfono</TableCell>
                <TableCell>Rol</TableCell>
                <TableCell align="right">Cambiar rol</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {usuarios.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>{u.nombre}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>{u.telefono || '—'}</TableCell>
                  <TableCell>
                    <Chip label={ETIQUETA_ROL[u.rol]} color={COLOR_ROL[u.rol]} size="small" />
                  </TableCell>
                  <TableCell align="right">
                    <Select
                      size="small"
                      value={u.rol}
                      onChange={(e) => cambiarRolDesdeTabla(u, e.target.value)}
                      sx={{ minWidth: 160 }}
                    >
                      {ROLES.map((r) => (
                        <MenuItem key={r} value={r}>
                          {ETIQUETA_ROL[r]}
                        </MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
              {usuarios.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                    Aún no hay usuarios registrados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </Paper>

      <Dialog open={dialogoAbierto} onClose={() => setDialogoAbierto(false)} fullWidth maxWidth="xs">
        <DialogTitle>Nuevo usuario</DialogTitle>
        <DialogContent>
          {errorCreacion && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errorCreacion}
            </Alert>
          )}
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Nombre completo"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              fullWidth
              autoFocus
            />
            <TextField
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              fullWidth
            />
            <TextField
              label="Contraseña"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              fullWidth
              helperText="Mínimo 6 caracteres"
            />
            <TextField
              label="Teléfono (opcional)"
              value={form.telefono}
              onChange={(e) => setForm({ ...form, telefono: e.target.value })}
              fullWidth
            />
            <TextField
              select
              label="Rol"
              value={form.rol}
              onChange={(e) => setForm({ ...form, rol: e.target.value })}
              fullWidth
            >
              {ROLES.map((r) => (
                <MenuItem key={r} value={r}>
                  {ETIQUETA_ROL[r]}
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
            disabled={guardando || !form.nombre || !form.email || !form.password}
          >
            {guardando ? 'Guardando...' : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

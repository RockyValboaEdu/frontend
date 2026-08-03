import { useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  Alert,
  Divider,
  Chip,
} from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import PersonAddAltRoundedIcon from '@mui/icons-material/PersonAddAltRounded';
import ReplayRoundedIcon from '@mui/icons-material/ReplayRounded';
import usuarioService from '../../api/usuarioService';
import envioService from '../../api/envioService';
import extraerMensajeError from '../../utils/extraerMensajeError';

const PASO = {
  IDENTIFICAR: 'IDENTIFICAR', // las dos opciones visibles: buscar o crear
  ENVIO: 'ENVIO',
  EXITO: 'EXITO',
};

const CLIENTE_NUEVO_VACIO = { nombre: '', email: '', password: '', telefono: '' };
const ENVIO_VACIO = { direccionEntrega: '', destinatarioNombre: '', destinatarioTelefono: '', pesoKg: '' };

export default function RegistrarEnvioPresencialPage() {
  const [paso, setPaso] = useState(PASO.IDENTIFICAR);

  // Cliente ya identificado (por búsqueda o por creación), listo para el envío
  const [cliente, setCliente] = useState(null);

  // --- Panel 1: buscar cliente existente ---
  const [emailBusqueda, setEmailBusqueda] = useState('');
  const [buscando, setBuscando] = useState(false);
  const [errorBusqueda, setErrorBusqueda] = useState('');

  // --- Panel 2: crear cliente nuevo (independiente del panel de búsqueda) ---
  const [formNuevoCliente, setFormNuevoCliente] = useState(CLIENTE_NUEVO_VACIO);
  const [creandoCliente, setCreandoCliente] = useState(false);
  const [errorCreacion, setErrorCreacion] = useState('');

  // --- Datos del envío ---
  const [formEnvio, setFormEnvio] = useState(ENVIO_VACIO);
  const [guardandoEnvio, setGuardandoEnvio] = useState(false);
  const [errorEnvio, setErrorEnvio] = useState('');
  const [envioCreado, setEnvioCreado] = useState(null);

  const reiniciarTodo = () => {
    setPaso(PASO.IDENTIFICAR);
    setCliente(null);
    setEmailBusqueda('');
    setErrorBusqueda('');
    setFormNuevoCliente(CLIENTE_NUEVO_VACIO);
    setErrorCreacion('');
    setFormEnvio(ENVIO_VACIO);
    setErrorEnvio('');
    setEnvioCreado(null);
  };

  const buscarCliente = async (e) => {
    e.preventDefault();
    if (!emailBusqueda.trim()) return;
    setErrorBusqueda('');
    setBuscando(true);
    try {
      const encontrado = await usuarioService.buscarPorEmail(emailBusqueda.trim());
      setCliente(encontrado);
      setPaso(PASO.ENVIO);
    } catch (err) {
      // Ya NO saltamos automáticamente al formulario de creación.
      // Solo avisamos; el recepcionista decide si usa el otro panel.
      setErrorBusqueda(extraerMensajeError(err, 'No se encontró ningún cliente con ese correo.'));
    } finally {
      setBuscando(false);
    }
  };

  const crearCliente = async (e) => {
    e.preventDefault();
    setErrorCreacion('');
    setCreandoCliente(true);
    try {
      const nuevoCliente = await usuarioService.crearCliente(formNuevoCliente);
      setCliente(nuevoCliente);
      setPaso(PASO.ENVIO);
    } catch (err) {
      setErrorCreacion(extraerMensajeError(err, 'No se pudo crear la cuenta del cliente.'));
    } finally {
      setCreandoCliente(false);
    }
  };

  const registrarEnvio = async (e) => {
    e.preventDefault();
    setErrorEnvio('');
    setGuardandoEnvio(true);
    try {
      const creado = await envioService.crear({
        ...formEnvio,
        clienteId: cliente.id,
        pesoKg: Number(formEnvio.pesoKg) || null,
      });
      setEnvioCreado(creado);
      setPaso(PASO.EXITO);
    } catch (err) {
      setErrorEnvio(extraerMensajeError(err, 'No se pudo registrar el envío.'));
    } finally {
      setGuardandoEnvio(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 900 }}>
      <Typography variant="h4" sx={{ mb: 0.5 }}>
        Mostrador
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Registra el envío de la persona que estás atendiendo en el local.
      </Typography>

      {/* PASO 1: dos opciones lado a lado, independientes */}
      {paso === PASO.IDENTIFICAR && (
        <Grid container spacing={3}>
          {/* Panel A: buscar cliente existente */}
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ p: 3, border: '1px solid #E4E7EC', height: '100%' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                Cliente existente
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Búscalo por su correo si ya tiene cuenta.
              </Typography>

              <Box component="form" onSubmit={buscarCliente}>
                <Stack spacing={2}>
                  <TextField
                    label="Correo"
                    type="email"
                    value={emailBusqueda}
                    onChange={(e) => setEmailBusqueda(e.target.value)}
                    fullWidth
                    autoFocus
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    color="secondary"
                    startIcon={<SearchRoundedIcon />}
                    disabled={buscando || !emailBusqueda.trim()}
                    fullWidth
                  >
                    {buscando ? 'Buscando...' : 'Buscar cliente'}
                  </Button>
                </Stack>
              </Box>

              {errorBusqueda && (
                <Alert severity="warning" sx={{ mt: 2 }}>
                  {errorBusqueda}
                </Alert>
              )}
            </Paper>
          </Grid>

          {/* Panel B: crear cliente nuevo */}
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ p: 3, border: '1px solid #E4E7EC', height: '100%' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                Cliente nuevo
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Créale la cuenta aquí mismo, sin que tenga que registrarse él.
              </Typography>

              {errorCreacion && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {errorCreacion}
                </Alert>
              )}

              <Box component="form" onSubmit={crearCliente}>
                <Stack spacing={2}>
                  <TextField
                    label="Nombre completo"
                    value={formNuevoCliente.nombre}
                    onChange={(e) => setFormNuevoCliente({ ...formNuevoCliente, nombre: e.target.value })}
                    required
                    fullWidth
                  />
                  <TextField
                    label="Correo"
                    type="email"
                    value={formNuevoCliente.email}
                    onChange={(e) => setFormNuevoCliente({ ...formNuevoCliente, email: e.target.value })}
                    required
                    fullWidth
                  />
                  <TextField
                    label="Contraseña"
                    type="password"
                    value={formNuevoCliente.password}
                    onChange={(e) => setFormNuevoCliente({ ...formNuevoCliente, password: e.target.value })}
                    required
                    fullWidth
                    helperText="Mínimo 6 caracteres. El cliente la usará para entrar y ver sus envíos."
                  />
                  <TextField
                    label="Teléfono (opcional)"
                    value={formNuevoCliente.telefono}
                    onChange={(e) => setFormNuevoCliente({ ...formNuevoCliente, telefono: e.target.value })}
                    fullWidth
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    color="secondary"
                    startIcon={<PersonAddAltRoundedIcon />}
                    disabled={
                      creandoCliente ||
                      !formNuevoCliente.nombre ||
                      !formNuevoCliente.email ||
                      !formNuevoCliente.password
                    }
                    fullWidth
                  >
                    {creandoCliente ? 'Creando cuenta...' : 'Crear cuenta y continuar'}
                  </Button>
                </Stack>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* PASO 2: datos del envío, con el cliente ya identificado */}
      {paso === PASO.ENVIO && cliente && (
        <Paper elevation={0} sx={{ p: 3, border: '1px solid #E4E7EC', maxWidth: 560 }}>
          <Box
            sx={{
              mb: 2.5,
              p: 2,
              borderRadius: 2,
              backgroundColor: 'rgba(30,142,90,0.08)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Box>
              <Typography variant="body2" fontWeight={600}>
                {cliente.nombre}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {cliente.email}
              </Typography>
            </Box>
            <Chip label="Cliente identificado" color="success" size="small" />
          </Box>

          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>
            Datos del envío
          </Typography>

          {errorEnvio && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errorEnvio}
            </Alert>
          )}

          <Box component="form" onSubmit={registrarEnvio}>
            <Stack spacing={2}>
              <TextField
                label="Dirección de entrega"
                value={formEnvio.direccionEntrega}
                onChange={(e) => setFormEnvio({ ...formEnvio, direccionEntrega: e.target.value })}
                required
                fullWidth
                autoFocus
              />
              <TextField
                label="Nombre del destinatario"
                value={formEnvio.destinatarioNombre}
                onChange={(e) => setFormEnvio({ ...formEnvio, destinatarioNombre: e.target.value })}
                fullWidth
              />
              <TextField
                label="Teléfono del destinatario"
                value={formEnvio.destinatarioTelefono}
                onChange={(e) => setFormEnvio({ ...formEnvio, destinatarioTelefono: e.target.value })}
                fullWidth
              />
              <TextField
                label="Peso (kg)"
                type="number"
                value={formEnvio.pesoKg}
                onChange={(e) => setFormEnvio({ ...formEnvio, pesoKg: e.target.value })}
                fullWidth
              />
              <Stack direction="row" spacing={1}>
                <Button onClick={reiniciarTodo}>Cancelar</Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="secondary"
                  disabled={guardandoEnvio || !formEnvio.direccionEntrega}
                  fullWidth
                >
                  {guardandoEnvio ? 'Registrando...' : 'Registrar envío'}
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Paper>
      )}

      {/* PASO 3: éxito */}
      {paso === PASO.EXITO && envioCreado && (
        <Paper elevation={0} sx={{ p: 4, border: '1px solid #E4E7EC', maxWidth: 560, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            ¡Envío registrado!
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Dale este código al cliente para que dé seguimiento a su encomienda:
          </Typography>
          <Typography
            variant="h4"
            sx={{ fontFamily: '"IBM Plex Mono", monospace', fontWeight: 700, mb: 3 }}
          >
            {envioCreado.codigoSeguimiento}
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <Button variant="contained" color="secondary" startIcon={<ReplayRoundedIcon />} onClick={reiniciarTodo}>
            Registrar otro envío
          </Button>
        </Paper>
      )}
    </Box>
  );
}
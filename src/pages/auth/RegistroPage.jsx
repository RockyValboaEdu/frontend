import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Box, Paper, TextField, Button, Typography, Alert, Stack, Link } from '@mui/material';
import useAuth from '../../hooks/useAuth';
import extraerMensajeError from '../../utils/extraerMensajeError';

/**
 * Registro publico: SIEMPRE crea al usuario como CLIENTE (el backend lo
 * impone, sin importar lo que se envie desde aqui). Por eso este formulario
 * no tiene selector de rol: las cuentas ADMIN/DESPACHADOR las crea un
 * administrador ya autenticado, no el propio usuario.
 */
export default function RegistroPage() {
  const { registrar } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ nombre: '', email: '', password: '', telefono: '' });
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  const actualizarCampo = (campo) => (e) => setForm({ ...form, [campo]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setEnviando(true);
    try {
      await registrar(form);
      navigate('/', { replace: true });
    } catch (err) {
      setError(extraerMensajeError(err, 'No se pudo completar el registro.'));
    } finally {
      setEnviando(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'background.default',
        p: 3,
      }}
    >
      <Paper elevation={0} sx={{ width: '100%', maxWidth: 440, p: 4, border: '1px solid #E4E7EC' }}>
        <Typography variant="h5" sx={{ mb: 0.5 }}>
          Crear cuenta
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Regístrate para dar seguimiento a tus envíos.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField label="Nombre completo" value={form.nombre} onChange={actualizarCampo('nombre')} required fullWidth />
            <TextField label="Email" type="email" value={form.email} onChange={actualizarCampo('email')} required fullWidth />
            <TextField
              label="Contraseña"
              type="password"
              value={form.password}
              onChange={actualizarCampo('password')}
              required
              fullWidth
              helperText="Mínimo 6 caracteres"
            />
            <TextField label="Teléfono (opcional)" value={form.telefono} onChange={actualizarCampo('telefono')} fullWidth />
            <Button type="submit" variant="contained" color="secondary" size="large" disabled={enviando} fullWidth>
              {enviando ? 'Creando cuenta...' : 'Crear cuenta'}
            </Button>
          </Stack>
        </Box>

        <Typography variant="body2" sx={{ mt: 3, textAlign: 'center', color: 'text.secondary' }}>
          ¿Ya tienes cuenta?{' '}
          <Link component={RouterLink} to="/login" fontWeight={600}>
            Inicia sesión
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}

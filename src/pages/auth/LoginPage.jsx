import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Box, Paper, TextField, Button, Typography, Alert, Stack, Link } from '@mui/material';
import useAuth from '../../hooks/useAuth';
import extraerMensajeError from '../../utils/extraerMensajeError';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setEnviando(true);
    try {
      await login(email, password);
      navigate('/panel', { replace: true });
    } catch (err) {
      setError(extraerMensajeError(err, 'Credenciales inválidas. Verifica tu email y contraseña.'));
    } finally {
      setEnviando(false);
    }
  };

  const [mensajeEspera, setMensajeEspera] = useState('');

  const iniciarSesion = async (e) => {
    e.preventDefault();
    setError('');
    setEnviando(true);

    // Si a los 4 segundos sigue sin responder, probablemente el backend está "despertando"
    const avisoDemora = setTimeout(() => {
      setMensajeEspera('El servidor estaba inactivo y está despertando, puede tardar hasta un minuto...');
    }, 4000);

    try {
      // ... tu lógica de login existente
    } catch (err) {
      setError(extraerMensajeError(err, 'No se pudo iniciar sesión.'));
    } finally {
      clearTimeout(avisoDemora);
      setMensajeEspera('');
      setEnviando(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Panel de marca */}
      <Box
        sx={{
          flex: 1,
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'linear-gradient(160deg, #0B1B33 0%, #132A4C 60%, #1B3B66 100%)',
          color: '#fff',
          p: 6,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Envíos Express
        </Typography>

        <Box>
          <RutaDecorativa />
          <Typography variant="h3" sx={{ mt: 4, mb: 2, maxWidth: 420 }}>
            Cada envío, en su ruta correcta.
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)', maxWidth: 380 }}>
            Planifica rutas, asigna vehículos y sigue cada encomienda en tiempo real, todo desde un solo lugar.
          </Typography>
        </Box>

        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>
          © {new Date().getFullYear()} Envíos Express
        </Typography>
      </Box>

      {/* Panel de formulario */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3,
          backgroundColor: 'background.default',
        }}
      >
        <Paper elevation={0} sx={{ width: '100%', maxWidth: 400, p: 4, border: '1px solid #E4E7EC' }}>
          <Typography variant="h5" sx={{ mb: 0.5 }}>
            Iniciar sesión
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Ingresa tus credenciales para continuar.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                fullWidth
                autoFocus
              />
              <TextField
                label="Contraseña"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                fullWidth
              />
              <Button type="submit" variant="contained" color="secondary" size="large" disabled={enviando} fullWidth>
                {enviando ? 'Ingresando...' : 'Ingresar'}
              </Button>
            </Stack>
          </Box>

          <Typography variant="body2" sx={{ mt: 3, textAlign: 'center', color: 'text.secondary' }}>
            ¿No tienes cuenta?{' '}
            <Link component={RouterLink} to="/registro" fontWeight={600}>
              Regístrate
            </Link>
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
}

/** Motivo decorativo: una ruta de puntos, coherente con el producto (planificación de rutas). */
function RutaDecorativa() {
  return (
    <svg width="220" height="60" viewBox="0 0 220 60" fill="none">
      <path
        d="M5 50 C 40 50, 40 10, 75 10 S 110 50, 145 50 S 180 10, 215 10"
        stroke="#FF6A3D"
        strokeWidth="2"
        strokeDasharray="6 6"
        fill="none"
      />
      <circle cx="5" cy="50" r="5" fill="#FF6A3D" />
      <circle cx="215" cy="10" r="5" fill="#FF6A3D" />
    </svg>
  );
}

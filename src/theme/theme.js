import { createTheme } from '@mui/material/styles';

/**
 * Identidad visual de Envios Express.
 *
 * Paleta: navy profundo (autoridad/confianza, como una app de control de flota)
 * + un naranja "express" como unico acento de accion, evitando el azul por
 * defecto de MUI. Los colores de estado (pendiente/en ruta/entregado/fallido)
 * son funcionales: codifican el estado real de un envio, no decoracion.
 *
 * Tipografia: Space Grotesk para titulos (caracter tecnico/geometrico, afin a
 * rutas y datos), Inter para texto de lectura, IBM Plex Mono para codigos de
 * seguimiento y coordenadas -- el detalle que distingue a la app: cualquier
 * dato "de maquina" (codigos, placas, coordenadas) se lee en monoespaciada.
 */

const colores = {
  navy: '#132A4C',
  navyOscuro: '#0B1B33',
  naranja: '#FF6A3D',
  naranjaOscuro: '#E14E22',
  fondo: '#F5F7FA',
  papel: '#FFFFFF',
  exito: '#1E8E5A',
  advertencia: '#C77700',
  error: '#D6392E',
  info: '#2472C8',
};

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: colores.navy,
      dark: colores.navyOscuro,
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: colores.naranja,
      dark: colores.naranjaOscuro,
      contrastText: '#FFFFFF',
    },
    success: { main: colores.exito },
    warning: { main: colores.advertencia },
    error: { main: colores.error },
    info: { main: colores.info },
    background: {
      default: colores.fondo,
      paper: colores.papel,
    },
    text: {
      primary: '#101828',
      secondary: '#5B6472',
    },
  },
  shape: {
    borderRadius: 10,
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", sans-serif',
    h1: { fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700 },
    h2: { fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700 },
    h3: { fontFamily: '"Space Grotesk", sans-serif', fontWeight: 600 },
    h4: { fontFamily: '"Space Grotesk", sans-serif', fontWeight: 600 },
    h5: { fontFamily: '"Space Grotesk", sans-serif', fontWeight: 600 },
    h6: { fontFamily: '"Space Grotesk", sans-serif', fontWeight: 600 },
    button: { fontWeight: 600, textTransform: 'none' },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 8, paddingInline: 16 },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: colores.navy,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600 },
      },
    },
  },
});

// Clase de utilidad para texto "de maquina" (codigos, placas, coordenadas)
theme.typography.mono = {
  fontFamily: '"IBM Plex Mono", monospace',
};

export default theme;
export { colores };

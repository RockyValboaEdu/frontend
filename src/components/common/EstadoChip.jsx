import { Chip } from '@mui/material';

/**
 * Traduce cada estado (de Vehiculo, Ruta o Envio) a una etiqueta en español
 * y un color semantico consistente en toda la app.
 */
const CONFIGURACIONES = {
  // Vehiculo
  DISPONIBLE: { label: 'Disponible', color: 'success' },
  EN_RUTA: { label: 'En ruta', color: 'info' },
  MANTENIMIENTO: { label: 'Mantenimiento', color: 'warning' },
  INACTIVO: { label: 'Inactivo', color: 'default' },
  // Ruta
  PLANIFICADA: { label: 'Planificada', color: 'default' },
  EN_CURSO: { label: 'En curso', color: 'info' },
  FINALIZADA: { label: 'Finalizada', color: 'success' },
  CANCELADA: { label: 'Cancelada', color: 'error' },
  // Envio
  PENDIENTE: { label: 'Pendiente', color: 'default' },
  ASIGNADO: { label: 'Asignado', color: 'info' },
  ENTREGADO: { label: 'Entregado', color: 'success' },
  FALLIDO: { label: 'Fallido', color: 'error' },
};

export default function EstadoChip({ estado, size = 'small' }) {
  const config = CONFIGURACIONES[estado] || { label: estado, color: 'default' };
  return <Chip label={config.label} color={config.color} size={size} />;
}

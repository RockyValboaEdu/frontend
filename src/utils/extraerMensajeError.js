/**
 * El backend responde los errores de dos formas distintas (ver
 * GlobalExceptionHandler en el backend):
 *
 * 1) Errores de negocio / no encontrado / credenciales:
 *    { "mensaje": "Ya existe un usuario registrado con ese email" }
 *
 * 2) Errores de validacion (@Valid):
 *    { "errores": { "email": "El email debe ser valido", "password": "..." } }
 *
 * Esta funcion revisa ambos formatos y siempre devuelve un texto legible,
 * en vez de mostrar un mensaje generico cuando en realidad el backend
 * si mandaba el motivo exacto.
 */
export default function extraerMensajeError(error, mensajePorDefecto = 'Ocurrió un error inesperado.') {
  const data = error?.response?.data;

  if (!data) return mensajePorDefecto;

  if (data.mensaje) return data.mensaje;

  if (data.errores && typeof data.errores === 'object') {
    const primerError = Object.values(data.errores)[0];
    if (primerError) return primerError;
  }

  return mensajePorDefecto;
}

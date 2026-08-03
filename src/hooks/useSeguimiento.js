import { useEffect, useRef, useState } from 'react';
import SeguimientoSocket from '../websocket/seguimientoSocket';

/**
 * Se suscribe en tiempo real a las actualizaciones de un envio especifico.
 * Devuelve el ultimo evento recibido para que la pagina lo pinte al vuelo.
 */
export default function useSeguimiento(envioId) {
  const [ultimoEvento, setUltimoEvento] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!envioId) return undefined;

    const socket = new SeguimientoSocket();
    socketRef.current = socket;
    let suscripcion;

    socket.conectar(() => {
      suscripcion = socket.suscribirseAEnvio(envioId, (evento) => {
        setUltimoEvento(evento);
      });
    });

    return () => {
      suscripcion?.unsubscribe();
      socket.desconectar();
    };
  }, [envioId]);

  return ultimoEvento;
}

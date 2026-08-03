import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const WS_URL = import.meta.env.VITE_WS_BASE_URL || 'http://localhost:8080/ws';

/**
 * Unica responsabilidad: abrir/cerrar la conexion STOMP y suscribirse
 * al topico de un envio especifico. No sabe nada de React ni de UI;
 * el hook useSeguimiento (en /hooks) es quien lo conecta con componentes.
 */
class SeguimientoSocket {
  constructor() {
    this.client = null;
  }

  conectar(onConectado) {
    this.client = new Client({
      webSocketFactory: () => new SockJS(WS_URL),
      reconnectDelay: 5000,
      onConnect: () => onConectado?.(),
    });
    this.client.activate();
  }

  suscribirseAEnvio(envioId, onMensaje) {
    if (!this.client || !this.client.connected) return null;
    return this.client.subscribe(`/topic/envios/${envioId}`, (mensaje) => {
      onMensaje(JSON.parse(mensaje.body));
    });
  }

  desconectar() {
    this.client?.deactivate();
  }
}

export default SeguimientoSocket;

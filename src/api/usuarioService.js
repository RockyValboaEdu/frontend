import axiosClient from './axiosClient';

const usuarioService = {
  listar: async (rol) => {
    const { data } = await axiosClient.get('/api/usuarios', { params: rol ? { rol } : {} });
    return data;
  },

  obtenerPorId: async (id) => {
    const { data } = await axiosClient.get(`/api/usuarios/${id}`);
    return data;
  },

  buscarPorEmail: async (email) => {
    const { data } = await axiosClient.get('/api/usuarios/buscar', { params: { email } });
    return data;
  },

  crear: async (usuario) => {
    const { data } = await axiosClient.post('/api/usuarios', usuario);
    return data;
  },

  // usado por el rol Recepcionista para crear la cuenta
  // del cliente que está siendo atendido presencialmente. Siempre queda con rol CLIENTE.
  crearCliente: async (cliente) => {
    const { data } = await axiosClient.post('/api/usuarios/clientes', cliente);
    return data;
  },

  cambiarRol: async (id, rol) => {
    const { data } = await axiosClient.patch(`/api/usuarios/${id}/rol`, null, { params: { rol } });
    return data;
  },
};

export default usuarioService;
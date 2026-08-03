import axiosClient from './axiosClient';

const envioService = {
  listar: async (filtros = {}) => {
    const { data } = await axiosClient.get('/api/envios', { params: filtros });
    return data;
  },

  obtenerPorId: async (id) => {
    const { data } = await axiosClient.get(`/api/envios/${id}`);
    return data;
  },

  obtenerPorCodigo: async (codigo) => {
    const { data } = await axiosClient.get(`/api/envios/seguimiento/${codigo}`);
    return data;
  },

  crear: async (envio) => {
    const { data } = await axiosClient.post('/api/envios', envio);
    return data;
  },

  historial: async (id) => {
    const { data } = await axiosClient.get(`/api/envios/${id}/historial`);
    return data;
  },

  registrarSeguimiento: async (evento) => {
    const { data } = await axiosClient.post('/api/envios/seguimiento', evento);
    return data;
  },
};

export default envioService;

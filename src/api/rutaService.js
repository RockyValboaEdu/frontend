import axiosClient from './axiosClient';

const rutaService = {
  listar: async (estado) => {
    const { data } = await axiosClient.get('/api/rutas', { params: estado ? { estado } : {} });
    return data;
  },

  obtenerPorId: async (id) => {
    const { data } = await axiosClient.get(`/api/rutas/${id}`);
    return data;
  },

  crear: async (ruta) => {
    const { data } = await axiosClient.post('/api/rutas', ruta);
    return data;
  },

  asignarVehiculo: async (rutaId, vehiculoId) => {
    const { data } = await axiosClient.patch(`/api/rutas/${rutaId}/vehiculo/${vehiculoId}`);
    return data;
  },

  cambiarEstado: async (id, estado) => {
    const { data } = await axiosClient.patch(`/api/rutas/${id}/estado`, null, { params: { estado } });
    return data;
  },
};

export default rutaService;

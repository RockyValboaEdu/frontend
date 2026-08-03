import axiosClient from './axiosClient';

const vehiculoService = {
  listar: async (estado) => {
    const { data } = await axiosClient.get('/api/vehiculos', { params: estado ? { estado } : {} });
    return data;
  },

  obtenerPorId: async (id) => {
    const { data } = await axiosClient.get(`/api/vehiculos/${id}`);
    return data;
  },

  crear: async (vehiculo) => {
    const { data } = await axiosClient.post('/api/vehiculos', vehiculo);
    return data;
  },

  actualizar: async (id, vehiculo) => {
    const { data } = await axiosClient.put(`/api/vehiculos/${id}`, vehiculo);
    return data;
  },

  cambiarEstado: async (id, estado) => {
    const { data } = await axiosClient.patch(`/api/vehiculos/${id}/estado`, null, { params: { estado } });
    return data;
  },

  eliminar: async (id) => {
    await axiosClient.delete(`/api/vehiculos/${id}`);
  },
};

export default vehiculoService;

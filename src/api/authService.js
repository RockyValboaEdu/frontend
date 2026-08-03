import axiosClient from './axiosClient';

const authService = {
  login: async (email, password) => {
    const { data } = await axiosClient.post('/api/auth/login', { email, password });
    return data;
  },

  registrar: async (usuario) => {
    const { data } = await axiosClient.post('/api/auth/registro', usuario);
    return data;
  },
};

export default authService;

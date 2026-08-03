import { createContext, useState, useEffect } from 'react';
import authService from '../api/authService';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const usuarioGuardado = localStorage.getItem('usuario');
    if (token && usuarioGuardado) {
      setUsuario(JSON.parse(usuarioGuardado));
    }
    setCargando(false);
  }, []);

  const login = async (email, password) => {
    const respuesta = await authService.login(email, password);
    guardarSesion(respuesta);
    return respuesta;
  };

  const registrar = async (datos) => {
    const respuesta = await authService.registrar(datos);
    guardarSesion(respuesta);
    return respuesta;
  };

  const guardarSesion = (respuesta) => {
    const usuarioSesion = {
      id: respuesta.usuarioId,
      nombre: respuesta.nombre,
      email: respuesta.email,
      rol: respuesta.rol,
    };
    localStorage.setItem('token', respuesta.token);
    localStorage.setItem('usuario', JSON.stringify(usuarioSesion));
    setUsuario(usuarioSesion);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUsuario(null);
  };

  const value = {
    usuario,
    cargando,
    estaAutenticado: !!usuario,
    login,
    registrar,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

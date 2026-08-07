import { useCallback, useRef, useState } from 'react';

/**
 * Encapsula navigator.geolocation.watchPosition para usar el celular
 * como transmisor de ubicación en tiempo real (simulando el GPS de un vehículo).
 */
export default function useMiUbicacion() {
    const [activo, setActivo] = useState(false);
    const [ubicacion, setUbicacion] = useState(null); // { latitud, longitud, precision }
    const [error, setError] = useState('');
    const watchIdRef = useRef(null);

    const iniciar = useCallback(() => {
        if (!('geolocation' in navigator)) {
            setError('Este navegador no soporta geolocalización.');
            return;
        }

        setError('');
        watchIdRef.current = navigator.geolocation.watchPosition(
            (posicion) => {
                setUbicacion({
                    lat: posicion.coords.latitude,
                    lng: posicion.coords.longitude,
                    precision: posicion.coords.accuracy,
                });
                setActivo(true); // solo confirmamos "activo" cuando de verdad llega una posición
            },
            (err) => {
                setError(
                    err.code === err.PERMISSION_DENIED
                        ? 'Debes autorizar el acceso a tu ubicación para continuar.'
                        : 'No se pudo obtener tu ubicación. Verifica que el GPS esté activado.'
                );
                if (watchIdRef.current !== null) {
                    navigator.geolocation.clearWatch(watchIdRef.current);
                    watchIdRef.current = null;
                }
                setActivo(false);
            },
            { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 }
        );
    }, []);

    const detener = useCallback(() => {
        if (watchIdRef.current !== null) {
            navigator.geolocation.clearWatch(watchIdRef.current);
            watchIdRef.current = null;
        }
        setActivo(false);
    }, []);

    return { activo, ubicacion, error, iniciar, detener };
}
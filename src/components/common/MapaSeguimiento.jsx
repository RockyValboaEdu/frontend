import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Box, Typography } from '@mui/material';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Leaflet no trae bien los iconos por defecto cuando se usa con bundlers (Vite/Webpack)
L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetina,
  iconUrl: icon,
  shadowUrl: iconShadow,
});

function Recentrar({ lat, lng }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], map.getZoom());
  }, [lat, lng, map]);
  return null;
}

export default function MapaSeguimiento({ latitud, longitud, etiqueta }) {
  if (latitud == null || longitud == null) {
    return (
      <Box
        sx={{
          height: 280,
          borderRadius: 2,
          border: '1px solid #E4E7EC',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Todavía no hay ubicación registrada para este envío.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: 280, borderRadius: 2, overflow: 'hidden', border: '1px solid #E4E7EC' }}>
      <MapContainer
        center={[latitud, longitud]}
        zoom={15}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[latitud, longitud]}>
          <Popup>{etiqueta || 'Ubicación actual del envío'}</Popup>
        </Marker>
        <Recentrar lat={latitud} lng={longitud} />
      </MapContainer>
    </Box>
  );
}
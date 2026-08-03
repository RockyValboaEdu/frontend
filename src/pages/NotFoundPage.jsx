import { Box, Typography, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
      }}
    >
      <Typography variant="h1" sx={{ fontSize: 96, color: 'secondary.main' }}>
        404
      </Typography>
      <Typography variant="h6">Esta página no existe</Typography>
      <Button component={RouterLink} to="/" variant="contained" color="secondary">
        Volver al panel
      </Button>
    </Box>
  );
}

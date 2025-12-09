import { BrowserRouter, useLocation } from 'react-router-dom';
import { Container, Box } from '@mui/material';
import AppRoutes from './routes/Routes';
import './App.css';

function AppContent() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login';

  // Auth pages render without Container for full-width layout
  if (isAuthPage) {
    return (
      <Box sx={{ minHeight: '100vh' }}>
        <AppRoutes />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl">
      <AppRoutes />
    </Container>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;


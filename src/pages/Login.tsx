import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Visibility, VisibilityOff, Email, Lock } from '@mui/icons-material';
import { useMutation } from '@tanstack/react-query';
import authService, { LoginRequest } from '../services/auth.service';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginRequest) => authService.login(credentials),
    onSuccess: () => {
      navigate('/');
    },
    onError: (err: Error & { response?: { data?: { message?: string } } }) => {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    loginMutation.mutate({ email, password });
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        position: 'fixed',
        top: 0,
        left: 0,
        background: `
          radial-gradient(ellipse at 20% 80%, rgba(120, 119, 198, 0.15) 0%, transparent 50%),
          radial-gradient(ellipse at 80% 20%, rgba(255, 119, 115, 0.12) 0%, transparent 50%),
          radial-gradient(ellipse at 40% 40%, rgba(72, 187, 120, 0.08) 0%, transparent 40%),
          linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)
        `,
      }}
    >
      {/* Left Side - Branding */}
      <Box
        sx={{
          flex: 1,
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          p: 6,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative circles */}
        <Box
          sx={{
            position: 'absolute',
            width: 400,
            height: 400,
            borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.05)',
            top: '10%',
            left: '-10%',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            width: 300,
            height: 300,
            borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.08)',
            bottom: '20%',
            right: '5%',
          }}
        />
        
        <Typography
          variant="h2"
          sx={{
            fontFamily: '"Instrument Serif", Georgia, serif',
            fontWeight: 400,
            color: '#fff',
            mb: 2,
            fontSize: { md: '3.5rem', lg: '4.5rem' },
            letterSpacing: '-0.02em',
          }}
        >
          nuggebugge
        </Typography>
        <Typography
          sx={{
            color: 'rgba(255,255,255,0.5)',
            fontSize: '1.1rem',
            fontWeight: 300,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
          }}
        >
          Admin Portal
        </Typography>
        
        {/* Animated dots */}
        <Box sx={{ display: 'flex', gap: 1.5, mt: 6 }}>
          {[0, 1, 2].map((i) => (
            <Box
              key={i}
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.3)',
                animation: 'pulse 2s ease-in-out infinite',
                animationDelay: `${i * 0.3}s`,
                '@keyframes pulse': {
                  '0%, 100%': { opacity: 0.3, transform: 'scale(1)' },
                  '50%': { opacity: 1, transform: 'scale(1.2)' },
                },
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Right Side - Login Form */}
      <Box
        sx={{
          flex: { xs: 1, md: '0 0 480px' },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 3, sm: 4 },
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: '100%',
            maxWidth: 400,
            p: { xs: 3, sm: 5 },
            borderRadius: 4,
            backgroundColor: 'rgba(255,255,255,0.03)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 600,
                color: '#fff',
                mb: 1,
              }}
            >
              Welcome back
            </Typography>
            <Typography
              sx={{
                color: 'rgba(255,255,255,0.5)',
                fontSize: '0.95rem',
              }}
            >
              Sign in to continue to your dashboard
            </Typography>
          </Box>

          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                backgroundColor: 'rgba(211, 47, 47, 0.1)',
                color: '#ff6b6b',
                border: '1px solid rgba(211, 47, 47, 0.2)',
                '& .MuiAlert-icon': { color: '#ff6b6b' },
              }}
            >
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email sx={{ color: 'rgba(255,255,255,0.4)' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 2.5,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(15, 15, 35, 0.8)',
                  borderRadius: 2,
                  '& fieldset': {
                    borderColor: 'rgba(120, 119, 198, 0.3)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(120, 119, 198, 0.5)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#7877c6',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255,255,255,0.6)',
                  '&.Mui-focused': { color: '#9897d6' },
                },
                '& .MuiInputBase-input': {
                  color: '#fff',
                  '&::placeholder': { color: 'rgba(255,255,255,0.3)' },
                  '&:-webkit-autofill, &:-webkit-autofill:hover, &:-webkit-autofill:focus': {
                    WebkitBoxShadow: '0 0 0 1000px rgba(15, 15, 35, 0.95) inset !important',
                    WebkitTextFillColor: '#fff !important',
                    caretColor: '#fff',
                  },
                },
              }}
            />

            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: 'rgba(255,255,255,0.4)' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{ color: 'rgba(255,255,255,0.4)' }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 4,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(15, 15, 35, 0.8)',
                  borderRadius: 2,
                  '& fieldset': {
                    borderColor: 'rgba(120, 119, 198, 0.3)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(120, 119, 198, 0.5)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#7877c6',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255,255,255,0.6)',
                  '&.Mui-focused': { color: '#9897d6' },
                },
                '& .MuiInputBase-input': {
                  color: '#fff',
                  '&::placeholder': { color: 'rgba(255,255,255,0.3)' },
                  '&:-webkit-autofill, &:-webkit-autofill:hover, &:-webkit-autofill:focus': {
                    WebkitBoxShadow: '0 0 0 1000px rgba(15, 15, 35, 0.95) inset !important',
                    WebkitTextFillColor: '#fff !important',
                    caretColor: '#fff',
                  },
                },
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loginMutation.isPending}
              sx={{
                py: 1.5,
                borderRadius: 2,
                fontSize: '1rem',
                fontWeight: 600,
                textTransform: 'none',
                background: 'linear-gradient(135deg, #7877c6 0%, #5a59a5 100%)',
                boxShadow: '0 4px 20px rgba(120, 119, 198, 0.3)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'linear-gradient(135deg, #8a89d4 0%, #6b6ab5 100%)',
                  boxShadow: '0 6px 25px rgba(120, 119, 198, 0.4)',
                  transform: 'translateY(-1px)',
                },
                '&:disabled': {
                  background: 'rgba(120, 119, 198, 0.3)',
                  color: 'rgba(255,255,255,0.5)',
                },
              }}
            >
              {loginMutation.isPending ? (
                <CircularProgress size={24} sx={{ color: '#fff' }} />
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography
              sx={{
                color: 'rgba(255,255,255,0.3)',
                fontSize: '0.85rem',
              }}
            >
              © {new Date().getFullYear()} nuggebugge. All rights reserved.
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}

export default Login;


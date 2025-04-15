import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TextField, 
  Button, 
  Paper, 
  Typography, 
  Box, 
  Alert, 
  Container,
  InputAdornment,
  IconButton,
  Avatar,
  useTheme,
  CircularProgress,
  Divider
} from '@mui/material';
import { 
  Visibility, 
  VisibilityOff, 
  Email as EmailIcon, 
  Lock as LockIcon,
  BusinessCenter as LogoIcon
} from '@mui/icons-material';
import { login } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTheme as useAppTheme } from '../context/ThemeContext';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();
  const theme = useTheme();
  const { mode } = useAppTheme();
  const [email, setEmail] = useState('eve.holt@reqres.in');
  const [password, setPassword] = useState('cityslicka');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const primaryColor = mode === 'light' ? '#5048E5' : '#7367F0';
  const gradientBg = mode === 'light' 
    ? 'linear-gradient(135deg, #6B73FF 0%, #000DFF 100%)' 
    : 'linear-gradient(135deg, #2D3748 0%, #1A202C 100%)';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const data = await login(email, password);
      if (data && data.token) {
        authLogin(data.token);
        navigate('/users');
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'An error occurred during login.');
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        background: gradientBg,
      }}
    >
      <Container 
        maxWidth="xs"
        sx={{
          opacity: 1,
          transform: 'translateY(0)',
          transition: 'opacity 0.5s, transform 0.5s',
        }}
      >
        <Paper
          elevation={10}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            borderRadius: 4,
            boxShadow: mode === 'light' 
              ? '0 8px 32px rgba(80, 72, 229, 0.25)' 
              : '0 8px 32px rgba(0, 0, 0, 0.4)',
            overflow: 'hidden',
            position: 'relative',
            transform: 'scale(1)',
            transition: 'transform 0.5s ease',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '5px',
              background: mode === 'light' 
                ? 'linear-gradient(90deg, #5048E5, #8884d8)' 
                : 'linear-gradient(90deg, #7367F0, #9E95F5)',
            }}
          />

          <Avatar
            sx={{
              m: 1,
              backgroundColor: primaryColor,
              width: 60,
              height: 60,
              animation: 'spin 1s ease',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)',
              '@keyframes spin': {
                '0%': { transform: 'scale(0) rotate(0deg)' },
                '100%': { transform: 'scale(1) rotate(360deg)' },
              },
            }}
          >
            <LogoIcon sx={{ color: 'white', fontSize: 30 }} />
          </Avatar>

          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom 
            sx={{ 
              fontWeight: 700,
              mt: 1,
              color: mode === 'light' ? primaryColor : 'white',
              textAlign: 'center',
              fontFamily: '"Poppins", sans-serif',
            }}
          >
            EmployWise
          </Typography>
          
          <Typography 
            variant="body1" 
            sx={{ 
              mb: 3, 
              textAlign: 'center',
              color: 'text.secondary',
              fontFamily: '"Poppins", sans-serif',
            }}
          >
            Sign in to manage users
          </Typography>
          
          {error && (
            <Box
              sx={{
                opacity: 1,
                transform: 'translateY(0)',
                transition: 'opacity 0.3s, transform 0.3s',
                width: '100%',
              }}
            >
              <Alert severity="error" sx={{ mb: 2, width: '100%', borderRadius: 2 }}>
                {error}
              </Alert>
            </Box>
          )}
          
          <Box 
            component="form" 
            onSubmit={handleSubmit} 
            noValidate 
            sx={{ 
              width: '100%',
            }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ color: mode === 'light' ? primaryColor : undefined }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 2,
                ...(mode === 'light' && {
                  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: primaryColor,
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: primaryColor,
                  }
                })
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: mode === 'light' ? primaryColor : undefined }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleTogglePassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 3,
                ...(mode === 'light' && {
                  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: primaryColor,
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: primaryColor,
                  }
                })
              }}
            />
            <Box
              sx={{
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.03)',
                },
                '&:active': {
                  transform: 'scale(0.97)',
                },
              }}
            >
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ 
                  py: 1.5,
                  fontWeight: 600,
                  fontSize: '1rem',
                  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.25)',
                  bgcolor: mode === 'light' ? primaryColor : undefined,
                  '&:hover': {
                    bgcolor: mode === 'light' ? '#4338CA' : undefined,
                  }
                }}
                disabled={loading}
              >
                {loading ? (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                    Signing in...
                  </Box>
                ) : 'Sign In'}
              </Button>
            </Box>
            
            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Divider sx={{ mb: 2 }}>
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ px: 1, fontSize: '0.8rem' }}
                >
                  DEMO CREDENTIALS
                </Typography>
              </Divider>
              
              <Box 
                sx={{ 
                  p: 2,
                  bgcolor: mode === 'light' ? 'rgba(80, 72, 229, 0.05)' : 'rgba(255, 255, 255, 0.05)',
                  borderRadius: 2,
                  border: mode === 'light' ? '1px dashed rgba(80, 72, 229, 0.2)' : '1px dashed rgba(255, 255, 255, 0.1)',
                }}
              >
                <Typography 
                  variant="body2" 
                  color={mode === 'light' ? primaryColor : 'primary.light'}
                  sx={{ 
                    fontFamily: 'monospace',
                    fontSize: '0.85rem',
                    fontWeight: 500,
                  }}
                >
                  <strong>Email:</strong> eve.holt@reqres.in<br />
                  <strong>Password:</strong> cityslicka
                </Typography>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login; 
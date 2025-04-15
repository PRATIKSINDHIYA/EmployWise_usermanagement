import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material';
import Login from './pages/Login';
import UserList from './pages/UserList';
import { useAuth } from './context/AuthContext';
import { useTheme } from './context/ThemeContext';

// Protected route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }
  
  return <>{children}</>;
};

const App: React.FC = () => {
  const { mode } = useTheme();
  
  // Define theme-based colors
  const primaryColor = mode === 'light' ? '#5048E5' : '#7367F0';
  const secondaryColor = mode === 'light' ? '#FF9800' : '#FFB74D';

  const theme = createTheme({
    palette: {
      mode,
      primary: {
        main: primaryColor,
        light: mode === 'light' ? '#8884d8' : '#9E93F8',
        dark: mode === 'light' ? '#4338CA' : '#5E50EB',
      },
      secondary: {
        main: secondaryColor,
      },
      background: {
        default: mode === 'light' ? '#F9FAFC' : '#121212',
        paper: mode === 'light' ? '#FFFFFF' : '#1E1E2D',
      },
      error: {
        main: mode === 'light' ? '#F44336' : '#FF5252',
      },
      text: {
        primary: mode === 'light' ? '#111827' : '#E6E6E6',
        secondary: mode === 'light' ? '#6B7280' : '#AAAAAA',
      },
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            '&:hover': {
              transform: 'translateY(-8px)',
              boxShadow: mode === 'light' 
                ? '0 12px 20px rgba(80, 72, 229, 0.15)' 
                : '0 12px 20px rgba(0, 0, 0, 0.3)',
            },
            borderRadius: 12,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            textTransform: 'none',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
            },
            fontWeight: 500,
          },
          containedPrimary: {
            boxShadow: mode === 'light' 
              ? '0 4px 14px rgba(80, 72, 229, 0.4)' 
              : '0 4px 14px rgba(0, 0, 0, 0.3)',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 8,
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              },
              '&.Mui-focused': {
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              },
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            background: mode === 'light' 
              ? 'linear-gradient(90deg, #5048E5, #8884d8)' 
              : 'linear-gradient(90deg, #2D3748, #1A202C)',
            boxShadow: mode === 'light'
              ? '0 4px 20px rgba(80, 72, 229, 0.15)'
              : '0 4px 20px rgba(0, 0, 0, 0.2)',
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            borderRight: mode === 'light' 
              ? '1px solid rgba(0, 0, 0, 0.08)' 
              : '1px solid rgba(255, 255, 255, 0.08)',
          },
        },
      },
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            scrollbarWidth: 'thin',
            '&::-webkit-scrollbar': {
              width: '8px',
              height: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: mode === 'light' ? '#F1F1F1' : '#2D3748',
            },
            '&::-webkit-scrollbar-thumb': {
              background: mode === 'light' ? '#BBBBBB' : '#4A5568',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: mode === 'light' ? '#999999' : '#718096',
            },
          },
        },
      },
    },
    shape: {
      borderRadius: 12,
    },
    typography: {
      fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: { fontWeight: 700 },
      h2: { fontWeight: 700 },
      h3: { fontWeight: 700 },
      h4: { fontWeight: 600 },
      h5: { fontWeight: 600 },
      h6: { fontWeight: 600 },
      button: { fontWeight: 600 },
    },
  });

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <UserList />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </MuiThemeProvider>
  );
};

export default App; 
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Button,
  CircularProgress,
  Pagination,
  AppBar,
  Toolbar,
  IconButton,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Alert,
  InputAdornment,
  useMediaQuery,
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Tooltip,
  Fade,
  Chip,
  Avatar,
  Container
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon, 
  Logout as LogoutIcon, 
  Search as SearchIcon,
  Menu as MenuIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Person as PersonIcon,
  Dashboard as DashboardIcon,
  Settings as SettingsIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { getUsers, deleteUser, updateUser } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTheme as useAppTheme } from '../context/ThemeContext';

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

// Add a new type for the active view
type ActiveView = 'dashboard' | 'users' | 'settings';

// Add color palette for light mode
const lightModeColors = {
  primary: '#6366F1', // Indigo primary
  secondary: '#EC4899', // Pink secondary
  gradient: 'linear-gradient(135deg, #6366F1, #EC4899)',
  cardHover: '0 12px 20px rgba(99, 102, 241, 0.15)',
  bgLight: '#F9FAFB',
  bgLighter: '#FFFFFF',
  accent: '#8B5CF6', // Purple accent
  success: '#10B981', // Emerald green
  lightAccent: 'rgba(99, 102, 241, 0.08)'
};

const UserList: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const theme = useTheme();
  const { mode, toggleTheme } = useAppTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Add state for active view
  const [activeView, setActiveView] = useState<ActiveView>('users');
  
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mobile drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  // Edit user state
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    first_name: '',
    last_name: '',
    email: ''
  });
  // Action loading states
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  // Delete confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);
  
  // Notification
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  useEffect(() => {
    if (searchQuery) {
      const filtered = users.filter(
        user =>
          user.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchQuery, users]);

  const fetchUsers = async (page: number) => {
    try {
      setLoading(true);
      const response = await getUsers(page);
      setUsers(response.data);
      setFilteredUsers(response.data);
      setTotalPages(response.total_pages);
    } catch (error) {
      showNotification('Failed to fetch users', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event &&
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  // Edit user functions
  const handleEditClick = (user: User) => {
    setEditingUser(user);
    setEditFormData({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email
    });
    setEditDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
    setEditingUser(null);
  };

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditSubmit = async () => {
    if (!editingUser) return;
    
    try {
      setEditLoading(true);
      await updateUser(editingUser.id, editFormData);
      
      // Simulate delay for better UX
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Update local state
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === editingUser.id
            ? { ...user, ...editFormData }
            : user
        )
      );
      
      showNotification('User updated successfully', 'success');
      handleEditDialogClose();
    } catch (error) {
      showNotification('Failed to update user', 'error');
    } finally {
      setEditLoading(false);
    }
  };

  // Delete user functions
  const handleDeleteClick = (userId: number) => {
    setUserToDelete(userId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;
    
    try {
      setDeleteLoading(true);
      await deleteUser(userToDelete);
      
      // Simulate delay for better UX
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Update local state
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userToDelete));
      showNotification('User deleted successfully', 'success');
    } catch (error) {
      showNotification('Failed to delete user', 'error');
    } finally {
      setDeleteLoading(false);
      handleDeleteDialogClose();
    }
  };

  // Notification functions
  const showNotification = (message: string, severity: 'success' | 'error') => {
    setNotification({
      open: true,
      message,
      severity
    });
  };

  const handleNotificationClose = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  // Theme-based colors - update with new light mode colors
  const primaryColor = mode === 'light' 
    ? lightModeColors.primary // Indigo in light mode
    : '#7367F0'; // Lighter purple in dark mode
    
  const secondaryColor = mode === 'light'
    ? lightModeColors.secondary
    : '#A78BFA';
    
  const headerBgColor = mode === 'light'
    ? lightModeColors.gradient
    : 'linear-gradient(90deg, #2D3748, #1A202C)';

  // Function to handle view changes
  const handleViewChange = (view: ActiveView) => {
    setActiveView(view);
    if (isMobile) {
      setDrawerOpen(false);
    }
  };

  // Drawer content
  const drawerContent = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onKeyDown={toggleDrawer(false)}
    >
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          p: 2, 
          backgroundColor: mode === 'light' ? lightModeColors.gradient : theme.palette.background.paper,
          color: mode === 'light' ? 'white' : theme.palette.primary.main,
          // height: '100%'
        }}
      >
        <Avatar
          sx={{ 
            width: 60, 
            height: 60, 
            mb: 1,
            backgroundColor: mode === 'light' ? 'white' : primaryColor,
            color: mode === 'light' ? primaryColor : 'white',
            boxShadow: mode === 'light' ? '0 4px 20px rgba(255, 255, 255, 0.3)' : 'none',
            transition: 'transform 0.3s',
            '&:hover': {
              transform: 'scale(1.05)'
            }
          }}
        >
          <PersonIcon fontSize="large" />
        </Avatar>
        <Typography variant="h6" sx={{ 
          fontWeight: 600,
          textShadow: mode === 'light' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none'
        }}>
          EmployWise
        </Typography>
        <Typography variant="body2" sx={{ 
          opacity: 0.8,
          fontWeight: 500
        }}>
          User Management
        </Typography>
      </Box>
      <Divider />
      <Box sx={{
        background: mode === 'light' 
          ? 'linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(249,250,251,1) 100%)' 
          : 'none',
        height: '100%',
        pt: 1
      }}>
        <List>
          <ListItem 
            button 
            selected={activeView === 'dashboard'} 
            onClick={() => handleViewChange('dashboard')}
            sx={{
              my: 0.5,
              mx: 1,
              borderRadius: 2,
              '&.Mui-selected': {
                backgroundColor: mode === 'light' 
                  ? lightModeColors.lightAccent 
                  : 'rgba(115, 103, 240, 0.08)',
              },
              '&.Mui-selected:hover': {
                backgroundColor: mode === 'light' 
                  ? 'rgba(99, 102, 241, 0.12)' 
                  : 'rgba(115, 103, 240, 0.12)',
              },
              '&:hover': {
                backgroundColor: mode === 'light'
                  ? 'rgba(99, 102, 241, 0.04)'
                  : 'rgba(115, 103, 240, 0.04)'
              }
            }}
          >
            <ListItemIcon>
              <DashboardIcon sx={{ 
                color: activeView === 'dashboard' 
                  ? primaryColor 
                  : mode === 'light' ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.6)',
                transition: 'transform 0.2s, color 0.2s',
                transform: activeView === 'dashboard' ? 'scale(1.1)' : 'scale(1)'
              }} />
            </ListItemIcon>
            <ListItemText 
              primary="Dashboard" 
              primaryTypographyProps={{
                color: activeView === 'dashboard' ? primaryColor : 'inherit',
                fontWeight: activeView === 'dashboard' ? 600 : 400
              }}
            />
          </ListItem>
          <ListItem 
            button 
            selected={activeView === 'users'} 
            onClick={() => handleViewChange('users')}
            sx={{
              my: 0.5,
              mx: 1,
              borderRadius: 2,
              '&.Mui-selected': {
                backgroundColor: mode === 'light' 
                  ? lightModeColors.lightAccent 
                  : 'rgba(115, 103, 240, 0.08)',
              },
              '&.Mui-selected:hover': {
                backgroundColor: mode === 'light' 
                  ? 'rgba(99, 102, 241, 0.12)' 
                  : 'rgba(115, 103, 240, 0.12)',
              },
              '&:hover': {
                backgroundColor: mode === 'light'
                  ? 'rgba(99, 102, 241, 0.04)'
                  : 'rgba(115, 103, 240, 0.04)'
              }
            }}
          >
            <ListItemIcon>
              <PersonIcon sx={{ 
                color: activeView === 'users' 
                  ? primaryColor 
                  : mode === 'light' ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.6)',
                transition: 'transform 0.2s, color 0.2s',
                transform: activeView === 'users' ? 'scale(1.1)' : 'scale(1)'
              }} />
            </ListItemIcon>
            <ListItemText 
              primary="Users" 
              primaryTypographyProps={{
                color: activeView === 'users' ? primaryColor : 'inherit',
                fontWeight: activeView === 'users' ? 600 : 400
              }}
            />
          </ListItem>
          <ListItem 
            button 
            selected={activeView === 'settings'} 
            onClick={() => handleViewChange('settings')}
            sx={{
              my: 0.5,
              mx: 1,
              borderRadius: 2,
              '&.Mui-selected': {
                backgroundColor: mode === 'light' 
                  ? lightModeColors.lightAccent 
                  : 'rgba(115, 103, 240, 0.08)',
              },
              '&.Mui-selected:hover': {
                backgroundColor: mode === 'light' 
                  ? 'rgba(99, 102, 241, 0.12)' 
                  : 'rgba(115, 103, 240, 0.12)',
              },
              '&:hover': {
                backgroundColor: mode === 'light'
                  ? 'rgba(99, 102, 241, 0.04)'
                  : 'rgba(115, 103, 240, 0.04)'
              }
            }}
          >
            <ListItemIcon>
              <SettingsIcon sx={{ 
                color: activeView === 'settings' 
                  ? primaryColor 
                  : mode === 'light' ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.6)',
                transition: 'transform 0.2s, color 0.2s',
                transform: activeView === 'settings' ? 'scale(1.1)' : 'scale(1)'
              }} />
            </ListItemIcon>
            <ListItemText 
              primary="Settings" 
              primaryTypographyProps={{
                color: activeView === 'settings' ? primaryColor : 'inherit',
                fontWeight: activeView === 'settings' ? 600 : 400
              }}
            />
          </ListItem>
        </List>
        <Divider sx={{ 
          my: 1.5, 
          mx: 2,
          ...(mode === 'light' && {
            opacity: 0.6
          })
        }} />
        <List>
          <ListItem 
            button 
            onClick={handleLogout}
            sx={{
              my: 0.5,
              mx: 1,
              borderRadius: 2,
              '&:hover': {
                backgroundColor: mode === 'light'
                  ? 'rgba(239, 68, 68, 0.08)'
                  : 'rgba(239, 68, 68, 0.16)'
              }
            }}
          >
            <ListItemIcon>
              <LogoutIcon color="error" sx={{
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateX(2px)'
                }
              }} />
            </ListItemIcon>
            <ListItemText 
              primary="Logout" 
              sx={{ color: theme.palette.error.main }} 
              primaryTypographyProps={{
                fontWeight: 500
              }}
            />
          </ListItem>
        </List>
      </Box>
    </Box>
  );

  // Render dashboard view - update colors
  const renderDashboardView = () => (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      textAlign: 'center',
      py: 5
    }}>
      <Box 
        sx={{ 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mb: 4,
          p: 3,
          borderRadius: 4,
          bgcolor: mode === 'light' ? 'rgba(99, 102, 241, 0.05)' : 'rgba(115, 103, 240, 0.05)',
          border: mode === 'light' ? `1px dashed ${lightModeColors.primary}40` : '1px dashed rgba(115, 103, 240, 0.2)',
          width: '100%',
          maxWidth: 700,
          boxShadow: mode === 'light' ? '0 4px 20px rgba(99, 102, 241, 0.08)' : 'none'
        }}
      >
        <DashboardIcon sx={{ 
          fontSize: 60, 
          color: primaryColor, 
          mb: 2,
          animation: 'pulse 2s infinite ease-in-out',
          '@keyframes pulse': {
            '0%': { opacity: 0.7, transform: 'scale(1)' },
            '50%': { opacity: 1, transform: 'scale(1.05)' },
            '100%': { opacity: 0.7, transform: 'scale(1)' }
          }
        }} />
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 700, color: mode === 'light' ? primaryColor : 'white' }}>
          Welcome to EmployWise
        </Typography>
        <Typography variant="h6" sx={{ mb: 2, color: 'text.secondary', maxWidth: 600 }}>
          Your complete solution for employee management and organization
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ maxWidth: 1000 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            p: 3, 
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            borderRadius: 3,
            transition: 'transform 0.3s, box-shadow 0.3s',
            '&:hover': {
              transform: 'translateY(-8px)',
              boxShadow: mode === 'light' ? lightModeColors.cardHover : '0 12px 20px rgba(0, 0, 0, 0.3)'
            },
            ...(mode === 'light' && {
              background: 'linear-gradient(145deg, white, #f5f7ff)'
            })
          }}>
            <PersonIcon sx={{ fontSize: 40, color: primaryColor, mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Manage Users
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Add, edit, and remove user profiles with our intuitive interface
            </Typography>
            <Button 
              variant="outlined" 
              sx={{ 
                mt: 2,
                borderColor: primaryColor,
                color: primaryColor,
                '&:hover': {
                  borderColor: mode === 'light' ? lightModeColors.secondary : undefined,
                  backgroundColor: mode === 'light' ? 'rgba(236, 72, 153, 0.08)' : undefined
                }
              }}
              onClick={() => handleViewChange('users')}
            >
              View Users
            </Button>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            p: 3, 
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            borderRadius: 3,
            transition: 'transform 0.3s, box-shadow 0.3s',
            '&:hover': {
              transform: 'translateY(-8px)',
              boxShadow: mode === 'light' ? lightModeColors.cardHover : '0 12px 20px rgba(0, 0, 0, 0.3)'
            },
            ...(mode === 'light' && {
              background: 'linear-gradient(145deg, white, #f5f7ff)'
            })
          }}>
            <InfoIcon sx={{ fontSize: 40, color: primaryColor, mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              System Overview
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Currently managing {users.length} users in the system
            </Typography>
            <Button 
              variant="outlined" 
              sx={{ 
                mt: 2,
                borderColor: 'rgba(0, 0, 0, 0.2)',
                color: 'text.secondary'
              }}
              disabled
            >
              View Stats
            </Button>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            p: 3, 
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            borderRadius: 3,
            transition: 'transform 0.3s, box-shadow 0.3s',
            '&:hover': {
              transform: 'translateY(-8px)',
              boxShadow: mode === 'light' ? lightModeColors.cardHover : '0 12px 20px rgba(0, 0, 0, 0.3)'
            },
            ...(mode === 'light' && {
              background: 'linear-gradient(145deg, white, #f5f7ff)'
            })
          }}>
            <SettingsIcon sx={{ fontSize: 40, color: primaryColor, mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Settings
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Configure system preferences and application settings
            </Typography>
            <Button 
              variant="outlined" 
              sx={{ 
                mt: 2,
                borderColor: primaryColor,
                color: primaryColor,
                '&:hover': {
                  borderColor: mode === 'light' ? lightModeColors.secondary : undefined,
                  backgroundColor: mode === 'light' ? 'rgba(236, 72, 153, 0.08)' : undefined
                }
              }}
              onClick={() => handleViewChange('settings')}
            >
              Go to Settings
            </Button>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  // Render settings view
  const renderSettingsView = () => (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      py: 3
    }}>
      <Typography 
        variant="h4" 
        component="h1" 
        gutterBottom 
        sx={{ 
          fontWeight: 600, 
          mb: 4,
          color: mode === 'light' ? primaryColor : undefined
        }}
      >
        Settings
      </Typography>
      
      <Card sx={{ width: '100%', maxWidth: 800, mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Theme Settings
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', my: 2 }}>
            <Typography>
              Dark Mode
            </Typography>
            <IconButton onClick={toggleTheme}>
              {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>
          </Box>
          <Divider />
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', my: 2 }}>
            <Typography>
              Current Theme
            </Typography>
            <Typography color="primary">
              {mode === 'light' ? 'Light Theme' : 'Dark Theme'}
            </Typography>
          </Box>
        </CardContent>
      </Card>
      
      <Card sx={{ width: '100%', maxWidth: 800 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Account Settings
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', my: 2 }}>
            <Typography>
              Log Out
            </Typography>
            <Button 
              variant="outlined" 
              color="error" 
              size="small"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );

  // Render users view - update the search bar and user cards
  const renderUsersView = () => (
    <>
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom 
          sx={{ 
            fontWeight: 600, 
            mb: 2,
            color: mode === 'light' ? lightModeColors.primary : undefined
          }}
        >
          User Management
        </Typography>
        
        <Typography 
          variant="body1" 
          color="text.secondary" 
          paragraph
          sx={{ maxWidth: 800 }}
        >
          View and manage all users in the system. You can edit user information or remove users as needed.
        </Typography>

        {/* Search bar */}
        <Box 
          sx={{ 
            display: 'flex',
            alignItems: 'center',
            mb: 3,
            width: '100%',
            maxWidth: 500,
            borderRadius: 2,
            backgroundColor: mode === 'light' ? 'rgba(99, 102, 241, 0.05)' : 'rgba(255, 255, 255, 0.05)',
            border: mode === 'light' ? '1px solid rgba(99, 102, 241, 0.1)' : '1px solid rgba(255, 255, 255, 0.1)',
            padding: '0 16px',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: mode === 'light' ? 'rgba(99, 102, 241, 0.08)' : 'rgba(255, 255, 255, 0.08)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
            }
          }}
        >
          <SearchIcon sx={{ color: mode === 'light' ? lightModeColors.primary : 'text.secondary', mr: 1 }} />
          <TextField
            placeholder="Search users by name or email..."
            variant="standard"
            fullWidth
            value={searchQuery}
            onChange={handleSearchChange}
            sx={{
              '& .MuiInput-root': {
                border: 'none',
                '&:before, &:after': {
                  display: 'none'
                }
              },
              '& .MuiInputBase-input': {
                py: 1.5
              }
            }}
          />
          {searchQuery && (
            <IconButton 
              size="small" 
              onClick={() => setSearchQuery('')}
              sx={{ ml: 1 }}
            >
              <Box 
                component="span" 
                sx={{ 
                  fontSize: '1.5rem', 
                  lineHeight: 1, 
                  color: 'text.secondary',
                  fontWeight: 'bold'
                }}
              >
                ×
              </Box>
            </IconButton>
          )}
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Chip
            icon={<InfoIcon fontSize="small" />}
            label={`${filteredUsers.length} ${filteredUsers.length === 1 ? 'user' : 'users'} found`}
            variant="outlined"
            sx={{ mr: 2 }}
          />
          
          {searchQuery && (
            <Chip
              label={`Search: "${searchQuery}"`}
              onDelete={() => setSearchQuery('')}
              color="primary"
              variant="outlined"
            />
          )}
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
          <CircularProgress sx={{ color: primaryColor }} />
        </Box>
      ) : filteredUsers.length === 0 ? (
        <Box 
          sx={{ 
            py: 10, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.palette.background.paper,
            borderRadius: 2,
            boxShadow: 1
          }}
        >
          <PersonIcon sx={{ fontSize: 60, opacity: 0.3, mb: 2 }} />
          <Typography align="center" variant="h6" sx={{ mb: 1 }}>
            No users found
          </Typography>
          <Typography align="center" color="text.secondary">
            {searchQuery ? 'Try a different search term' : 'There are no users to display'}
          </Typography>
          {searchQuery && (
            <Button
              variant="outlined"
              onClick={() => setSearchQuery('')}
              sx={{ mt: 2 }}
            >
              Clear Search
            </Button>
          )}
        </Box>
      ) : (
        <Box sx={{ opacity: 1, transition: 'opacity 0.3s' }}>
          <Grid container spacing={3}>
            {filteredUsers.map((user, index) => (
              <Grid 
                item 
                xs={12} 
                sm={6} 
                md={4} 
                lg={3} 
                key={user.id}
                sx={{
                  opacity: 1,
                  transform: 'translateY(0)',
                  transition: `opacity 0.3s ease, transform 0.3s ease ${index * 0.05}s`,
                }}
              >
                <Card 
                  sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    height: '100%',
                    overflow: 'hidden',
                    position: 'relative',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': { 
                      transform: 'translateY(-8px)',
                      boxShadow: mode === 'light' 
                        ? lightModeColors.cardHover 
                        : '0 12px 20px rgba(0, 0, 0, 0.3)'
                    },
                    borderRadius: 3,
                    ...(mode === 'light' && {
                      background: 'linear-gradient(145deg, white, #f5f7ff)'
                    })
                  }}
                >
                  <CardMedia
                    component="img"
                    sx={{ 
                      height: 240, 
                      objectFit: 'cover',
                      transition: 'transform 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'scale(1.05)',
                      },
                    }}
                    image={user.avatar}
                    alt={`${user.first_name} ${user.last_name}`}
                  />
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Typography 
                      gutterBottom 
                      variant="h5" 
                      component="div"
                      sx={{ 
                        fontWeight: 600,
                        color: mode === 'light' ? lightModeColors.primary : undefined
                      }}
                    >
                      {user.first_name} {user.last_name}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        mb: 2
                      }}
                    >
                      <PersonIcon fontSize="small" sx={{ mr: 1, opacity: 0.7 }} />
                      {user.email}
                    </Typography>
                  </CardContent>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    p: 2,
                    borderTop: `1px solid ${theme.palette.divider}`,
                  }}>
                    <Button
                      startIcon={<EditIcon />}
                      size="small"
                      variant="outlined"
                      onClick={() => handleEditClick(user)}
                      sx={{ 
                        flex: 1, 
                        mr: 1,
                        borderColor: mode === 'light' ? lightModeColors.primary : undefined,
                        color: mode === 'light' ? lightModeColors.primary : undefined,
                        '&:hover': {
                          borderColor: mode === 'light' ? lightModeColors.secondary : undefined,
                          backgroundColor: mode === 'light' ? 'rgba(236, 72, 153, 0.08)' : undefined
                        }
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      startIcon={<DeleteIcon />}
                      size="small"
                      variant="outlined"
                      color="error"
                      onClick={() => handleDeleteClick(user.id)}
                      sx={{ flex: 1 }}
                    >
                      Delete
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Pagination */}
      {!searchQuery && users.length > 0 && (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          mt: 6,
          mb: 2 
        }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            size="large"
            showFirstButton
            showLastButton
            sx={{
              '& .MuiPaginationItem-root': {
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'scale(1.1)',
                },
              },
              ...(mode === 'light' && {
                '& .Mui-selected': {
                  backgroundColor: `${lightModeColors.primary} !important`,
                  color: 'white'
                }
              })
            }}
          />
        </Box>
      )}
    </>
  );

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar 
        position="fixed" 
        elevation={0} 
        sx={{ 
          zIndex: theme.zIndex.drawer + 1,
          background: headerBgColor
        }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={toggleDrawer(!drawerOpen)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              flexGrow: 1, 
              display: 'flex', 
              alignItems: 'center',
              fontWeight: 600,
              letterSpacing: '0.5px'
            }}
          >
            <Box
              sx={{
                animation: 'spin 2s',
                '@keyframes spin': {
                  '0%': { transform: 'rotate(0deg)' },
                  '100%': { transform: 'rotate(360deg)' },
                },
                mr: 1
              }}
            >
              <DashboardIcon />
            </Box>
            EmployWise
          </Typography>
          
          <Tooltip title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}>
            <IconButton color="inherit" onClick={toggleTheme} sx={{ mr: 1 }}>
              {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Logout">
            <IconButton color="inherit" onClick={handleLogout} edge="end">
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
      
      {/* Mobile drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
      >
        <Box sx={{ 
          paddingTop: isMobile ? '56px' : '64px', // Match AppBar height
          height: '100%',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {drawerContent}
        </Box>
      </Drawer>
      
      {/* Desktop sidebar */}
      {!isMobile && (
        <Drawer
          variant="permanent"
          sx={{
            width: 250,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { 
              width: 250, 
              boxSizing: 'border-box',
              borderRight: mode === 'light' 
                ? '1px solid rgba(99, 102, 241, 0.08)' 
                : '1px solid rgba(255, 255, 255, 0.08)',
              marginTop: '64px', // Match AppBar height
              height: 'calc(100% - 64px)',
              ...(mode === 'light' && {
                boxShadow: '4px 0 15px rgba(0, 0, 0, 0.03)'
              })
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: 3, 
          mt: 8,
          ml: isMobile ? 0 : '250px',
          transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Container maxWidth="xl">
          {activeView === 'dashboard' && renderDashboardView()}
          {activeView === 'users' && renderUsersView()}
          {activeView === 'settings' && renderSettingsView()}
        </Container>
      </Box>

      {/* Edit User Dialog */}
      <Dialog 
        open={editDialogOpen} 
        onClose={handleEditDialogClose}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Fade}
        transitionDuration={400}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h5" component="div" sx={{ 
            fontWeight: 600,
            color: mode === 'light' ? primaryColor : undefined
          }}>
            Edit User
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Update user information below
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          {editingUser && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Avatar 
                src={editingUser.avatar} 
                alt={`${editingUser.first_name} ${editingUser.last_name}`}
                sx={{ width: 60, height: 60, mr: 2 }}
              />
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  User ID: {editingUser.id}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {editingUser.email}
                </Typography>
              </Box>
            </Box>
          )}
          <TextField
            margin="dense"
            name="first_name"
            label="First Name"
            fullWidth
            variant="outlined"
            value={editFormData.first_name}
            onChange={handleEditFormChange}
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
            margin="dense"
            name="last_name"
            label="Last Name"
            fullWidth
            variant="outlined"
            value={editFormData.last_name}
            onChange={handleEditFormChange}
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
            margin="dense"
            name="email"
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            value={editFormData.email}
            onChange={handleEditFormChange}
            sx={{ 
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
        </DialogContent>
        <DialogActions sx={{ p: 2, display: 'flex', justifyContent: 'space-between' }}>
          <Button 
            onClick={handleEditDialogClose}
            variant="outlined"
            startIcon={<DeleteIcon />}
            disabled={editLoading}
            sx={mode === 'light' ? {
              borderColor: 'rgba(0,0,0,0.2)',
              color: 'rgba(0,0,0,0.7)'
            } : {}}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleEditSubmit} 
            variant="contained"
            startIcon={editLoading ? null : <EditIcon />}
            disabled={editLoading}
            sx={{ 
              minWidth: '130px',
              bgcolor: mode === 'light' ? primaryColor : undefined,
              '&:hover': {
                bgcolor: mode === 'light' ? '#4338CA' : undefined,
              }
            }}
          >
            {editLoading ? (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                Saving...
              </Box>
            ) : (
              'Save Changes'
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={deleteDialogOpen} 
        onClose={handleDeleteDialogClose}
        maxWidth="xs"
        fullWidth
        TransitionComponent={Fade}
        transitionDuration={400}
      >
        <DialogTitle sx={{ color: theme.palette.error.main }}>
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this user? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={handleDeleteDialogClose} 
            autoFocus
            disabled={deleteLoading}
            variant="outlined"
            sx={mode === 'light' ? {
              borderColor: 'rgba(0,0,0,0.2)',
              color: 'rgba(0,0,0,0.7)'
            } : {}}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            variant="contained"
            startIcon={deleteLoading ? null : <DeleteIcon />}
            disabled={deleteLoading}
            sx={{ minWidth: '130px' }}
          >
            {deleteLoading ? (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                Deleting...
              </Box>
            ) : (
              'Delete User'
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={handleNotificationClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleNotificationClose} 
          severity={notification.severity} 
          variant="filled"
          sx={{ 
            width: '100%',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            borderRadius: 2,
            ...(notification.severity === 'success' && mode === 'light' && {
              bgcolor: primaryColor
            })
          }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserList; 
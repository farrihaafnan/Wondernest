import React, { useEffect, useState } from 'react';
import { Box, CssBaseline, Drawer, List, ListItem, ListItemButton, ListItemText, Toolbar, AppBar, Typography, Button, Alert } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

interface User {
  id: string;
  email: string;
  children: any[];
}

const drawerWidth = 240;

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login?message=Please login to access the dashboard');
      return;
    }

    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [navigate]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlMessage = params.get('message');
    if (urlMessage) {
      setMessage(urlMessage);
    }
  }, [location]);

  const menuItems = [
    { text: 'Word Flashcards', path: '/wordflashcard' },
    { text: 'Sentence Learning', path: '/sentence-learning' },
    { text: 'Story Generation', path: '/story-generation' },
    { text: 'Word Matching', path: '/word-matching' },
    { text: 'Sentence Correction', path: '/sentence-correction' },
    { text: 'Puzzle', path: '/puzzle' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login?message=You have been logged out. Please login again to access the dashboard');
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      {/* Top App Bar */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" noWrap component="div">
            WonderNest
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {menuItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton onClick={() => navigate(item.path)}>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Main content area */}
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
      >
        <Toolbar />
        {message && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {message}
          </Alert>
        )}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <Typography variant="h4" gutterBottom>
            Welcome to Your Dashboard
          </Typography>
          <Typography variant="body1">
            Email: {user?.email}
          </Typography>
          <Typography variant="body1">
            User ID: {user?.id}
          </Typography>
          <Typography variant="body1">
            Children: {user?.children.map((child) => child.name).join(', ')}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;

import React, { useEffect, useState } from 'react';
import {
  Box, CssBaseline, Drawer, List, ListItem, ListItemButton,
  ListItemText, Toolbar, AppBar, Typography, Button, Alert
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

interface Child {
  id: string;
  name: string;
  age: number;
  gender: string;
  avatarUrl?: string;
}

interface Parent {
  id: string;
  email: string;
}

const drawerWidth = 240;

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<Parent | null>(null);
  const [child, setChild] = useState<Child | null>(null);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (!token || !storedUser) {
      navigate('/login?message=Please login to access the dashboard');
      return;
    }

    const state = location.state as any;
    if (state?.parent && state?.child) {
      setUser(state.parent);
      setChild(state.child);
    } else {
      navigate('/select-child');
    }

    const params = new URLSearchParams(location.search);
    const urlMessage = params.get('message');
    if (urlMessage) setMessage(urlMessage);
  }, [location, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login?message=You have been logged out. Please login again to access the dashboard');
  };

  const menuItems = [
    { text: 'Word Flashcards', path: '/wordflashcard' },
    { text: 'Sentence Learning', path: '/sentence-learning' },
    { text: 'Story Generation', path: '/story-generation' },
    { text: 'Word Matching', path: '/word-matching' },
    { text: 'Sentence Correction', path: '/sentence-correction' },
    { text: 'Puzzle', path: '/puzzle' },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6">WonderNest</Typography>
          <Button color="inherit" onClick={handleLogout}>Logout</Button>
        </Toolbar>
      </AppBar>

      <Drawer variant="permanent" sx={{ width: drawerWidth, flexShrink: 0, [`& .MuiDrawer-paper`]: { width: drawerWidth } }}>
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

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
        <Typography variant="h4">Welcome to Your Dashboard</Typography>
        {user && child && (
          <>
            <Typography>Email: {user.email}</Typography>
            <Typography>User ID: {user.id}</Typography>
            <Typography>Selected Child: {child.name} (Age: {child.age})</Typography>
          </>
        )}
      </Box>
    </Box>
  );
};

export default Dashboard;

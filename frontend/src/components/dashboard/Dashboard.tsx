import React from 'react';
import { Box, CssBaseline, Drawer, List, ListItem, ListItemButton, ListItemText, Toolbar, AppBar, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';





const drawerWidth = 240;

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

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

      {/* Top App Bar */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            WonderNest
          </Typography>
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
        <Typography variant="h4" gutterBottom>
          Welcome to Your Dashboard
        </Typography>
      </Box>
    </Box>
  );
};

export default Dashboard;

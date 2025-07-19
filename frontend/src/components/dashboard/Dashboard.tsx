import React, { useEffect, useState } from 'react';
import {
  Box, CssBaseline, Drawer, List, ListItem, ListItemButton,
  ListItemText, Toolbar, AppBar, Typography, Button, Alert
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardMedia, Grid } from '@mui/material';


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
    const token = sessionStorage.getItem('token');
    const storedUser = sessionStorage.getItem('user');
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


  const menuItems = [
    { text: 'Word Flashcards', path: '/wordflashcard' },
    { text: 'Sentence Learning', path: '/sentence-learning' },
    { text: 'Story Generation', path: '/story-generation' },
    { text: 'Word Matching', path: '/word-matching' },
    { text: 'Sentence Correction', path: '/sentence-evaluation' },
    { text: 'Puzzle', path: '/puzzle' },
    { text: 'Edit Profile', path: '/edit-child-profile', isEdit: true },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Drawer variant="permanent" sx={{ width: drawerWidth, flexShrink: 0, [`& .MuiDrawer-paper`]: { width: drawerWidth ,  boxSizing: 'border-box', mt: '64px', height: 'calc(100vh - 64px)',} }}>
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {menuItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  onClick={() => {
                    if (item.isEdit) {
                      navigate(item.path, { state: { parent: user, child: child } });
                    } else {
                      navigate(item.path, { state: { parent: user, child: child } });
                    }
                  }}
                >
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {child && (
        <Typography variant="h4" sx={{ mb: 4 }}>
          Hello, {child.name}!
        </Typography>
      )}

      <Grid container spacing={3}>
        {[
          { title: 'Learn new words with flashcard and fun visuals !', path: '/wordflashcard', image: '/Word.png' },
          { title: 'Understand sentence structure with engaging examples!', path: '/sentence-learning', image: '/SentenceLearning.png' },
          { title: 'Create fun stories with cartoon illustrations!', path: '/story-generation', image: '/story.png' },
          { title: 'Match words with their images in a playful way!', path: '/word-matching', image: '/match.png' },
          { title: 'Fix grammar mistakes and learn proper sentence forms!', path: '/sentence-evaluation', image: '/correction.png' },
          { title: 'Solve image puzzles to train your brain!', path: '/puzzle', image: '/puzzle.png' },
        ].map((activity) => (
          <Grid item xs={12} sm={6} md={4} key={activity.title}>
            <Card
              sx={{
                borderRadius: 4,
                boxShadow: 3,
                textAlign: 'center',
                cursor: 'pointer',
                '&:hover': { boxShadow: 6, transform: 'scale(1.02)' },
                transition: 'all 0.2s ease-in-out'
              }}
              onClick={() => navigate(activity.path, { state: { parent: user, child } })}
            >
              <CardMedia
                component="img"
                height="140"
                image={activity.image}
                alt={activity.title}
                sx={{ objectFit: 'contain', mt: 2 }}
              />
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.primary' , textAlign: 'center',}}>
                  {activity.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      </Box>
    </Box>
  );
};

export default Dashboard;

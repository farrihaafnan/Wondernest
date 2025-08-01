import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card, CardContent, Typography, Grid, Avatar, Button, Container,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Box
} from '@mui/material';
import { USER_LEARNING_API_BASE_URL } from '../../apiConfig';

interface Child {
  id: string;
  name: string;
  age: number;
  gender: string;
  avatarUrl?: string;
}

const SelectChild: React.FC = () => {
  const navigate = useNavigate();
  const [children, setChildren] = useState<Child[]>([]);
  const [open, setOpen] = useState(false);
  const [newChild, setNewChild] = useState({ name: '', age: '', gender: '', avatarUrl: '' });

  const user = JSON.parse(sessionStorage.getItem('user') || '{}');
  const token = sessionStorage.getItem('token');

  useEffect(() => {
    if (!token || !user?.id) {
      navigate('/login?message=Please login first');
      return;
    }

    fetch(`${USER_LEARNING_API_BASE_URL}/api/parents/${user.id}/children`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setChildren(data))
      .catch(() => alert('Failed to fetch children'));
  }, [navigate, token, user?.id]);

  const handleChildSelect = (child: Child) => {
    sessionStorage.setItem('selectedChild', JSON.stringify(child));
    navigate('/dashboard', { state: { parent: user, child } });
  };

  const handleAddKid = async () => {
    try {
      const response = await fetch(`${USER_LEARNING_API_BASE_URL}/api/children`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...newChild,
          age: parseInt(newChild.age),
          parentId: user.id,
        }),
      });

      if (!response.ok) throw new Error('Failed to add child');

      const updated = await fetch(`${USER_LEARNING_API_BASE_URL}/api/parents/${user.id}/children`).then(res => res.json());
      setChildren(updated);
      setOpen(false);
      setNewChild({ name: '', age: '', gender: '', avatarUrl: '' });
    } catch {
      alert('Error adding child');
    }
  };

  const AVATAR_OPTIONS = [
    '/avatars/avatar1.jpg',
    '/avatars/avatar2.jpg',
    '/avatars/avatar3.jpg',
    '/avatars/avatar4.jpg',
    '/avatars/avatar5.jpg',
    '/avatars/avatar6.jpg',
  ];

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Select Your Child</Typography>
      <Grid container spacing={2}>
        {children.map((child: Child) => (
          <Grid item xs={12} sm={6} md={4} key={child.id}>
            <Card onClick={() => handleChildSelect(child)} sx={{ cursor: 'pointer' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Avatar src={child.avatarUrl || ''} sx={{ width: 80, height: 80, margin: 'auto', mb: 2 }} />
                <Typography variant="h6">{child.name}</Typography>
                <Typography variant="body2">Age: {child.age}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Button variant="contained" sx={{ mt: 4 }} onClick={() => setOpen(true)}>Add Kid</Button>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add New Kid</DialogTitle>
        <DialogContent>
          <TextField fullWidth margin="dense" label="Name" value={newChild.name} onChange={(e) => setNewChild({ ...newChild, name: e.target.value })} />
          <TextField fullWidth margin="dense" label="Age" type="number" value={newChild.age} onChange={(e) => setNewChild({ ...newChild, age: e.target.value })} />
          <TextField select fullWidth margin="dense" label="Gender" value={newChild.gender} onChange={(e) => setNewChild({ ...newChild, gender: e.target.value })}>
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </TextField>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>Select Avatar</Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
              {AVATAR_OPTIONS.map((avatar) => (
                <Avatar
                  key={avatar}
                  src={avatar}
                  sx={{
                    width: 56,
                    height: 56,
                    border: newChild.avatarUrl === avatar ? '3px solid #1976d2' : '2px solid #ccc',
                    cursor: 'pointer',
                    transition: 'border 0.2s',
                  }}
                  onClick={() => setNewChild({ ...newChild, avatarUrl: avatar })}
                />
              ))}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddKid}>Add</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SelectChild;

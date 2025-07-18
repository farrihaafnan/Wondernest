import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Paper, Typography, TextField, MenuItem, Button, Box, Avatar } from '@mui/material';
import { USER_LEARNING_API_BASE_URL } from '../../apiConfig';

const AVATAR_OPTIONS = [
  '/avatars/avatar1.jpg',
  '/avatars/avatar2.jpg',
  '/avatars/avatar3.jpg',
  '/avatars/avatar4.jpg',
  '/avatars/avatar5.jpg',
  '/avatars/avatar6.jpg',
];

const EditChildProfile: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const child = location.state?.child;
  const token = localStorage.getItem('token');

  const [form, setForm] = useState({
    name: child?.name || '',
    age: child?.age || '',
    gender: child?.gender || '',
    avatarUrl: child?.avatarUrl || '',
  });
  const [saving, setSaving] = useState(false);

  if (!child) {
    return <Typography>Child not found.</Typography>;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch(`${USER_LEARNING_API_BASE_URL}/api/children/${child.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...form,
        age: parseInt(form.age),
      }),
    });

      if (!response.ok) throw new Error('Failed to update child but response was not ok');
      const updatedChild = await response.json();
      navigate('/dashboard', { state: { parent: location.state?.parent, child: updatedChild } });
    } catch (error) {
      alert('Failed to update child alert');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Paper sx={{ p: 4, borderRadius: 4 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>Edit Profile</Typography>
        <TextField
          fullWidth
          margin="normal"
          label="Name"
          name="name"
          value={form.name}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Age"
          name="age"
          type="number"
          value={form.age}
          onChange={handleChange}
        />
        <TextField
          select
          fullWidth
          margin="normal"
          label="Gender"
          name="gender"
          value={form.gender}
          onChange={handleChange}
        >
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
                  border: form.avatarUrl === avatar ? '3px solid #1976d2' : '2px solid #ccc',
                  cursor: 'pointer',
                  transition: 'border 0.2s',
                }}
                onClick={() => setForm({ ...form, avatarUrl: avatar })}
              />
            ))}
          </Box>
        </Box>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 3, py: 1.5, fontWeight: 'bold', borderRadius: '30px', textTransform: 'none' }}
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save'}
        </Button>
      </Paper>
    </Container>
  );
};

export default EditChildProfile; 
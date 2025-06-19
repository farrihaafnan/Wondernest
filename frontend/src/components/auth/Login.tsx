import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container, Paper, Typography, TextField, Button, Box, Link, Alert,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

interface LoginFormData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState<LoginFormData>({ email: '', password: '' });
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // Always clear auth state when login page is visited
    localStorage.removeItem('user');
    localStorage.removeItem('token');

    const params = new URLSearchParams(location.search);
    const message = params.get('message');
    if (message) setError(message);
  }, [location]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:8081/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Login failed');

      const data = await response.json();
      localStorage.setItem('user', JSON.stringify(data));
      localStorage.setItem('token', data.token);

      navigate('/select-child');
    } catch {
      setError('Invalid email or password');
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography variant="h4" align="center">Sign In</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit}>
          <TextField required fullWidth label="Email Address" name="email" value={formData.email} onChange={handleChange} margin="normal" />
          <TextField required fullWidth label="Password" type="password" name="password" value={formData.password} onChange={handleChange} margin="normal" />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>Sign In</Button>
          <Box textAlign="center">
            <Link component={RouterLink} to="/register" variant="body2">Don't have an account? Sign up</Link>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;

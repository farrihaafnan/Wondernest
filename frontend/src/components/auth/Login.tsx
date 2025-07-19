import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container, Paper, Typography, TextField, Button, Box, Link, Alert,Grid,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { USER_LEARNING_API_BASE_URL } from '../../apiConfig';

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
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');

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
      const response = await fetch(`${USER_LEARNING_API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Login failed');

      const data = await response.json();
      sessionStorage.setItem('user', JSON.stringify(data));
      sessionStorage.setItem('token', data.token);

      navigate('/parent-options');
    } catch {
      setError('Invalid email or password');
    }
  };

  return (
    <Box
    sx={{
    position: 'absolute',
    top: 63,
    left: 0,
    m: 0,
    p: 0,
    width: '99vw',
    height: '92vh',
    overflow: 'hidden',
    backgroundColor: 'background.default',
    backgroundImage: 'url("/login-illustration3.png")',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'left center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end', // aligns the form to the right
    }}
  >
    <Container maxWidth="lg">
      <Grid container spacing={4} alignItems="center">
        {/* Left Illustration */}
        <Grid item xs={12} md={7}>
         
        </Grid>

        {/* Right Login Form */}
        <Grid item xs={12} md={5}>
          <Paper
            elevation={4}
            sx={{
              p: 4,
              borderRadius: 4,
              bgcolor: 'white',
              boxShadow: 6,
              width: '100%',
              maxWidth: 420,
              mx: 'auto',
              ml: 14,
            }}
          >
            <Typography
              variant="h4"
              align="center"
              sx={{ fontWeight: 'bold', color: 'text.primary', mb: 1 }}
            >
              Welcome Back!
            </Typography>
            <Typography
              variant="body1"
              align="center"
              sx={{ color: 'text.secondary', mb: 3 }}
            >
              Let's get learning again ✨
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                required
                fullWidth
                label="Email Address"
                name="email"
                value={formData.email}
                onChange={handleChange}
                margin="normal"
                sx={{ backgroundColor: '#fff', borderRadius: 2 }}
              />
              <TextField
                required
                fullWidth
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                margin="normal"
                sx={{ backgroundColor: '#fff', borderRadius: 2 }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="secondary"
                sx={{
                  mt: 3,
                  mb: 2,
                  py: 1.5,
                  fontWeight: 'bold',
                  borderRadius: '30px',
                  textTransform: 'none',
                }}
              >
                🚀 Sign In
              </Button>
              <Box textAlign="center">
                <Link component={RouterLink} to="/register" variant="body2">
                  Don't have an account? Sign up
                </Link>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  </Box>
  );
};

export default Login;

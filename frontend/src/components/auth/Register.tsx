import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Link,
  Alert,
  Grid,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { USER_LEARNING_API_BASE_URL } from '../../apiConfig';

interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
}

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterFormData>({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (formData.password.length < 8) {
      setError('Passwords must be at least 8 characters long');
      return;
    }


    try {
      const response = await fetch(`${USER_LEARNING_API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        if (errorMessage.includes('Email already registered')) {
          setError('This email is already registered.');
        } else {
          setError('Registration failed. Please try again.');
        }
        setFormData({ email: '', password: '', confirmPassword: '' });
        return;
      }

      navigate('/login');
    } catch (err) {
      setFormData({ email: '', password: '', confirmPassword: '' });
      setError('Registration failed. Please try again.');
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
        backgroundImage: 'url("/register-illustration.png")',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'left center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        pt: 8
      }}
    >
      <Grid container spacing={0} sx={{ width: '100%', height: '100%' }}>
        {/* Optional: Keep or remove left Grid */}
        <Grid item xs={false} md={7} />

        {/* Right-side Form */}
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
            }}
          >
            <Typography
              variant="h4"
              align="center"
              sx={{ fontWeight: 'bold', color: 'text.primary', mb: 1 }}
            >
              Create Account
            </Typography>
            <Typography
              variant="body1"
              align="center"
              sx={{ color: 'text.secondary', mb: 3 }}
            >
              Let's start your journey ✨
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                sx={{ backgroundColor: '#fff', borderRadius: 2 }}
              />
              <Typography variant="caption" sx={{ mt: 1, ml: 0.5, color: 'error.main' }}>
                Password must be at least 8 characters long
              </Typography>
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                sx={{ backgroundColor: '#fff', borderRadius: 2 }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
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
                🎉 Register
              </Button>
              <Box sx={{ textAlign: 'center' }}>
                <Link component={RouterLink} to="/login" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Register;
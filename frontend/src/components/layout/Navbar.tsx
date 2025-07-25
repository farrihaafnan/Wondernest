import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const isAuthenticated = !!sessionStorage.getItem('token');

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
    navigate('/login?message=You have been logged out.');
  };

  return (
    <AppBar position="static">
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <SchoolIcon sx={{ mr: 2 }} />
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              flexGrow: 1,
              textDecoration: 'none',
              color: 'inherit',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            WonderNest
          </Typography>
          <nav role="navigation">
            <Box>
              {isAuthenticated ? (
                <>
                  <Button
                    color="inherit"
                    component={RouterLink}
                    to="/parent-options"
                    sx={{ mr: 1 }}
                  >
                    Home Page
                  </Button>
                  <Button
                    color="inherit"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    color="inherit"
                    component={RouterLink}
                    to="/login"
                  >
                    Login
                  </Button>
                  <Button
                    color="inherit"
                    component={RouterLink}
                    to="/register"
                  >
                    Register
                  </Button>
                </>
              )}
            </Box>
          </nav>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;

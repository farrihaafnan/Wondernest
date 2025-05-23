import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
} from '@mui/material';
import {
  School as SchoolIcon,
  Psychology as PsychologyIcon,
  Groups as GroupsIcon,
} from '@mui/icons-material';

const Home: React.FC = () => {
  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          mb: 6,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" component="h1" gutterBottom>
                Welcome to WonderNest
              </Typography>
              <Typography variant="h5" paragraph>
                Your AI-powered learning companion for personalized education
              </Typography>
              <Button
                component={RouterLink}
                to="/register"
                variant="contained"
                color="secondary"
                size="large"
                sx={{ mt: 2 }}
              >
                Get Started
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="/hero-image.png"
                alt="Learning illustration"
                sx={{
                  width: '100%',
                  maxWidth: 500,
                  height: 'auto',
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg">
        <Typography variant="h3" component="h2" align="center" gutterBottom>
          Why Choose WonderNest?
        </Typography>
        <Grid container spacing={4} sx={{ mt: 4 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <SchoolIcon color="primary" sx={{ fontSize: 40, mb: 2 }} />
                <Typography variant="h5" component="h3" gutterBottom>
                  Personalized Learning
                </Typography>
                <Typography>
                  AI-powered adaptive learning paths tailored to your unique needs
                  and learning style.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <PsychologyIcon color="primary" sx={{ fontSize: 40, mb: 2 }} />
                <Typography variant="h5" component="h3" gutterBottom>
                  Smart Analytics
                </Typography>
                <Typography>
                  Track your progress with detailed insights and recommendations
                  for improvement.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <GroupsIcon color="primary" sx={{ fontSize: 40, mb: 2 }} />
                <Typography variant="h5" component="h3" gutterBottom>
                  Community Learning
                </Typography>
                <Typography>
                  Connect with peers, share knowledge, and learn together in a
                  supportive environment.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Home; 
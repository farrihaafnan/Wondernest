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
import { motion } from 'framer-motion';

const Home: React.FC = () => {
  return (
     <Box>
      {/* Hero Section */}
      <Box sx={{ position: 'relative', bgcolor: 'background.default', overflow: 'hidden' }}>
  {/* Doodle Background */}
  <Box
    sx={{
      backgroundImage: 'url("/bgdoodles2.png")',
      backgroundRepeat: 'repeat',
      backgroundSize: 'cover',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      opacity: 0.25,
      zIndex: 0,
    }}
  />

  {/* Main Hero Content */}
  <Box sx={{ py: { xs: 10, md: 14 }, position: 'relative', zIndex: 2 }}>
    <Container maxWidth="lg">
      <Grid container spacing={6} alignItems="center">
        <Grid item xs={12} md={6}>
          <Typography variant="h2" sx={{ fontWeight: 700, color: 'text.primary' }} gutterBottom>
            Learning Starts with Wonder!
          </Typography>
          <Typography variant="h5" sx={{ mb: 4, color: 'text.secondary' }}>
            WonderNest makes every lesson feel like playtime — powered by AI, designed for kids.
          </Typography>
          <Button
            component={RouterLink}
            to="/register"
            variant="contained"
            color="secondary"
            sx={{
              borderRadius: '30px',
              px: 9,
              py: 2,
              fontWeight: 'bold',
              boxShadow: 2,
              textTransform: 'none',
            }}
          >
            ✏️ Get Started
          </Button>
        </Grid>

        {/* Character Illustration */}
        <Grid item xs={12} md={6}>
          <Box
            component="img"
            src="/character.png"
            alt="Cute character"
            sx={{ width: '100%', maxWidth: 650, display: 'block', objectFit: 'contain', objectPosition: 'bottom',  mt: { xs: -10, md: -10 } }}
          />
        </Grid>
      </Grid>
    </Container>
  </Box>

  {/* 🔽 SVG Wavy Bottom Divider
  <Box
    component="svg"
    viewBox="0 0 1440 320"
    preserveAspectRatio="none"
    sx={{
      display: 'block',
      width: '100%',
      height: 50,
      position: 'relative',
      top: 0,
      zIndex: 1,
    }}
  >
    <path
      fill="#FFF8E1" // This should match your background.default to transition smoothly
      d="M0,256L48,245.3C96,235,192,213,288,197.3C384,181,480,171,576,186.7C672,203,768,245,864,250.7C960,256,1056,224,1152,213.3C1248,203,1344,213,1392,218.7L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
    />
  </Box> */}
</Box>






{/* Decorative Wave Transition */}
<Box sx={{ position: 'relative', width: '100%', zIndex: 1 }}>
  <svg
    viewBox="0 0 1440 100"
    preserveAspectRatio="none"
    style={{ display: 'block', width: '100%', height: '100px' }}
  >
    <defs>
      <pattern
        id="doodleBg"
        patternUnits="userSpaceOnUse"
        width="400"
        height="250"
      >
        <image href="/bgdoodles.png" x="0" y="0" width="400" height="250" />
      </pattern>
    </defs>
    <path
      d="M0,80 C360,100 1080,0 1440,60 L1440,100 L0,100 Z"
      fill="url(#doodleBg)"
    />
  </svg>
</Box>

{/* How It Works Section */}
<Box
  sx={{
    backgroundImage: 'url("/bgdoodles.png")',
    backgroundRepeat: 'repeat',
    backgroundSize: 'cover',
    bgcolor: 'primary.main',
    py: 8,
    position: 'relative',
    zIndex: 0,
  }}
>
  <Container maxWidth="lg">
    <Typography
      variant="h3"
      align="center"
      color="white"
      gutterBottom
      sx={{ fontWeight: 'bold' }}
    >
      How It Works
    </Typography>

    <Grid container spacing={4} sx={{ mt: 4 }}>
      {[
        {
          icon: '🎯',
          title: 'Pick Your Topic',
          description: 'Choose what you want to learn — Math, Science, Stories and more!',
        },
        {
          icon: '🤖',
          title: 'Smart Plan',
          description: 'WonderNest creates a fun learning path just for you!',
        },
        {
          icon: '🎉',
          title: 'Learn & Play',
          description: 'Enjoy lessons, games, and challenges made to help you grow.',
        },
      ].map((step, index) => (
        <Grid item xs={12} md={4} key={index}>
          <Card
            sx={{
              textAlign: 'center',
              py: 4,
              px: 3,
              borderRadius: 4,
              height: '100%',
              bgcolor: 'white',
              boxShadow: 3,
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)',
              },
            }}
          >
            <Typography variant="h2" component="div" gutterBottom>
              {step.icon}
            </Typography>
            <Typography
              variant="h5"
              gutterBottom
              sx={{ color: 'text.primary', fontWeight: 'bold' }}
            >
              {step.title}
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>
              {step.description}
            </Typography>
          </Card>
        </Grid>
      ))}
    </Grid>
  </Container>
</Box>


{/* ✨ Features Section - Bento Layout with Mascots */}
<Box sx={{ py: 12, bgcolor: 'background.default' }}>
  <Container maxWidth="lg">
    <Typography
      variant="h3"
      align="center"
      sx={{ fontWeight: 'bold', color: 'text.primary', mb: 20 }}
    >
      Discover the Magic!
    </Typography>

    <Grid container spacing={6}>
      {[
        {
          title: 'Personalized Learning',
          description: 'Every child learns at their own pace with tailored AI-driven paths.',
          image: '/mascot-pointing.svg',
        },
        {
          title: 'Smart Insights',
          description: 'Track growth with fun visuals and helpful progress updates.',
          image: '/mascot-graph.svg',
        },
        {
          title: 'Safe Peer Interaction',
          description: 'Connect safely with classmates and learn together.',
          image: '/mascot-friends.svg',
        },
      ].map((feature, index) => (
        <Grid item xs={12} md={4} key={index}>
          <Box sx={{ position: 'relative', pt: 8 }}>
            {/* Mascot */}
            <Box
              component="img"
              src={feature.image}
              alt={feature.title}
              sx={{
                height: 220,
                position: 'absolute',
                top: -120,
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 2,
              }}
            />

            {/* Card */}
            <Card
              sx={{
                textAlign: 'center',
                pt: 8,
                pb: 4,
                px: 3,
                borderRadius: 4,
                boxShadow: 3,
                backgroundColor: 'white',
                minHeight: 240,
              }}
            >
              <Typography
                variant="h5"
                sx={{ fontWeight: 'bold', color: 'text.primary', mb: 1 }}
              >
                {feature.title}
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}>
                {feature.description}
              </Typography>
            </Card>
          </Box>
        </Grid>
      ))}
    </Grid>
  </Container>
</Box>



    </Box>
  );
};

export default Home; 
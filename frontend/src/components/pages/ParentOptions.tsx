import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Paper, Typography, Button, Box, Grid } from '@mui/material';

const ParentOptions: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'background.default' }}>
      <Container maxWidth="sm">
        <Paper elevation={4} sx={{ p: 4, borderRadius: 4, textAlign: 'center' }}>
          <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
            Welcome, Parent!
          </Typography>
          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ py: 2, borderRadius: '30px', fontWeight: 'bold', textTransform: 'none' }}
                onClick={() => navigate('/select-child')}
              >
                Login as Child
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="outlined"
                color="secondary"
                fullWidth
                sx={{ py: 2, borderRadius: '30px', fontWeight: 'bold', textTransform: 'none' }}
                onClick={() => navigate('/select-child-progress')}
              >
                View Child Progress
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default ParentOptions; 
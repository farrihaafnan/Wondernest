import React from 'react';
import { useParams } from 'react-router-dom';
import { Container, Paper, Typography, Box } from '@mui/material';

const ChildProgress: React.FC = () => {
  const { childId } = useParams();
  const user = JSON.parse(sessionStorage.getItem('user') || '{}');
  const parentId = user.id;

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'background.default' }}>
      <Container maxWidth="sm">
        <Paper elevation={4} sx={{ p: 4, borderRadius: 4, textAlign: 'center' }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
            Child Progress Page
          </Typography>
          <Typography variant="body1">Parent ID: {parentId}</Typography>
          <Typography variant="body1">Child ID: {childId}</Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default ChildProgress; 
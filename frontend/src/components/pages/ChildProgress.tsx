import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Paper, Typography, Box, Button, Dialog, DialogContent } from '@mui/material';
import ScreenTimeDisplay from '../dashboard/ScreenTimeDisplay';
import { USER_LEARNING_API_BASE_URL } from '../../apiConfig';

interface Child {
  id: string;
  name: string;
  age: number;
  gender: string;
  avatarUrl?: string;
}

interface AvgScores {
  wordMatchingAvg: number | null;
  sentenceCorrectionAvg: number | null;
}

const ChildProgress: React.FC = () => {
  const { childId } = useParams();
  const user = JSON.parse(sessionStorage.getItem('user') || '{}');
  const parentId = user.id;
  const [child, setChild] = useState<Child | null>(null);
  const [screenTimeDialogOpen, setScreenTimeDialogOpen] = useState(false);
  const [avgScores, setAvgScores] = useState<AvgScores>({ wordMatchingAvg: null, sentenceCorrectionAvg: null });

  useEffect(() => {
    // Fetch child data to display child name
    const fetchChildData = async () => {
      try {
        const token = sessionStorage.getItem('token');
        if (!token || !parentId) return;

        const response = await fetch(`${USER_LEARNING_API_BASE_URL}/api/parents/${parentId}/children`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.ok) {
          const children = await response.json();
          const currentChild = children.find((c: Child) => c.id === childId);
          if (currentChild) {
            setChild(currentChild);
          }
        }
      } catch (error) {
        console.error('Failed to fetch child data:', error);
      }
    };

    const fetchAvgScores = async () => {
      try {
        const res = await fetch(`${USER_LEARNING_API_BASE_URL}/api/progress/${childId}/avg-scores`);
        if (res.ok) {
          const data = await res.json();
          setAvgScores({
            wordMatchingAvg: data.wordMatchingAvg,
            sentenceCorrectionAvg: data.sentenceCorrectionAvg
          });
          console.log('[DEBUG] Frontend avgScores:', data);
        }
      } catch (error) {
        setAvgScores({ wordMatchingAvg: null, sentenceCorrectionAvg: null });
      }
    };

    fetchChildData();
    if (childId) fetchAvgScores();
  }, [childId, parentId]);

  const handleViewScreenTime = () => {
    setScreenTimeDialogOpen(true);
  };

  const handleCloseScreenTime = () => {
    setScreenTimeDialogOpen(false);
  };

  if (!childId) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'background.default' }}>
        <Container maxWidth="sm">
          <Paper elevation={4} sx={{ p: 4, borderRadius: 4, textAlign: 'center' }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: 'error.main' }}>
              Error: Child not found
            </Typography>
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'background.default' }}>
      <Container maxWidth="sm">
        <Paper elevation={4} sx={{ p: 4, borderRadius: 4, textAlign: 'center' }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
            {child ? `${child.name}'s Progress` : 'Child Progress Page'}
          </Typography>
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="body1" sx={{ mb: 1 }}>Parent ID: {parentId}</Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>Child ID: {childId}</Typography>
            {/* Avg scores display */}
            <Typography variant="h6" sx={{ mt: 2, mb: 1, color: 'primary.main' }}>
              Average Scores
            </Typography>
            <Typography variant="body1">
              Word Matching: {avgScores.wordMatchingAvg !== null ? avgScores.wordMatchingAvg.toFixed(2) : 'N/A'}
            </Typography>
            <Typography variant="body1">
              Sentence Correction: {avgScores.sentenceCorrectionAvg !== null ? avgScores.sentenceCorrectionAvg.toFixed(2) : 'N/A'}
            </Typography>
          </Box>

          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleViewScreenTime}
            sx={{
              px: 4,
              py: 2,
              fontWeight: 'bold',
              borderRadius: '30px',
              textTransform: 'none',
              fontSize: '1.1rem'
            }}
          >
            📊 View Screen Time
          </Button>
        </Paper>
      </Container>

      <Dialog
        open={screenTimeDialogOpen}
        onClose={handleCloseScreenTime}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 4 }
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          <ScreenTimeDisplay
            childId={childId}
            onClose={handleCloseScreenTime}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ChildProgress; 
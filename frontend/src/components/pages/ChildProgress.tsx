import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Paper, Typography, Box, Button, Dialog, DialogContent } from '@mui/material';
import ScreenTimeDisplay from '../dashboard/ScreenTimeDisplay';
import BehaviorFlagsDisplay from '../dashboard/BehaviorFlagsDisplay';
import { USER_LEARNING_API_BASE_URL } from '../../apiConfig';
import { EVALUATION_API_BASE_URL } from '../../apiConfig';

interface Child {
  id: string;
  name: string;
  age: number;
  gender: string;
  avatarUrl?: string;
}

const ChildProgress: React.FC = () => {
  const { childId } = useParams();
  const user = JSON.parse(sessionStorage.getItem('user') || '{}');
  const parentId = user.id;
  const [child, setChild] = useState<Child | null>(null);
  const [screenTimeDialogOpen, setScreenTimeDialogOpen] = useState(false);
  const [behaviorFlagsDialogOpen, setBehaviorFlagsDialogOpen] = useState(false);
  const [hasBehaviorFlags, setHasBehaviorFlags] = useState(false);
  const [scoreDialogOpen, setScoreDialogOpen] = useState(false);
  const [wordMatchingScores, setWordMatchingScores] = useState<any>(null);
  const [sentenceCorrectionScores, setSentenceCorrectionScores] = useState<any>(null);
  const [scoreLoading, setScoreLoading] = useState(false);
  const [scoreError, setScoreError] = useState('');

  useEffect(() => {
    // Fetch child data to display child name and check behavior flags
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

        // Check if child has behavior flags
        if (childId) {
          const behaviorResponse = await fetch(`${USER_LEARNING_API_BASE_URL}/api/behavior-flags/child/${childId}/exists`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          if (behaviorResponse.ok) {
            const hasFlags = await behaviorResponse.json();
            setHasBehaviorFlags(hasFlags);
          }
        }
      } catch (error) {
        console.error('Failed to fetch child data:', error);
      }
    };

    fetchChildData();
  }, [childId, parentId]);

  useEffect(() => {
    if (!scoreDialogOpen || !childId) return;
    const fetchScores = async () => {
      setScoreLoading(true);
      setScoreError('');
      try {
        const [wmResp, scResp] = await Promise.all([
          fetch(`${EVALUATION_API_BASE_URL}/evaluation/word-matching/weekly-averages?childId=${childId}`),
          fetch(`${EVALUATION_API_BASE_URL}/evaluation/sentence-correction/weekly-averages?childId=${childId}`)
        ]);
        if (!wmResp.ok || !scResp.ok) throw new Error('Failed to fetch scores');
        setWordMatchingScores(await wmResp.json());
        setSentenceCorrectionScores(await scResp.json());
      } catch (err) {
        setScoreError('Failed to load scores. Please try again.');
      } finally {
        setScoreLoading(false);
      }
    };
    fetchScores();
  }, [scoreDialogOpen, childId]);

  const handleViewScreenTime = () => {
    setScreenTimeDialogOpen(true);
  };

  const handleCloseScreenTime = () => {
    setScreenTimeDialogOpen(false);
  };

  const handleViewBehaviorFlags = () => {
    setBehaviorFlagsDialogOpen(true);
  };

  const handleCloseBehaviorFlags = () => {
    setBehaviorFlagsDialogOpen(false);
  };

  const handleViewScore = () => {
    setScoreDialogOpen(true);
  };

  const handleCloseScore = () => {
    setScoreDialogOpen(false);
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
          

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
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
                fontSize: '1.1rem',
                width: '100%',
                maxWidth: '300px'
              }}
            >
              📊 View Screen Time
            </Button>

            {hasBehaviorFlags && (
              <Button
                variant="contained"
                color="warning"
                size="large"
                onClick={handleViewBehaviorFlags}
                sx={{
                  px: 4,
                  py: 2,
                  fontWeight: 'bold',
                  borderRadius: '30px',
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  width: '100%',
                  maxWidth: '300px'
                }}
              >
                🚩 Behavior Flags
              </Button>
            )}
            
            <Button
              variant="contained"
              color="secondary"
              size="large"
              onClick={handleViewScore}
              sx={{
                px: 4,
                py: 2,
                fontWeight: 'bold',
                borderRadius: '30px',
                textTransform: 'none',
                fontSize: '1.1rem',
                width: '100%',
                maxWidth: '300px'
              }}
            >
              🏆 Show Score
            </Button>
          </Box>
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

      <Dialog
        open={behaviorFlagsDialogOpen}
        onClose={handleCloseBehaviorFlags}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 4 }
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          <BehaviorFlagsDisplay
            childId={childId}
            onClose={handleCloseBehaviorFlags}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={scoreDialogOpen}
        onClose={handleCloseScore}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 4 }
        }}
      >
        <DialogContent sx={{ p: 3 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', textAlign: 'center' }}>
            {child ? `${child.name}'s Scores` : 'Child Scores'}
          </Typography>
          {scoreLoading ? (
            <Typography>Loading...</Typography>
          ) : scoreError ? (
            <Typography color="error">{scoreError}</Typography>
          ) : (
            <>
              {/* Word Matching Table */}
              <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Word Matching (Score per Test(Out of 5))</Typography>
              {wordMatchingScores ? (
                <Box sx={{ overflowX: 'auto', mb: 2 }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
                        <th style={{ border: '1px solid #ccc', padding: 8 }}>Range</th>
                        <th style={{ border: '1px solid #ccc', padding: 8 }}>This Week</th>
                        <th style={{ border: '1px solid #ccc', padding: 8 }}>Last Week</th>
                      </tr>
                    </thead>
                    <tbody>
                      {['A-E', 'F-J', 'K-O', 'P-T', 'U-Z'].map((range) => (
                        <tr key={range}>
                          <td style={{ border: '1px solid #ccc', padding: 8 }}>{range}</td>
                          <td style={{ border: '1px solid #ccc', padding: 8 }}>{wordMatchingScores[range]?.thisWeek?.toFixed(2) ?? '-'}</td>
                          <td style={{ border: '1px solid #ccc', padding: 8 }}>{wordMatchingScores[range]?.lastWeek?.toFixed(2) ?? '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Box>
              ) : <Typography>No word matching data.</Typography>}
              {/* Sentence Correction */}
              <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>Sentence Correction (Score per Test (Out of 5))</Typography>
              {sentenceCorrectionScores ? (
                <Box sx={{ mb: 2 }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
                        <th style={{ border: '1px solid #ccc', padding: 8 }}>This Week</th>
                        <th style={{ border: '1px solid #ccc', padding: 8 }}>Last Week</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={{ border: '1px solid #ccc', padding: 8 }}>{sentenceCorrectionScores.thisWeek?.toFixed(2)}</td>
                        <td style={{ border: '1px solid #ccc', padding: 8 }}>{sentenceCorrectionScores.lastWeek?.toFixed(2)}</td>
                      </tr>
                    </tbody>
                  </table>
                </Box>
              ) : <Typography>No sentence correction data.</Typography>}
            </>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button variant="contained" onClick={handleCloseScore} sx={{ px: 4 }}>
              Close
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ChildProgress;
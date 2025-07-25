import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Paper, Typography, Box, Button, Dialog, DialogContent } from '@mui/material';
import ScreenTimeDisplay from '../dashboard/ScreenTimeDisplay';
import BehaviorFlagsDisplay from '../dashboard/BehaviorFlagsDisplay';
import { USER_LEARNING_API_BASE_URL } from '../../apiConfig';

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
          </Box>

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
                minWidth: '200px'
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
                  minWidth: '200px'
                }}
              >
                🚩 Behavior Flags
              </Button>
            )}
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
    </Box>
  );
};

export default ChildProgress; 
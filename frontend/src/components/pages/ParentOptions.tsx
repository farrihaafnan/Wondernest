import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Paper, 
  Typography, 
  Button, 
  Box, 
  Grid,
  IconButton,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Chip,
  Divider
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useUser } from '../../contexts/UserContext';
import { USER_LEARNING_API_BASE_URL } from '../../apiConfig';

interface BehaviorFlag {
  id: string;
  childId: string;
  childName: string;
  activityType: string;
  submittedText: string;
  offensiveWords: string[];
  flaggedAt: string;
  isSeen: boolean;
  displayActivityType: string;
}

const ParentOptions: React.FC = () => {
  const navigate = useNavigate();
  const { user, token } = useUser();
  const [notificationCount, setNotificationCount] = useState<number>(0);
  const [notificationOpen, setNotificationOpen] = useState<boolean>(false);
  const [behaviorFlags, setBehaviorFlags] = useState<BehaviorFlag[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch notification count when component mounts
  const fetchNotificationCount = useCallback(async () => {
    if (!user || !token) return;
    
    try {
      const response = await fetch(
        `${USER_LEARNING_API_BASE_URL}/api/behavior-flags/parent/${user.id}/unseen/count`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      if (response.ok) {
        const count = await response.json();
        setNotificationCount(count);
      }
    } catch (error) {
      console.error('Error fetching notification count:', error);
    }
  }, [user, token]);

  useEffect(() => {
    fetchNotificationCount();
  }, [fetchNotificationCount]);

  const fetchBehaviorFlags = async () => {
    if (!user || !token) return;
    
    setLoading(true);
    try {
      const response = await fetch(
        `${USER_LEARNING_API_BASE_URL}/api/behavior-flags/parent/${user.id}/unseen`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      if (response.ok) {
        const flags = await response.json();
        setBehaviorFlags(flags);
      }
    } catch (error) {
      console.error('Error fetching behavior flags:', error);
    } finally {
      setLoading(false);
    }
  };

  const markFlagsAsSeen = async () => {
    if (!user || !token || behaviorFlags.length === 0) return;
    
    try {
      const flagIds = behaviorFlags.map(flag => flag.id);
      const response = await fetch(
        `${USER_LEARNING_API_BASE_URL}/api/behavior-flags/mark-seen`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(flagIds),
        }
      );
      
      if (response.ok) {
        setNotificationCount(0);
        setBehaviorFlags([]);
      }
    } catch (error) {
      console.error('Error marking flags as seen:', error);
    }
  };

  const handleNotificationClick = async () => {
    setNotificationOpen(true);
    await fetchBehaviorFlags();
  };

  const handleCloseNotification = async () => {
    setNotificationOpen(false);
    if (behaviorFlags.length > 0) {
      await markFlagsAsSeen();
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'background.default' }}>
      {/* Notification Button - Fixed Position */}
      <IconButton
        onClick={handleNotificationClick}
        sx={{
          position: 'fixed',
          top: 80,
          right: 20,
          backgroundColor: 'primary.main',
          color: 'white',
          '&:hover': {
            backgroundColor: 'primary.dark',
          },
        }}
        size="large"
      >
        <Badge badgeContent={notificationCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

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

      {/* Notification Dialog */}
      <Dialog
        open={notificationOpen}
        onClose={handleCloseNotification}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Inappropriate Words Detected
          </Typography>
        </DialogTitle>
        <DialogContent>
          {loading ? (
            <Typography>Loading...</Typography>
          ) : behaviorFlags.length === 0 ? (
            <Typography>No new inappropriate words detected.</Typography>
          ) : (
            <List>
              {behaviorFlags.map((flag, index) => (
                <React.Fragment key={flag.id}>
                  <ListItem alignItems="flex-start">
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                            {flag.displayActivityType}
                          </Typography>
                          <Chip
                            label={flag.childName || `Child ID: ${flag.childId.substring(0, 8)}...`}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            <strong>Submitted Text:</strong> "{flag.submittedText}"
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                            <Typography variant="body2" sx={{ mr: 1 }}>
                              <strong>Inappropriate Words:</strong>
                            </Typography>
                            {flag.offensiveWords.map((word, wordIndex) => (
                              <Chip
                                key={wordIndex}
                                label={word}
                                size="small"
                                color="error"
                                variant="filled"
                              />
                            ))}
                          </Box>
                          <Typography variant="caption" color="text.secondary">
                            Detected on: {new Date(flag.flaggedAt).toLocaleString()}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < behaviorFlags.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseNotification} variant="contained">
            Mark as Seen
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ParentOptions; 
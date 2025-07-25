import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Button,
  CircularProgress,
  Alert,
  Divider,
  Chip,
  Card,
  CardContent
} from '@mui/material';
import { USER_LEARNING_API_BASE_URL } from '../../apiConfig';

interface BehaviorFlag {
  id: string;
  childId: string;
  activityType: string;
  submittedText: string;
  offensiveWords: string[];
  flaggedAt: string;
  displayActivityType: string;
}

interface BehaviorFlagsDisplayProps {
  childId: string;
  onClose: () => void;
}

const BehaviorFlagsDisplay: React.FC<BehaviorFlagsDisplayProps> = ({ childId, onClose }) => {
  const [behaviorFlags, setBehaviorFlags] = useState<BehaviorFlag[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        
        const token = sessionStorage.getItem('token');
        if (!token) {
          setError('Please login to view behavior flags');
          setLoading(false);
          return;
        }

        console.log(`[BehaviorFlags] Fetching behavior flags for child: ${childId}`);

        const response = await fetch(`${USER_LEARNING_API_BASE_URL}/api/behavior-flags/child/${childId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch behavior flags data');
        }

        const data = await response.json();
        setBehaviorFlags(data);
        
        console.log(`[BehaviorFlags] Fetched ${data.length} behavior flags`);
      } catch (err) {
        setError('Failed to load behavior flags data. Please try again.');
        console.error('Error fetching behavior flags data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [childId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={onClose}>
          Close
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', textAlign: 'center' }}>
        {behaviorFlags.length === 0 ? '✅ Behavior Report' : '🚩 Behavior Flags Report'}
      </Typography>

      {behaviorFlags.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="success.main" sx={{ mb: 2 }}>
            ✅ No Inappropriate Behavior Detected
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Great news! Your child has not used any inappropriate language in their activities.
          </Typography>
        </Box>
      ) : (
        <>
          <Alert severity="warning" sx={{ mb: 3 }}>
            <Typography variant="body2">
              <strong>{behaviorFlags.length}</strong> instance{behaviorFlags.length > 1 ? 's' : ''} of inappropriate language detected. 
              Please discuss appropriate language with your child.
            </Typography>
          </Alert>

          <Box sx={{ mb: 3 }}>
            {behaviorFlags.map((flag, index) => (
              <Card key={flag.id} sx={{ mb: 2, border: '1px solid #ffcc02' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Chip 
                      label={flag.displayActivityType} 
                      color="primary" 
                      size="small"
                      sx={{ fontWeight: 'bold' }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(flag.flaggedAt)}
                    </Typography>
                  </Box>

                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
                    Submitted Text:
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      mb: 2, 
                      p: 1, 
                      backgroundColor: '#f5f5f5', 
                      borderRadius: 1,
                      fontStyle: 'italic'
                    }}
                  >
                    "{truncateText(flag.submittedText)}"
                  </Typography>

                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
                    Detected Words:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {flag.offensiveWords.map((word, wordIndex) => (
                      <Chip 
                        key={wordIndex}
                        label={word}
                        color="error"
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>

          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2">
              💡 <strong>Tip:</strong> Use this as an opportunity to discuss appropriate language and digital citizenship with your child.
            </Typography>
          </Alert>
        </>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Button variant="contained" onClick={onClose} sx={{ px: 4 }}>
          Close
        </Button>
      </Box>
    </Box>
  );
};

export default BehaviorFlagsDisplay;

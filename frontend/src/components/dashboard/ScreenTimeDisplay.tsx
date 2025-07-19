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
  Divider
} from '@mui/material';
import { USER_LEARNING_API_BASE_URL } from '../../apiConfig';

interface ScreenTimeSummary {
  activityType: string;
  displayName: string;
  totalTimeSeconds: number;
  formattedTime: string;
}

interface ScreenTimeDisplayProps {
  childId: string;
  onClose: () => void;
}

const ScreenTimeDisplay: React.FC<ScreenTimeDisplayProps> = ({ childId, onClose }) => {
  const [screenTimeData, setScreenTimeData] = useState<ScreenTimeSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        
        const token = sessionStorage.getItem('token');
        if (!token) {
          setError('Please login to view screen time data');
          setLoading(false);
          return;
        }

        const response = await fetch(`${USER_LEARNING_API_BASE_URL}/api/screen-time/summary/${childId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch screen time data');
        }

        const data = await response.json();
        setScreenTimeData(data);
      } catch (err) {
        setError('Failed to load screen time data. Please try again.');
        console.error('Error fetching screen time data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [childId]);

  const getTotalScreenTime = () => {
    const totalSeconds = screenTimeData.reduce((total, item) => total + item.totalTimeSeconds, 0);
    return formatTime(totalSeconds);
  };

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
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
        Screen Time Report (Last 7 Days)
      </Typography>

      {screenTimeData.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No screen time data available for the last 7 days
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Your child hasn't used any activities yet, or the data is older than 7 days.
          </Typography>
        </Box>
      ) : (
        <>
          <Paper elevation={2} sx={{ p: 2, mb: 3, backgroundColor: '#f5f5f5' }}>
            <Typography variant="h6" sx={{ textAlign: 'center', fontWeight: 'bold' }}>
              Total Screen Time: {getTotalScreenTime()}
            </Typography>
          </Paper>

          <Paper elevation={1} sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
              Activity Breakdown:
            </Typography>
            
            <List>
              {screenTimeData.map((item, index) => (
                <React.Fragment key={item.activityType}>
                  <ListItem>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                          {item.displayName}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary">
                          {item.formattedTime}
                        </Typography>
                      }
                    />
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                        {item.formattedTime}
                      </Typography>
                    </Box>
                  </ListItem>
                  {index < screenTimeData.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
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

export default ScreenTimeDisplay;

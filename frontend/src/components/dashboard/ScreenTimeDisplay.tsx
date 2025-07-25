import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { USER_LEARNING_API_BASE_URL } from '../../apiConfig';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';

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
  const [weeklyAverages, setWeeklyAverages] = useState<any>(null);

  useEffect(() => {
    const fetchSummary = async () => {
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

    fetchSummary();
  }, [childId]);

  useEffect(() => {
    const fetchWeeklyData = async () => {
      try {
        setLoading(true);
        setError('');
        const token = sessionStorage.getItem('token');
        if (!token) {
          setError('Please login to view screen time data');
          setLoading(false);
          return;
        }

        const resp = await fetch(`${USER_LEARNING_API_BASE_URL}/api/screen-time/weekly-activity/${childId}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!resp.ok) throw new Error('Failed to fetch weekly averages');
        const weeklyData = await resp.json();
        setWeeklyAverages(weeklyData);
      } catch (err) {
        setError('Failed to load screen time data. Please try again.');
        console.error('Error fetching screen time data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeeklyData();
  }, [childId]);

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

  const activityDisplayNames: Record<string, string> = {
    word_flashcard: 'Word Flashcards',
    picture_puzzle: 'Picture Puzzles',
    story_generation: 'Story Generation',
    sentence_learning: 'Sentence Learning',
    word_match: 'Word Matching',
    sentence_correction: 'Sentence Correction',
  };

  const allActivities = Object.keys(activityDisplayNames);

  const chartData = allActivities.map((activity) => ({
    name: activityDisplayNames[activity],
    thisWeek: Math.round((weeklyAverages?.thisWeek?.[activity] || 0) / 60),
    lastWeek: Math.round((weeklyAverages?.lastWeek?.[activity] || 0) / 60),
  }));

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
        Screen Time Report (Per Day)
      </Typography>

      {weeklyAverages ? (
        <>
          <TableContainer component={Paper} sx={{ mb: 4 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Activity</TableCell>
                  <TableCell align="center">This Week Avg</TableCell>
                  <TableCell align="center">Last Week Avg</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {allActivities.map((activity) => (
                  <TableRow key={activity}>
                    <TableCell>{activityDisplayNames[activity]}</TableCell>
                    <TableCell align="center">
                      {weeklyAverages.thisWeek?.[activity]
                        ? `${Math.round(weeklyAverages.thisWeek[activity] / 60)}m`
                        : '0m'}
                    </TableCell>
                    <TableCell align="center">
                      {weeklyAverages.lastWeek?.[activity]
                        ? `${Math.round(weeklyAverages.lastWeek[activity] / 60)}m`
                        : '0m'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* New Total Screen Time Table */}
          <TableContainer component={Paper} sx={{ mb: 4 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell colSpan={2} align="center" sx={{ fontWeight: 'bold' }}>
                    Total Screen Time (Per Day)
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="center">This Week (Total)</TableCell>
                  <TableCell align="center">Last Week (Total)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell align="center">
                    {formatTime(
                      allActivities.reduce((sum, activity) => sum + (weeklyAverages?.thisWeekRaw?.[activity] ?? weeklyAverages?.thisWeek?.[activity] ?? 0), 0)
                    )}
                  </TableCell>
                  <TableCell align="center">
                    {formatTime(
                      allActivities.reduce((sum, activity) => sum + (weeklyAverages?.lastWeekRaw?.[activity] ?? weeklyAverages?.lastWeek?.[activity] ?? 0), 0)
                    )}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          <Typography variant="h6" sx={{ mb: 2, mt: 1 }}>
            Weekly Screen Time Comparison (in minutes)
          </Typography>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 0, bottom: 50 }}
            >
              <XAxis
                dataKey="name"
                interval={0}
                angle={-20}
                textAnchor="end"
              />
              <YAxis label={{ value: 'Minutes', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend layout="horizontal" verticalAlign="top" align="center" />
              <Bar dataKey="thisWeek" fill="#1976d2" name="This Week" />
              <Bar dataKey="lastWeek" fill="#90caf9" name="Last Week" />
            </BarChart>
          </ResponsiveContainer>
        </>
      ) : (
        <Typography>No weekly screen time data available.</Typography>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Button variant="contained" onClick={onClose} sx={{ px: 4 }}>
          Close
        </Button>
      </Box>
    </Box>
  );
};

export default ScreenTimeDisplay;

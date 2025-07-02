import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Alert,
  CircularProgress,
  Paper,
  Container,
  Chip,
  Divider
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { USER_LEARNING_API_BASE_URL } from '../../apiConfig';

interface Child {
  id: string;
  name: string;
  age: number;
  gender: string;
}

interface SentenceLearningResponse {
  imageUrl: string;
  feedback: string;
  isCorrect: boolean;
  correctedSentence: string | null;
  imageDescription: string;
}

const SentenceLearning: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [child, setChild] = useState<Child | null>(null);
  const [sentence, setSentence] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [response, setResponse] = useState<SentenceLearningResponse | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [imageGenerated, setImageGenerated] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (!token || !storedUser) {
      navigate('/login?message=Please login to access this feature');
      return;
    }

    const state = location.state as any;
    if (state?.parent && state?.child) {
      setChild(state.child);
    } else {
      navigate('/select-child');
    }
  }, [location, navigate]);

  const generateImage = async () => {
    if (!child) {
      setError('Child information not found.');
      return;
    }

    setLoading(true);
    setError('');
    setShowResult(false);
    setSentence('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${USER_LEARNING_API_BASE_URL}/api/sentence-learning/generate-image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          childId: child.id,
          childName: child.name,
          childAge: child.age,
          childGender: child.gender,
          sentence: '',
          imageDescription: ''
        })
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login?message=Your session has expired. Please login again');
          return;
        }
        throw new Error(`Error: ${response.statusText}`);
      }

      const data: SentenceLearningResponse = await response.json();
      setResponse(data);
      setImageGenerated(true);
    } catch (err) {
      console.error(err);
      setError('Failed to generate image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!sentence.trim()) {
      setError('Please enter a sentence about the image.');
      return;
    }

    if (!child || !response) {
      setError('Child information or image not found.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const evaluationResponse = await fetch(`${USER_LEARNING_API_BASE_URL}/api/sentence-learning/evaluate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          childId: child.id,
          childName: child.name,
          childAge: child.age,
          childGender: child.gender,
          sentence: sentence.trim(),
          imageDescription: response.imageDescription
        })
      });

      if (!evaluationResponse.ok) {
        if (evaluationResponse.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login?message=Your session has expired. Please login again');
          return;
        }
        throw new Error(`Error: ${evaluationResponse.statusText}`);
      }

      const data: SentenceLearningResponse = await evaluationResponse.json();
      // Preserve the existing image URL since evaluation doesn't return a new image
      setResponse({
        ...data,
        imageUrl: response.imageUrl
      });
      setShowResult(true);
    } catch (err) {
      console.error(err);
      setError('Failed to evaluate sentence. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleNewImage = () => {
    setSentence('');
    setResponse(null);
    setShowResult(false);
    setImageGenerated(false);
    setError('');
  };

  if (!child) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom align="center" color="primary">
        Sentence Learning
      </Typography>
      
      <Typography variant="h6" gutterBottom align="center" color="text.secondary">
        Hi {child.name}! Look at the image and write a sentence about what you see.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {!imageGenerated ? (
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Click the button below to generate a new image!
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={generateImage}
            disabled={loading}
            sx={{ mb: 3 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Generate New Image'}
          </Button>
        </Box>
      ) : response && (
        <Box sx={{ mb: 4 }}>
          <Card sx={{ mb: 3 }}>
            <CardMedia
              component="img"
              height="400"
              image={response.imageUrl}
              alt="Generated image"
              sx={{ objectFit: 'contain' }}
            />
            <CardContent>
              <Typography variant="h6" gutterBottom>
                What do you see in this image?
              </Typography>
              <Chip 
                label={response.imageDescription} 
                color="primary" 
                variant="outlined"
                sx={{ mb: 2 }}
              />
            </CardContent>
          </Card>

          {!showResult && (
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Your Sentence:
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
                value={sentence}
                onChange={(e) => setSentence(e.target.value)}
                placeholder="Write a sentence about what you see in the image..."
                variant="outlined"
                sx={{ mb: 2 }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={loading || !sentence.trim()}
                fullWidth
              >
                {loading ? <CircularProgress size={24} /> : 'Submit Sentence'}
              </Button>
            </Paper>
          )}
        </Box>
      )}

      {showResult && response && (
        <Paper sx={{ p: 3, backgroundColor: response.isCorrect ? '#e8f5e8' : '#fff3e0' }}>
          <Typography variant="h6" gutterBottom color={response.isCorrect ? 'success.main' : 'warning.main'}>
            {response.isCorrect ? 'Great Job! 🎉' : 'Let\'s Learn Together! 📚'}
          </Typography>
          
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="body1" paragraph>
            <strong>Feedback:</strong> {response.feedback}
          </Typography>
          
          {response.correctedSentence && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1" gutterBottom>
                <strong>Corrected Sentence:</strong>
              </Typography>
              <Paper sx={{ p: 2, backgroundColor: '#f5f5f5' }}>
                <Typography variant="body1" color="primary">
                  "{response.correctedSentence}"
                </Typography>
              </Paper>
            </Box>
          )}
          
          <Button
            variant="outlined"
            color="primary"
            onClick={handleNewImage}
            sx={{ mt: 3 }}
            fullWidth
          >
            Try Another Image
          </Button>
        </Paper>
      )}
    </Container>
  );
};

export default SentenceLearning; 
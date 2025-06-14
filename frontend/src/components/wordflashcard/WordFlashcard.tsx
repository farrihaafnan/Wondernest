import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  MenuItem,
  Select,
  Typography,
  Card,
  CardMedia,
  CardContent,
} from '@mui/material';

const ranges = [
  { label: 'A-E', value: 'A-E' },
  { label: 'F-J', value: 'F-J' },
  { label: 'K-O', value: 'K-O' },
  { label: 'P-T', value: 'P-T' },
  { label: 'U-Z', value: 'U-Z' },
];

interface WordImage {
  letter: string;
  word: string;
  imageUrl: string;
}

const WordFlashcard: React.FC = () => {
  const [selectedRange, setSelectedRange] = useState<string>('A-E');
  const [words, setWords] = useState<WordImage[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!selectedRange) return;

    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login?message=Please login to access this feature';
      return;
    }

    setLoading(true);
    setError('');
    
    fetch(`http://localhost:8081/api/words?range=${selectedRange}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then((res) => {
        if (!res.ok) {
          if (res.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login?message=Your session has expired. Please login again';
            throw new Error('Session expired');
          }
          throw new Error(`Error fetching words: ${res.statusText}`);
        }
        return res.json();
      })
      .then((data: WordImage[]) => {
        setWords(data);
        setCurrentIndex(0);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load words');
        setWords([]);
        setLoading(false);
      });
  }, [selectedRange]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % words.length);
  };

  return (
    <Box sx={{ maxWidth: 600, margin: 'auto', mt: 4, textAlign: 'center' }}>
      <Typography variant="h5" gutterBottom>
        Word Flashcards
      </Typography>

      <Select
        value={selectedRange}
        onChange={(e) => setSelectedRange(e.target.value)}
        sx={{ mb: 3, minWidth: 120 }}
      >
        {ranges.map((range) => (
          <MenuItem key={range.value} value={range.value}>
            {range.label}
          </MenuItem>
        ))}
      </Select>

      {loading && <Typography>Loading...</Typography>}
      {error && <Typography color="error">{error}</Typography>}

      {!loading && !error && words.length > 0 && (
        <Card>
          <CardMedia
            component="img"
            height="300"
            image={words[currentIndex].imageUrl}
            alt={words[currentIndex].word}
          />
          <CardContent>
            <Typography variant="h6">{words[currentIndex].word}</Typography>
            <Typography color="text.secondary">
              (Starts with: {words[currentIndex].letter})
            </Typography>
          </CardContent>
        </Card>
      )}

      {!loading && !error && words.length === 0 && (
        <Typography>No words found for this range.</Typography>
      )}

      <Button
        variant="contained"
        onClick={handleNext}
        sx={{ mt: 2 }}
        disabled={words.length === 0 || loading}
      >
        Next
      </Button>
    </Box>
  );
};

export default WordFlashcard;

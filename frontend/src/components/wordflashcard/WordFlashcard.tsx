import React, { useState } from 'react';
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
import { USER_LEARNING_API_BASE_URL } from '../../apiConfig';

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

const getLettersInRange = (range: string): string[] => {
  const [start, end] = range.split('-');
  const startCode = start.charCodeAt(0);
  const endCode = end.charCodeAt(0);
  const letters = [];
  for (let i = startCode; i <= endCode; i++) {
    letters.push(String.fromCharCode(i));
  }
  return letters;
};

const WordFlashcard: React.FC = () => {
  const [selectedRange, setSelectedRange] = useState<string>('A-E');
  const [letters, setLetters] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [currentWordImage, setCurrentWordImage] = useState<WordImage | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [started, setStarted] = useState<boolean>(false);

  const fetchWordImage = (letter: string) => {
    setLoading(true);
    setError('');
    const token = sessionStorage.getItem('token');
    if (!token) {
      window.location.href = '/login?message=Please login to access this feature';
      return;
    }
    fetch(`${USER_LEARNING_API_BASE_URL}/api/word-image?letter=${letter}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then((res) => {
        if (!res.ok) {
          if (res.status === 401) {
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('user');
            window.location.href = '/login?message=Your session has expired. Please login again';
            throw new Error('Session expired');
          }
          throw new Error(`Error fetching word-image: ${res.statusText}`);
        }
        return res.json();
      })
      .then((data: WordImage) => {
        setCurrentWordImage(data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to load word-image');
        setCurrentWordImage(null);
        setLoading(false);
      });
  };

  const handleStart = () => {
    const rangeLetters = getLettersInRange(selectedRange);
    setLetters(rangeLetters);
    setCurrentIndex(0);
    setStarted(true);
    fetchWordImage(rangeLetters[0]);
  };

  const handleNext = () => {
    if (currentIndex < letters.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      fetchWordImage(letters[nextIndex]);
    }
  };

  const highlightFirstLetter = (word: string, letter: string) => {
    if (!word || !letter) return word;
    const idx = word.toLowerCase().indexOf(letter.toLowerCase());
    if (idx === -1) return word;
    return <span>{word.slice(0, idx)}<span style={{ color: 'red', fontWeight: 'bold' }}>{word[idx]}</span>{word.slice(idx + 1)}</span>;
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
        disabled={started}
      >
        {ranges.map((range) => (
          <MenuItem key={range.value} value={range.value}>
            {range.label}
          </MenuItem>
        ))}
      </Select>

      {!started && (
        <Button variant="contained" onClick={handleStart} sx={{ mb: 3 }}>
          Start
        </Button>
      )}

      {loading && <Typography>Loading...</Typography>}
      {error && <Typography color="error">{error}</Typography>}

      {started && !loading && !error && currentWordImage && (
        <Card>
          <CardMedia
            component="img"
            image={currentWordImage.imageUrl}
            alt={currentWordImage.word}
            sx={{ width: 200, height: 200, objectFit: 'contain', margin: '0 auto' }}
          />
          <CardContent>
            <Typography variant="h6">
              {highlightFirstLetter(currentWordImage.word, letters[currentIndex])}
            </Typography>
            <Typography color="text.secondary">
              (Starts with: {letters[currentIndex]})
            </Typography>
          </CardContent>
        </Card>
      )}

      {started && !loading && !error && (
        <Button
          variant="contained"
          onClick={handleNext}
          sx={{ mt: 2 }}
          disabled={currentIndex >= letters.length - 1 || loading}
        >
          Next
        </Button>
      )}
    </Box>
  );
};

export default WordFlashcard;

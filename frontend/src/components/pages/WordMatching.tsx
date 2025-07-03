import React, { useState } from 'react';
import { Box, Button, Typography, Grid, Select, MenuItem, Card, CardMedia, CardContent, FormControl, InputLabel } from '@mui/material';
import axios from 'axios';
import { EVALUATION_API_BASE_URL } from '../../apiConfig';

const LETTER_RANGES = [
  'A-E', 'F-J', 'K-O', 'P-T', 'U-Z'
];

const WordMatching: React.FC = () => {
  const [letterRange, setLetterRange] = useState('A-E');
  const [images, setImages] = useState<string[]>([]);
  const [words, setWords] = useState<string[]>([]);
  const [correctWords, setCorrectWords] = useState<string[]>([]);
  const [userMatches, setUserMatches] = useState<string[]>(Array(5).fill(''));
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<boolean[]>([]);
  const [error, setError] = useState('');

  const handleRangeChange = (e: any) => {
    setLetterRange(e.target.value);
    setImages([]);
    setWords([]);
    setCorrectWords([]);
    setUserMatches(Array(5).fill(''));
    setSubmitted(false);
    setScore(null);
    setFeedback([]);
    setError('');
  };

  const fetchPairs = async () => {
    setLoading(true);
    setError('');
    setSubmitted(false);
    setScore(null);
    setFeedback([]);
    try {
      const resp = await axios.get(`${EVALUATION_API_BASE_URL}/evaluation/word-matching/generate?letterRange=${letterRange}`);
      // The backend returns: { words: [...], images: [...], correctPairs: [{word, imageUrl}], letterRange }
      setImages(resp.data.images);
      setWords(resp.data.words);
      setCorrectWords(resp.data.correctPairs.map((p: any) => p.word));
      setUserMatches(Array(5).fill(''));
      setSubmitted(false);
      setScore(null);
      setFeedback([]);
      console.log('[DEBUG] Fetched image URLs:', resp.data.images);
      console.log('[DEBUG] Fetched pairs:', resp.data);
    } catch (err) {
      setError('Failed to fetch word-image pairs.');
    }
    setLoading(false);
  };

  const handleMatchChange = (imgIdx: number, word: string) => {
    const updated = [...userMatches];
    updated[imgIdx] = word;
    setUserMatches(updated);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const selectedChild = localStorage.getItem('selectedChild');
      if (!selectedChild) {
        setError('No child selected.');
        setLoading(false);
        return;
      }
      const childObj = JSON.parse(selectedChild);
      const payload = {
        childId: childObj.id,
        letterRange,
        userMatches,
        correctWords,
        score: userMatches.filter((w, i) => w === correctWords[i]).length,
      };
      console.log('[DEBUG] Submitting:', payload);
      const resp = await axios.post(`${EVALUATION_API_BASE_URL}/evaluation/word-matching/submit`, payload);
      setScore(resp.data.score);
      setFeedback(resp.data.correct);
      setSubmitted(true);
      console.log('[DEBUG] Submit response:', resp.data);
    } catch (err) {
      setError('Failed to submit results.');
    }
    setLoading(false);
  };

  return (
    <Box sx={{ maxWidth: 800, margin: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>Word Matching</Typography>
      <FormControl sx={{ minWidth: 120, mb: 2 }}>
        <InputLabel>Letter Range</InputLabel>
        <Select value={letterRange} label="Letter Range" onChange={handleRangeChange} disabled={loading || submitted}>
          {LETTER_RANGES.map(r => <MenuItem key={r} value={r}>{r}</MenuItem>)}
        </Select>
      </FormControl>
      <Button variant="contained" onClick={fetchPairs} disabled={loading || submitted} sx={{ ml: 2 }}>Generate</Button>
      {error && <Typography color="error" mt={2}>{error}</Typography>}
      {images.length > 0 && words.length > 0 && (
        <Box mt={4}>
          <Grid container spacing={2}>
            {images.map((img, idx) => (
              <Grid item xs={12} sm={6} md={4} key={idx}>
                <Card>
                  <CardMedia component="img" height="200" image={img} alt={`word-img-${idx}`} />
                  <CardContent>
                    <FormControl fullWidth>
                      <InputLabel>Match Word</InputLabel>
                      <Select
                        value={userMatches[idx] || ''}
                        label="Match Word"
                        onChange={e => handleMatchChange(idx, e.target.value)}
                        disabled={submitted}
                      >
                        <MenuItem value=""><em>None</em></MenuItem>
                        {words.map((w, i) => <MenuItem key={i} value={w}>{w}</MenuItem>)}
                      </Select>
                    </FormControl>
                    {submitted && (
                      <Typography color={feedback[idx] ? 'green' : 'red'} mt={1}>
                        {feedback[idx] ? 'Correct!' : `Wrong. Correct: ${correctWords[idx]}`}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          {!submitted && (
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 3 }}
              onClick={handleSubmit}
              disabled={userMatches.some(w => !w) || loading}
            >
              Submit
            </Button>
          )}
          {submitted && (
            <Typography variant="h6" mt={3}>
              Your Score: {score} / 5
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
};

export default WordMatching;
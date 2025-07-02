import React, { useState } from 'react';
import axios from 'axios';
import { Box, Button, TextField, Typography, Paper, CircularProgress } from '@mui/material';
import { EVALUATION_API_BASE_URL } from '../../apiConfig';

interface TestItem {
  original: string;
  userCorrection: string;
  feedback?: string;
  correctSentence?: string;
  isCorrect?: boolean;
}

const NUM_QUESTIONS = 5;

const SentenceEvaluation: React.FC = () => {
  const [testItems, setTestItems] = useState<TestItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [testStarted, setTestStarted] = useState(false);
  const [testSubmitted, setTestSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [error, setError] = useState('');

  const fetchSentences = async () => {
    setLoading(true);
    setError('');
    setTestItems([]);
    setTestStarted(false);
    setTestSubmitted(false);
    setScore(0);
    try {
      const res = await axios.get(`${EVALUATION_API_BASE_URL}/api/evaluation/sentences?count=5`);
      const sentences: string[] = res.data;
      if (!Array.isArray(sentences) || sentences.length < NUM_QUESTIONS) {
        setError('Could not fetch enough unique sentences. Please try again.');
        setLoading(false);
        return;
      }
      setTestItems(sentences.map(s => ({ original: s, userCorrection: '' })));
      setTestStarted(true);
    } catch (err) {
      setError('Failed to fetch sentences.');
    }
    setLoading(false);
  };

  const handleInputChange = (idx: number, value: string) => {
    setTestItems(items => items.map((item, i) => i === idx ? { ...item, userCorrection: value } : item));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const results = await Promise.all(
        testItems.map(item =>
          axios.post(`${EVALUATION_API_BASE_URL}/api/evaluation/check`, {
            original: item.original,
            userCorrection: item.userCorrection,
          }).then(res => res.data)
        )
      );
      let correctCount = 0;
      const updatedItems = testItems.map((item, idx) => {
        const result = results[idx];
        console.log('Result:', result, typeof result?.isCorrect);
        if ((typeof result?.isCorrect !== 'undefined' ? result.isCorrect : result.correct)) correctCount++;
        return {
          ...item,
          feedback: result?.feedback,
          correctSentence: result?.correctSentence,
          isCorrect: typeof result?.isCorrect !== 'undefined' ? result.isCorrect : result.correct,
        };
      });
      setTestItems(updatedItems);
      setScore(correctCount);
      setTestSubmitted(true);
      // Save result to backend
      const selectedChild = localStorage.getItem('selectedChild');
      console.log('[DEBUG] selectedChild from localStorage:', selectedChild);
      if (selectedChild) {
        const childObj = JSON.parse(selectedChild);
        console.log('[DEBUG] childObj:', childObj);
        if (childObj && childObj.id) {
          const payload = {
            childId: childObj.id,
            score: correctCount,
          };
          console.log('[DEBUG] About to POST to /api/evaluation/sentence-correction with payload:', payload);
          try {
            const resp = await axios.post(`${EVALUATION_API_BASE_URL}/api/evaluation/sentence-correction`, payload);
            console.log('[DEBUG] POST /api/evaluation/sentence-correction response:', resp);
          } catch (err) {
            console.error('[DEBUG] POST /api/evaluation/sentence-correction error:', err);
          }
        } else {
          console.warn('[DEBUG] childObj.id is missing');
        }
      } else {
        console.warn('[DEBUG] selectedChild is missing from localStorage');
      }
    } catch (err) {
      setError('Failed to check corrections.');
    }
    setLoading(false);
  };

  return (
    <Box maxWidth={700} mx="auto" mt={5}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Sentence Correction Test
        </Typography>
        {!testStarted && !testSubmitted && (
          <Button variant="contained" onClick={fetchSentences} disabled={loading}>
            Start Test
          </Button>
        )}
        {loading && <CircularProgress sx={{ mt: 2 }} />}
        {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
        {testStarted && !testSubmitted && (
          <>
            {testItems.map((item, idx) => (
              <Box key={idx} sx={{ mb: 3 }}>
                <Typography variant="subtitle1">Sentence {idx + 1}:</Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>{item.original}</Typography>
                <TextField
                  label="Your Correction"
                  fullWidth
                  value={item.userCorrection}
                  onChange={e => handleInputChange(idx, e.target.value)}
                  sx={{ mb: 1 }}
                  disabled={testSubmitted}
                />
              </Box>
            ))}
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading || testItems.some(item => !item.userCorrection)}
            >
              Submit Test
            </Button>
          </>
        )}
        {testSubmitted && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" color="primary">
              Your Score: {score} / {NUM_QUESTIONS}
            </Typography>
            <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
              Review:
            </Typography>
            {testItems.map((item, idx) => {
              console.log('item.isCorrect:', item.isCorrect, typeof item.isCorrect);
              return (
                <Box key={idx} sx={{ mb: 2, p: 2, border: '1px solid #eee', borderRadius: 2 }}>
                  <Typography variant="subtitle2">Sentence {idx + 1}:</Typography>
                  <Typography>Incorrect Sentence: <b>{item.original}</b></Typography>
                  <Typography>Your Correction: <b>{item.userCorrection}</b></Typography>
                  {item.isCorrect === true ? (
                    <Typography color="success.main">Correct!</Typography>
                  ) : (
                    <>
                      <Typography color="error">Incorrect.</Typography>
                      <Typography>Correct Sentence: <b>{item.correctSentence}</b></Typography>
                    </>
                  )}
                </Box>
              );
            })}
            <Button variant="contained" sx={{ mt: 2 }} onClick={fetchSentences}>
              Retake Test
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default SentenceEvaluation; 
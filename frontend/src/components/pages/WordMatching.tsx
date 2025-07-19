import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, Typography, Paper, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import axios from 'axios';
import { EVALUATION_API_BASE_URL } from '../../apiConfig';
import { useScreenTimeTracker } from '../../hooks/useScreenTimeTracker';

const LETTER_RANGES = ['A-E', 'F-J', 'K-O', 'P-T', 'U-Z'];

const WordMatching: React.FC = () => {
  const [letterRange, setLetterRange] = useState('A-E');
  const [images, setImages] = useState<string[]>([]);
  const [words, setWords] = useState<string[]>([]);
  const [correctPairs, setCorrectPairs] = useState<{ word: string, imageUrl: string }[]>([]);

  const [selected, setSelected] = useState<{ type: 'image' | 'word'; index: number } | null>(null);
  const [matches, setMatches] = useState<{ [imgIdx: number]: number }>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [error, setError] = useState('');

  const imageRefs = useRef<Array<HTMLDivElement | null>>(Array(5).fill(null));
  const wordRefs = useRef<Array<HTMLDivElement | null>>(Array(5).fill(null));
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Get current child ID from session storage (should be set when child is selected)
  const selectedChild = JSON.parse(sessionStorage.getItem('selectedChild') || '{}');
  const childId = selectedChild.id;

  // Screen time tracking
  useScreenTimeTracker({ 
    childId: childId || '', 
    activityType: 'word_match', 
    isActive: images.length > 0 && !submitted && !!childId
  });
  useEffect(() => {
    //fetchPairs();
  }, []);
  

  const fetchPairs = async () => {
  setError('');
  setSubmitted(false);
  setMatches({});
  setScore(null);
  setSelected(null);

  try {
    const resp = await axios.get(`${EVALUATION_API_BASE_URL}/evaluation/word-matching/generate?letterRange=${letterRange}`);
    const pairs: { word: string; imageUrl: string }[] = resp.data.correctPairs;

    const shuffle = <T,>(array: T[]): T[] => {
      return [...array].sort(() => Math.random() - 0.5);
    };

    const shuffledImages = shuffle(pairs.map((p: { imageUrl: string }) => p.imageUrl));
    const shuffledWords = shuffle(pairs.map((p: { word: string }) => p.word));

    setCorrectPairs(pairs); // correct order for scoring
    setImages(shuffledImages);
    setWords(shuffledWords);
  } catch (err) {
    setError('Failed to fetch data');
  }
};



  const handleSelect = (type: 'image' | 'word', index: number) => {
    if (selected?.type === type && selected.index === index) {
      setSelected(null);
      return;
    }

    if (selected && selected.type !== type) {
      const imageIndex = selected.type === 'image' ? selected.index : index;
      const wordIndex = selected.type === 'word' ? selected.index : index;

      const newMatches: { [imgIdx: number]: number } = {};
      for (const [imgIdxStr, wordIdx] of Object.entries(matches)) {
        const imgIdx = +imgIdxStr;
        if (imgIdx !== imageIndex && wordIdx !== wordIndex) {
          newMatches[imgIdx] = wordIdx;
        }
      }

      newMatches[imageIndex] = wordIndex;
      setMatches(newMatches);
      setSelected(null);
      return;
    }

    setSelected({ type, index });
  };

  const getRelativeCenter = (el: HTMLElement | null, container: HTMLElement | null) => {
    if (!el || !container) return { x: 0, y: 0 };
    const elRect = el.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    return {
      x: elRect.left - containerRect.left + elRect.width / 2 -30 ,
      y: elRect.top - containerRect.top + elRect.height/2 -170 ,
    };
  };

  const handleSubmit = async () => {
  setError('');
  setSubmitted(false);

  try {
    const selectedChild = sessionStorage.getItem('selectedChild');
    if (!selectedChild) {
      setError('No child selected.');
      return;
    }

    const childObj = JSON.parse(selectedChild);

    // Build user matched pairs (actual image URL and selected word)
    const userMatchedWords = Object.entries(matches).map(([imgIdxStr, wordIdx]) => {
      const imgIdx = +imgIdxStr;
      return {
        imageUrl: images[imgIdx],
        word: words[wordIdx]
      };
    });

    // Score based on actual pair match
    let correct = 0;
    for (const pair of correctPairs) {
      if (userMatchedWords.find(p => p.imageUrl === pair.imageUrl && p.word === pair.word)) {
        correct++;
      }
    }

    const payload = {
      childId: childObj.id,
      letterRange,
      userMatches: userMatchedWords.map(p => p.word),
      correctWords: correctPairs.map(p => p.word),
      score: correct,
    };

    console.log('[DEBUG] Submitting:', payload);

    const resp = await axios.post(`${EVALUATION_API_BASE_URL}/evaluation/word-matching/submit`, payload);

    setScore(resp.data.score ?? correct);
    setSubmitted(true);
    console.log('[DEBUG] Submit response:', resp.data);

  } catch (err) {
    console.error(err);
    setError('Failed to submit results.');
  }
};



  return (
      <Box
        ref={containerRef}
        sx={{
          maxWidth: 900,
          mx: 'auto',
          mt: 4,
          position: 'relative',
          background: '#fffbe6',
          p: 4,
          borderRadius: 2,
        }}
      > 
        
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Letter Range</InputLabel>
            <Select
              value={letterRange}
              label="Letter Range"
              onChange={(e) => setLetterRange(e.target.value)}
            >
              {LETTER_RANGES.map((r) => (
                <MenuItem key={r} value={r}>{r}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button variant="contained" onClick={fetchPairs}>
            Generate
          </Button>
        </Box>
        <Typography variant="h5" gutterBottom>
          Match the images and words!
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, position: 'relative', gap: 50 }}>
          {/* SVG Lines */}
          <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
            {Object.entries(matches).map(([imgIdx, wordIdx]) => {
              const from = getRelativeCenter(imageRefs.current[+imgIdx], containerRef.current);
              const to = getRelativeCenter(wordRefs.current[+wordIdx], containerRef.current);
              return (
                <line
                  key={imgIdx}
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  stroke="blue"
                  strokeWidth={2}
                />
              );
            })}
          </svg>
  
          {/* Images */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {images.map((img, idx) => {
              const isSelected = selected?.type === 'image' && selected.index === idx;
              return (
                <Paper
                  key={idx}
                  ref={(el) => (imageRefs.current[idx] = el)}
                  onClick={() => handleSelect('image', idx)}
                  sx={{
                    p: 1,
                    cursor: 'pointer',
                    border: isSelected ? '3px solid blue' : '1px solid #ccc',
                    boxShadow: isSelected ? '0 0 10px blue' : 'none',
                    backgroundColor: isSelected ? '#e6f0ff' : '#fff',
                    transition: '0.2s ease',
                    width: 120,
                    height: 120,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <img src={img} alt={`img-${idx}`} width={80} />
                </Paper>
              );
            })}
          </Box>
  
          {/* Words */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {words.map((word, idx) => {
              const isSelected = selected?.type === 'word' && selected.index === idx;
              const isMatched = Object.values(matches).includes(idx);
              return (
                <Paper
                  key={idx}
                  ref={(el) => (wordRefs.current[idx] = el)}
                  onClick={() => handleSelect('word', idx)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 120,
                    width: 120,
                    cursor: 'pointer',
                    border: isSelected ? '3px solid green' : '1px solid #ccc',
                    boxShadow: isSelected ? '0 0 10px green' : 'none',
                    backgroundColor: isSelected ? '#e6ffe6' : isMatched ? '#f0f0f0' : '#fff',
                    transition: '0.2s ease',
                  }}
                >
                  {word}
                </Paper>
              );
            })}
          </Box>

        </Box>
        {images.length > 0 && words.length > 0 && !submitted && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={Object.keys(matches).length < 5}
            sx={{ mt: 3 }}
          >
            Submit
          </Button>
        )}
        {submitted && score !== null && (
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              bgcolor: 'rgba(0, 0, 0, 0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
            }}
          >
            <Box
              sx={{
                backgroundColor: 'white',
                padding: 4,
                borderRadius: 2,
                textAlign: 'center',
                width: 300,
              }}
            >
              <Typography variant="h5" gutterBottom>
                Your Score
              </Typography>
              <Typography variant="h4" color="primary" gutterBottom>
                {score} / 5
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => {
                  setImages([]);
                  setWords([]);
                  setMatches({});
                  setSubmitted(false);
                  setScore(null);
                  setSelected(null);
                }}
              >
                Close
              </Button>
            </Box>
          </Box>
        )}

      </Box>
    );
  };

export default WordMatching;

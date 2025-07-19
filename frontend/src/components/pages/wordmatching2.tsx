import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, Typography, Paper, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import axios from 'axios';
import { EVALUATION_API_BASE_URL } from '../../apiConfig';

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

  useEffect(() => {
    imageRefs.current = Array(5).fill(null);
    wordRefs.current = Array(5).fill(null);
  }, [images, words]);

  const fetchPairs = async () => {
    setError('');
    setSubmitted(false);
    setMatches({});
    setScore(null);
    setSelected(null);

    try {
      const resp = await axios.get(`${EVALUATION_API_BASE_URL}/evaluation/word-matching/generate?letterRange=${letterRange}`);
      setCorrectPairs(resp.data.correctPairs);
      setImages(resp.data.images);
      setWords(resp.data.words);
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
      x: elRect.left - containerRect.left + elRect.width / 2 -30,
      y: elRect.top - containerRect.top + elRect.height / 2 -100,
    };
  };

  const handleSubmit = async () => {
    const userMatches = Object.entries(matches).map(([imgIdx, wordIdx]) => ({
      imageUrl: images[+imgIdx],
      word: words[wordIdx]
    }));

    let correct = 0;
    for (const [imgIdx, wordIdx] of Object.entries(matches)) {
      const correctMatch = correctPairs.find(p =>
        p.imageUrl === images[+imgIdx] && p.word === words[wordIdx]
      );
      if (correctMatch) correct++;
    }

    try {
      const selectedChild = sessionStorage.getItem('selectedChild');
      const child = selectedChild ? JSON.parse(selectedChild) : null;

      await axios.post(`${EVALUATION_API_BASE_URL}/evaluation/word-matching/submit`, {
        childId: child?.id,
        letterRange,
        userMatches: Object.values(matches).map(i => words[i]),
        correctWords: correctPairs.map(p => p.word),
        score: correct,
      });
    } catch (e) {
      console.warn('Submit failed.');
    }

    setScore(correct);
    setSubmitted(true);
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
        <Typography variant="h5" gutterBottom>
          Image-Word Matching with Lines
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
      </Box>
    );
  };

export default WordMatching;

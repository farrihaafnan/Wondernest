import React, { useEffect, useState, useRef } from 'react';
import { Box, Button, Typography, Select, MenuItem, Grid, Alert } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { USER_LEARNING_API_BASE_URL } from '../../apiConfig';

interface Child {
  id: string;
  name: string;
  age: number;
  gender: string;
  avatarUrl?: string;
}

interface Parent {
  id: string;
  email: string;
}

interface PicturePuzzle {
  id: string;
  level: number;
  imageUrl: string[];
}

const Puzzle: React.FC = () => {
  const location = useLocation();
  const [level, setLevel] = useState<number>(3);
  const [puzzle, setPuzzle] = useState<PicturePuzzle | null>(null);
  const [pieces, setPieces] = useState<string[]>([]);
  const [timer, setTimer] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [message, setMessage] = useState<string>('');
  const [solved, setSolved] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [puzzleStarted, setPuzzleStarted] = useState<boolean>(false);
  const [timeUp, setTimeUp] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const touchStartRef = useRef<number | null>(null);
  const touchOverIndexRef = useRef<number | null>(null);

  const state = location.state as any;
  const child: Child | null = state?.child || null;
  const parent: Parent | null = state?.parent || null;

  useEffect(() => {
    if (level === 3) {
      setTimer(120);
      setTimeLeft(120);
    } else if (level === 4) {
      setTimer(240);
      setTimeLeft(240);
    }
  }, [level]);

  useEffect(() => {
    if (
      puzzle &&
      pieces.length === puzzle.imageUrl.length &&
      pieces.every((url, idx) => url === puzzle.imageUrl[idx])
    ) {
      setSolved(true);
      setPuzzleStarted(false);
      setMessage('🎉 Congratulations! Puzzle solved!');
      stopTimer();
      recordAttempt(true);
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    }
  }, [pieces]);

  useEffect(() => {
    if (timeLeft === 0 && puzzle && !solved) {
      setMessage('⏰ Time is up! Try again.');
      setTimeUp(true);
      setPuzzleStarted(false);
      recordAttempt(false);
      stopTimer();
    }
  }, [timeLeft]);

  const startTimer = () => {
    stopTimer();
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const fetchPuzzle = async () => {
    if (!child) return;
    setLoading(true);
    setMessage('');
    setSolved(false);
    setPuzzle(null);
    setPieces([]);
    try {
      const res = await fetch(`${USER_LEARNING_API_BASE_URL}/api/puzzle/random?childId=${child.id}&level=${level}`);
      const data = await res.json();
      if (data && (data.imageUrl || data.image_url)) {
        const imageUrl = data.imageUrl || data.image_url;
        setPuzzle(data);
        setPuzzleStarted(true);
        const shuffled = [...imageUrl];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        setPieces(shuffled);
        setTimeLeft(level === 3 ? 90 : 180);
        startTimer();
      } else {
        setMessage(data.message || 'No puzzle found.');
      }
    } catch (e) {
      setMessage('Error fetching puzzle.');
    }
    setLoading(false);
  };

  const recordAttempt = async (isSolved: boolean) => {
    if (!child || !puzzle) return;
    try {
      await fetch(`${USER_LEARNING_API_BASE_URL}/api/puzzle/attempt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ childId: child.id, puzzleId: puzzle.id, solved: isSolved }),
      });
    } catch (e) {}
  };

  const handleDragStart = (index: number) => {
    if (!solved) setDragIndex(index);
  };

  const handleDrop = (targetIndex: number) => {
    if (dragIndex === null || dragIndex === targetIndex) return;
    const newPieces = [...pieces];
    [newPieces[dragIndex], newPieces[targetIndex]] = [newPieces[targetIndex], newPieces[dragIndex]];
    setPieces(newPieces);
    setDragIndex(null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleTouchStart = (index: number) => {
    if (!solved) {
      touchStartRef.current = index;
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    touchOverIndexRef.current = index;
  };

  const handleTouchEnd = () => {
    if (
      touchStartRef.current !== null &&
      touchOverIndexRef.current !== null &&
      touchStartRef.current !== touchOverIndexRef.current
    ) {
      const newPieces = [...pieces];
      const from = touchStartRef.current;
      const to = touchOverIndexRef.current;
      [newPieces[from], newPieces[to]] = [newPieces[to], newPieces[from]];
      setPieces(newPieces);
    }
    touchStartRef.current = null;
    touchOverIndexRef.current = null;
  };

  const resetPuzzle = () => {
    stopTimer();
    setPuzzle(null);
    setPieces([]);
    setMessage('');
    setSolved(false);
    setPuzzleStarted(false);
    setTimeUp(false);
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>Picture Puzzle</Typography>

      {message && <Alert severity={solved ? 'success' : 'info'} sx={{ mb: 2 }}>{message}</Alert>}

      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {!puzzleStarted && !puzzle && (
          <Box>
            <Typography>Select Level:</Typography>
            <Select value={level} onChange={(e) => setLevel(Number(e.target.value))}>
              <MenuItem value={3}>3 x 3</MenuItem>
              <MenuItem value={4}>4 x 4</MenuItem>
            </Select>
            <Button
              variant="contained"
              sx={{ ml: 2 }}
              onClick={fetchPuzzle}
              disabled={!child || loading}
            >
              Start Puzzle
            </Button>
          </Box>
        )}

        {puzzle && (
          <>
            <Button sx={{ mr: 2 }} onClick={resetPuzzle}>Reset</Button>
            <Typography sx={{ fontWeight: 'bold' }}>
              Time Left: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </Typography>
          </>
        )}
      </Box>

      {puzzle && (
        <Box sx={{ mt: 2, mb: 2 }}>
          <Grid container spacing={0.5}>
            {pieces.map((url, idx) => (
              <Grid item xs={12 / level} key={idx}>
                <div
                  draggable={!solved}
                  onDragStart={() => handleDragStart(idx)}
                  onDrop={() => handleDrop(idx)}
                  onDragOver={handleDragOver}
                  onTouchStart={() => handleTouchStart(idx)}
                  onTouchMove={(e) => handleTouchMove(e, idx)}
                  onTouchEnd={handleTouchEnd}
                  style={{ width: '100%', height: '100%' }}
                >
                  <img
                    src={url}
                    loading="lazy"
                    alt={`piece-${idx}`}
                    style={{
                      width: '100%',
                      display: 'block',
                      border: '1px solid #ccc',
                      cursor: solved ? 'default' : 'grab',
                      userSelect: 'none'
                    }}
                  />
                </div>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {(solved || timeUp) && (
        <Box sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          animation: 'fadeIn 0.5s ease-in-out'
        }}>
          <Typography variant="h2" sx={{ fontWeight: 'bold', mb: 2, textAlign: 'center' }}>
            {solved ? '🎉 Congratulations! 🎉' : '⏰ Time is Up!'}
          </Typography>
          <Typography variant="h5" sx={{ mb: 4 }}>
            {solved ? 'You solved the puzzle!' : 'Better luck next time!'}
          </Typography>
          <Button variant="contained" onClick={resetPuzzle}>Close</Button>
        </Box>
      )}

      <audio ref={audioRef} src="/clap.mp3" preload="auto" />
    </Box>
  );
};

export default Puzzle;

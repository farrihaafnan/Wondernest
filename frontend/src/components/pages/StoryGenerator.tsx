// src/components/pages/StoryGenerator.tsx

import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Card,
  CardContent
} from '@mui/material';
import html2pdf from 'html2pdf.js';
import { useLocation } from 'react-router-dom';
import { USER_LEARNING_API_BASE_URL } from '../../apiConfig';
import { useScreenTimeTracker } from '../../hooks/useScreenTimeTracker';

interface Child {
  id: string;
  name: string;
  age: number;
  gender: string;
}

interface StorySummary {
  id: string;
  prompt: string;
}

const StoryGenerator: React.FC = () => {
  const location = useLocation();
  const [child, setChild] = useState<Child | null>(null);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [story, setStory] = useState('');
  const [error, setError] = useState('');
  const [stories, setStories] = useState<StorySummary[]>([]);
  const [showStory, setShowStory] = useState(false);

  // Screen time tracking
  useScreenTimeTracker({ 
    childId: child?.id || '', 
    activityType: 'story_generation', 
    isActive: !!child?.id && (!!prompt || showStory || loading)
  });

  useEffect(() => {
    const state = location.state as { child: Child };
    if (state?.child) {
      setChild(state.child);
      fetchStoryList(state.child.id);
    }
  }, [location]);

  const fetchStoryList = async (childId: string) => {
    try {
      const res = await fetch(`${USER_LEARNING_API_BASE_URL}/api/story/list/${childId}`);
      const data = await res.json();
      setStories(data);
    } catch (err) {
      console.error("Failed to fetch stories:", err);
    }
  };

  const handleGenerate = async () => {
    if (!child) return;

    setLoading(true);
    setError('');
    setStory('');

    try {
      const response = await fetch(`${USER_LEARNING_API_BASE_URL}/api/story/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          childId: child.id,
          childName: child.name,
          childAge: child.age,
          childGender: child.gender
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server Error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      setStory(data.story);
      setShowStory(true);
      fetchStoryList(child.id); // Refresh story list
    } catch (err: any) {
      setError('Failed to generate story. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
  const element = document.getElementById('story-content');
  if (element) {
    const opt = {
      margin:       [0.5, 0.5, 0.5, 0.5], // top, left, bottom, right (in inches)
      filename:     'story.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
  }
};


  const handleStoryClick = async (id: string) => {
    try {
      const res = await fetch(`${USER_LEARNING_API_BASE_URL}/api/story/${id}`);
      const html = await res.text();
      setStory(html);
      setShowStory(true);
    } catch (err) {
      setError('Failed to load story.');
    }
  };

  return (
    <Box p={2}>
      {!showStory && (
        <>
          <Typography variant="h5" gutterBottom>Generate a Story for {child?.name}</Typography>

          <TextField
            fullWidth
            multiline
            rows={3}
            label="Enter your story prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            margin="normal"
          />

          <Button variant="contained" onClick={handleGenerate} disabled={!prompt || loading}>
            {loading ? <CircularProgress size={24} /> : 'Generate'}
          </Button>

          {error && <Typography color="error" mt={2}>{error}</Typography>}

          <Divider sx={{ my: 4 }} />
          <Typography variant="h6" gutterBottom>Previous Stories</Typography>
          <Box display="flex" flexDirection="column" gap={2}>
            {stories.map((s) => (
              <Card key={s.id} sx={{ backgroundColor: '#fff', boxShadow: 2 }}>
                <CardContent sx={{ padding: 0 }}>
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => handleStoryClick(s.id)}>
                      <ListItemText primary={s.prompt} />
                    </ListItemButton>
                  </ListItem>
                </CardContent>
              </Card>
            ))}
          </Box>
        </>
      )}

      {showStory && (
  <Box mt={4} mx={{ xs: 6, sm: 4, md: 35 }}>
    <Box
      id="story-content"
      sx={{
        textAlign: 'justify',
        fontSize: '18px',
        lineHeight: 1.6,
      }}
      dangerouslySetInnerHTML={{ __html: story }}
    />
    <Box mt={2}>
      <Button variant="outlined" onClick={() => setShowStory(false)}>Close</Button>
      <Button variant="contained" onClick={handleDownload} sx={{ ml: 2 }}>Download</Button>
    </Box>
  </Box>
)}

    </Box>
  );
};

export default StoryGenerator;

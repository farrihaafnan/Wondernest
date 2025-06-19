// src/components/pages/StoryGenerator.tsx

import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, CircularProgress, List, ListItem, ListItemButton, ListItemText, Divider } from '@mui/material';
import html2pdf from 'html2pdf.js';
import { useLocation } from 'react-router-dom';

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

  useEffect(() => {
    const state = location.state as { child: Child };
    if (state?.child) {
      setChild(state.child);
      fetchStoryList(state.child.id);
    }
  }, [location]);

  const fetchStoryList = async (childId: string) => {
    try {
      const res = await fetch(`http://localhost:8081/api/story/list/${childId}`);
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
      const response = await fetch('http://localhost:8081/api/story/generate', {
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
      html2pdf().from(element).save(`story.pdf`);
    }
  };

  const handleStoryClick = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:8081/api/story/${id}`);
      const html = await res.text();
      setStory(html);
      setShowStory(true);
    } catch (err) {
      setError('Failed to load story.');
    }
  };

  return (
    <Box p={2}>
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

      {showStory && (
        <Box mt={4}>
          <div id="story-content" dangerouslySetInnerHTML={{ __html: story }} />
          <Box mt={2}>
            <Button variant="outlined" onClick={() => setShowStory(false)}>Close</Button>
            <Button variant="contained" onClick={handleDownload} sx={{ ml: 2 }}>Download</Button>
          </Box>
        </Box>
      )}

      <Divider sx={{ my: 4 }} />

      <Typography variant="h6" gutterBottom>Previous Stories</Typography>
      <List>
        {stories.map((s) => (
          <ListItem key={s.id} disablePadding>
            <ListItemButton onClick={() => handleStoryClick(s.id)}>
              <ListItemText primary={s.prompt} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default StoryGenerator;


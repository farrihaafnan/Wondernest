import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import Navbar from './components/layout/Navbar';
import Home from './components/pages/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import PrivateRoute from './components/auth/PrivateRoute';
import WordFlashcard from './components/wordflashcard/WordFlashcard';
import SelectChild from './components/dashboard/SelectChild';
import StoryGenerator from './components/pages/StoryGenerator';
import SentenceLearning from './components/pages/SentenceLearning';




const App: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/select-child" element={<SelectChild />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route path="/wordflashcard" element={<WordFlashcard />} />
          <Route path="/story-generation" element={<StoryGenerator />} />
          <Route path="/sentence-learning" element={<SentenceLearning />} />
        </Routes>
      </Box>
    </Box>
  );
};

export default App; 
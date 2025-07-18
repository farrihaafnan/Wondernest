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
import SentenceEvaluation from './components/pages/SentenceEvaluation';
import WordMatching from './components/pages/WordMatching';
import Puzzle from './components/pages/Puzzle';
import ParentOptions from './components/pages/ParentOptions';
import SelectChildForProgress from './components/pages/SelectChildForProgress';
import ChildProgress from './components/pages/ChildProgress';
import EditChildProfile from './components/dashboard/EditChildProfile';


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
          <Route path="/sentence-evaluation" element={<SentenceEvaluation />} />
          <Route path="/word-matching" element={<WordMatching />} />
          <Route path="/puzzle" element={<Puzzle />} />
          <Route path="/parent-options" element={<ParentOptions />} />
          <Route path="/select-child-progress" element={<SelectChildForProgress />} />
          <Route path="/child-progress/:childId" element={<ChildProgress />} />
          <Route path="/edit-child-profile" element={<EditChildProfile />} />
        </Routes>
      </Box>
    </Box>
  );
};

export default App; 
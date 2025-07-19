import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import WordMatching from '../WordMatching';
import axios from 'axios';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock the API configuration
jest.mock('../../../apiConfig', () => ({
  EVALUATION_API_BASE_URL: 'http://localhost:8082/api',
}));

// Create a test theme
const theme = createTheme();

// Wrapper component for testing with providers
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeProvider theme={theme}>
    <BrowserRouter>
      {children}
    </BrowserRouter>
  </ThemeProvider>
);

describe('WordMatching Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (sessionStorage.getItem as jest.Mock).mockReturnValue(JSON.stringify({
      id: 'child-123',
      name: 'Test Child',
      age: 8
    }));
  });

  it('should render the component with initial state', async () => {
    await act(async () => {
      render(
        <TestWrapper>
          <WordMatching />
        </TestWrapper>
      );
    });

    expect(screen.getByText('Word Matching')).toBeInTheDocument();
    expect(screen.getByText('Generate')).toBeInTheDocument();
  });

  it('should fetch word-image pairs successfully', async () => {
    const mockResponse = {
      data: {
        words: ['apple', 'banana', 'cat', 'dog', 'elephant'],
        images: ['img1.jpg', 'img2.jpg', 'img3.jpg', 'img4.jpg', 'img5.jpg'],
        correctPairs: [
          { word: 'apple', imageUrl: 'img1.jpg' },
          { word: 'banana', imageUrl: 'img2.jpg' }
        ]
      }
    };

    mockedAxios.get.mockResolvedValueOnce(mockResponse);

    await act(async () => {
      render(
        <TestWrapper>
          <WordMatching />
        </TestWrapper>
      );
    });

    const generateButton = screen.getByText('Generate');
    
    await act(async () => {
      fireEvent.click(generateButton);
    });

    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'http://localhost:8082/api/evaluation/word-matching/generate?letterRange=A-E'
      );
    });
  });

  it('should handle API error when generating pairs', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('API Error'));

    await act(async () => {
      render(
        <TestWrapper>
          <WordMatching />
        </TestWrapper>
      );
    });

    const generateButton = screen.getByText('Generate');
    
    await act(async () => {
      fireEvent.click(generateButton);
    });

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch word-image pairs.')).toBeInTheDocument();
    });
  });
}); 
import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import WordFlashcard from '../WordFlashcard';

// Mock fetch globally
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
});

// Mock window.location
const mockLocation = {
  href: 'http://localhost:3000',
  search: '',
  pathname: '/',
  origin: 'http://localhost:3000',
};
Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true,
});

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

describe('WordFlashcard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue('mock-token');
    mockFetch.mockClear();
  });

  it('should render the component with initial state', () => {
    render(
      <TestWrapper>
        <WordFlashcard />
      </TestWrapper>
    );

    expect(screen.getByText('Word Flashcards')).toBeInTheDocument();
    expect(screen.getByText('Start')).toBeInTheDocument();
    expect(screen.getByDisplayValue('A-E')).toBeInTheDocument();
  });

  it('should start the flashcard session when Start button is clicked', async () => {
    const mockWordImage = {
      letter: 'A',
      word: 'Apple',
      imageUrl: 'https://example.com/apple.jpg'
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockWordImage
    });

    render(
      <TestWrapper>
        <WordFlashcard />
      </TestWrapper>
    );

    const startButton = screen.getByText('Start');
    
    await act(async () => {
      fireEvent.click(startButton);
    });

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/api/word-image?letter=A',
        {
          headers: {
            'Authorization': 'Bearer mock-token'
          }
        }
      );
    });

    await waitFor(() => {
      expect(screen.getByText('(Starts with: A)')).toBeInTheDocument();
    });
  });

  it('should handle API error when fetching word image', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    render(
      <TestWrapper>
        <WordFlashcard />
      </TestWrapper>
    );

    const startButton = screen.getByText('Start');
    
    await act(async () => {
      fireEvent.click(startButton);
    });

    await waitFor(() => {
      expect(screen.getByText('Failed to load word-image')).toBeInTheDocument();
    });
  });

  it('should handle 401 unauthorized response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      statusText: 'Unauthorized'
    });

    render(
      <TestWrapper>
        <WordFlashcard />
      </TestWrapper>
    );

    const startButton = screen.getByText('Start');
    
    await act(async () => {
      fireEvent.click(startButton);
    });

    await waitFor(() => {
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('token');
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('user');
    });
  });

  it('should redirect to login when no token is present', async () => {
    mockLocalStorage.getItem.mockReturnValue(null);

    render(
      <TestWrapper>
        <WordFlashcard />
      </TestWrapper>
    );

    const startButton = screen.getByText('Start');
    
    await act(async () => {
      fireEvent.click(startButton);
    });

    expect(mockLocation.href).toBe('/login?message=Please login to access this feature');
  });

  it('should show loading state while fetching word image', async () => {
    let resolveFetch: (value: any) => void;
    const fetchPromise = new Promise((resolve) => {
      resolveFetch = resolve;
    });

    mockFetch.mockReturnValueOnce(fetchPromise);

    render(
      <TestWrapper>
        <WordFlashcard />
      </TestWrapper>
    );

    const startButton = screen.getByText('Start');
    
    await act(async () => {
      fireEvent.click(startButton);
    });

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    // Resolve the fetch
    resolveFetch!({
      ok: true,
      json: async () => ({ letter: 'A', word: 'Apple', imageUrl: 'test.jpg' })
    });

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
  });
}); 
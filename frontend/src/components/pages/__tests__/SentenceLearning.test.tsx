import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import SentenceLearning from '../SentenceLearning';

// Mock fetch globally
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock sessionStorage
const mocksessionStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'sessionStorage', {
  value: mocksessionStorage,
  writable: true,
});

// Mock useNavigate
const mockNavigate = jest.fn();

// Mock API config
jest.mock('../../../apiConfig', () => ({
  USER_LEARNING_API_BASE_URL: 'http://localhost:8081'
}));

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: jest.fn(),
  Link: (() => {
    const React = require('react');
    return React.forwardRef(({ children, to, ...props }: any, ref: any) => {
      return React.createElement('a', { href: to, ref, ...props }, children);
    });
  })(),
}));

// Get the mocked useLocation
const { useLocation } = require('react-router-dom');

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

describe('SentenceLearning Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mocksessionStorage.getItem.mockImplementation((key) => {
      if (key === 'token') return 'mock-token';
      if (key === 'user') return JSON.stringify({ id: 'parent-123', name: 'Test Parent' });
      return null;
    });
    mockFetch.mockClear();
    mockNavigate.mockClear();
    
    // Set default location mock
    useLocation.mockReturnValue({
      pathname: '/sentence-learning',
      search: '',
      state: {
        parent: { id: 'parent-123', name: 'Test Parent' },
        child: { id: 'child-123', name: 'Test Child', age: 8, gender: 'male' }
      }
    });
  });

  it('should render the component with child information', async () => {
    render(
      <TestWrapper>
        <SentenceLearning />
      </TestWrapper>
    );

    // Wait for component to stabilize after useEffect
    await waitFor(() => {
      expect(screen.getByText('Sentence Learning')).toBeInTheDocument();
    });

    expect(screen.getByText('Hi Test Child! Look at the image and write a sentence about what you see.')).toBeInTheDocument();
    expect(screen.getByText('Generate New Image')).toBeInTheDocument();
  });

  it('should navigate to select-child when no child state is provided', async () => {
    // Update the mock location to return state without child
    useLocation.mockReturnValue({
      pathname: '/sentence-learning',
      search: '',
      state: {
        parent: { id: 'parent-123', name: 'Test Parent' }
        // Missing child property
      }
    });

    render(
      <TestWrapper>
        <SentenceLearning />
      </TestWrapper>
    );

    // Should navigate to select-child page
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/select-child');
    }, { timeout: 3000 });
  });

  it('should navigate to login when no token is available', async () => {
    // Mock sessionStorage to return no token
    mocksessionStorage.getItem.mockImplementation((key) => {
      if (key === 'token') return null;
      if (key === 'user') return null;
      return null;
    });

    render(
      <TestWrapper>
        <SentenceLearning />
      </TestWrapper>
    );

    // Should navigate to login
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login?message=Please login to access this feature');
    });
  });

  it('should render generate image button when no image is generated', async () => {
    render(
      <TestWrapper>
        <SentenceLearning />
      </TestWrapper>
    );

    // Wait for component to stabilize
    await waitFor(() => {
      expect(screen.getByText('Sentence Learning')).toBeInTheDocument();
    });

    expect(screen.getByText('Click the button below to generate a new image!')).toBeInTheDocument();
    expect(screen.getByText('Generate New Image')).toBeInTheDocument();
  });
}); 
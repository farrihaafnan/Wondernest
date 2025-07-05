import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import StoryGenerator from '../StoryGenerator';

// Mock fetch globally
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock html2pdf
jest.mock('html2pdf.js', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    from: jest.fn(() => ({
      save: jest.fn()
    }))
  }))
}));

// Mock API config
jest.mock('../../../apiConfig', () => ({
  USER_LEARNING_API_BASE_URL: 'http://localhost:8081'
}));

// Mock useLocation
const mockLocation = {
  pathname: '/story-generator',
  search: '',
  state: {
    child: { id: 'child-123', name: 'Test Child', age: 8, gender: 'male' }
  }
};

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => mockLocation,
  Link: (() => {
    const React = require('react');
    return React.forwardRef(({ children, to, ...props }: any, ref: any) => {
      return React.createElement('a', { href: to, ref, ...props }, children);
    });
  })(),
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

describe('StoryGenerator Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockClear();
    
    // Mock the story list API call to prevent hanging
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ([])
    });
  });

  it('should render the component with child information', async () => {
    render(
      <TestWrapper>
        <StoryGenerator />
      </TestWrapper>
    );

    // Wait for component to stabilize
    await waitFor(() => {
      expect(screen.getByText('Generate a Story for Test Child')).toBeInTheDocument();
    });

    expect(screen.getByLabelText('Enter your story prompt')).toBeInTheDocument();
    expect(screen.getByText('Generate')).toBeInTheDocument();
    expect(screen.getByText('Previous Stories')).toBeInTheDocument();
  });

  it('should disable Generate button when prompt is empty', async () => {
    render(
      <TestWrapper>
        <StoryGenerator />
      </TestWrapper>
    );

    // Wait for component to stabilize
    await waitFor(() => {
      expect(screen.getByText('Generate a Story for Test Child')).toBeInTheDocument();
    });

    const generateButton = screen.getByText('Generate');
    expect(generateButton).toBeDisabled();
  });

  it('should render when no child state is provided', async () => {
    // Override mock location to have no child state
    const noStateLocation = {
      pathname: '/story-generator',
      search: '',
      state: null
    };

    jest.doMock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useLocation: () => noStateLocation,
    }));

    // Re-import component with new mock
    const StoryGeneratorModule = await import('../StoryGenerator');
    const StoryGeneratorNoState = StoryGeneratorModule.default;
    
    render(
      <TestWrapper>
        <StoryGeneratorNoState />
      </TestWrapper>
    );

    // Should still render without crashing
    expect(screen.getByLabelText('Enter your story prompt')).toBeInTheDocument();
  });
}); 
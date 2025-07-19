import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import SentenceEvaluation from '../SentenceEvaluation';
import axios from 'axios';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock the API configuration
jest.mock('../../../apiConfig', () => ({
  EVALUATION_API_BASE_URL: 'http://localhost:8082/api',
}));

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

describe('SentenceEvaluation Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mocksessionStorage.getItem.mockReturnValue(JSON.stringify({
      id: 'child-123',
      name: 'Test Child',
      age: 8
    }));
  });

  it('should render the component with initial state', () => {
    render(
      <TestWrapper>
        <SentenceEvaluation />
      </TestWrapper>
    );

    expect(screen.getByText('Sentence Correction Test')).toBeInTheDocument();
    expect(screen.getByText('Start Test')).toBeInTheDocument();
  });

  it('should start test when Start Test button is clicked', async () => {
    const mockSentences = [
      'The cat is sleeping.',
      'I like to play.',
      'She reads books.',
      'They are happy.',
      'We go to school.'
    ];

    mockedAxios.get.mockResolvedValueOnce({ data: mockSentences });

    render(
      <TestWrapper>
        <SentenceEvaluation />
      </TestWrapper>
    );

    const startButton = screen.getByText('Start Test');
    
    await act(async () => {
      fireEvent.click(startButton);
    });

    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'http://localhost:8082/api/evaluation/sentences?count=5'
      );
    });

    await waitFor(() => {
      expect(screen.getByText('Sentence 1:')).toBeInTheDocument();
      expect(screen.getByText('The cat is sleeping.')).toBeInTheDocument();
      expect(screen.getByText('Submit Test')).toBeInTheDocument();
    });
  });

  it('should handle API error when fetching sentences', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('API Error'));

    render(
      <TestWrapper>
        <SentenceEvaluation />
      </TestWrapper>
    );

    const startButton = screen.getByText('Start Test');
    
    await act(async () => {
      fireEvent.click(startButton);
    });

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch sentences.')).toBeInTheDocument();
    });
  });

  it('should allow user to input corrections', async () => {
    const mockSentences = [
      'The cat is sleeping.',
      'I like to play.',
      'She reads books.',
      'They are happy.',
      'We go to school.'
    ];

    mockedAxios.get.mockResolvedValueOnce({ data: mockSentences });

    render(
      <TestWrapper>
        <SentenceEvaluation />
      </TestWrapper>
    );

    const startButton = screen.getByText('Start Test');
    
    await act(async () => {
      fireEvent.click(startButton);
    });

    await waitFor(() => {
      expect(screen.getByText('Sentence 1:')).toBeInTheDocument();
    });

    // Use getAllByLabelText and select the first one
    const textFields = screen.getAllByLabelText('Your Correction');
    const firstTextField = textFields[0];
    fireEvent.change(firstTextField, { target: { value: 'The cat is sleeping' } });

    expect(firstTextField).toHaveValue('The cat is sleeping');
  });

  it('should disable submit button when not all corrections are filled', async () => {
    const mockSentences = [
      'The cat is sleeping.',
      'I like to play.',
      'She reads books.',
      'They are happy.',
      'We go to school.'
    ];

    mockedAxios.get.mockResolvedValueOnce({ data: mockSentences });

    render(
      <TestWrapper>
        <SentenceEvaluation />
      </TestWrapper>
    );

    const startButton = screen.getByText('Start Test');
    
    await act(async () => {
      fireEvent.click(startButton);
    });

    await waitFor(() => {
      expect(screen.getByText('Sentence 1:')).toBeInTheDocument();
    });

    const submitButton = screen.getByText('Submit Test');
    expect(submitButton).toBeDisabled();

    // Fill only one correction
    const textFields = screen.getAllByLabelText('Your Correction');
    fireEvent.change(textFields[0], { target: { value: 'Test correction' } });

    expect(submitButton).toBeDisabled();
  });

  it('should show loading state during API calls', async () => {
    let resolveFetch: (value: any) => void;
    const fetchPromise = new Promise((resolve) => {
      resolveFetch = resolve;
    });

    mockedAxios.get.mockReturnValueOnce(fetchPromise);

    render(
      <TestWrapper>
        <SentenceEvaluation />
      </TestWrapper>
    );

    const startButton = screen.getByText('Start Test');
    
    await act(async () => {
      fireEvent.click(startButton);
    });

    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    // Resolve the fetch
    resolveFetch!({ data: ['Test sentence'] });

    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });
  });
}); 
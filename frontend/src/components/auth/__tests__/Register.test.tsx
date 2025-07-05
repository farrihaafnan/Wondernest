import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Register from '../Register';

// Mock the API configuration
jest.mock('../../../apiConfig', () => ({
  USER_LEARNING_API_BASE_URL: 'http://localhost:8081',
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

describe('Register Component', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock useNavigate
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(mockNavigate);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Rendering', () => {
    it('should render registration form with all required fields', () => {
      render(
        <TestWrapper>
          <Register />
        </TestWrapper>
      );

      expect(screen.getByText('Create Account')).toBeInTheDocument();
      expect(screen.getByText("Let's start your journey ✨")).toBeInTheDocument();
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^Password\s*\*/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^Confirm Password\s*\*/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '🎉 Register' })).toBeInTheDocument();
      expect(screen.getByText('Already have an account? Sign in')).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('should show error when passwords do not match', async () => {
      render(
        <TestWrapper>
          <Register />
        </TestWrapper>
      );

      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/^Password\s*\*/i);
      const confirmPasswordInput = screen.getByLabelText(/^Confirm Password\s*\*/i);
      const submitButton = screen.getByRole('button', { name: '🎉 Register' });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'differentpassword' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
      });

      expect(global.fetch).not.toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('should allow form submission when passwords match', async () => {
      // Mock successful registration
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: 'Registration successful' }),
      });

      render(
        <TestWrapper>
          <Register />
        </TestWrapper>
      );

      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/^Password\s*\*/i);
      const confirmPasswordInput = screen.getByLabelText(/^Confirm Password\s*\*/i);
      const submitButton = screen.getByRole('button', { name: '🎉 Register' });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          'http://localhost:8081/api/auth/register',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: 'test@example.com',
              password: 'password123',
            }),
          }
        );
      });

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/login');
      });
    });
  });

  describe('API Integration', () => {
    it('should handle registration failure', async () => {
      // Mock failed registration
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        statusText: 'Bad Request',
      });

      render(
        <TestWrapper>
          <Register />
        </TestWrapper>
      );

      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/^Password\s*\*/i);
      const confirmPasswordInput = screen.getByLabelText(/^Confirm Password\s*\*/i);
      const submitButton = screen.getByRole('button', { name: '🎉 Register' });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Registration failed. Please try again.')).toBeInTheDocument();
      });

      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('should handle network error', async () => {
      // Mock network error
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      render(
        <TestWrapper>
          <Register />
        </TestWrapper>
      );

      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/^Password\s*\*/i);
      const confirmPasswordInput = screen.getByLabelText(/^Confirm Password\s*\*/i);
      const submitButton = screen.getByRole('button', { name: '🎉 Register' });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Registration failed. Please try again.')).toBeInTheDocument();
      });
    });
  });

  describe('Navigation', () => {
    it('should navigate to login page when sign in link is clicked', () => {
      render(
        <TestWrapper>
          <Register />
        </TestWrapper>
      );

      const signInLink = screen.getByText('Already have an account? Sign in');
      fireEvent.click(signInLink);

      expect(signInLink).toHaveAttribute('href', '/login');
    });
  });

  describe('Form Interaction', () => {
    it('should update form fields when user types', () => {
      render(
        <TestWrapper>
          <Register />
        </TestWrapper>
      );

      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/^Password\s*\*/i);
      const confirmPasswordInput = screen.getByLabelText(/^Confirm Password\s*\*/i);

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });

      expect(emailInput).toHaveValue('test@example.com');
      expect(passwordInput).toHaveValue('password123');
      expect(confirmPasswordInput).toHaveValue('password123');
    });

    it('should clear error when user starts typing', () => {
      render(
        <TestWrapper>
          <Register />
        </TestWrapper>
      );

      const emailInput = screen.getByLabelText(/email address/i);
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

      // Error should be cleared when user interacts with form
      expect(screen.queryByText('Passwords do not match')).not.toBeInTheDocument();
    });
  });
}); 
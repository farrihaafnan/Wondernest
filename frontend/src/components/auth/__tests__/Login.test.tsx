import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Login from '../Login';

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

describe('Login Component', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock useNavigate
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(mockNavigate);
    // Mock useLocation
    jest.spyOn(require('react-router-dom'), 'useLocation').mockReturnValue({
      pathname: '/login',
      search: '',
      state: null,
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Rendering', () => {
    it('should render login form with all required fields', () => {
      render(
        <TestWrapper>
          <Login />
        </TestWrapper>
      );

      expect(screen.getByText('Welcome Back!')).toBeInTheDocument();
      expect(screen.getByText("Let's get learning again ✨")).toBeInTheDocument();
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '🚀 Sign In' })).toBeInTheDocument();
      expect(screen.getByText("Don't have an account? Sign up")).toBeInTheDocument();
    });

    it('should clear auth state on mount', () => {
      render(
        <TestWrapper>
          <Login />
        </TestWrapper>
      );

      expect(sessionStorage.removeItem).toHaveBeenCalledWith('user');
      expect(sessionStorage.removeItem).toHaveBeenCalledWith('token');
    });

    it('should display error message from URL parameters', () => {
      jest.spyOn(require('react-router-dom'), 'useLocation').mockReturnValue({
        pathname: '/login',
        search: '?message=Session expired',
        state: null,
      });

      render(
        <TestWrapper>
          <Login />
        </TestWrapper>
      );

      expect(screen.getByText('Session expired')).toBeInTheDocument();
    });
  });

  describe('Form Interaction', () => {
    it('should update form fields when user types', () => {
      render(
        <TestWrapper>
          <Login />
        </TestWrapper>
      );

      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/password/i);

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });

      expect(emailInput).toHaveValue('test@example.com');
      expect(passwordInput).toHaveValue('password123');
    });

    it('should clear error when user starts typing', () => {
      render(
        <TestWrapper>
          <Login />
        </TestWrapper>
      );

      const emailInput = screen.getByLabelText(/email address/i);
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

      // Error should be cleared when user interacts with form
      expect(screen.queryByText('Invalid email or password')).not.toBeInTheDocument();
    });
  });

  describe('Form Submission', () => {
    it('should handle successful login', async () => {
      const mockUserData = {
        id: '123',
        email: 'test@example.com',
        token: 'mock-token',
        children: []
      };

      // Mock successful fetch response
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockUserData,
      });

      render(
        <TestWrapper>
          <Login />
        </TestWrapper>
      );

      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: '🚀 Sign In' });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          'http://localhost:8081/api/auth/login',
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
        expect(sessionStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify(mockUserData));
        expect(sessionStorage.setItem).toHaveBeenCalledWith('token', 'mock-token');
        expect(mockNavigate).toHaveBeenCalledWith('/select-child');
      });
    });

    it('should handle login failure', async () => {
      // Mock failed fetch response
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        statusText: 'Unauthorized',
      });

      render(
        <TestWrapper>
          <Login />
        </TestWrapper>
      );

      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: '🚀 Sign In' });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Invalid email or password')).toBeInTheDocument();
      });

      expect(sessionStorage.setItem).not.toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('should handle network error', async () => {
      // Mock network error
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      render(
        <TestWrapper>
          <Login />
        </TestWrapper>
      );

      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: '🚀 Sign In' });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Invalid email or password')).toBeInTheDocument();
      });
    });
  });

  describe('Navigation', () => {
    it('should navigate to register page when sign up link is clicked', () => {
      render(
        <TestWrapper>
          <Login />
        </TestWrapper>
      );

      const signUpLink = screen.getByText("Don't have an account? Sign up");
      fireEvent.click(signUpLink);

      // Since we're using BrowserRouter, the link should work
      expect(signUpLink).toHaveAttribute('href', '/register');
    });
  });

  describe('Accessibility', () => {
    it('should have proper form labels and accessibility attributes', () => {
      render(
        <TestWrapper>
          <Login />
        </TestWrapper>
      );

      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/password/i);

      expect(emailInput).toHaveAttribute('type', 'text');
      expect(passwordInput).toHaveAttribute('type', 'password');
      expect(emailInput).toBeRequired();
      expect(passwordInput).toBeRequired();
    });

    it('should have proper button accessibility', () => {
      render(
        <TestWrapper>
          <Login />
        </TestWrapper>
      );

      const submitButton = screen.getByRole('button', { name: '🚀 Sign In' });
      expect(submitButton).toHaveAttribute('type', 'submit');
    });
  });
}); 
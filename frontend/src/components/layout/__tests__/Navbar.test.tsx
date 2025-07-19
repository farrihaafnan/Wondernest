import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Navbar from '../Navbar';

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

describe('Navbar Component', () => {
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
    it('should render navbar with logo and title', () => {
      render(
        <TestWrapper>
          <Navbar />
        </TestWrapper>
      );

      expect(screen.getByText('WonderNest')).toBeInTheDocument();
      expect(screen.getByTestId('SchoolIcon')).toBeInTheDocument();
    });

    it('should render login and register buttons when not authenticated', () => {
      (sessionStorage.getItem as jest.Mock).mockReturnValue(null);

      render(
        <TestWrapper>
          <Navbar />
        </TestWrapper>
      );

      expect(screen.getByText('Login')).toBeInTheDocument();
      expect(screen.getByText('Register')).toBeInTheDocument();
      expect(screen.queryByText('Logout')).not.toBeInTheDocument();
    });

    it('should render logout button when authenticated', () => {
      (sessionStorage.getItem as jest.Mock).mockReturnValue('mock-token');

      render(
        <TestWrapper>
          <Navbar />
        </TestWrapper>
      );

      expect(screen.getByText('Logout')).toBeInTheDocument();
      expect(screen.queryByText('Login')).not.toBeInTheDocument();
      expect(screen.queryByText('Register')).not.toBeInTheDocument();
    });
  });

  describe('Navigation', () => {
    it('should navigate to home when logo is clicked', () => {
      render(
        <TestWrapper>
          <Navbar />
        </TestWrapper>
      );

      const logoLink = screen.getByText('WonderNest');
      fireEvent.click(logoLink);

      expect(logoLink).toHaveAttribute('href', '/');
    });

    it('should navigate to login page when login button is clicked', () => {
      (sessionStorage.getItem as jest.Mock).mockReturnValue(null);

      render(
        <TestWrapper>
          <Navbar />
        </TestWrapper>
      );

      const loginButton = screen.getByText('Login');
      fireEvent.click(loginButton);

      expect(loginButton).toHaveAttribute('href', '/login');
    });

    it('should navigate to register page when register button is clicked', () => {
      (sessionStorage.getItem as jest.Mock).mockReturnValue(null);

      render(
        <TestWrapper>
          <Navbar />
        </TestWrapper>
      );

      const registerButton = screen.getByText('Register');
      fireEvent.click(registerButton);

      expect(registerButton).toHaveAttribute('href', '/register');
    });
  });

  describe('Authentication', () => {
    it('should handle logout when logout button is clicked', () => {
      (sessionStorage.getItem as jest.Mock).mockReturnValue('mock-token');

      render(
        <TestWrapper>
          <Navbar />
        </TestWrapper>
      );

      const logoutButton = screen.getByText('Logout');
      fireEvent.click(logoutButton);

      expect(sessionStorage.removeItem).toHaveBeenCalledWith('user');
      expect(sessionStorage.removeItem).toHaveBeenCalledWith('token');
      expect(mockNavigate).toHaveBeenCalledWith('/login?message=You have been logged out.');
    });

    it('should check authentication status from sessionStorage', () => {
      (sessionStorage.getItem as jest.Mock).mockReturnValue('mock-token');

      render(
        <TestWrapper>
          <Navbar />
        </TestWrapper>
      );

      expect(sessionStorage.getItem).toHaveBeenCalledWith('token');
    });
  });

  describe('Accessibility', () => {
    it('should have proper navigation structure', () => {
      render(
        <TestWrapper>
          <Navbar />
        </TestWrapper>
      );

      // Should have proper semantic structure
      expect(screen.getByRole('banner')).toBeInTheDocument();
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    it('should have proper button accessibility', () => {
      (sessionStorage.getItem as jest.Mock).mockReturnValue('mock-token');

      render(
        <TestWrapper>
          <Navbar />
        </TestWrapper>
      );

      const logoutButton = screen.getByRole('button', { name: 'Logout' });
      expect(logoutButton).toBeInTheDocument();
    });
  });
}); 
import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Navbar from '../components/layout/Navbar';

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

describe('App Core Components', () => {
  it('should render navbar with logo', () => {
    render(
      <TestWrapper>
        <Navbar />
      </TestWrapper>
    );

    // Should render navbar
    expect(screen.getByText('WonderNest')).toBeInTheDocument();
  });

  it('should render navbar with authentication buttons when not logged in', () => {
    render(
      <TestWrapper>
        <Navbar />
      </TestWrapper>
    );

    // Should render login and register buttons
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Register')).toBeInTheDocument();
  });
}); 
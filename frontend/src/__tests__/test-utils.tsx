// This is a utility file for testing, not a test file itself
// Adding a dummy test to satisfy Jest's requirement
describe('Test Utils', () => {
  it('should be available for testing', () => {
    expect(true).toBe(true);
  });
});

import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Create a test theme
const theme = createTheme();

// Wrapper component for testing with providers
const AllTheProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </ThemeProvider>
  );
};

// Custom render function that includes all providers
const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything
export * from '@testing-library/react';

// Override render method
export { customRender as render };

// Export the wrapper for individual use
export { AllTheProviders as TestWrapper };

// Common mock data
export const mockUser = {
  id: '123',
  email: 'test@example.com',
  token: 'mock-token',
  children: []
};

export const mockChild = {
  id: 'child-123',
  name: 'Test Child',
  age: 8,
  gender: 'male'
};

// Common mock functions
export const mockNavigate = jest.fn();
export const mockLocation = {
  pathname: '/',
  search: '',
  state: null,
};

// Setup common mocks
export const setupCommonMocks = () => {
  jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(mockNavigate);
  jest.spyOn(require('react-router-dom'), 'useLocation').mockReturnValue(mockLocation);
};

// Clean up mocks
export const cleanupMocks = () => {
  jest.restoreAllMocks();
  jest.clearAllMocks();
}; 
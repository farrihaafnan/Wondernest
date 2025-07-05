import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { UserProvider, useUser } from '../UserContext';

// Mock component to test the context
const TestComponent: React.FC = () => {
  const { user, token, login, logout, isAuthenticated } = useUser();
  
  return (
    <div>
      <div data-testid="user-email">{user?.email || 'No user'}</div>
      <div data-testid="user-id">{user?.id || 'No id'}</div>
      <div data-testid="token">{token || 'No token'}</div>
      <div data-testid="is-authenticated">{isAuthenticated.toString()}</div>
      <button 
        data-testid="login-btn" 
        onClick={() => login({ id: '123', email: 'test@example.com' }, 'test-token')}
      >
        Login
      </button>
      <button data-testid="logout-btn" onClick={logout}>
        Logout
      </button>
    </div>
  );
};

describe('UserContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('UserProvider', () => {
    it('should render children without crashing', () => {
      render(
        <UserProvider>
          <div>Test Child</div>
        </UserProvider>
      );

      expect(screen.getByText('Test Child')).toBeInTheDocument();
    });

    it('should initialize with no user when localStorage is empty', () => {
      (localStorage.getItem as jest.Mock).mockReturnValue(null);

      render(
        <UserProvider>
          <TestComponent />
        </UserProvider>
      );

      expect(screen.getByTestId('user-email')).toHaveTextContent('No user');
      expect(screen.getByTestId('user-id')).toHaveTextContent('No id');
      expect(screen.getByTestId('token')).toHaveTextContent('No token');
      expect(screen.getByTestId('is-authenticated')).toHaveTextContent('false');
    });

    it('should initialize with user data from localStorage', () => {
      const mockUser = { id: '123', email: 'test@example.com' };
      const mockToken = 'test-token';

      (localStorage.getItem as jest.Mock)
        .mockReturnValueOnce(JSON.stringify(mockUser)) // user
        .mockReturnValueOnce(mockToken); // token

      render(
        <UserProvider>
          <TestComponent />
        </UserProvider>
      );

      expect(screen.getByTestId('user-email')).toHaveTextContent('test@example.com');
      expect(screen.getByTestId('user-id')).toHaveTextContent('123');
      expect(screen.getByTestId('token')).toHaveTextContent('test-token');
      expect(screen.getByTestId('is-authenticated')).toHaveTextContent('true');
    });

    it('should handle invalid JSON in localStorage gracefully', () => {
      (localStorage.getItem as jest.Mock)
        .mockReturnValueOnce('invalid-json') // user
        .mockReturnValueOnce('test-token'); // token

      // Should not throw error
      expect(() => {
        render(
          <UserProvider>
            <TestComponent />
          </UserProvider>
        );
      }).not.toThrow();

      expect(screen.getByTestId('user-email')).toHaveTextContent('No user');
      expect(screen.getByTestId('is-authenticated')).toHaveTextContent('false');
    });
  });

  describe('useUser hook', () => {
    it('should throw error when used outside UserProvider', () => {
      // Suppress console.error for this test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      // Create a component that uses useUser outside provider
      const TestComponentOutsideProvider = () => {
        const { user } = useUser();
        return <div>{user?.email}</div>;
      };

      // Test that it throws an error
      expect(() => {
        render(<TestComponentOutsideProvider />);
      }).toThrow('useUser must be used within a UserProvider');

      consoleSpy.mockRestore();
    });

    it('should provide login function that updates state and localStorage', () => {
      render(
        <UserProvider>
          <TestComponent />
        </UserProvider>
      );

      const loginButton = screen.getByTestId('login-btn');
      
      act(() => {
        loginButton.click();
      });

      expect(screen.getByTestId('user-email')).toHaveTextContent('test@example.com');
      expect(screen.getByTestId('user-id')).toHaveTextContent('123');
      expect(screen.getByTestId('token')).toHaveTextContent('test-token');
      expect(screen.getByTestId('is-authenticated')).toHaveTextContent('true');

      expect(localStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify({ id: '123', email: 'test@example.com' }));
      expect(localStorage.setItem).toHaveBeenCalledWith('token', 'test-token');
    });

    it('should provide logout function that clears state and localStorage', () => {
      // First login
      (localStorage.getItem as jest.Mock)
        .mockReturnValueOnce(JSON.stringify({ id: '123', email: 'test@example.com' }))
        .mockReturnValueOnce('test-token');

      render(
        <UserProvider>
          <TestComponent />
        </UserProvider>
      );

      const logoutButton = screen.getByTestId('logout-btn');
      
      act(() => {
        logoutButton.click();
      });

      expect(screen.getByTestId('user-email')).toHaveTextContent('No user');
      expect(screen.getByTestId('user-id')).toHaveTextContent('No id');
      expect(screen.getByTestId('token')).toHaveTextContent('No token');
      expect(screen.getByTestId('is-authenticated')).toHaveTextContent('false');

      expect(localStorage.removeItem).toHaveBeenCalledWith('user');
      expect(localStorage.removeItem).toHaveBeenCalledWith('token');
    });

    it('should update isAuthenticated based on user state', () => {
      render(
        <UserProvider>
          <TestComponent />
        </UserProvider>
      );

      // Initially not authenticated
      expect(screen.getByTestId('is-authenticated')).toHaveTextContent('false');

      // Login
      const loginButton = screen.getByTestId('login-btn');
      act(() => {
        loginButton.click();
      });

      expect(screen.getByTestId('is-authenticated')).toHaveTextContent('true');

      // Logout
      const logoutButton = screen.getByTestId('logout-btn');
      act(() => {
        logoutButton.click();
      });

      expect(screen.getByTestId('is-authenticated')).toHaveTextContent('false');
    });
  });

  describe('Context State Management', () => {
    it('should maintain state consistency across multiple operations', () => {
      render(
        <UserProvider>
          <TestComponent />
        </UserProvider>
      );

      // Initial state
      expect(screen.getByTestId('is-authenticated')).toHaveTextContent('false');

      // Login
      const loginButton = screen.getByTestId('login-btn');
      act(() => {
        loginButton.click();
      });

      expect(screen.getByTestId('user-email')).toHaveTextContent('test@example.com');
      expect(screen.getByTestId('is-authenticated')).toHaveTextContent('true');

      // Logout
      const logoutButton = screen.getByTestId('logout-btn');
      act(() => {
        logoutButton.click();
      });

      expect(screen.getByTestId('user-email')).toHaveTextContent('No user');
      expect(screen.getByTestId('is-authenticated')).toHaveTextContent('false');

      // Login again
      act(() => {
        loginButton.click();
      });

      expect(screen.getByTestId('user-email')).toHaveTextContent('test@example.com');
      expect(screen.getByTestId('is-authenticated')).toHaveTextContent('true');
    });

    it('should handle multiple rapid state changes', () => {
      render(
        <UserProvider>
          <TestComponent />
        </UserProvider>
      );

      const loginButton = screen.getByTestId('login-btn');
      const logoutButton = screen.getByTestId('logout-btn');

      // Multiple rapid operations
      act(() => {
        loginButton.click();
        logoutButton.click();
        loginButton.click();
      });

      // Should end up in logged-in state
      expect(screen.getByTestId('is-authenticated')).toHaveTextContent('true');
      expect(screen.getByTestId('user-email')).toHaveTextContent('test@example.com');
    });
  });
}); 
# Frontend Testing Guide

This document provides comprehensive information about the testing setup for the WonderNest frontend application.

## Overview

The frontend uses a comprehensive testing setup with:
- **Jest** as the test runner
- **React Testing Library** for component testing
- **TypeScript** support
- **Coverage reporting**
- **Mocking** for external dependencies

## Test Structure

```
frontend/src/
├── __tests__/                    # Test utilities and main app tests
│   ├── test-utils.tsx           # Common test helpers
│   └── App.test.tsx             # Main App component tests
├── components/
│   ├── auth/__tests__/          # Authentication component tests
│   │   ├── Login.test.tsx
│   │   └── Register.test.tsx
│   ├── layout/__tests__/        # Layout component tests
│   │   └── Navbar.test.tsx
│   └── pages/__tests__/         # Page component tests
│       └── WordMatching.test.tsx
└── contexts/__tests__/          # Context tests
    └── UserContext.test.tsx
```

## Running Tests

### Local Development
```bash
# Run tests in watch mode (recommended for development)
npm test

# Run tests once
npm test -- --watchAll=false

# Run tests with coverage
npm test -- --coverage --watchAll=false

# Run specific test file
npm test -- Login.test.tsx

# Run tests matching a pattern
npm test -- --testNamePattern="Login"
```

### CI/CD Pipeline
Tests are automatically run in the GitHub Actions CI pipeline:
- On every push to `main` branch
- On pull requests
- Tests must pass before deployment

## Testing Patterns

### 1. Component Testing
Components are tested using React Testing Library with proper mocking:

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TestWrapper } from '../__tests__/test-utils';

describe('ComponentName', () => {
  it('should render correctly', () => {
    render(
      <TestWrapper>
        <ComponentName />
      </TestWrapper>
    );
    
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

### 2. API Mocking
External API calls are mocked using Jest:

```typescript
// Mock fetch
(global.fetch as jest.Mock).mockResolvedValueOnce({
  ok: true,
  json: async () => mockData,
});

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
mockedAxios.post.mockResolvedValueOnce({ data: mockResponse });
```

### 3. Context Testing
Context providers are tested with custom test components:

```typescript
const TestComponent = () => {
  const { user, login, logout } = useUser();
  return (
    <div>
      <div data-testid="user">{user?.email || 'No user'}</div>
      <button onClick={() => login(mockUser, 'token')}>Login</button>
    </div>
  );
};
```

### 4. Navigation Testing
React Router navigation is mocked:

```typescript
const mockNavigate = jest.fn();
jest.spyOn(require('react-router-dom'), 'useNavigate')
  .mockReturnValue(mockNavigate);

// Test navigation
expect(mockNavigate).toHaveBeenCalledWith('/expected-route');
```

## Mocking Strategy

### 1. Browser APIs
- **localStorage/sessionStorage**: Mocked in `setupTests.ts`
- **fetch**: Mocked globally
- **window.location**: Mocked for URL testing
- **window.matchMedia**: Mocked for responsive design

### 2. External Libraries
- **axios**: Mocked for API calls
- **react-router-dom**: Partially mocked for navigation testing
- **Material-UI**: Used with test theme

### 3. Configuration
- **API endpoints**: Mocked in individual test files
- **Environment variables**: Mocked as needed

## Test Coverage

The testing setup includes comprehensive coverage reporting:

### Coverage Thresholds
- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%
- **Statements**: 70%

### Coverage Reports
Coverage reports are generated in the `coverage/` directory and include:
- Line-by-line coverage
- Branch coverage
- Function coverage
- Statement coverage

## Key Components Tested

### 1. Authentication Components
- **Login**: Form validation, API integration, error handling
- **Register**: Password matching, API calls, navigation
- **UserContext**: State management, localStorage integration

### 2. Layout Components
- **Navbar**: Authentication state, navigation, logout functionality

### 3. Feature Components
- **WordMatching**: API integration, game logic, user interactions
- **Dashboard**: Authentication checks, navigation

### 4. Core Components
- **App**: Routing, layout structure

## Components Not Tested (Trivial/Skipped)

### 1. Simple Display Components
- **Static UI elements** without business logic
- **Pure presentational components** with no state or interactions
- **Icon components** and simple visual elements

### 2. Static Pages Without Logic
- **Home page** (mostly static content)
- **About pages** or informational content
- **Static landing pages** without user interactions

### 3. Utility Functions Without Side Effects
- **Pure functions** with no external dependencies
- **Helper functions** that are simple transformations
- **Constants** and configuration objects

### 4. Why These Are Skipped
- **Low risk**: These components rarely introduce bugs
- **High maintenance**: Testing simple components adds overhead
- **Focus on value**: Tests focus on components with business logic
- **Coverage efficiency**: Better to test complex components thoroughly

## Best Practices

### 1. Test Organization
- Group related tests using `describe` blocks
- Use descriptive test names
- Test one behavior per test case

### 2. Mocking
- Mock external dependencies
- Use realistic mock data
- Clean up mocks between tests

### 3. Assertions
- Test user behavior, not implementation
- Use semantic queries (getByRole, getByLabelText)
- Avoid testing implementation details

### 4. Async Testing
- Use `waitFor` for async operations
- Mock API responses appropriately
- Test loading states and error handling

## Common Test Patterns

### 1. Form Testing
```typescript
// Fill form
fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
fireEvent.click(submitButton);

// Wait for async operation
await waitFor(() => {
  expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
});
```

### 2. API Error Testing
```typescript
// Mock API error
(global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

// Test error handling
await waitFor(() => {
  expect(screen.getByText('Error message')).toBeInTheDocument();
});
```

### 3. Authentication Testing
```typescript
// Test authenticated state
(localStorage.getItem as jest.Mock).mockReturnValue('mock-token');

// Test unauthenticated state
(localStorage.getItem as jest.Mock).mockReturnValue(null);
```

## Troubleshooting

### Common Issues

1. **Test not finding elements**: Use `screen.debug()` to see rendered output
2. **Async test failures**: Ensure proper use of `waitFor` and async/await
3. **Mock not working**: Check mock setup and cleanup
4. **Coverage not updating**: Clear Jest cache with `npm test -- --clearCache`

### Debug Commands
```bash
# Debug test output
npm test -- --verbose

# Run single test with debugging
npm test -- --testNamePattern="specific test" --verbose

# Clear Jest cache
npm test -- --clearCache
```

## CI/CD Integration

Tests are integrated into the GitHub Actions workflow:

1. **Frontend tests run** before build
2. **Coverage reports** are generated
3. **Tests must pass** before deployment
4. **CD workflow waits** for CI completion

This ensures code quality and prevents broken code from reaching production. 
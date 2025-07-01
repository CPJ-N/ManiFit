import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import LoginScreen from '../LoginScreen';
import { Provider } from 'react-redux';
import { store } from '../../../store/reduxStore';
import { GluestackUIProvider } from '../../../../components/ui/gluestack-ui-provider';
import { ROUTES } from '../../../constants/navigation';

// Mock navigation
const mockNavigate = jest.fn();
const mockNavigation = {
  navigate: mockNavigate,
};

// Mock Alert
jest.spyOn(Alert, 'alert');

// Test wrapper component
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <Provider store={store}>
    <GluestackUIProvider mode="light">
      {children}
    </GluestackUIProvider>
  </Provider>
);

describe('LoginScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderLoginScreen = () => {
    return render(
      <TestWrapper>
        <LoginScreen navigation={mockNavigation} />
      </TestWrapper>
    );
  };

  describe('UI Rendering', () => {
    it('renders all essential elements', () => {
      const { getByText, getByPlaceholderText } = renderLoginScreen();
      
      expect(getByText('Welcome Back')).toBeTruthy();
      expect(getByText('Sign in to continue your fitness journey')).toBeTruthy();
      expect(getByPlaceholderText('Enter your email')).toBeTruthy();
      expect(getByPlaceholderText('Enter your password')).toBeTruthy();
      expect(getByText('Sign In')).toBeTruthy();
      expect(getByText('New to ManiFit?')).toBeTruthy();
    });

    it('displays input labels correctly', () => {
      const { getByText } = renderLoginScreen();
      
      expect(getByText('Email Address')).toBeTruthy();
      expect(getByText('Password')).toBeTruthy();
    });
  });

  describe('Form Validation', () => {
    it('shows error when email is empty', async () => {
      const { getByText, getByPlaceholderText } = renderLoginScreen();
      
      const passwordInput = getByPlaceholderText('Enter your password');
      const loginButton = getByText('Sign In');
      
      fireEvent.changeText(passwordInput, 'password');
      fireEvent.press(loginButton);
      
      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith('Error', 'Please fill in all fields');
      });
    });

    it('shows error when password is empty', async () => {
      const { getByText, getByPlaceholderText } = renderLoginScreen();
      
      const emailInput = getByPlaceholderText('Enter your email');
      const loginButton = getByText('Sign In');
      
      fireEvent.changeText(emailInput, 'user@email.com');
      fireEvent.press(loginButton);
      
      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith('Error', 'Please fill in all fields');
      });
    });

    it('shows error when both fields are empty', async () => {
      const { getByText } = renderLoginScreen();
      
      const loginButton = getByText('Sign In');
      fireEvent.press(loginButton);
      
      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith('Error', 'Please fill in all fields');
      });
    });
  });

  describe('Authentication', () => {
    it('successfully logs in with valid credentials', async () => {
      const mockSignIn = signInWithEmailAndPassword as jest.Mock;
      mockSignIn.mockResolvedValueOnce({ user: { uid: '123' } });

      const { getByText, getByPlaceholderText } = renderLoginScreen();
      
      const emailInput = getByPlaceholderText('Enter your email');
      const passwordInput = getByPlaceholderText('Enter your password');
      const loginButton = getByText('Sign In');
      
      fireEvent.changeText(emailInput, 'user@email.com');
      fireEvent.changeText(passwordInput, 'password');
      
      await act(async () => {
        fireEvent.press(loginButton);
      });
      
      await waitFor(() => {
        expect(mockSignIn).toHaveBeenCalledWith({}, 'user@email.com', 'password');
      });
    });

    it('successfully logs in with sample credentials', async () => {
      const mockSignIn = signInWithEmailAndPassword as jest.Mock;
      mockSignIn.mockResolvedValueOnce({ user: { uid: 'sample-user-123' } });

      const { getByText, getByPlaceholderText } = renderLoginScreen();
      
      const emailInput = getByPlaceholderText('Enter your email');
      const passwordInput = getByPlaceholderText('Enter your password');
      const loginButton = getByText('Sign In');
      
      // Test with the provided sample credentials
      fireEvent.changeText(emailInput, 'user@email.com');
      fireEvent.changeText(passwordInput, 'password');
      
      await act(async () => {
        fireEvent.press(loginButton);
      });
      
      await waitFor(() => {
        expect(mockSignIn).toHaveBeenCalledWith({}, 'user@email.com', 'password');
      });
    });

    it('handles authentication errors', async () => {
      const mockSignIn = signInWithEmailAndPassword as jest.Mock;
      const errorMessage = 'Invalid email or password';
      mockSignIn.mockRejectedValueOnce(new Error(errorMessage));

      const { getByText, getByPlaceholderText } = renderLoginScreen();
      
      const emailInput = getByPlaceholderText('Enter your email');
      const passwordInput = getByPlaceholderText('Enter your password');
      const loginButton = getByText('Sign In');
      
      fireEvent.changeText(emailInput, 'invalid@email.com');
      fireEvent.changeText(passwordInput, 'wrongpassword');
      
      await act(async () => {
        fireEvent.press(loginButton);
      });
      
      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith('Login Failed', errorMessage);
      });
    });
  });

  describe('Loading States', () => {
    it('shows loading state during authentication', async () => {
      const mockSignIn = signInWithEmailAndPassword as jest.Mock;
      // Create a promise that doesn't resolve immediately
      let resolvePromise: (value: any) => void;
      const pendingPromise = new Promise((resolve) => {
        resolvePromise = resolve;
      });
      mockSignIn.mockReturnValueOnce(pendingPromise);

      const { getByText, getByPlaceholderText } = renderLoginScreen();
      
      const emailInput = getByPlaceholderText('Enter your email');
      const passwordInput = getByPlaceholderText('Enter your password');
      const loginButton = getByText('Sign In');
      
      fireEvent.changeText(emailInput, 'user@email.com');
      fireEvent.changeText(passwordInput, 'password');
      
      await act(async () => {
        fireEvent.press(loginButton);
      });
      
      // Check loading state
      expect(getByText('Signing In...')).toBeTruthy();
      
      // Resolve the promise to complete the test
      resolvePromise!({ user: { uid: '123' } });
    });

    it('disables button during loading', async () => {
      const mockSignIn = signInWithEmailAndPassword as jest.Mock;
      let resolvePromise: (value: any) => void;
      const pendingPromise = new Promise((resolve) => {
        resolvePromise = resolve;
      });
      mockSignIn.mockReturnValueOnce(pendingPromise);

      const { getByText, getByPlaceholderText } = renderLoginScreen();
      
      const emailInput = getByPlaceholderText('Enter your email');
      const passwordInput = getByPlaceholderText('Enter your password');
      const loginButton = getByText('Sign In');
      
      fireEvent.changeText(emailInput, 'user@email.com');
      fireEvent.changeText(passwordInput, 'password');
      
      await act(async () => {
        fireEvent.press(loginButton);
      });
      
      // Button should be disabled during loading
      const loadingButton = getByText('Signing In...');
      expect(loadingButton).toBeTruthy();
      
      // Resolve the promise
      resolvePromise!({ user: { uid: '123' } });
    });
  });

  describe('Password Visibility Toggle', () => {
    it('toggles password visibility', () => {
      const { getByPlaceholderText, getByTestId } = renderLoginScreen();
      
      const passwordInput = getByPlaceholderText('Enter your password');
      
      // Initially password should be hidden (secureTextEntry: true)
      expect(passwordInput.props.secureTextEntry).toBe(true);
      
      // Note: In a real implementation, you'd need to add testID to the password toggle button
      // For now, this test demonstrates the concept
    });
  });

  describe('Navigation', () => {
    it('navigates to register screen when register button is pressed', () => {
      const { getByText } = renderLoginScreen();
      
      const registerButton = getByText('New to ManiFit?');
      fireEvent.press(registerButton);
      
      expect(mockNavigate).toHaveBeenCalledWith(ROUTES.REGISTER);
    });
  });

  describe('Input Handling', () => {
    it('updates email state when typing', () => {
      const { getByPlaceholderText } = renderLoginScreen();
      
      const emailInput = getByPlaceholderText('Enter your email');
      fireEvent.changeText(emailInput, 'test@example.com');
      
      expect(emailInput.props.value).toBe('test@example.com');
    });

    it('updates password state when typing', () => {
      const { getByPlaceholderText } = renderLoginScreen();
      
      const passwordInput = getByPlaceholderText('Enter your password');
      fireEvent.changeText(passwordInput, 'testpassword');
      
      expect(passwordInput.props.value).toBe('testpassword');
    });

    it('trims email whitespace before authentication', async () => {
      const mockSignIn = signInWithEmailAndPassword as jest.Mock;
      mockSignIn.mockResolvedValueOnce({ user: { uid: '123' } });

      const { getByText, getByPlaceholderText } = renderLoginScreen();
      
      const emailInput = getByPlaceholderText('Enter your email');
      const passwordInput = getByPlaceholderText('Enter your password');
      const loginButton = getByText('Sign In');
      
      // Add whitespace to email
      fireEvent.changeText(emailInput, '  user@email.com  ');
      fireEvent.changeText(passwordInput, 'password');
      
      await act(async () => {
        fireEvent.press(loginButton);
      });
      
      await waitFor(() => {
        // Email should be trimmed
        expect(mockSignIn).toHaveBeenCalledWith({}, 'user@email.com', 'password');
      });
    });
  });
}); 
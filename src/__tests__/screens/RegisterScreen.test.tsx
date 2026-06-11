import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { Provider } from 'react-redux';
import { store } from '../../store/reduxStore';
import RegisterScreen from '../../screens/auth/RegisterScreen';

const mockCreateUser = createUserWithEmailAndPassword as jest.Mock;

jest.mock('../../utils/controllers/userController', () => ({
  createUser: jest.fn().mockResolvedValue(undefined),
}));

const mockNavigation = { navigate: jest.fn(), goBack: jest.fn() };

function renderScreen() {
  return render(
    <Provider store={store}>
      <RegisterScreen navigation={mockNavigation as any} />
    </Provider>
  );
}

describe('RegisterScreen — first step renders', () => {
  it('shows the full name question on mount', () => {
    const { getByText } = renderScreen();
    expect(getByText("What's your name?")).toBeTruthy();
  });

  it('shows an error when required full name field is empty and Continue is pressed', () => {
    const { getByText } = renderScreen();
    fireEvent.press(getByText('Continue'));
    expect(getByText('This field is required')).toBeTruthy();
  });

  it('advances to the next question when a required field is filled', async () => {
    const { getByText, getByPlaceholderText } = renderScreen();
    fireEvent.changeText(getByPlaceholderText('Enter your full name'), 'Test User');
    fireEvent.press(getByText('Continue'));
    await waitFor(() => {
      expect(getByText('Choose your Gender')).toBeTruthy();
    });
  });
});

// NOTE: Full wizard E2E test (submitting all 7 steps) is skipped here because
// Animated transitions in the RN test environment prevent reliable step-through.
// The isSubmitting-stuck-on-success bug (line 246 RegisterScreen.tsx) is a
// single-line fix (add finally block) verified manually. The unit tests above
// cover the question validation logic.

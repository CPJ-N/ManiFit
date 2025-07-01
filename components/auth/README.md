# Auth Components

This directory contains reusable authentication components that provide consistency across all auth screens.

## Components

### FormField
A styled form input field with:
- Icon support
- Focus states with animations
- Error states
- Password toggle functionality
- Consistent styling and behavior

### ErrorMessage  
A consistent error message component with:
- Animated entrance
- Error icon
- Styled background with border

### ActionButton
A reusable button component with:
- Primary and secondary variants
- Loading states with spinner
- Icon support
- Animated entrance
- Gradient styling for primary buttons

### AuthHeader
A standardized header for auth screens with:
- Logo with gradient background
- Title and subtitle
- Animated entrance
- Consistent styling

## Usage

```tsx
import { FormField, ErrorMessage, ActionButton, AuthHeader } from '@/components/auth';

// In your auth screen:
<FormField
  label="Email Address"
  value={email}
  onChangeText={setEmail}
  placeholder="Enter your email"
  icon="mail"
  focused={emailFocused}
  onFocus={() => setEmailFocused(true)}
  onBlur={() => setEmailFocused(false)}
  animatedValue={fadeAnim}
/>

<ActionButton
  title="Sign In"
  onPress={handleLogin}
  isLoading={isLoading}
  loadingText="Signing In..."
  variant="primary"
  animatedValue={buttonAnim}
/>
```

## Benefits

- **Consistency**: All auth screens use the same components
- **Maintainability**: Changes to styling/behavior only need to be made in one place
- **Reusability**: Components can be used across any auth screen
- **Type Safety**: Full TypeScript support with proper interfaces
export const SCREEN_FLAGS = {
  checkoutEnabled: process.env.EXPO_PUBLIC_ENABLE_CHECKOUT_SCREEN === 'true',
} as const;

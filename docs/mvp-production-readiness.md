# ManiFit MVP Production Readiness

Updated: 2026-06-11

## Current Verdict

ManiFit is not production-ready yet. Native project setup and pod install are not the active blocker; the remaining blockers are product and backend readiness, especially server-side billing, trainer/client linking, and missing MVP surfaces.

## Completed Or In Progress

- App shell: Expo/React Native navigation, auth screens, main tabs, profile, workout category/exercise flow.
- Firebase client setup: Auth, Firestore, Storage initialization.
- Verification status:
  - `npm test -- --runInBand` passes.
  - `npx tsc --noEmit` passes.
  - `npx expo-doctor` passes 19/21 checks.
  - `npm audit fix` has been applied once and Firebase was upgraded to reduce production audit exposure; remaining production audit issues require breaking dependency changes.
- Phase 0 app fixes added:
  - Registration now supports trainer vs trainee role selection.
  - New trainee profiles get `linkedTrainer: ''`; new trainer profiles get `linkedTrainees: []`.
  - Forgot-password now sends Firebase reset email.
  - App routing waits for authenticated profile loading before mounting the main/auth stack.
  - Linking controller now calls server functions instead of attempting cross-user Firestore writes.
- Payment safety fixes added:
  - Razorpay API secret and API URL are no longer exposed through Expo config or app env declarations.
  - Client-side Razorpay Order creation, client HMAC verification, and client ledger writes were removed.
  - Checkout now expects a server-created Razorpay Subscription and opens Razorpay with `subscription_id`.
- Firestore prep:
  - Billing collections are named in `firebaseCollection`.
  - Composite indexes are defined for unlinked trainees, subscriptions, transactions/charges, and payouts.
  - Billing ledger writes are denied from the client in Firestore rules.
  - Routine assignment reads now use `assigneeIds` for Firestore-compatible trainee access checks and `array-contains` queries.
  - `UsersDetails` rules now keep subscription/linking fields server-owned while allowing safe profile updates.
  - Registration now avoids writing `undefined` values to Firestore profile documents.

## MVP Release Blockers

### Must Finish Before Production

- Cloud Functions backend is missing:
  - `createSubscription` callable.
  - `razorpayWebhook` HTTP function with raw-body signature verification.
  - Admin SDK writes for `Subscriptions`, `Charges`/`TransactionDetails`, `WebhookEvents`, and `UsersDetails.isSubscribed`.
  - `linkTraineeToTrainer` and `unlinkTraineeFromTrainer` callable functions.
- Razorpay production setup is not complete:
  - Rotate any previously exposed key secret.
  - Store secrets in Firebase Secret Manager.
  - Configure Razorpay subscription webhooks and validate test recurring charges.
- Trainer dashboard is missing:
  - Client roster.
  - Paid/overdue/failed billing status.
  - Revenue summary.
  - Payout ledger.
- Trainer program management is incomplete:
  - Create/duplicate workout templates.
  - Assign personalized workout plans from trainer UI.
  - Meal plan creation and assignment.
- Client-side MVP surfaces are incomplete:
  - Assigned daily plan view backed by trainer assignments.
  - Workout completion history persisted to Firestore.
  - Meal plan access.
  - AI food photo, calorie recognition, food diary.
  - Chat/direct messaging and message notifications.
- Production operations are missing:
  - Data migration for legacy trainee docs missing `linkedTrainer`.
  - Data migration for legacy routine docs missing `assigneeIds`.
  - Deployed Firestore rules and indexes.
  - Crash/error reporting.
- Release build validation on iOS and Android devices.
- Expo Doctor residual warnings:
  - Native folders are checked in, so config fields in `app.config.js` will not auto-sync unless native files are regenerated or maintained manually.
  - React Native Directory flags `react-native-razorpay` as unsupported on New Architecture and `react-native-fs` as unmaintained/untested. Android New Architecture is disabled for MVP compatibility, but these package risks still need a payment/file-storage dependency decision.
- Production dependency audit still reports 13 vulnerabilities, including a high-severity `@gluestack-ui/nativewind-utils` -> `patch-package` -> `tmp` chain and a moderate Expo config tooling `uuid` chain. The available automated fixes are breaking changes and must be handled as explicit dependency-upgrade work.

### Compliance / Business Sign-Off

- Founder/legal sign-off is required for the pooled Razorpay merchant-of-record model.
- Monthly subscription amount must be enforced server-side at or below the RBI/NPCI e-mandate limit called out in the billing design spec.
- Cancellation/pause/resume must be available before paid launch.

## Release Gate Checklist

- `npm test` passes.
- `npx tsc --noEmit` passes.
- iOS production build installs and opens on device/simulator.
- Android production build installs and opens on device/emulator.
- Firebase rules deploy succeeds.
- Firestore indexes deploy succeeds.
- Firestore rules are validated with current Firebase credentials or the emulator; local validation is currently blocked by expired Firebase CLI credentials and missing Java.
- Razorpay test subscription creates, activates, charges, fails, and cancels with correct webhook-ledger state.
- No mobile bundle contains `RAZORPAY_API_KEY_SECRET`, webhook secrets, Basic auth payment calls, or client-side HMAC verification.

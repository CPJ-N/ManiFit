# ManiFit — Billing, Auth & Linking Design Spec

- **Date:** 2026-06-11
- **Status:** Draft for review
- **Approved approach:** Pooled auto-debit, ManiFit as merchant of record (Razorpay Subscriptions)
- **Scope:** Phase 0 (auth + linking + trainer signup), Phase 1 (billing core), Phase 2 (trainer dashboard + payouts)

---

## 1. Overview & Goals

### Product model: pooled auto-debit, ManiFit as merchant of record

ManiFit is the **single merchant of record**. Each client approves a **Razorpay Subscription mandate once** (UPI AutoPay primary; card e-mandate / net-banking e-mandate as fallback). Razorpay then **auto-debits the monthly amount into ManiFit's single Razorpay account** every billing cycle. A **Cloud Functions webhook is the source of truth**: it verifies each Razorpay event and updates a Firestore **ledger** (subscription state + charge records). Trainers see each client's status (**paid / overdue / failed**) and a **payout ledger**; payouts are **manual for v1**, computed as gross collected minus a **configurable platform fee (default 0%)**.

Because ManiFit is the merchant and money settles into ManiFit's own account, **trainers need no Razorpay KYC**. We deliberately do **not** use Razorpay Route in v1 (Route would require per-trainer Linked Accounts with KYC). The compliance trade-off of pooling funds (payment-aggregator exposure) is documented in §4 and §9 and needs founder/legal sign-off.

### Goals

1. **Remove the live secret leak.** The Razorpay `key_secret` currently ships in the client bundle and is logged to console. Move all secret-holding logic server-side and **rotate the key**. (Highest priority — gates Phase 1 go-live.)
2. **Replace fake recurring billing** (a one-time Order + a one-shot local notification) with **real Razorpay Subscriptions auto-debit** driven by webhooks.
3. **Per-client custom pricing** set by the trainer, validated server-side, implemented via a **plan price catalog** (one Razorpay Plan per distinct price point).
4. **Webhooks are the single source of truth** for entitlement and ledger state; the in-app checkout result is optimistic UI only.
5. **Fix Phase 0 prerequisites** that block the trainer/trainee model: trainer signup role selection, cross-user linking (blocked by rules today), the post-login routing race, and forgot-password.
6. **Trainer dashboard** showing paid/overdue/failed per client + revenue, plus a manual **payout ledger** with a configurable platform fee.

### Non-goals (v1)

- Automated payouts to trainers (manual bank transfer for v1; ledger only).
- Razorpay Route / per-trainer settlement.
- Any single debit above ₹15,000 (breaks AFA-free auto-debit — see §4).
- Multiple trainers per trainee (model supports one `linkedTrainer`).

---

## 2. Architecture

| Layer | Responsibility | Holds secret? |
|---|---|---|
| **Expo / React Native client** | Trainer sets price; trainee opens Razorpay checkout in subscription mode (`subscription_id`); reads ledger state from Firestore. | No — only the publishable `key_id`. |
| **Cloud Functions (v2, TypeScript, Node 22)** | Holds `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET` in Secret Manager. Creates plans/subscriptions; verifies auth + webhook signatures; writes all authoritative billing state via Admin SDK. | **Yes** — Secret Manager only. |
| **Razorpay** | Mandate registration, scheduled auto-debit, retries, webhook delivery. | n/a |
| **Firestore** | Projection of billing state (client-readable), idempotency log, plan catalog, payout ledger. Admin-SDK writes bypass rules; client writes denied on billing collections. | n/a |

### Two backend entry points (the only two for billing)

1. **`createSubscription`** — `onCall` (callable). Verifies `request.auth` (rejects unauthenticated). Derives `clientId` from `request.auth.uid` (never trusts a client-supplied uid). Reads the trainer-set price for this trainee, resolves/creates the matching Razorpay **Plan**, creates the **Subscription**, writes a `pending` ledger doc, returns `{ subscriptionId, shortUrl }`. Secrets bound: `[RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET]`.
2. **`razorpayWebhook`** — `onRequest` (raw HTTP). Reads `req.rawBody`, verifies `X-Razorpay-Signature = HMAC_SHA256(rawBody, WEBHOOK_SECRET)`, dedupes on `x-razorpay-event-id` via an atomic Firestore transaction, then drives the ledger. Returns 2xx fast. Secret bound: `[RAZORPAY_WEBHOOK_SECRET]` only.

### Signature verification — two distinct secrets, do not conflate

- **Auth signature** (post-checkout, optional confirmation): `HMAC_SHA256(razorpay_payment_id + '|' + razorpay_subscription_id, KEY_SECRET)`. **Note the reversed order** vs one-time orders (`order_id|payment_id`). The current `verifyPayment` uses the one-time order and must be **deleted**, not adapted.
- **Webhook signature** (authoritative): `HMAC_SHA256(rawBody, WEBHOOK_SECRET)` over the **raw, unparsed body** — a separate secret configured per-webhook in the Razorpay dashboard.

### Entitlement model (webhook-driven)

- `subscription.activated` / `subscription.charged` → `active`; grant/extend the paid month; append a `Charges` entry; set `UsersDetails.isSubscribed = true`.
- `subscription.pending` / `payment.failed` → `past_due` / `failed`; trigger dunning push.
- `subscription.halted` → suspend access (`isSubscribed = false`), but recoverable (re-auth can return to active).
- `subscription.cancelled` → revoke (permanent; a new subscription is required to resume).
- `subscription.completed` → end-of-term; renewal policy creates a fresh subscription.

The client app **never sees recurring charges** — they are asynchronous and scheduler-driven. Access is gated only on the webhook-updated Firestore doc, never on the in-app checkout result.

---

## 3. End-to-end flow

**A. Trainer sets price** (Phase 1 data, Phase 2 UI)
1. Trainer enters a monthly price within the allowed catalog (₹2,000–₹10,000; must be ≤ ₹15,000 per debit).
2. App writes a `Plans` doc keyed to the trainee `{ trainerId, traineeUid, amountPaise, currency:'INR', period:'monthly', interval:1 }`. `razorpayPlanId` is resolved lazily server-side at subscribe time.

**B. Trainee authorizes the mandate**
1. Trainee taps Subscribe → client calls `createSubscription` (uid server-derived).
2. Function validates the trainee is linked to a trainer and reads the trainer-set price (server-side; the client cannot choose the amount).
3. Function resolves the Razorpay Plan for that price point from a cached catalog, lazily creating a plan only when a price point is new (plan amounts are immutable → one plan per price).
4. Function creates the Subscription (`POST /v1/subscriptions` with `plan_id`, `total_count`, `customer_notify:1`, `expire_by`, `notes:{ manifit_client_id, trainer_id }`), writes a `pending` Subscription doc, returns `subscription_id` + `short_url`.
5. Client opens `RazorpayCheckout.open({ key: KEY_ID, subscription_id, name, description, prefill, theme })` — **`subscription_id`, not `order_id`**. Trainee completes one-time AFA (UPI PIN / OTP) to register the mandate.
6. On resolve `{ razorpay_payment_id, razorpay_subscription_id, razorpay_signature }` → client shows an **optimistic "activation pending"** state. On `.catch`, surface `error.code` / `error.description` and allow retry.

**C. Recurring auto-debit** (Razorpay-driven; app never sees it)
1. ~24h before each cycle, Razorpay initiates the debit → the **issuing bank** sends the mandatory pre-debit notification (see §4 — ManiFit does not send this).
2. On the debit date, Razorpay charges and fires `subscription.charged` (or `payment.failed` / `subscription.pending` / `subscription.halted`).
3. `razorpayWebhook` verifies the signature, dedupes by event id, writes the `Charges` entry, updates `Subscriptions` status + period, flips `UsersDetails.isSubscribed`, and (on failure) queues a dunning push.

**D. Trainer dashboard & payout** (Phase 2)
1. Trainer reads `getSubscriptionsByTrainerId` + `getTransactionsByTrainerId` → paid/overdue/failed buckets + total revenue.
2. `Payouts` entries per period: `netAmount = grossRevenue − platformFee` (default 0%). For v1, an admin/function marks them `paid` after a manual bank transfer; no Razorpay payout API is called.

**E. Cancel / pause** (RBI online-withdrawal requirement)
- The app surfaces a prominent self-serve cancel/pause that calls backend wrappers (`cancel`/`pause`/`resume`). Cancellation is permanent; resuming after cancel requires a new subscription.

---

## 4. Compliance requirements (RBI / NPCI)

**Per-debit AFA-free ceiling: ₹15,000 (hard product constraint).** Every individual recurring debit must stay ≤ ₹15,000 so cycles auto-debit without per-cycle OTP/PIN after the one-time mandate. The ₹2,000–₹10,000 range is safely under this. **Enforce server-side** in `createSubscription`: reject any trainer-set price > ₹15,000. Fitness/gym is **not** an RBI/NPCI exempt category (unlike MF SIP, insurance, credit-card bills, which get the ₹1,00,000 cap). Any future tier that pushes a single debit over ₹15,000 must use one-time checkout, not the auto-debit rail.

**24-hour pre-debit notification: sent by the issuing bank, not ManiFit.** The customer's bank sends the mandatory ≥24h pre-debit notice (amount, date, merchant, reference, opt-out) for every cycle, triggered by Razorpay initiating the debit ~24h early. **ManiFit does not build, send, or replicate it** and needs no integration for it — it only consumes the debit result via webhook. Dunning design should assume the customer already received a bank notice with an opt-out option.

**One-time AFA at registration.** Mandate registration always requires AFA once (UPI PIN / OTP), regardless of amount. Set the registered mandate max with headroom but still ≤ ₹15,000. An upward price change beyond the registered max requires a **new mandate (fresh AFA)** — a price increase is not a silent update.

**Mandate rails.** Default UPI AutoPay (best success rate sub-₹15,000); offer card e-mandate and net-banking e-mandate as fallbacks. The rail is abstracted behind the subscription model — no rail-specific client code beyond what `RazorpayCheckout` handles.

**Payment-aggregator exposure (must be flagged to founder).** Because v1 pools subscriber funds into ManiFit's own account before manually paying trainers, ManiFit acts as a payment intermediary, which can trigger RBI Payment Aggregator licence / nodal-escrow requirements. The compliance-clean alternative (Razorpay Route split settlement) was rejected because it reintroduces per-trainer KYC. This is an **accepted, documented business risk for v1** requiring founder/legal sign-off. Practical mitigations: keep trainer count small in v1; revisit Route or a PA-compliant escrow at scale.

**Cancel/withdraw facility (mandatory).** RBI requires an online facility to withdraw/cancel an e-mandate at any time — surfaced as an easy, non-buried self-serve cancel/pause (§3E).

**Entitlement from webhooks only.** Bank declines and customer opt-outs via the pre-debit notice are common; never assume silent success. Drive all access from `subscription.charged` / `pending` / `halted` / `cancelled`, reconciled against the Razorpay API.

---

## 5. Data model & Firestore rules

### Collections (`src/constants/firebaseContant.ts` — add `plans`, `webhookEvents`, `charges`, `payouts`)

**`UsersDetails/{uid}`** (existing) — standardize linking fields:
- Trainees: `linkedTrainer: ''` (empty-string sentinel, written on signup; backfill legacy docs). Trainers: `linkedTrainees: []`.
- `isTrainer` driven by the new register role step (no longer hardcoded `false`).
- `isSubscribed`, `subscriptionId` written **only by the webhook function** going forward.
- (Optional) `pushToken` for server-driven dunning.

**`Plans/{planDocId}`** (NEW) — trainer-set price per trainee: `{ trainerId, traineeUid, amountPaise, currency:'INR', period:'monthly', interval:1, razorpayPlanId? }`. `razorpayPlanId` resolved/cached lazily server-side (one Razorpay plan per distinct price point; immutable amount).

**`Subscriptions/{id}`** (revise `subscription.model.ts`):
- ADD: `razorpaySubscriptionId`, `razorpayPlanId`, `razorpayCustomerId?`, `razorpayMandateId?/tokenId?`, `shortUrl`, `currentPeriodStart`, `currentPeriodEnd`, `chargeCount`, `totalCount`.
- POPULATE (required): `trainerId` (from `trainee.linkedTrainer`), `clientId` (paying uid). Authoritative `amount`/`currency`/`billingCycle` from the trainer-set plan.
- `status`: align to the Razorpay lifecycle `created | authenticated | active | pending | halted | completed | cancelled`.
- DEPRECATE/REMOVE: `stripeSubscriptionId`, `stripeCustomerId`, `paymentMethodId`, legacy `plan`/`details`/`payments`/`nextDueDate`. Standardize the owner key on `clientId` (write during transition; rules fall back to `userId` for legacy reads).

**`TransactionDetails/{id}` / `Charges/{id}`** — written by the webhook only: `{ clientId, trainerId, razorpaySubscriptionId, paymentId, amount, currency, status:'success'|'failed', cycleStart, cycleEnd, eventId, timestamp }`. Adding `trainerId` is the Phase 2 enabler.

**`WebhookEvents/{eventId}`** (NEW) — idempotency log keyed by `x-razorpay-event-id`: `{ receivedAt }`. No client access.

**`Payouts/{id}`** (NEW, `payout.model.ts`): `{ trainerId, periodStart, periodEnd, grossRevenue, platformFeePct (default 0), platformFeeAmount, netAmount, status:'pending'|'processing'|'paid', payoutDate?, sourceTransactionIds[] }`. v1 written by admin/function; marked `paid` after manual transfer.

### `firestore.rules` changes

- **`UsersDetails`** — keep strict `read, write if request.auth.uid == userId` (cross-user linking goes through a Cloud Function, **not** a rules relaxation).
- **`Subscriptions`** — `allow read if request.auth != null && (resource.data.clientId == request.auth.uid || resource.data.userId == request.auth.uid || resource.data.trainerId == request.auth.uid)`; **deny client write** (webhook writes via Admin SDK bypass rules).
- **`TransactionDetails` / `Charges`** — read for owner (`clientId`) or `trainerId`; **deny client write**.
- **`Plans`** — read for the owning trainer and the linked trainee; write for the owning trainer only.
- **`Payouts`** — read where `resource.data.trainerId == request.auth.uid`; deny client write.
- **`WebhookEvents`** — no client access.

### `firestore.indexes.json` (currently empty `[]`)

Add composite indexes: `UsersDetails(isTrainer ==, linkedTrainer ==)`; `Subscriptions(trainerId ==, status ==, orderBy timestamp)`; `TransactionDetails(trainerId ==, status ==, orderBy timestamp)`; `Payouts(trainerId ==, orderBy payoutDate)`. Missing indexes throw `failed-precondition` at runtime, not build time.

---

## 6. Phase plan

### Phase 0 — Auth, linking & trainer signup (prerequisites)

**Deliverables**
- Trainer-vs-trainee role selection at registration, writing `isTrainer` correctly.
- Deterministic `linkedTrainer`/`linkedTrainees` convention so the unlinked-trainee query works.
- Cross-user trainer↔trainee linking not blocked by Firestore rules (via Cloud Function).
- Fixed post-login routing race (no flash to AUTH before profile loads).
- Working forgot-password flow.
- Composite index for `isTrainer+linkedTrainer`; one-time backfill of legacy trainee docs.

**Change-sites**
- `src/screens/auth/RegisterScreen.tsx` (`questions[]`): add a `role` question (`trainee` / `trainer`) before `email`, reusing the existing options renderer.
- `src/screens/auth/RegisterScreen.tsx` (`handleSubmit`, ~L224–235): set `isTrainer: answers.role === 'trainer'`; trainees get `linkedTrainer:''`, trainers get `linkedTrainees:[]`; remove hardcoded `isTrainer:false` (L232).
- `src/utils/controllers/linkingTrainerTrainee.ts` (`assignTraineeToTrainer`, L6–26): replace the two cross-user `updateDoc` calls with a call to a new callable `linkTraineeToTrainer` (Admin SDK, atomic batch, role-validated).
- `src/utils/controllers/linkingTrainerTrainee.ts` (`getAllUnlinkedTrainees`, L49–57): no logic change once `linkedTrainer:''` is standardized; depends on the composite index.
- `functions/src/linking.ts` (NEW): `linkTraineeToTrainer` callable — verified caller, role checks, batch write to both `UsersDetails` docs.
- `firestore.rules` (`UsersDetails`, L5–7): keep strict same-user write unchanged.
- `src/screens/auth/LoginScreen.tsx` (Forgot Password, ~L251–255): add `handleForgotPassword` using `sendPasswordResetEmail`, wire `onPress`.
- `App.tsx` (loading gate, L59): change to `if (authLoading || (isAuthenticated && userLoading))`.
- `src/hooks/useUserProfile.ts`: make `loading=true` cover the "authenticated but profile not yet fetched" window; reset `false` on both success and no-profile paths.
- `src/navigation/RootNavigator.tsx` (`getInitialRoute`, L46–64): no change if `App.tsx` settles `hasCompletedProfile` before mount; otherwise switch to conditional-stack rendering.
- `firestore.indexes.json`: add `isTrainer(==)+linkedTrainer(==)`.
- One-time migration script (NEW): backfill `linkedTrainer:''` on legacy trainee docs.

### Phase 1 — Billing core (Cloud Functions, Razorpay Subscriptions, webhook, ledger, data model + rules)

**Deliverables**
- Cloud Functions v2 (TypeScript, Node 22) scaffolded and wired into `firebase.json`.
- Secrets in Secret Manager (`KEY_ID`, `KEY_SECRET`, `WEBHOOK_SECRET`); client secret usage removed and key rotated.
- `createSubscription` callable: validates trainer-set price (≤ ₹15,000), resolves/caches a Razorpay Plan per price point, creates the Subscription, returns `subscription_id`/`short_url`.
- `razorpayWebhook` onRequest: rawBody signature verify, `x-razorpay-event-id` idempotency, authoritative ledger writes for activated/charged/pending/halted/cancelled/completed/payment.failed.
- Razorpay-shaped Subscription model + `Plans`/`WebhookEvents`/`Charges` collections.
- Firestore rules locked: client writes denied on billing collections; trainer/owner reads allowed.
- Checkout rewritten to `subscription_id` mandate mode; local fake-recurring notification removed.

**Change-sites**
- `functions/` (NEW scaffold): `package.json` (firebase-functions v6.x, firebase-admin, razorpay; Node 22), `tsconfig.json`, `.env.example`.
- `functions/src/index.ts` (NEW): export `createSubscription` (onCall) and `razorpayWebhook` (onRequest); `initializeApp()` + `getFirestore()` at module top.
- `functions/src/razorpay.ts` (NEW): server Razorpay client (key from `defineSecret`); `createPlan`, `createSubscription`, `fetchSubscription`, `cancel`/`pause`/`resume`.
- `functions/src/webhookHandlers.ts` (NEW): handlers with idempotent `WebhookEvents` claim and atomic ledger transactions.
- `firebase.json`: add a `functions` block.
- `src/utils/controllers/billingController.ts` (`generateOrderId`, L25–63): DELETE client Orders + Basic-auth call; remove base-64 encode + `razorpayApiKeySecret` usage.
- `src/utils/controllers/billingController.ts` (`verifyPayment`, L65–90): DELETE entirely; remove CryptoJS import and all secret-logging (L75–76).
- `src/utils/controllers/billingController.ts` (`recordPaymentInFirestore`, `addSubscription`, `updateSubscription`): move authoritative writes into the webhook function; keep client read helpers (or downgrade to pending-intent).
- `src/utils/controllers/billingClient.ts` (NEW): thin `httpsCallable` wrapper for `createSubscription` + Firestore status reads.
- `src/screens/CheckoutScreen.jsx`: remove client price radios + client amount; fetch trainer-set price; call `createSubscription`; open `RazorpayCheckout` with `subscription_id`; remove client `verifyPayment`/`handleSubscription`/`recordPaymentInFirestore`; remove `scheduleMonthlyNotification`/`scheduleTestNotification`; add "activation pending" UI.
- `src/utils/notificationHandler.ts` (`scheduleMonthlyNotification`, L36–50): deprecate/remove; keep permissions/config; optionally register push token.
- `src/constants/dataModels/subscription.model.ts`: add `razorpay*` fields, populate `trainerId`/`clientId`, deprecate `stripe*`/legacy fields.
- `src/constants/firebaseContant.ts`: add `plans:'Plans'`, `webhookEvents:'WebhookEvents'`, `charges:'Charges'`.
- `app.config.js` (`extra`): REMOVE `razorpayApiKeySecret` and `razorpayApiUrl`; keep publishable `razorpayApiKeyId`.
- `env.d.ts`: remove `RAZORPAY_API_KEY_SECRET`/`RAZORPAY_API_URL` client decls; fix the `{r` typo on L1.
- `.env.example`: keep `RAZORPAY_API_KEY_ID` app-level; move SECRET/URL + new `WEBHOOK_SECRET` into `functions/.env.example`.
- `firestore.rules` (`Subscriptions` L26–28, `TransactionDetails` L21–23): deny client write, allow owner + `trainerId` read; add `Plans`/`Charges`/`WebhookEvents` rules.

### Phase 2 — Trainer dashboard + payout ledger

**Deliverables**
- Role-branched trainer tabs (Clients, Billing/Revenue, Payouts) in the existing tab navigator.
- Per-client paid/overdue/failed status pills sourced from the webhook-written ledger.
- Revenue dashboard aggregating trainer-scoped subscriptions/transactions.
- Manual payout ledger with a configurable platform fee (default 0%).
- Trainer-scoped reads enabled by `trainerId` on docs + widened read rules + composite indexes.

**Change-sites**
- `src/constants/navigation.ts` (`ROUTES`): add `CLIENTS`, `BILLING`, `PAYOUTS`, `CLIENT_DETAIL`.
- `src/navigation/MainNavigator.tsx`: read `isTrainer` via `useSelector`; conditionally render trainer `Tab.Screen`s with a falsy default guard (avoid tab remount); register new screens; register `ClientDetail` as a stack screen following the `CHECKOUT` pattern; keep dark/gold theme.
- `src/utils/controllers/billingController.ts`: add `getSubscriptionsByTrainerId` and `getTransactionsByTrainerId` (where `trainerId ==`) for buckets + revenue.
- `src/utils/controllers/payoutController.ts` (NEW): `createPayout`, `getPayoutsByTrainerId`, `updatePayoutStatus`; `netAmount = grossRevenue − platformFee`.
- `src/utils/controllers/linkingTrainerTrainee.ts` (`getAlllinkedTrainees`): reuse as-is for the client roster.
- `src/constants/dataModels/payout.model.ts` (NEW): `Payout` interface.
- `src/screens/trainer/ClientsScreen.tsx`, `BillingScreen.tsx`, `PayoutsScreen.tsx`, `ClientDetailScreen.tsx` (NEW): reuse `HomeScreen` `StatCard`/dark-gold theme.
- `firestore.rules`: allow `resource.data.trainerId == request.auth.uid` read on `Subscriptions`/`TransactionDetails`; add `Payouts` trainer-owned read rule.
- `firestore.indexes.json`: add `trainerId+status (+orderBy)` indexes.
- `src/constants/firebaseContant.ts`: add `payouts:'Payouts'`.

---

## 7. Sequencing constraints

1. **Secret rotation gates Phase 1 go-live.** The exposed `key_secret` is already in shipped builds — it must be **rotated in the Razorpay dashboard**, not merely deleted from source. Ship the Cloud Function (server-held secret) first, then remove client usage, then rotate.
2. **Functions + Admin-SDK writes must land before rules are tightened.** Tightening `Subscriptions`/`TransactionDetails` to deny client writes will break the current client `addSubscription`/`recordPaymentInFirestore` until those writes move into the webhook. Sequence: deploy functions → migrate writes → lock rules.
3. **`linkedTrainer` standardization (Phase 0) gates the unlinked-trainee query and the trainer dashboard.** `where('linkedTrainer','==','')` does not match a missing field; register must write `linkedTrainer:''` on every trainee, plus a one-time legacy backfill.
4. **`trainerId`/`clientId` on Subscription + Transaction docs is the Phase 2 blocker.** No trainer-scoped query is possible until the payment write path persists these.
5. **Composite indexes** for two-equality / status+orderBy queries must be added and deployed, or queries fail at runtime.

---

## 8. External setup required (by you)

- **Razorpay:** rotate the currently-exposed `key_secret`; generate a new `key_id` + `key_secret`. (Confirm whether the leaked key is test or live first.)
- **Razorpay:** confirm Subscriptions and e-mandate/UPI AutoPay are enabled; validate in TEST mode with test cards/UPI before live.
- **Razorpay:** create a Webhook pointing at the deployed `razorpayWebhook` URL; subscribe to `subscription.activated`, `subscription.charged`, `subscription.pending`, `subscription.halted`, `subscription.cancelled`, `subscription.completed`, `payment.failed`; set a webhook secret (separate from the API key secret).
- **Firebase:** `firebase init functions` (TypeScript), Node 22; install `firebase-functions` (v6.x), `firebase-admin`, `razorpay`.
- **Firebase:** store secrets via Secret Manager (`firebase functions:secrets:set RAZORPAY_KEY_ID|RAZORPAY_KEY_SECRET|RAZORPAY_WEBHOOK_SECRET`). Do not use `functions.config()`. Bind each secret only to the function that needs it.
- **Firebase:** deploy composite indexes (`firebase deploy --only firestore:indexes`).
- **Test-mode validation:** trigger a test recurring charge to confirm `subscription.charged` fires and entitlement + ledger writes work. Webhook signature must be tested against a deployed function/tunnel (rawBody is undefined in the emulator).
- **Founder / legal sign-off:** accept the payment-aggregator/RBI-PA pooling exposure for v1.
- **Data migration:** backfill `linkedTrainer:''` on legacy trainee docs; decide whether to backfill `trainerId`/`clientId` on legacy Subscription/Transaction docs or mark them legacy/inactive.
- **Push notifications:** decide Expo push vs FCM for renewal/failed-charge alerts; add push-token storage to the user model.

---

## 9. Risks & open questions

- **Exposed secret in shipped builds** must be rotated in the dashboard, not just removed from source. Until rotated, the credential is compromised.
- **Payment-aggregator / RBI PA exposure** from pooling funds — accepted v1 business risk; needs founder/legal sign-off.
- **`react-native-razorpay` subscription support unverified** — confirm the installed version and account both support subscription_id / eMandate checkout; may need an SDK upgrade. Validate in TEST first.
- **Webhook rawBody undefined in the Firebase emulator** — test signature verification against a deployed function or tunnel.
- **Idempotency is mandatory** (at-least-once delivery) — claim `x-razorpay-event-id` in a Firestore transaction before processing, or revenue double-counts.
- **Legacy data invisibility** — existing docs lack `linkedTrainer`/`trainerId`/`clientId`; invisible to new equality queries/rules until backfill.
- **Composite index runtime failures** — missing indexes throw `failed-precondition` only at runtime.
- **Rules-tightening rollout ordering** — functions + Admin writes first, then lock rules.
- **Overdue/failed buckets have no data source** until webhooks record them.
- **Tab remount on role resolution** — `isTrainer` can be `undefined` during profile load; guard with a falsy default so trainees never flash trainer tabs.
- **`total_count` renewal policy undecided** — `completed` stops billing; decide auto-renew (new subscription) vs a large `total_count`. `cancelled` is permanent.
- **Mandate max headroom vs ₹15,000** — headroom for future price rises must never push the registered max over ₹15,000.

---

## 10. Appendix — design decisions resolved

- **Route vs pooled:** v1 pools into ManiFit's account (no trainer KYC); Route is out of scope. PA exposure accepted as documented risk.
- **Who sends pre-debit notifications:** the customer's issuing bank, not ManiFit.
- **AFA-free threshold:** current operative ceiling is ₹15,000 (RBI June 2022), not the legacy ₹2,000/₹5,000.
- **Signature order:** subscription auth signature is `payment_id|subscription_id` (reversed vs one-time orders); webhook signature is `rawBody` with a separate secret. Old `verifyPayment` is deleted.
- **Per-client pricing:** fixed price catalog, one immutable Razorpay Plan per price point, cached and reused; `quantity` only for clean multiples; `addons` only for one-time onboarding fees.
- **Two subscription shapes:** canonical model is Razorpay-shaped; deprecate Stripe + flat-legacy fields; new writes go through the webhook function only.
- **Owner key:** standardize on `clientId` (write both during transition; rules fall back to `userId` for legacy reads); add `trainerId`-based read access.
- **Cross-user linking:** moved into a Cloud Function (Admin SDK, atomic) rather than relaxing the strict same-user user-doc rule.
- **Post-login routing race:** gate loading on `authLoading || (isAuthenticated && userLoading)`; `useUserProfile` reports loading during the unfetched-profile window.
- **"Recurring" mechanism:** the one-shot local notification is deleted; real recurrence is Razorpay auto-debit, with webhook-triggered push for renewals/failures.

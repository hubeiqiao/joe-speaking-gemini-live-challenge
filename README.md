# Joe Speaking Gemini Live Challenge

Competition-only Joe Speaking build for the Gemini Live Agent Challenge. This repo is isolated from the production Joe Speaking product and runs on a separate Google Cloud stack.

## Scope

- Reuse the Joe Speaking landing-page feel and IELTS speaking framing
- Focus the app on the judge path:
  - Google sign-in
  - Gemini live conversation
  - session saved to library
  - review/result page
  - same-topic re-practice with versioning
- Keep the challenge stack production-safe:
  - separate repo
  - separate Google Cloud deployment
  - separate secrets
  - Google Cloud Run deployment

## Current Status

The challenge build currently includes:

- reusable Joe Speaking landing page and judge entry flow
- starter demo provisioning and local challenge state
- Gemini Live session bootstrap via `/api/live/token`
- in-browser live panel with:
  - spoken Gemini output
  - push-to-talk microphone input
  - typed fallback input
  - transcript capture for review generation
- recap generation via `/api/live/review`
- library grouping by same-topic attempts
- collection save flow for review takeaways
- detailed GCP, deployment, and submission docs

Core routes:

- `/`
- `/app`
- `/api/health`
- `/api/demo/provision`
- `/api/live/token`
- `/api/live/review`

## Local Run

1. Copy `.env.example` to `.env.local`.
2. Fill in the Gemini and Google Cloud values.
3. Install dependencies:

```bash
npm install
```

4. Start the app:

```bash
npm run dev
```

5. Run the current unit test batch:

```bash
npx vitest --run
```

6. Validate a production build locally before deployment:

```bash
npm run build
```

## Deploy to Google Cloud

Read these in order:

1. [`docs/gcp/SETUP.md`](./docs/gcp/SETUP.md)
2. [`docs/gcp/SECRETS.md`](./docs/gcp/SECRETS.md)
3. [`docs/gcp/DEPLOY.md`](./docs/gcp/DEPLOY.md)

## Submission Assets

- Devpost project outline: [`docs/submission/DEVPOST.md`](./docs/submission/DEVPOST.md)
- Submission checklist: [`docs/submission/CHECKLIST.md`](./docs/submission/CHECKLIST.md)
- Video storyboard: [`docs/video/STORYBOARD.md`](./docs/video/STORYBOARD.md)
- Video script: [`docs/video/SCRIPT.md`](./docs/video/SCRIPT.md)
- Architecture notes: [`docs/architecture/diagram.md`](./docs/architecture/diagram.md)

## Production Safety Rules

- Do not reintroduce onboarding, credits, Stripe, BYOK, PostHog, or Vercel Analytics.
- Do not document Vercel as the canonical host for the challenge build.
- Keep the judge build on its own Google Cloud configuration and do not mix it with the current production app runtime.

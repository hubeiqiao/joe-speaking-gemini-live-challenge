# Joe Speaking Live

Joe Speaking Live is a new **Gemini Live Agent Challenge** submission based on the Joe Speaking product experience. Joe Speaking is the broader speaking product at **[JoeSpeaking.com](https://joespeaking.com)**, while this repository is the separate challenge build that keeps the Joe Speaking landing page, IELTS framing, live speaking flow, library, review, and same-topic retry loop, but ships as its own **Google Cloud** submission artifact.

## Challenge Fit

- **Category:** Live Agents
- **Gemini requirement:** uses **Gemini Live API**
- **SDK requirement:** uses the **Google GenAI SDK**
- **Google Cloud service requirement:** uses **Cloud Run**, **Secret Manager**, **Cloud Build**, and **Artifact Registry**
- **Hosting requirement:** backend is hosted on **Google Cloud Run**
- **Public repo requirement:** this repository is public for judging and reproducibility

Official challenge references:

- [Gemini Live Agent Challenge overview](https://geminiliveagentchallenge.devpost.com/)
- [Official rules](https://geminiliveagentchallenge.devpost.com/rules)
- [FAQ](https://geminiliveagentchallenge.devpost.com/details/faqs)

## Public Links

- **Live demo:** [joe-speaking-gemini-live-challenge-739605611304.northamerica-northeast1.run.app](https://joe-speaking-gemini-live-challenge-739605611304.northamerica-northeast1.run.app)
- **Public repo:** [github.com/hubeiqiao/joe-speaking-gemini-live-challenge](https://github.com/hubeiqiao/joe-speaking-gemini-live-challenge)
- **Joe Speaking product:** [JoeSpeaking.com](https://joespeaking.com)
- **Architecture diagram:** [docs/architecture/diagram.md](./docs/architecture/diagram.md)
- **Google Cloud deployment proof:** [docs/gcp/DEPLOY.md](./docs/gcp/DEPLOY.md)
- **Google Cloud service usage in code:** [app/api/live/token/route.ts](./app/api/live/token/route.ts)

## What Judges Should See

This build is intentionally focused on one clear loop:

1. Open the landing page.
2. Enter the app at `/app`.
3. Start a live Gemini speaking session.
4. Answer by microphone or with **text mode**.
5. Generate a recap.
6. Open the attempt from the **Library**.
7. Retry the same topic and see versioned progression.

## What This Submission Includes

- Joe Speaking landing page and IELTS speaking presentation
- Joe Speaking-style app shell
- Gemini Live conversation flow
- text-mode fallback for the live session
- recap generation after a session
- library of attempts
- same-topic retry flow
- review surface
- collection save flow
- Google Cloud deployment docs
- submission docs and architecture diagram

## What This Submission Does Not Try To Be

This repository is **not** the full production Joe Speaking app.

It intentionally excludes or avoids:

- production billing flows
- Stripe
- BYOK
- multi-provider switching
- Vercel as the canonical deployment target
- production analytics vendors
- production onboarding and credit systems

## Tech Stack

- Gemini Live API
- Google GenAI SDK
- Google Cloud Run
- Google Secret Manager
- Google Cloud Build
- Artifact Registry
- Next.js
- React
- Tailwind CSS
- Three.js / React Three Fiber
- HeroUI
- Vitest
- Remotion

## Reproducible Testing Instructions

These are the README spin-up instructions required for judging.

### 1. Clone the repository

```bash
git clone https://github.com/hubeiqiao/joe-speaking-gemini-live-challenge.git
cd joe-speaking-gemini-live-challenge
```

### 2. Create local environment config

Copy the template:

```bash
cp .env.example .env.local
```

Fill in the required values in `.env.local`:

```bash
NEXT_PUBLIC_APP_URL=http://localhost:3100
GEMINI_API_KEY=your-gemini-api-key
GOOGLE_CLOUD_PROJECT=your-gcp-project-id
GOOGLE_CLOUD_REGION=northamerica-northeast1
CLOUD_RUN_SERVICE=joe-speaking-gemini-live-challenge
GOOGLE_CLOUD_ARTIFACT_REGISTRY=joe-speaking-challenge
DEMO_MODE=true
```

### 3. Install dependencies

```bash
npm install
```

### 4. Run the app locally

```bash
npm run dev -- --port 3100
```

Open:

- [http://localhost:3100](http://localhost:3100)
- [http://localhost:3100/app](http://localhost:3100/app)

### 5. Run the automated test suite

```bash
npm test
```

### 6. Validate a production build locally

```bash
npm run build
```

### 7. Recommended manual verification

After the app is running:

1. Open `/app`
2. Confirm **Text mode** is visible immediately
3. Start the live exam
4. Send one typed response or use the microphone
5. Generate a review
6. Open **Library**
7. Click the session card
8. Confirm **Review** opens for the selected session

## Local Development Notes

- Default local port is `3100` to avoid conflicts with the existing Joe Speaking product.
- Supabase is optional in this challenge build.
- The public demo path is designed to work without production Joe Speaking infrastructure.

## Google Cloud Deployment

Read these in order:

1. [docs/gcp/SETUP.md](./docs/gcp/SETUP.md)
2. [docs/gcp/SECRETS.md](./docs/gcp/SECRETS.md)
3. [docs/gcp/DEPLOY.md](./docs/gcp/DEPLOY.md)

## Submission Assets

- Devpost project outline: [docs/submission/DEVPOST.md](./docs/submission/DEVPOST.md)
- Submission checklist: [docs/submission/CHECKLIST.md](./docs/submission/CHECKLIST.md)
- Video storyboard: [docs/video/STORYBOARD.md](./docs/video/STORYBOARD.md)
- Video script: [docs/video/SCRIPT.md](./docs/video/SCRIPT.md)
- Architecture notes: [docs/architecture/diagram.md](./docs/architecture/diagram.md)

## Security and Publication Notes

- Security audit: [docs/security/AUDIT.md](./docs/security/AUDIT.md)
- Public Gemini-cost endpoints are rate-limited before publication.
- `.env.local` is intentionally ignored and must never be committed.

## Notes for Judges

This project was built specifically for the Gemini Live Agent Challenge as a new challenge submission, while reusing the Joe Speaking interface and learning flow as the product foundation.

If you want to see the broader Joe Speaking product context, visit **[JoeSpeaking.com](https://joespeaking.com)**. This repository and the Cloud Run demo are the challenge-specific build, not the full production app.

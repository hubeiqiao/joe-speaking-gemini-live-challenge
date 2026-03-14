# Migration Notes From the Current Vercel Product

This challenge repo intentionally does not preserve the current Vercel-first operational setup.

## Replaced Assumptions

- `NEXT_PUBLIC_VERCEL_ENV`
  - replaced by explicit challenge env values and Cloud Run deployment metadata
- Vercel preview URL routing
  - removed from the auth redirect strategy
- `@vercel/analytics`
  - excluded from the challenge repo
- PostHog shared analytics
  - excluded from the challenge repo
- Vercel-specific auth callback fallbacks
  - replaced by explicit `NEXT_PUBLIC_APP_URL` + local-origin handling

## What Must Not Be Carried Over

- onboarding routing
- welcome bonus / credits
- Stripe and billing
- BYOK
- production PostHog
- Vercel Analytics
- environment multiplexing against one shared production database

## New Deployment Model

- one separate repo
- one Cloud Run service
- one Secret Manager set
- one public submission URL

# Security Audit

Date: 2026-03-14

## Scope

Pre-publication audit for the standalone `joe-speaking-gemini-live-challenge` repository before creating a public GitHub repository.

## Checks Performed

- Verified ignored local-secret files are not tracked:
  - `.env.local`
  - `.next`
  - `node_modules`
- Searched the repository for common secret patterns and hardcoded credentials.
- Reviewed the public Gemini API routes:
  - `/api/live/token`
  - `/api/live/review`
  - `/api/demo/state`
  - `/api/demo/provision`
- Added request throttling to public Gemini-cost endpoints.
- Upgraded vulnerable production dependencies and reran the production-only audit.
- Rebuilt the app after dependency updates.

## Findings and Remediation

### Fixed

1. Public Gemini endpoints had no abuse control.
   - Added server-side IP-based rate limiting for:
     - `/api/live/token`
     - `/api/live/review`

2. Production dependency audit reported high-severity vulnerabilities.
   - Upgraded `next` to `15.5.10`
   - Upgraded `eslint-config-next` to `15.5.10`
   - Added a `glob` override to remove the vulnerable production path

3. Next.js upgrade introduced build compatibility issues.
   - Updated the `sign-in` page to the Next 15 `searchParams` signature
   - Marked `/app` as dynamic to avoid static prerender failures for the interactive live UI

## Verification Evidence

- `npm audit --omit=dev --json`
  - Result: `0` production vulnerabilities
- `npm test`
  - Result: full suite passed
- `npm run build`
  - Result: passed

## Residual Risks

- Rate limiting is in-memory and instance-local. It is appropriate for a demo deployment, but not a full production abuse-prevention strategy.
- Public demo mode remains intentionally lightweight and is not a substitute for a full authenticated production environment.
- `.env.local` still contains local runtime secrets and must remain untracked.

## Publication Decision

Safe to publish as a public code repository after confirming:

- `.env.local` is not staged
- the GitHub remote points to the intended new public repository

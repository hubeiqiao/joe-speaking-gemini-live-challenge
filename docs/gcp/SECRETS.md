# Secret Management

This repo uses a strict split:

- public values go in `NEXT_PUBLIC_*`
- server-only secrets go in Secret Manager

## Secret Manager Values

Store these in Google Secret Manager:

- `gemini-api-key`

Create them:

```bash
printf '%s' "$GEMINI_API_KEY" | gcloud secrets create gemini-api-key --data-file=-
```

If the secret already exists, add a new version instead:

```bash
printf '%s' "$GEMINI_API_KEY" | gcloud secrets versions add gemini-api-key --data-file=-
```

## Plain Environment Variables

These can remain standard env vars:

- `NEXT_PUBLIC_APP_URL`
- `GOOGLE_CLOUD_PROJECT`
- `GOOGLE_CLOUD_REGION`
- `CLOUD_RUN_SERVICE`
- `DEMO_MODE`

## Runtime Secret Access

The Cloud Run runtime service account needs:

- `roles/secretmanager.secretAccessor`

The service should not need editor or owner permissions.

## Local Development

For local development, keep secrets in `.env.local`.

Rules:

- never commit `.env.local`
- never paste production keys into the challenge repo
- rotate any challenge secret that is accidentally exposed in logs or screenshots

Console UI:

- open `Security` -> `Secret Manager`
- click `Create Secret`
- name: `gemini-api-key`
- paste the Gemini API key as the first secret version

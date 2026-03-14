# Cloud Run Deployment

This deploy flow assumes:

- GCP project already exists
- required APIs are enabled
- Gemini API key is in Secret Manager

## 1. Set Local Variables

```bash
export GOOGLE_CLOUD_PROJECT=YOUR_PROJECT_ID
export GOOGLE_CLOUD_REGION=northamerica-northeast1
export CLOUD_RUN_SERVICE=joe-speaking-gemini-live-challenge
```

## 2. Deploy from Source

From the repo root:

```bash
gcloud run deploy "$CLOUD_RUN_SERVICE" \
  --source . \
  --project "$GOOGLE_CLOUD_PROJECT" \
  --region "$GOOGLE_CLOUD_REGION" \
  --allow-unauthenticated \
  --service-account "joe-speaking-challenge-runtime@${GOOGLE_CLOUD_PROJECT}.iam.gserviceaccount.com" \
  --set-env-vars "NEXT_PUBLIC_APP_URL=https://${CLOUD_RUN_SERVICE}-REPLACE_WITH_HASH-${GOOGLE_CLOUD_REGION}.a.run.app,GOOGLE_CLOUD_PROJECT=${GOOGLE_CLOUD_PROJECT},GOOGLE_CLOUD_REGION=${GOOGLE_CLOUD_REGION},CLOUD_RUN_SERVICE=${CLOUD_RUN_SERVICE},DEMO_MODE=true" \
  --set-secrets "GEMINI_API_KEY=gemini-api-key:latest"
```

After the first deployment, replace the temporary `NEXT_PUBLIC_APP_URL` with the actual Cloud Run service URL and redeploy.

## 3. Get the Cloud Run URL

```bash
gcloud run services describe "$CLOUD_RUN_SERVICE" \
  --project "$GOOGLE_CLOUD_PROJECT" \
  --region "$GOOGLE_CLOUD_REGION" \
  --format='value(status.url)'
```

Use that URL in:

- `NEXT_PUBLIC_APP_URL`
- submission materials

## 4. Post-Deploy Checks

Verify:

```bash
curl -sS https://YOUR_CLOUD_RUN_URL/api/health
```

Expected shape:

```json
{"status":"ok","timestamp":"2026-03-12T00:00:00.000Z"}
```

Then verify manually:

1. homepage loads
2. `/app` loads and starts the public judge demo
3. `Gemini API key missing` does not appear once secrets are set
4. no Vercel references appear in the deployed app or README

## 5. Update Deployments

Redeploy after code changes:

```bash
gcloud run deploy "$CLOUD_RUN_SERVICE" \
  --source . \
  --project "$GOOGLE_CLOUD_PROJECT" \
  --region "$GOOGLE_CLOUD_REGION" \
  --allow-unauthenticated
```

## 6. Rollback

List revisions:

```bash
gcloud run revisions list \
  --service "$CLOUD_RUN_SERVICE" \
  --project "$GOOGLE_CLOUD_PROJECT" \
  --region "$GOOGLE_CLOUD_REGION"
```

Send traffic back to a known good revision:

```bash
gcloud run services update-traffic "$CLOUD_RUN_SERVICE" \
  --project "$GOOGLE_CLOUD_PROJECT" \
  --region "$GOOGLE_CLOUD_REGION" \
  --to-revisions REVISION_NAME=100
```

Console UI:

- open `Cloud Run`
- click the service name
- copy the service URL from the header
- use `Revisions` to inspect and roll back traffic if needed

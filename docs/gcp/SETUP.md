# Google Cloud Setup

This document is intentionally local-operator friendly. Follow it from a clean machine and do not assume anything from the production Joe Speaking setup.

## 1. Create a New GCP Project

1. Open the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project dedicated to the challenge build.
3. Enable billing on that project.
4. Pick a project ID and keep it stable. Example:

```text
joe-speaking-gemini-live-challenge
```

Console UI:

- top nav project picker -> `New Project`
- name: `joe-speaking-gemini-live-challenge`
- choose billing account when prompted
- after creation, confirm the selected project in the top nav matches the new project

## 2. Install and Authenticate `gcloud`

Install the Google Cloud CLI, then authenticate:

```bash
gcloud auth login
gcloud auth application-default login
gcloud config set project YOUR_PROJECT_ID
```

Verify:

```bash
gcloud config get-value project
gcloud auth list
```

## 3. Enable Required APIs

Enable these APIs:

```bash
gcloud services enable \
  run.googleapis.com \
  cloudbuild.googleapis.com \
  artifactregistry.googleapis.com \
  secretmanager.googleapis.com
```

Why each one matters:

- `run.googleapis.com`: Cloud Run hosting
- `cloudbuild.googleapis.com`: source-to-image build path
- `artifactregistry.googleapis.com`: container image storage
- `secretmanager.googleapis.com`: runtime secret storage

Console UI:

- open `APIs & Services` -> `Library`
- search and enable:
  - `Cloud Run Admin API`
  - `Cloud Build API`
  - `Artifact Registry API`
  - `Secret Manager API`

## 4. Choose Region and Service Names

Recommended defaults for the challenge build:

```text
Region: northamerica-northeast1
Service: joe-speaking-gemini-live-challenge
Artifact Registry repo: joe-speaking-challenge
```

## 5. Set Local Shell Variables

Set these locally:

```bash
export GOOGLE_CLOUD_PROJECT=YOUR_PROJECT_ID
export GOOGLE_CLOUD_REGION=northamerica-northeast1
export CLOUD_RUN_SERVICE=joe-speaking-gemini-live-challenge
export GOOGLE_CLOUD_ARTIFACT_REGISTRY=joe-speaking-challenge
```

## 6. Create Artifact Registry Repository

```bash
gcloud artifacts repositories create "$GOOGLE_CLOUD_ARTIFACT_REGISTRY" \
  --repository-format=docker \
  --location="$GOOGLE_CLOUD_REGION" \
  --description="Containers for the Joe Speaking Gemini Live challenge app"
```

Verify:

```bash
gcloud artifacts repositories list --location="$GOOGLE_CLOUD_REGION"
```

Console UI:

- open `Artifact Registry`
- click `Create Repository`
- format: `Docker`
- name: `joe-speaking-challenge`
- region: `northamerica-northeast1`

## 7. Create a Runtime Service Account

Create a dedicated runtime identity:

```bash
gcloud iam service-accounts create joe-speaking-challenge-runtime \
  --display-name="Joe Speaking Challenge Runtime"
```

Grant only the secret accessor role for runtime secret reads:

```bash
gcloud projects add-iam-policy-binding "$GOOGLE_CLOUD_PROJECT" \
  --member="serviceAccount:joe-speaking-challenge-runtime@${GOOGLE_CLOUD_PROJECT}.iam.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

Console UI:

- open `IAM & Admin` -> `Service Accounts`
- click `Create Service Account`
- name: `joe-speaking-challenge-runtime`
- after creation, open the account and grant `Secret Manager Secret Accessor`

## 8. Local Environment File

Create `.env.local` from `.env.example` and fill:

- `NEXT_PUBLIC_APP_URL`
- `GEMINI_API_KEY`
- `GOOGLE_CLOUD_PROJECT`
- `GOOGLE_CLOUD_REGION`
- `CLOUD_RUN_SERVICE`
- `GOOGLE_CLOUD_ARTIFACT_REGISTRY`

Use `http://localhost:3100` locally unless you intentionally choose a different port.

## 9. First Verification

Before writing deploy commands, verify:

```bash
npm install
npx vitest --run
```

If the app starts locally and the unit tests pass, the repo is ready for secret wiring and Cloud Run deployment. Open `/app` to use the public judge demo.

# Architecture Diagram

```mermaid
flowchart LR
  A["Judge Browser"] --> B["Cloud Run Next.js App"]
  B --> C["Gemini Live / Google GenAI SDK"]
  B --> E["Google Secret Manager"]
  A --> F["Local Judge State"]

  subgraph "Cloud Run App"
    B1["Landing + Judge Flow"]
    B2["Live Token Endpoint"]
    B3["Review Endpoint"]
    B4["Demo Provision Endpoint"]
  end

  subgraph "Judge Browser"
    A1["Landing / Judge Entry"]
    A2["Gemini Live Panel (audio + mic + transcript)"]
    A3["Library / Collection / Review Shell"]
  end

  B --> B1
  B --> B2
  B --> B3
  B --> B4
```

## Notes

- The challenge repo is intentionally isolated from production Joe Speaking.
- Gemini is the only AI provider exposed in this build.
- Cloud Run is the canonical host.
- The public judge demo uses local challenge state instead of a shared external data service.
- The browser panel requests an ephemeral live token from Cloud Run, then connects directly to Gemini Live for the active session.

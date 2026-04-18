# Gapsi Task Manager — Claude Context

## Project Overview

Full-stack task manager (To-Do List) built as a Gapsi technical exam. Three services communicate in a chain: a React SPA talks to a Node.js gateway, which proxies to a Go service that reads/writes Firestore.

## Architecture

```
React (Firebase Hosting)
  → Node.js API Gateway (Cloud Run, port 3001)
    → Go Task Service (Cloud Run, port 8080)
      → Google Firestore (project: jsonchrist)
```

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18, Vite, TypeScript, MUI, react-window |
| Gateway | Node.js 20, Express, axios, cors, dotenv |
| Task service | Go 1.25, net/http ServeMux, Firestore SDK |
| Database | Google Firestore (Native mode, nam5 region) |
| Hosting | Firebase Hosting (frontend), Cloud Run (backend services) |

## Deployed URLs

| Service | URL |
|---|---|
| Frontend | https://jsonchrist.web.app |
| Node Gateway | https://node-gateway-715767502505.us-central1.run.app |
| Go Task Service | https://go-task-service-715767502505.us-central1.run.app |

## Local Dev Setup

Start services in this order (each depends on the one below it):

```bash
# 1. Go Task Service — http://localhost:8080
cd go-task-service && cp .env.example .env   # set GCP_PROJECT_ID=jsonchrist
gcloud auth application-default login        # required for Firestore ADC
go run .

# 2. Node.js Gateway — http://localhost:3001
cd node-gateway && cp .env.example .env      # GO_SERVICE_URL=http://localhost:8080
npm install && npm run dev

# 3. React Frontend — http://localhost:5173
cd frontend && cp .env.example .env          # VITE_API_URL=http://localhost:3001
npm install && npm run dev
```

## Technical Decisions

### net/http over a router framework
The Go service uses the standard library `net/http` ServeMux instead of chi, gorilla/mux, or similar. The API surface is small (4 endpoints + health), so an external router adds dependency weight with no real benefit. Path parameter extraction is done manually with `strings.TrimPrefix`.

### Firestore database ID: "default" not "(default)"
The Firestore SDK constant `firestore.DefaultDatabaseID` resolves to `"(default)"` — the canonical Firestore database name. However, this project's database was created through the Firebase console, which names it `"default"` (no parentheses). Using the SDK constant causes a `"database does not exist"` gRPC error at runtime even though the database is visible in the GCP console. The fix is `firestore.NewClientWithDatabase(ctx, projectID, "default")` with the literal string. This is documented in `main.go` with a comment because it will confuse anyone who sees it.

### CORS only on the Node.js Gateway
The Go service has no CORS middleware. It is an internal service — only reachable from the Node gateway on Cloud Run, never directly from a browser. Adding CORS there would be dead configuration. CORS is configured on the Node gateway via the `ALLOWED_ORIGIN` env var (defaults to `http://localhost:5173` for local dev).

### godotenv graceful fallback
`godotenv.Load()` failure is logged and swallowed, not fatal. On Cloud Run, env vars are injected directly and no `.env` file exists — treating the missing file as an error would crash production. Locally, the file is present and gets loaded normally.

### MaxBytesReader on the Go service
All incoming request bodies are capped at 1 MB via `http.MaxBytesReader` in `ServeHTTP` before any handler runs. This prevents a malicious or buggy client from streaming an unbounded body and exhausting memory. Task payloads are tiny, so 1 MB is generous without being exploitable.

### Go 1.25 base image
The Dockerfile uses `golang:1.25-alpine` to match the local toolchain (Go 1.26.2 installed via Homebrew). Earlier versions (1.21, 1.24) were tried but updated to stay current. The `go.mod` `go` directive is set to `1.22` as a minimum compatibility floor, which is satisfied by any 1.25 image.

### Input validation length limits
Title is capped at 200 characters, description at 2000. These are enforced in the Go handler before the Firestore write. Without limits, a client could write arbitrarily large strings into Firestore documents, inflating storage costs and downstream response sizes.

### Error message isolation at the Node gateway
The Express error handler (`middleware/errorHandler.js`) forwards only `err.response?.data?.error` from the Go service — never the raw `err.message`. This prevents Node.js internals (e.g., `ECONNREFUSED connect to localhost:8080`) from leaking to the browser client when the Go service is unreachable.

# Gapsi Task Manager

Full-stack task manager built with React, Node.js, and Go, deployed on GCP.

## Architecture

```
React (Firebase Hosting)
  → Node.js API Gateway (Cloud Run)
    → Go Task Service (Cloud Run)
      → Google Firestore
```

---

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | v20+ |
| Go | v1.21+ |
| Git | latest |

---

## Local Development

### 1. Go Task Service

```bash
cd go-task-service
cp .env.example .env          # set GCP_PROJECT_ID
go mod tidy
go run .
# Runs on http://localhost:8080
```

> **Auth note:** For local development, authenticate with `gcloud auth application-default login` so the Go service can access Firestore.

### 2. Node.js API Gateway

```bash
cd node-gateway
cp .env.example .env          # GO_SERVICE_URL=http://localhost:8080
npm install
npm run dev
# Runs on http://localhost:3001
```

### 3. React Frontend

```bash
cd frontend
cp .env.example .env          # VITE_API_URL=http://localhost:3001
npm install
npm run dev
# Runs on http://localhost:5173
```

---

## GCP Deployment

### 1. Initial Setup

```bash
# Create project and enable APIs
gcloud projects create jsonchrist
gcloud config set project jsonchrist
gcloud services enable firestore.googleapis.com run.googleapis.com

# Create Firestore database (Native mode)
gcloud firestore databases create --location=nam5

# Create service account for Go service
gcloud iam service-accounts create go-task-service
gcloud projects add-iam-policy-binding jsonchrist \
  --member="serviceAccount:go-task-service@jsonchrist.iam.gserviceaccount.com" \
  --role="roles/datastore.user"
```

### 2. Deploy Go Task Service

```bash
cd go-task-service
gcloud run deploy go-task-service \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars GCP_PROJECT_ID=jsonchrist \
  --service-account go-task-service@jsonchrist.iam.gserviceaccount.com
```

Note the deployed URL (e.g., `https://go-task-service-xxxx-uc.a.run.app`).

### 3. Deploy Node.js Gateway

```bash
cd node-gateway
gcloud run deploy node-gateway \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars GO_SERVICE_URL=<go-task-service-url>
```

Note the deployed URL (e.g., `https://node-gateway-xxxx-uc.a.run.app`).

### 4. Deploy React Frontend

```bash
# Install Firebase CLI if needed
npm install -g firebase-tools
firebase login

cd frontend
echo "VITE_API_URL=<node-gateway-url>" > .env
npm run build
firebase init hosting   # select existing project, set dist/ as public dir
firebase deploy
```

---

## API Reference

See `docs/postman_collection.json` for the full Postman collection.

### Go Task Service (internal)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /tasks | List all tasks |
| POST | /tasks | Create a task |
| PATCH | /tasks/:id | Toggle completed |
| DELETE | /tasks/:id | Delete a task |

### Node.js Gateway (public)

Same operations under `/api/tasks`.

### Task object

```json
{
  "id": "uuid",
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "creation_date": "18-Apr-26",
  "creation_time": "14:30",
  "completed": false
}
```

---

## Project Structure

```
jsonchrist/
├── frontend/          # React 18 + Vite + MUI + react-window
├── node-gateway/      # Node.js 20 + Express API Gateway
├── go-task-service/   # Go 1.21 + Firestore Task Service
└── docs/
    └── postman_collection.json
```

# Frontend

React 18 single-page application for the Gapsi Task Manager. Communicates with the Node.js API Gateway.

## Tech Stack

| | |
|---|---|
| Framework | React 18 + TypeScript |
| Build tool | Vite |
| UI components | MUI (Material UI) |
| Virtual list | react-window |

## Local Development

```bash
cp .env.example .env   # set VITE_API_URL=http://localhost:3001
npm install
npm run dev
# Runs on http://localhost:5173
```

## Build

```bash
npm run build   # output in dist/
```

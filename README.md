# ECOMSIGHT AI - Platform Quick Start

E-Commerce Sales Intelligence & Prediction System with FastAPI backend and React Vite frontend.

## Quick Start (Windows)

Simply double-click:
- **`run.bat`**: One-click launcher that:
  - Validates Python and Node.js environments.
  - Automatically installs frontend packages if missing.
  - Launches FastAPI Backend on `http://localhost:8000` in its own window.
  - Launches Vite React Frontend on `http://localhost:5173` in its own window.
  - Automatically opens the web dashboard in your default browser.
  - Provides a control menu to open Swagger docs or shut down all servers cleanly.

## Utility Scripts

- **`stop.bat`**: Cleanly kills all running backend (`:8000`) and frontend (`:5173`) server processes.
- **`setup.bat`**: Installs or refreshes all backend Python requirements and frontend npm packages in one step.

## Manual Launch (Terminal)

### Backend
```bash
cd backend
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```
- API Health Check: `http://localhost:8000/api/health`
- Swagger Documentation: `http://localhost:8000/docs`

### Frontend
```bash
cd frontend
npm install
npm run dev
```
- Dashboard URL: `http://localhost:5173`

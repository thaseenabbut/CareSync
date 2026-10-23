# CareSync

AI-powered hospital operations intelligence platform.

CareSync helps hospital administrators understand operational bottlenecks and evaluate possible solutions using simulated hospital data and open-weight AI models.

> **Disclaimer:** This is an operational decision-support prototype using simulated data. It is not a clinical diagnosis or treatment system. AI-generated recommendations have not been clinically validated.

## Quick Start

### Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### AI (Ollama)

```bash
brew install ollama
ollama serve
ollama pull phi3:mini
```

## Architecture

- **Frontend:** React + TypeScript + Vite
- **Backend:** Python + FastAPI + Pydantic
- **AI:** Open-weight model via Ollama (local inference)
- **Data:** Clearly labelled simulated hospital data

## License

MIT

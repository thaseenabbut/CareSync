# CareSync 🏥

> **AI-Powered Hospital Operations Intelligence Platform**  
> An operational decision-support prototype designed to detect throughput bottlenecks, evaluate logistical solutions, and simulate hypothetical adjustments in real time using simulated hospital data and Google Gemini.

---

> [!IMPORTANT]
> **Safety & Regulatory Disclaimer:**  
> CareSync is an **administrative and operational decision-support prototype** using synthetic, simulated hospital data. It is **not** a clinical diagnosis, medical triage, or patient treatment system. AI-generated recommendations are logistical suggestions for hospital staff review and have not been clinically validated.

---

## 🌟 Key Features

1. **Deterministic Operational Metrics**  
   Pure mathematical calculations and benchmark rules tracking:
   - **Bed Occupancy & Availability:** Real-time capacity across Emergency, ICU, General Medicine, Surgical, and Pediatric units.
   - **Admitted Patient Boarding:** Emergency Department boarding alerts.
   - **Diagnostic Backlogs:** Queue wait times and equipment availability for CT Scans, MRIs, Ultrasounds, and X-Rays.
   - **Discharge Execution Delays:** Patient-level logs of medically cleared discharges held by pharmacy, transport, or paperwork delays.
   - **Staffing Workload Ratios:** Patient-to-nurse ratios compared against departmental safety targets.

2. **Rule-Based Bottleneck Detection**  
   Automatic identification of high- and critical-severity bottlenecks without hallucination, calculating exact observed values versus established thresholds.

3. **AI Operations Intelligence (Google Gemini)**  
   - Integrates Google's official `google-genai` SDK (`gemini-3.5-flash` / `gemini-3.8-flash`).
   - Generates executive operational summaries and root-cause analyses from verified findings.
   - Proposes concrete, non-clinical action steps tagged by **urgency** (*Immediate*, *Short-term*, *Next shift*) and **target role** (*Operations Director, Discharge Coordinator, Charge Nurse, Transport Lead*).
   - **Graceful Degradation:** If the API key is missing or quota is exhausted, deterministic metrics remain 100% operational with zero fabricated responses.

4. **Interactive Scenario Simulator**  
   Explore hypothetical operational interventions in real time:
   - Restore offline imaging equipment (e.g., 3rd CT scanner).
   - Add floating nurses to strained units.
   - Expedite pending discharges to a discharge lounge.
   - Transfer stable ICU patients to step-down beds.  
   *Calculates projected bottleneck resolution and before-and-after metric comparisons.*

5. **Resilient Dual-Mode Architecture**  
   Runs in full-stack mode with the FastAPI backend, or in standalone **Demo Mode** on static hosts (like Vercel).

---

## 🏗️ Architecture & Tech Stack

```
CareSync/
├── backend/
│   ├── ai/            # Google Gemini service wrapper (google-genai SDK)
│   ├── app/           # Centralized configuration (pydantic-settings)
│   ├── data/          # Synthetic hospital dataset
│   ├── schemas/       # Typed Pydantic models (hospital, insights, simulation)
│   ├── services/      # Deterministic bottleneck analyzer & scenario simulator
│   ├── tests/         # Automated pytest test suite
│   ├── main.py        # FastAPI application & REST routes
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── components/ # Dashboard tabs (Overview, Beds, Diagnostics, Staffing, AI, Simulator)
    │   ├── lib/        # Resilient API client & client-side simulation engine
    │   ├── types/      # TypeScript interfaces
    │   ├── App.tsx     # Application shell & state coordination
    │   └── App.css     # Medical-grade responsive dark theme
    ├── package.json
    ├── vite.config.ts
    └── vercel.json
```

- **Frontend:** React 19, TypeScript, Vite, Vanilla CSS design system.
- **Backend:** Python 3.14+, FastAPI, Pydantic v2, Pydantic-Settings, Uvicorn.
- **AI Engine:** Google Gemini via official `google-genai` SDK.

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- Python 3.11+ (Python 3.14 tested)
- Node.js 20+ & npm
- A Google Gemini API Key from [Google AI Studio](https://aistudio.google.com/)

---

### 2. Backend Setup

```bash
cd backend

# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
# Create a .env file in the backend/ directory:
cat <<EOF > .env
GEMINI_API_KEY=your_actual_gemini_api_key_here
GEMINI_MODEL=gemini-3.5-flash
EOF

# Start the FastAPI server
uvicorn main:app --reload --port 8000
```

- **Interactive API Documentation (Swagger):** [http://localhost:8000/docs](http://localhost:8000/docs)
- **Health Endpoint:** [http://localhost:8000/api/health](http://localhost:8000/api/health)

---

### 3. Frontend Setup

In a new terminal window:

```bash
cd frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```

- **CareSync Web Application:** [http://localhost:5173/](http://localhost:5173/)

---

## 🧪 Running Automated Tests

Run the backend integration test suite verifying health endpoints, deterministic metric calculations, live Gemini AI explainability, and graceful offline degradation:

```bash
cd backend
source venv/bin/activate
PYTHONPATH=. pytest -v tests/test_gemini_integration.py
```

---

## ☁️ Deployment Guide (Vercel)

When deploying the frontend to **Vercel**:

1. **Import the repository** into Vercel.
2. In the project setup, set **Root Directory** to:  
   `frontend`
3. Leave **Framework Preset** as `Vite` (*Build Command:* `npm run build`, *Output Directory:* `dist`).
4. **Connecting the Backend:**
   - If hosting your FastAPI backend on Render, Railway, or Fly.io, add the environment variable in Vercel:  
     `VITE_API_BASE_URL=https://your-backend-service.com/api`
   - Alternatively, use the in-app **⚙️ Settings** modal in the top navigation bar to connect to any backend URL on the fly.
   - If no backend is provided, CareSync automatically runs in **Demo Mode** with full interactivity and zero crashes.

---

## 🛡️ Security & Privacy

- `backend/.env` is strictly excluded via `.gitignore` and never committed.
- API keys are never exposed in frontend code, returned in network responses, or printed in logs.
- All patient identifiers (e.g. `SIM-PT-401`) and hospital statistics are completely synthetic.

---

## 📄 License

[MIT License](LICENSE)
"""CareSync Backend — FastAPI Application Entry Point.

Exposes deterministic hospital metrics and AI-driven operational bottleneck insights.
Keeps AI service invocation completely isolated from business and calculation logic.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from ai.gemini_service import generate_bottleneck_explanations
from schemas.hospital import HospitalOperationalSnapshot
from schemas.insights import ExplainRequest, ExplainResponse
from schemas.simulation import SimulationScenarioRequest, SimulationScenarioResult
from services.bottleneck_analyzer import get_operational_snapshot
from services.scenario_simulator import run_scenario_simulation

app = FastAPI(
    title=settings.api_title,
    description="AI-powered hospital operations intelligence platform",
    version=settings.api_version,
)

# CORS — allow frontend dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
async def health_check():
    """Health check endpoint reporting API and AI configuration readiness."""
    return {
        "status": "healthy",
        "service": settings.api_title,
        "version": settings.api_version,
        "ai": {
            "provider": "Google Gemini",
            "model": settings.gemini_model,
            "configured": settings.is_gemini_configured,
        },
    }


@app.get("/api/metrics", response_model=HospitalOperationalSnapshot)
async def get_hospital_metrics() -> HospitalOperationalSnapshot:
    """Returns deterministic hospital operational metrics and verified active bottlenecks.

    All metrics in this endpoint are computed purely with rule-based mathematical logic.
    """
    return get_operational_snapshot()


@app.post("/api/insights/explain", response_model=ExplainResponse)
async def explain_bottlenecks(request: ExplainRequest | None = None) -> ExplainResponse:
    """Explains verified hospital operational bottlenecks and suggests staff actions.

    The backend calculates verified findings deterministically before dispatching to Gemini.
    If Gemini is unavailable or rate-limited, returns model_unavailable status with verified
    bottlenecks intact, never fabricating fake AI responses.
    """
    # 1. Deterministically calculate current operational findings
    snapshot = get_operational_snapshot()
    active_bottlenecks = snapshot.active_bottlenecks

    # 2. Filter by requested bottleneck IDs if specified
    if request and request.bottleneck_ids:
        requested_set = set(request.bottleneck_ids)
        verified_subset = [b for b in active_bottlenecks if b.id in requested_set]
        if not verified_subset:
            raise HTTPException(
                status_code=404,
                detail=f"None of the requested bottleneck IDs {request.bottleneck_ids} match active verified bottlenecks.",
            )
        target_bottlenecks = verified_subset
    else:
        target_bottlenecks = active_bottlenecks

    # 3. Call isolated Gemini AI service
    focus = request.focus_area if request else None
    return generate_bottleneck_explanations(
        verified_bottlenecks=target_bottlenecks,
        focus_area=focus,
    )


@app.post("/api/simulation/simulate", response_model=SimulationScenarioResult)
async def simulate_scenario(scenario: SimulationScenarioRequest) -> SimulationScenarioResult:
    """Explores hypothetical operational changes and calculates deterministic impact.

    Evaluates how adjustments to staffing, equipment availability, or discharge
    throughput affect active bottlenecks and department capacity without modifying
    the baseline hospital operational state.
    """
    return run_scenario_simulation(scenario)


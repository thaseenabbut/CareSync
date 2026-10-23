"""CareSync Automated Tests for Metrics and Gemini AI Integration.

Verifies:
1. Health endpoint with AI configuration flags.
2. Deterministic operational calculations and bottleneck rule detection.
3. Live/graceful Gemini explanation generation without fake fallbacks.
4. Unconfigured key graceful degradation.
5. Error handling for invalid bottleneck queries.
"""

from unittest.mock import patch
import pytest
from fastapi.testclient import TestClient

from main import app
from services.bottleneck_analyzer import get_operational_snapshot

client = TestClient(app)


def test_health_check_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "CareSync API"
    assert "ai" in data
    assert data["ai"]["provider"] == "Google Gemini"
    assert data["ai"]["model"] == "gemini-3.5-flash"
    assert isinstance(data["ai"]["configured"], bool)
    # Ensure no API key or secret exists anywhere in the response
    raw_text = response.text.lower()
    assert "key" not in data["ai"]
    assert "secret" not in raw_text


def test_deterministic_metrics_endpoint():
    response = client.get("/api/metrics")
    assert response.status_code == 200
    data = response.json()

    assert data["facility_name"] == "Metro General Hospital (Simulated)"
    assert data["data_classification"] == "SIMULATED"
    assert data["total_capacity_beds"] == 279
    assert data["total_occupied_beds"] > 0
    assert data["overall_occupancy_rate_percent"] > 0.0

    # Verify departments
    departments = {d["department"]: d for d in data["departments"]}
    assert "Emergency Department" in departments
    assert "Intensive Care Unit" in departments
    assert "General Medicine" in departments

    # Verify deterministic bottlenecks detected
    bottlenecks = data["active_bottlenecks"]
    assert len(bottlenecks) >= 5
    ids = [b["id"] for b in bottlenecks]
    assert "BN-BED-INTENSIVE_CARE_UNIT" in ids
    assert "BN-ED-BOARDING" in ids
    assert "BN-DIAG-CT_SCAN" in ids


def test_gemini_explain_endpoint_live():
    # Test explaining all bottlenecks or a subset
    payload = {"bottleneck_ids": ["BN-BED-INTENSIVE_CARE_UNIT"]}
    response = client.post("/api/insights/explain", json=payload)
    assert response.status_code == 200
    data = response.json()

    # The status must be either 'success' or 'model_unavailable' (never 500)
    assert data["status"] in ("success", "model_unavailable")
    assert len(data["verified_bottlenecks_analyzed"]) == 1
    assert data["verified_bottlenecks_analyzed"][0]["id"] == "BN-BED-INTENSIVE_CARE_UNIT"

    if data["status"] == "success":
        assert len(data["explanations"]) >= 1
        explanation = data["explanations"][0]
        assert explanation["bottleneck_id"] == "BN-BED-INTENSIVE_CARE_UNIT"
        assert len(explanation["operational_context"]) > 10
        assert len(explanation["suggested_actions"]) >= 1
        action = explanation["suggested_actions"][0]
        assert action["urgency"] in ("immediate", "short_term", "next_shift")
        assert len(action["action"]) > 5
        assert len(action["target_role"]) > 0


def test_gemini_graceful_degradation_when_unconfigured():
    # Simulate missing API key
    with patch("app.config.settings.gemini_api_key", None), patch("app.config.settings.ai_api_key", None):
        response = client.post("/api/insights/explain", json={})
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "model_unavailable"
        assert len(data["verified_bottlenecks_analyzed"]) > 0
        assert "not configured" in data["error_message"].lower()
        # Verify no hardcoded fake AI answers were returned
        assert len(data["explanations"]) == 0


def test_unknown_bottleneck_id_returns_404():
    response = client.post(
        "/api/insights/explain",
        json={"bottleneck_ids": ["BN-NON-EXISTENT-ID-999"]},
    )
    assert response.status_code == 404

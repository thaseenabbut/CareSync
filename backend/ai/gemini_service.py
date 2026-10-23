"""CareSync Gemini AI Service.

Integrates with Google's official google-genai SDK to explain verified operational
bottlenecks and propose logistical actions for hospital staff review.
Includes rigorous validation, strict system constraints, and graceful degradation.
Never fabricates AI responses upon model or connection failure.
"""

import json
import logging
from typing import Literal
from pydantic import BaseModel, Field

from app.config import settings
from schemas.hospital import BottleneckAlert
from schemas.insights import ActionSuggestion, BottleneckExplanation, ExplainResponse

logger = logging.getLogger("caresync.ai")

# Internal schema for Gemini structured JSON output
class _GenAction(BaseModel):
    action: str = Field(description="Specific operational step for hospital administrative or nursing staff.")
    target_role: str = Field(description="Operational role, e.g. 'Discharge Coordinator', 'Charge Nurse', 'Operations Director'.")
    urgency: Literal["immediate", "short_term", "next_shift"] = Field(description="Operational priority timeline.")
    expected_impact: str = Field(description="Anticipated operational relief or throughput gain.")


class _GenExplanation(BaseModel):
    bottleneck_id: str = Field(description="Matches the exact ID of the verified bottleneck analyzed.")
    operational_context: str = Field(description="Root cause operational context derived strictly from the verified metric.")
    systemic_risk: str = Field(description="Risk to hospital throughput or departmental flow if unresolved.")
    suggested_actions: list[_GenAction] = Field(default_factory=list)


class _GenPayload(BaseModel):
    executive_summary: str = Field(description="High-level operational summary of current systemic bottlenecks.")
    explanations: list[_GenExplanation] = Field(default_factory=list)


SYSTEM_INSTRUCTION = (
    "You are CareSync's Hospital Operations Intelligence Advisor.\n"
    "Your objective is to review deterministic hospital operational findings and explain logistical bottlenecks "
    "to hospital administrators, nursing leadership, and unit managers.\n\n"
    "CRITICAL CONSTRAINTS:\n"
    "1. Base your explanations and suggestions STRICTLY on the verified facts provided. Do NOT invent new metrics or unverified numbers.\n"
    "2. Propose ONLY non-clinical, administrative, and logistical workflow interventions (e.g., activating discharge lounges, "
    "prioritizing transport dispatch, expediting pharmacy reconciliation, floating nurses, or routing outpatient imaging).\n"
    "3. NEVER make clinical diagnosis, medical triage, drug dosage, or medical treatment decisions.\n"
    "4. Clearly distinguish calculated observations from suggested actions."
)


def _get_genai_client():
    """Lazily initializes the google-genai Client using the configured API key."""
    if not settings.is_gemini_configured:
        return None
    try:
        from google import genai
        return genai.Client(api_key=settings.effective_gemini_api_key)
    except Exception as e:
        logger.warning(f"Failed to initialize google-genai Client: {e}")
        return None


def generate_bottleneck_explanations(
    verified_bottlenecks: list[BottleneckAlert],
    focus_area: str | None = None,
) -> ExplainResponse:
    """Explains verified hospital bottlenecks using the Gemini model.

    If the model API key is missing or the provider returns an error,
    it returns a structured 'model_unavailable' status alongside the
    verified deterministic findings without fabricating fallback text.
    """
    # 1. Check if there are any verified findings to explain
    if not verified_bottlenecks:
        return ExplainResponse(
            status="success",
            model_name=settings.gemini_model,
            verified_bottlenecks_analyzed=[],
            explanations=[],
            executive_summary="All hospital operational metrics are currently within normal baseline thresholds.",
        )

    # 2. Check client configuration
    client = _get_genai_client()
    if not client:
        return ExplainResponse(
            status="model_unavailable",
            model_name=None,
            verified_bottlenecks_analyzed=verified_bottlenecks,
            explanations=[],
            executive_summary=None,
            error_message="Gemini API is not configured. Set the GEMINI_API_KEY environment variable in backend/.env.",
        )

    # 3. Format deterministic verified findings for the prompt
    findings_prompt_lines = [
        "Verified Operational Findings (Simulated Hospital Data):",
    ]
    if focus_area:
        findings_prompt_lines.append(f"Operational Focus Area: {focus_area}\n")

    for b in verified_bottlenecks:
        findings_prompt_lines.append(
            f"- Bottleneck ID: {b.id}\n"
            f"  Department: {b.department_or_unit}\n"
            f"  Severity: {b.severity}\n"
            f"  Metric: {b.metric_name}\n"
            f"  Observed Value: {b.observed_value} (Threshold: {b.benchmark_threshold})\n"
            f"  Description: {b.description}\n"
        )

    prompt = "\n".join(findings_prompt_lines)

    # 4. Invoke Gemini with structured output validation
    try:
        from google.genai import types

        config = types.GenerateContentConfig(
            system_instruction=SYSTEM_INSTRUCTION,
            response_mime_type="application/json",
            response_schema=_GenPayload,
            temperature=0.2,
        )

        response = client.models.generate_content(
            model=settings.gemini_model,
            contents=prompt,
            config=config,
        )

        if not response.text:
            return ExplainResponse(
                status="model_unavailable",
                model_name=settings.gemini_model,
                verified_bottlenecks_analyzed=verified_bottlenecks,
                explanations=[],
                error_message="Gemini model returned an empty response.",
            )

        # Parse structured payload into validated domain models
        parsed_data = json.loads(response.text)
        payload = _GenPayload.model_validate(parsed_data)

        domain_explanations: list[BottleneckExplanation] = []
        for item in payload.explanations:
            actions = [
                ActionSuggestion(
                    action=act.action,
                    target_role=act.target_role,
                    urgency=act.urgency,
                    expected_impact=act.expected_impact,
                )
                for act in item.suggested_actions
            ]
            domain_explanations.append(
                BottleneckExplanation(
                    bottleneck_id=item.bottleneck_id,
                    operational_context=item.operational_context,
                    systemic_risk=item.systemic_risk,
                    suggested_actions=actions,
                )
            )

        return ExplainResponse(
            status="success",
            model_name=settings.gemini_model,
            verified_bottlenecks_analyzed=verified_bottlenecks,
            explanations=domain_explanations,
            executive_summary=payload.executive_summary,
        )

    except Exception as exc:
        err_msg = str(exc)
        # Sanitize any accidental sensitive leaks in provider exception strings
        sanitized_msg = err_msg.replace(str(settings.effective_gemini_api_key or ""), "[REDACTED_KEY]")
        logger.error(f"Gemini API invocation error: {sanitized_msg}")

        return ExplainResponse(
            status="model_unavailable",
            model_name=settings.gemini_model,
            verified_bottlenecks_analyzed=verified_bottlenecks,
            explanations=[],
            executive_summary=None,
            error_message=f"Gemini operational advisor unavailable: {sanitized_msg[:180]}",
        )

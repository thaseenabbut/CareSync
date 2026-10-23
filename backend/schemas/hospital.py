"""CareSync Hospital Operations Pydantic Schemas.

Defines typed models for simulated hospital operations data,
deterministic metrics, and detected operational bottlenecks.
"""

from datetime import datetime, timezone
from enum import Enum
from typing import Literal
from pydantic import BaseModel, Field


class DepartmentName(str, Enum):
    EMERGENCY = "Emergency Department"
    ICU = "Intensive Care Unit"
    GENERAL_MED = "General Medicine"
    SURGICAL = "Surgical Ward"
    PEDIATRICS = "Pediatrics"


class ModalityName(str, Enum):
    CT = "CT Scan"
    MRI = "MRI"
    ULTRASOUND = "Ultrasound"
    XRAY = "X-Ray"


class DepartmentMetrics(BaseModel):
    department: DepartmentName
    total_beds: int = Field(gt=0)
    occupied_beds: int = Field(ge=0)
    pending_discharge_beds: int = Field(default=0, ge=0)
    occupancy_rate_percent: float = Field(ge=0.0, le=100.0)
    status: Literal["normal", "warning", "critical"]


class DiagnosticBacklog(BaseModel):
    modality: ModalityName
    pending_scans: int = Field(ge=0)
    average_wait_minutes: float = Field(ge=0.0)
    in_service_machines: int = Field(ge=0)
    total_machines: int = Field(ge=1)
    status: Literal["normal", "elevated", "critical"]


class PendingDischargeDetail(BaseModel):
    patient_identifier: str = Field(description="De-identified simulated ID, e.g. SIM-PT-104")
    ward: DepartmentName
    cleared_for_hours: float = Field(ge=0.0)
    hold_reason: Literal["Pharmacy Medication Reconciliation", "Transport Arrangement", "SNF/Rehab Bed Awaiting", "Paperwork Processing"]


class StaffingIndicator(BaseModel):
    department: DepartmentName
    active_nurses: int = Field(ge=0)
    target_nurses: int = Field(ge=1)
    patient_to_nurse_ratio: float = Field(ge=0.0)
    target_ratio: float = Field(ge=0.0)
    status: Literal["adequate", "strained", "critical_shortage"]


class BottleneckAlert(BaseModel):
    """A deterministic, verified operational bottleneck identified by backend rules."""
    id: str
    department_or_unit: str
    severity: Literal["low", "medium", "high", "critical"]
    metric_name: str
    observed_value: str
    benchmark_threshold: str
    description: str
    detected_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class HospitalOperationalSnapshot(BaseModel):
    """Aggregate snapshot containing verified deterministic hospital operational state."""
    facility_name: str = "Metro General Hospital (Simulated)"
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    data_classification: Literal["SIMULATED"] = "SIMULATED"
    
    # Core operational figures
    total_capacity_beds: int
    total_occupied_beds: int
    overall_occupancy_rate_percent: float
    total_pending_discharges: int
    emergency_boarded_patients: int
    
    # Detailed departmental metrics
    departments: list[DepartmentMetrics]
    diagnostic_backlogs: list[DiagnosticBacklog]
    pending_discharges: list[PendingDischargeDetail]
    staffing_indicators: list[StaffingIndicator]
    
    # Rule-detected bottlenecks
    active_bottlenecks: list[BottleneckAlert]

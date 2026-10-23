"""CareSync Scenario Simulation Schemas.

Models for exploring hypothetical operational adjustments
(e.g., staffing adjustments, machine restoration, discharge acceleration).
"""

from pydantic import BaseModel, Field
from schemas.hospital import BottleneckAlert, DepartmentMetrics, DiagnosticBacklog, StaffingIndicator


class SimulationScenarioRequest(BaseModel):
    # Staffing adjustments
    additional_general_med_nurses: int = Field(default=0, ge=0, le=15, description="Add floating nurses to General Medicine")
    additional_ed_nurses: int = Field(default=0, ge=0, le=10, description="Add nurses to Emergency Department")
    
    # Capacity & Throughput adjustments
    restore_ct_scanner: bool = Field(default=False, description="Bring offline 3rd CT scanner back online")
    expedited_discharges_count: int = Field(default=0, ge=0, le=10, description="Expedite pending discharges via discharge lounge")
    stepdown_transfers_count: int = Field(default=0, ge=0, le=5, description="Transfer stable ICU patients to telemetry/step-down")


class MetricComparison(BaseModel):
    metric_name: str
    unit: str
    baseline_value: float | int | str
    simulated_value: float | int | str
    change_direction: str  # "improved", "unchanged", "strained"
    change_label: str


class SimulationScenarioResult(BaseModel):
    scenario_description: str
    baseline_bottleneck_count: int
    simulated_bottleneck_count: int
    resolved_bottleneck_ids: list[str]
    remaining_bottlenecks: list[BottleneckAlert]
    key_metric_comparisons: list[MetricComparison]
    departments: list[DepartmentMetrics]
    diagnostics: list[DiagnosticBacklog]
    staffing: list[StaffingIndicator]

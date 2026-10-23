/**
 * CareSync TypeScript Definitions
 * Strictly typed interfaces matching backend Pydantic models.
 */

export type DepartmentName =
  | 'Emergency Department'
  | 'Intensive Care Unit'
  | 'General Medicine'
  | 'Surgical Ward'
  | 'Pediatrics';

export type ModalityName = 'CT Scan' | 'MRI' | 'Ultrasound' | 'X-Ray';

export type BottleneckSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface DepartmentMetrics {
  department: DepartmentName;
  total_beds: intOrNumber;
  occupied_beds: number;
  pending_discharge_beds: number;
  occupancy_rate_percent: number;
  status: 'normal' | 'warning' | 'critical';
}

type intOrNumber = number;

export interface DiagnosticBacklog {
  modality: ModalityName;
  pending_scans: number;
  average_wait_minutes: number;
  in_service_machines: number;
  total_machines: number;
  status: 'normal' | 'elevated' | 'critical';
}

export interface PendingDischargeDetail {
  patient_identifier: string;
  ward: DepartmentName;
  cleared_for_hours: number;
  hold_reason: string;
}

export interface StaffingIndicator {
  department: DepartmentName;
  active_nurses: number;
  target_nurses: number;
  patient_to_nurse_ratio: number;
  target_ratio: number;
  status: 'adequate' | 'strained' | 'critical_shortage';
}

export interface BottleneckAlert {
  id: string;
  department_or_unit: string;
  severity: BottleneckSeverity;
  metric_name: string;
  observed_value: string;
  benchmark_threshold: string;
  description: string;
  detected_at: string;
}

export interface HospitalOperationalSnapshot {
  facility_name: string;
  timestamp: string;
  data_classification: string;
  total_capacity_beds: number;
  total_occupied_beds: number;
  overall_occupancy_rate_percent: number;
  total_pending_discharges: number;
  emergency_boarded_patients: number;
  departments: DepartmentMetrics[];
  diagnostic_backlogs: DiagnosticBacklog[];
  pending_discharges: PendingDischargeDetail[];
  staffing_indicators: StaffingIndicator[];
  active_bottlenecks: BottleneckAlert[];
}

export interface ActionSuggestion {
  action: string;
  target_role: string;
  urgency: 'immediate' | 'short_term' | 'next_shift';
  expected_impact: string;
}

export interface BottleneckExplanation {
  bottleneck_id: string;
  operational_context: string;
  systemic_risk: string;
  suggested_actions: ActionSuggestion[];
}

export interface ExplainResponse {
  status: 'success' | 'model_unavailable' | 'error';
  model_name?: string | null;
  verified_bottlenecks_analyzed: BottleneckAlert[];
  explanations: BottleneckExplanation[];
  executive_summary?: string | null;
  error_message?: string | null;
  disclaimer: string;
}

export interface MetricComparison {
  metric_name: string;
  unit: string;
  baseline_value: string | number;
  simulated_value: string | number;
  change_direction: 'improved' | 'unchanged' | 'strained';
  change_label: string;
}

export interface SimulationScenarioResult {
  scenario_description: string;
  baseline_bottleneck_count: number;
  simulated_bottleneck_count: number;
  resolved_bottleneck_ids: string[];
  remaining_bottlenecks: BottleneckAlert[];
  key_metric_comparisons: MetricComparison[];
  departments: DepartmentMetrics[];
  diagnostics: DiagnosticBacklog[];
  staffing: StaffingIndicator[];
}

export interface HealthStatus {
  status: string;
  service: string;
  version: string;
  ai?: {
    provider: string;
    model: string;
    configured: boolean;
  };
}

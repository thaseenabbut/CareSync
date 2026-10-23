/**
 * CareSync Typed API Client
 * Centralized communication with the FastAPI backend.
 */

import {
  ExplainResponse,
  HealthStatus,
  HospitalOperationalSnapshot,
  SimulationScenarioResult,
} from '../types';

const API_BASE = '/api';

export async function fetchHealth(): Promise<HealthStatus> {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) throw new Error(`Health check failed: HTTP ${res.status}`);
  return res.json();
}

export async function fetchMetrics(): Promise<HospitalOperationalSnapshot> {
  const res = await fetch(`${API_BASE}/metrics`);
  if (!res.ok) throw new Error(`Failed to fetch hospital metrics: HTTP ${res.status}`);
  return res.json();
}

export async function fetchExplainInsights(
  bottleneckIds?: string[],
  focusArea?: string
): Promise<ExplainResponse> {
  const res = await fetch(`${API_BASE}/insights/explain`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      bottleneck_ids: bottleneckIds && bottleneckIds.length > 0 ? bottleneckIds : null,
      focus_area: focusArea || null,
    }),
  });
  if (!res.ok) throw new Error(`AI Insights request failed: HTTP ${res.status}`);
  return res.json();
}

export interface SimulationParams {
  additional_general_med_nurses: number;
  additional_ed_nurses: number;
  restore_ct_scanner: boolean;
  expedited_discharges_count: number;
  stepdown_transfers_count: number;
}

export async function runSimulation(
  params: SimulationParams
): Promise<SimulationScenarioResult> {
  const res = await fetch(`${API_BASE}/simulation/simulate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error(`Simulation request failed: HTTP ${res.status}`);
  return res.json();
}

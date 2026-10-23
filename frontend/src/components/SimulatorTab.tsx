import React, { useState } from 'react';
import { runSimulation, SimulationParams } from '../lib/api';
import { SimulationScenarioResult } from '../types';

export const SimulatorTab: React.FC = () => {
  const [params, setParams] = useState<SimulationParams>({
    restore_ct_scanner: true,
    additional_general_med_nurses: 4,
    additional_ed_nurses: 2,
    expedited_discharges_count: 4,
    stepdown_transfers_count: 2,
  });

  const [result, setResult] = useState<SimulationScenarioResult | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSimulate = async () => {
    setIsRunning(true);
    setError(null);
    try {
      const data = await runSimulation(params);
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Failed to execute scenario simulation.');
    } finally {
      setIsRunning(false);
    }
  };

  const handleReset = () => {
    setParams({
      restore_ct_scanner: false,
      additional_general_med_nurses: 0,
      additional_ed_nurses: 0,
      expedited_discharges_count: 0,
      stepdown_transfers_count: 0,
    });
    setResult(null);
  };

  return (
    <div className="tab-container">
      <div className="tab-header-block">
        <h2>Interactive Hospital Scenario Simulator</h2>
        <p>
          Model hypothetical operational adjustments and quantify the deterministic outcome on acute bottlenecks,
          nurse workloads, and bed availability before taking real-world administrative action.
        </p>
      </div>

      <div className="sim-layout">
        {/* Controls Column */}
        <div className="sim-controls-card">
          <div className="sim-controls-header">
            <h3>Hypothetical Adjustments</h3>
            <button className="reset-link-btn" onClick={handleReset}>
              Reset Baseline
            </button>
          </div>

          <div className="control-field">
            <label className="checkbox-control">
              <input
                type="checkbox"
                checked={params.restore_ct_scanner}
                onChange={(e) =>
                  setParams({ ...params, restore_ct_scanner: e.target.checked })
                }
              />
              <span className="checkbox-text">
                <strong>Restore 3rd CT Scanner</strong>
                <span className="control-help">
                  Returns calibrated scanner to service (increases capacity 50%).
                </span>
              </span>
            </label>
          </div>

          <div className="control-field">
            <div className="slider-label-row">
              <label>General Medicine Float RNs:</label>
              <span className="slider-val">+{params.additional_general_med_nurses} RNs</span>
            </div>
            <input
              type="range"
              min="0"
              max="8"
              value={params.additional_general_med_nurses}
              onChange={(e) =>
                setParams({
                  ...params,
                  additional_general_med_nurses: Number(e.target.value),
                })
              }
              className="ops-slider"
            />
            <span className="control-help">Current: 18 active (Ratio 6.2:1). Target: 4.0:1.</span>
          </div>

          <div className="control-field">
            <div className="slider-label-row">
              <label>Emergency Dept Float RNs:</label>
              <span className="slider-val">+{params.additional_ed_nurses} RNs</span>
            </div>
            <input
              type="range"
              min="0"
              max="6"
              value={params.additional_ed_nurses}
              onChange={(e) =>
                setParams({
                  ...params,
                  additional_ed_nurses: Number(e.target.value),
                })
              }
              className="ops-slider"
            />
            <span className="control-help">Current: 11 active (Ratio 3.8:1). Target: 3.0:1.</span>
          </div>

          <div className="control-field">
            <div className="slider-label-row">
              <label>Expedite Delayed Discharges:</label>
              <span className="slider-val">{params.expedited_discharges_count} patients</span>
            </div>
            <input
              type="range"
              min="0"
              max="6"
              value={params.expedited_discharges_count}
              onChange={(e) =>
                setParams({
                  ...params,
                  expedited_discharges_count: Number(e.target.value),
                })
              }
              className="ops-slider"
            />
            <span className="control-help">Move cleared patients to discharge lounge to free acute beds.</span>
          </div>

          <div className="control-field">
            <div className="slider-label-row">
              <label>ICU to Step-Down Transfers:</label>
              <span className="slider-val">{params.stepdown_transfers_count} patients</span>
            </div>
            <input
              type="range"
              min="0"
              max="4"
              value={params.stepdown_transfers_count}
              onChange={(e) =>
                setParams({
                  ...params,
                  stepdown_transfers_count: Number(e.target.value),
                })
              }
              className="ops-slider"
            />
            <span className="control-help">Transfer stable ICU patients to relieve 95.8% ICU occupancy.</span>
          </div>

          <button
            className="run-sim-btn"
            onClick={handleSimulate}
            disabled={isRunning}
          >
            {isRunning ? 'Calculating Mathematical Model...' : '▶ Run Scenario Simulation'}
          </button>

          {error && <div className="sim-error-alert">{error}</div>}
        </div>

        {/* Results Column */}
        <div className="sim-results-pane">
          {!result && (
            <div className="sim-placeholder">
              <div className="sim-icon">⚗️</div>
              <h4>Configure parameters and click &quot;Run Scenario Simulation&quot;</h4>
              <p>
                The simulator clones the hospital state, applies your hypothetical adjustments, and re-runs
                the deterministic metric algorithms to project bottleneck resolution and throughput changes.
              </p>
            </div>
          )}

          {result && (
            <div className="sim-results-card">
              <div className="sim-results-header">
                <div>
                  <span className="sim-tag">Simulation Completed</span>
                  <h4>{result.scenario_description}</h4>
                </div>
                <div className="sim-bottleneck-stat">
                  <div className="stat-pill-row">
                    <span className="pill-old">{result.baseline_bottleneck_count} Baseline</span>
                    <span className="pill-arrow">➔</span>
                    <span className="pill-new">{result.simulated_bottleneck_count} Projected</span>
                  </div>
                </div>
              </div>

              {/* Resolved Bottlenecks Highlight */}
              {result.resolved_bottleneck_ids.length > 0 ? (
                <div className="resolved-box">
                  <div className="resolved-title">
                    ✅ {result.resolved_bottleneck_ids.length} Operational Bottlenecks Projected to Resolve:
                  </div>
                  <div className="resolved-chips-wrap">
                    {result.resolved_bottleneck_ids.map((id) => (
                      <span key={id} className="resolved-chip">
                        ✓ {id}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="resolved-box box-neutral">
                  ℹ️ No active bottlenecks completely resolved with these parameters. Try increasing staffing or expediting more discharges.
                </div>
              )}

              {/* Metric Delta Comparison Table */}
              <div className="sim-table-wrap">
                <h5>Key Operational Indicator Impact</h5>
                <table className="ops-table sim-table">
                  <thead>
                    <tr>
                      <th>Metric</th>
                      <th>Baseline</th>
                      <th>Simulated</th>
                      <th>Projected Delta</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.key_metric_comparisons.map((c) => (
                      <tr key={c.metric_name}>
                        <td>
                          <strong>{c.metric_name}</strong>
                        </td>
                        <td>{c.baseline_value}</td>
                        <td>
                          <span className={c.change_direction === 'improved' ? 'text-success' : ''}>
                            {c.simulated_value}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`delta-tag ${
                              c.change_direction === 'improved' ? 'delta-improved' : 'delta-unchanged'
                            }`}
                          >
                            {c.change_label}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Simulated Department Occupancy Summary */}
              <div className="sim-depts-preview">
                <h5>Projected Unit Capacity</h5>
                <div className="sim-depts-grid">
                  {result.departments.map((d) => (
                    <div key={d.department} className="sim-dept-item">
                      <div className="sim-dept-top">
                        <span>{d.department}</span>
                        <strong className={d.status === 'critical' ? 'text-critical' : ''}>
                          {d.occupancy_rate_percent}%
                        </strong>
                      </div>
                      <div className="meter-track">
                        <div
                          className={`meter-bar ${
                            d.status === 'critical'
                              ? 'fill-critical'
                              : d.status === 'warning'
                              ? 'fill-warning'
                              : 'fill-normal'
                          }`}
                          style={{ width: `${Math.min(d.occupancy_rate_percent, 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

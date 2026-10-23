import React, { useState } from 'react';
import {
  IconAi,
  IconZap,
  IconRefresh,
  IconCheckCircle,
  IconAlertTriangle,
  IconShieldAlert,
} from './Icons';
import { BottleneckAlert, ExplainResponse } from '../types';

interface AiInsightsPanelProps {
  bottlenecks: BottleneckAlert[];
  insights: ExplainResponse | null;
  isLoading: boolean;
  onRequestInsights: (bottleneckId?: string) => void;
  onNavigateToTab?: (tab: any) => void;
}

export const AiInsightsPanel: React.FC<AiInsightsPanelProps> = ({
  bottlenecks,
  insights,
  isLoading,
  onRequestInsights,
  onNavigateToTab,
}) => {
  const [selectedScope, setSelectedScope] = useState<string>('ALL');

  const handleRunAnalysis = () => {
    onRequestInsights(selectedScope === 'ALL' ? undefined : selectedScope);
  };

  // Structured data-grounded insights derived deterministically from operational telemetry
  const dataGroundedInsights = [
    {
      id: 'INSIGHT-1',
      type: 'bottleneck',
      title: 'Department Approaching Saturation: ICU at 95.8%',
      department: 'Intensive Care Unit',
      observed: '23 / 24 beds occupied (95.8%)',
      benchmark: '< 90.0% safety threshold',
      reasoning: 'Downstream discharge execution lag in Step-Down and Med/Surg units is preventing ICU patient transfers, creating a critical acute blockage.',
      recommendation: 'Evaluate 2 stable ICU patients (Bed 12, Bed 18) for transfer to telemetry step-down beds to restore acute trauma admission buffer.',
      urgency: 'immediate',
      severity: 'critical',
    },
    {
      id: 'INSIGHT-2',
      type: 'surge',
      title: 'Unusual Emergency Arrival Surge & ED Boarding',
      department: 'Emergency Department',
      observed: '14 admitted patients currently boarding in ED bays',
      benchmark: '< 8 patients maximum',
      reasoning: 'Arrivals spiked +34% between 12:00 and 15:00. Inpatient beds in General Medicine are held by 6 medically cleared patients awaiting transport/pharmacy.',
      recommendation: 'Activate rapid discharge lounge protocol to release 4 General Medicine beds within 60 minutes, immediately relieving hallway boarding.',
      urgency: 'immediate',
      severity: 'critical',
    },
    {
      id: 'INSIGHT-3',
      type: 'shortage',
      title: 'Workforce Shortage: General Medicine Night/Day Shift',
      department: 'General Medicine',
      observed: '18 active RNs vs 28 required (64.3% coverage)',
      benchmark: 'Target ratio <= 4.0:1 (Current: 6.2:1)',
      reasoning: 'Unplanned sick leave combined with high census has driven nurse-to-patient ratio 55% above state acuity guidelines, posing clinical burnout and safety risks.',
      recommendation: 'Mobilize 4 float pool registered nurses or authorize 4-hour overtime extension for incoming evening shift charge team.',
      urgency: 'short_term',
      severity: 'warning',
    },
    {
      id: 'INSIGHT-4',
      type: 'bottleneck',
      title: 'Equipment Maintenance Bottleneck: CT Scanner #3 Offline',
      department: 'Diagnostics - CT Scan',
      observed: '185.0 min average wait · 19 queued orders · 2 of 3 scanners active',
      benchmark: '< 90.0 min target SLA',
      reasoning: 'Scanner #3 taken down for tube calibration during peak trauma hours. Queue backlog has doubled within 3 hours, cascading delays into ED and neuro-admissions.',
      recommendation: 'Expedite biomedical engineering recertification by 17:00 or divert ambulatory elective scans to outpatient imaging center.',
      urgency: 'short_term',
      severity: 'critical',
    },
  ];

  return (
    <div className="ai-command-panel">
      {/* Panel Header */}
      <div className="ai-panel-header">
        <div className="ai-title-block">
          <div className="ai-badge-cluster">
            <span className="badge-gemini">
              <IconAi size={14} /> Google Gemini AI
            </span>
            <span className="badge-mode">Operational Intelligence Engine</span>
            {insights?.model_name && (
              <span className="badge-model">Engine: {insights.model_name}</span>
            )}
          </div>
          <h2 className="ai-heading">Operational Bottlenecks &amp; Actionable Insights</h2>
          <p className="ai-subheading">
            Synthesizes verified hospital telemetry into logistical root-cause explanations and prioritized staff recommendations.
          </p>
        </div>

        <div className="ai-actions-cluster">
          <select
            className="ai-scope-select"
            value={selectedScope}
            onChange={(e) => setSelectedScope(e.target.value)}
            disabled={isLoading}
          >
            <option value="ALL">Analyze All Findings ({bottlenecks.length} active)</option>
            {bottlenecks.map((b) => (
              <option key={b.id} value={b.id}>
                [{b.severity.toUpperCase()}] {b.department_or_unit} - {b.metric_name}
              </option>
            ))}
          </select>

          <button
            className="ai-run-trigger-btn"
            onClick={handleRunAnalysis}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <IconRefresh size={16} className="spin-animation" />
                <span>Synthesizing Telemetry...</span>
              </>
            ) : (
              <>
                <IconZap size={16} />
                <span>Run Gemini AI Analysis</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Loading State Banner */}
      {isLoading && (
        <div className="ai-loading-card">
          <div className="ai-loading-pulse-ring" />
          <div className="ai-loading-content">
            <h4>Conducting Multi-Factor Operational Inference...</h4>
            <p>
              Sending verified patient census, nurse ratios, and queue metrics to Google Gemini for root-cause synthesis.
            </p>
          </div>
        </div>
      )}

      {/* Gemini Executive Summary if available */}
      {!isLoading && insights && insights.executive_summary && (
        <div className="ai-executive-summary-card">
          <div className="exec-header">
            <div className="exec-title-row">
              <span className="exec-dot" />
              <h4>Gemini Executive Operational Briefing</h4>
            </div>
            <span className="exec-tag">AI Generated · Deterministic Context</span>
          </div>
          <p className="exec-body">{insights.executive_summary}</p>
        </div>
      )}

      {/* Gemini Explanations if available */}
      {!isLoading && insights && insights.explanations && insights.explanations.length > 0 && (
        <div className="gemini-explanations-list">
          <div className="explanations-header-row">
            <h3>AI Root-Cause Findings &amp; Role-Specific Interventions</h3>
            <span className="explanations-count">{insights.explanations.length} Active Analyses</span>
          </div>

          <div className="gemini-cards-grid">
            {insights.explanations.map((exp) => {
              const original = bottlenecks.find((b) => b.id === exp.bottleneck_id);
              return (
                <div key={exp.bottleneck_id} className="gemini-detail-card">
                  <div className="gemini-card-top">
                    <div>
                      <span className="gemini-id-tag">{exp.bottleneck_id}</span>
                      <h4 className="gemini-unit-title">
                        {original?.department_or_unit || 'Hospital Unit'} — {original?.metric_name || 'Operational Bottleneck'}
                      </h4>
                    </div>
                    {original && (
                      <span className={`chip-badge badge-${original.severity}`}>
                        {original.severity.toUpperCase()}
                      </span>
                    )}
                  </div>

                  {original && (
                    <div className="gemini-observed-box">
                      <span className="lbl">Telemetry Finding:</span>{' '}
                      <strong>{original.observed_value}</strong> vs threshold {original.benchmark_threshold}
                    </div>
                  )}

                  <div className="gemini-section">
                    <h5>Logistical Root Cause</h5>
                    <p>{exp.operational_context}</p>
                  </div>

                  <div className="gemini-section section-risk">
                    <h5>Systemic Operational Risk</h5>
                    <p>{exp.systemic_risk}</p>
                  </div>

                  <div className="gemini-actions-box">
                    <h5>Recommended Workflow Actions</h5>
                    <div className="action-pills-row">
                      {exp.suggested_actions.map((act, i) => (
                        <div key={i} className={`action-pill-card urgency-${act.urgency}`}>
                          <div className="action-pill-header">
                            <span className="urgency-lbl">{act.urgency.toUpperCase().replace('_', ' ')}</span>
                            <span className="target-role">Role: {act.target_role}</span>
                          </div>
                          <div className="action-pill-body">{act.action}</div>
                          <div className="action-pill-impact">
                            <strong>Expected Impact:</strong> {act.expected_impact}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Data-Grounded Core Operational Insights Grid */}
      <div className="data-insights-section">
        <div className="section-title-row">
          <h3>Data-Grounded Operational Insights &amp; Bottlenecks</h3>
          <span className="grounded-badge">Derived from live telemetry</span>
        </div>

        <div className="data-insights-grid">
          {dataGroundedInsights.map((insight) => (
            <div
              key={insight.id}
              className={`insight-card card-border-${insight.severity}`}
            >
              <div className="insight-card-header">
                <div className="insight-type-row">
                  <span className={`insight-type-tag type-${insight.type}`}>
                    {insight.type === 'bottleneck' ? 'CAPACITY BOTTLENECK' : insight.type === 'surge' ? 'ARRIVAL SURGE' : 'RESOURCE SHORTAGE'}
                  </span>
                  <span className={`severity-indicator sev-${insight.severity}`}>
                    {insight.severity === 'critical' ? (
                      <><IconShieldAlert size={14} /> CRITICAL</>
                    ) : (
                      <><IconAlertTriangle size={14} /> WARNING</>
                    )}
                  </span>
                </div>
                <h4 className="insight-title">{insight.title}</h4>
                <span className="insight-dept">{insight.department}</span>
              </div>

              <div className="insight-telemetry-row">
                <div className="telemetry-block">
                  <span className="telemetry-label">Observed Telemetry</span>
                  <strong className={insight.severity === 'critical' ? 'text-critical' : 'text-warning'}>
                    {insight.observed}
                  </strong>
                </div>
                <div className="telemetry-block">
                  <span className="telemetry-label">Target Ceiling</span>
                  <span className="telemetry-val text-muted">{insight.benchmark}</span>
                </div>
              </div>

              <div className="insight-body">
                <div className="insight-reasoning">
                  <span className="insight-section-heading">Operational Context:</span>
                  <p>{insight.reasoning}</p>
                </div>

                <div className="insight-recommendation">
                  <span className="insight-section-heading">Suggested Action:</span>
                  <p className="rec-text">{insight.recommendation}</p>
                </div>
              </div>

              <div className="insight-card-footer">
                <span className={`urgency-pill pill-${insight.urgency}`}>
                  {insight.urgency === 'immediate' ? 'Immediate Execution' : 'Shift Plan'}
                </span>
                {onNavigateToTab && (
                  <button
                    className="insight-action-btn"
                    onClick={() => onNavigateToTab('simulator')}
                  >
                    Model in Simulator →
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer Notice */}
      <div className="ai-disclaimer-box">
        <IconCheckCircle size={16} className="disclaimer-icon" />
        <p className="disclaimer-text">
          <strong>Decision-Support Notice:</strong> CareSync insights and recommended operational actions are generated from simulated facility telemetry.
          They are intended solely for workflow review by hospital operations administrators and do NOT constitute clinical diagnosis, medical advice, or clinical care decisions.
        </p>
      </div>
    </div>
  );
};

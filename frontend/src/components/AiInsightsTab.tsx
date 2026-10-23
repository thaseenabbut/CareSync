import React, { useState } from 'react';
import { BottleneckAlert, ExplainResponse } from '../types';

interface AiInsightsTabProps {
  bottlenecks: BottleneckAlert[];
  insights: ExplainResponse | null;
  isLoading: boolean;
  onRequestInsights: (bottleneckId?: string) => void;
  selectedBottleneckId?: string;
  onSelectBottleneckId: (id?: string) => void;
}

export const AiInsightsTab: React.FC<AiInsightsTabProps> = ({
  bottlenecks,
  insights,
  isLoading,
  onRequestInsights,
  selectedBottleneckId,
  onSelectBottleneckId,
}) => {
  const [filterId, setFilterId] = useState<string>(selectedBottleneckId || 'ALL');

  const handleFilterChange = (val: string) => {
    setFilterId(val);
    onSelectBottleneckId(val === 'ALL' ? undefined : val);
  };

  const handleRunAnalysis = () => {
    onRequestInsights(filterId === 'ALL' ? undefined : filterId);
  };

  return (
    <div className="tab-container">
      {/* Header Banner */}
      <div className="ai-tab-header">
        <div className="ai-header-left">
          <div className="ai-badge-row">
            <span className="ai-pill-brand">Google Gemini AI</span>
            <span className="ai-pill-mode">Operations Intelligence</span>
            {insights?.model_name && (
              <span className="ai-pill-model">Model: {insights.model_name}</span>
            )}
          </div>
          <h2>Hospital Operational Insights &amp; Recommended Actions</h2>
          <p>
            Transforms verified deterministic bottleneck findings into logistical root-cause explanations
            and role-specific action items for hospital administrators and unit charge nurses.
          </p>
        </div>

        <div className="ai-controls-card">
          <div className="control-group">
            <label htmlFor="bottleneck-select">Scope of Analysis:</label>
            <select
              id="bottleneck-select"
              className="ops-select"
              value={filterId}
              onChange={(e) => handleFilterChange(e.target.value)}
              disabled={isLoading}
            >
              <option value="ALL">Analyze All Active Bottlenecks ({bottlenecks.length})</option>
              {bottlenecks.map((b) => (
                <option key={b.id} value={b.id}>
                  [{b.severity.toUpperCase()}] {b.department_or_unit} — {b.metric_name}
                </option>
              ))}
            </select>
          </div>

          <button
            className="primary-ai-btn"
            onClick={handleRunAnalysis}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spin-icon">↻</span>
                <span>Synthesizing with Gemini...</span>
              </>
            ) : (
              <>
                <span>Run AI Analysis</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="ai-loading-box">
          <div className="ai-loading-spinner" />
          <h4>Synthesizing Operational Findings...</h4>
          <p>
            Passing verified metrics to Google Gemini for root-cause analysis and workflow action recommendations.
          </p>
        </div>
      )}

      {/* Model Unavailable or Error Warning */}
      {!isLoading && insights && insights.status === 'model_unavailable' && (
        <div className="alert-callout callout-warning">
          <div>
            <strong>AI Engine Temporarily Unavailable:</strong> {insights.error_message}
            <p className="subtext">
              Deterministic metrics and rule-based bottleneck alerts remain fully functional. No fabricated
              fallback text was substituted.
            </p>
          </div>
        </div>
      )}

      {/* Success State */}
      {!isLoading && insights && insights.status === 'success' && (
        <div className="ai-results-wrapper">
          {/* Executive Summary Card */}
          {insights.executive_summary && (
            <div className="ai-summary-card">
              <div className="summary-header">
                <h4>Executive Operational Summary</h4>
                <span className="verified-tag">AI Generated · Verified Context</span>
              </div>
              <p className="summary-content">{insights.executive_summary}</p>
            </div>
          )}

          {/* Explanations List */}
          <div className="explanations-list">
            <div className="list-title-row">
              <h3>Root-Cause Explanations &amp; Recommended Staff Actions</h3>
              <span className="item-count-badge">
                {insights.explanations.length} Bottlenecks Addressed
              </span>
            </div>

            {insights.explanations.map((exp) => {
              // Find matching verified bottleneck for context
              const original = bottlenecks.find((b) => b.id === exp.bottleneck_id);

              return (
                <div key={exp.bottleneck_id} className="explanation-card">
                  <div className="exp-card-header">
                    <div>
                      <span className="exp-id">{exp.bottleneck_id}</span>
                      {original && (
                        <h4 className="exp-unit">
                          {original.department_or_unit} — {original.metric_name}
                        </h4>
                      )}
                    </div>
                    {original && (
                      <span className={`chip-badge badge-${original.severity}`}>
                        {original.severity.toUpperCase()}
                      </span>
                    )}
                  </div>

                  {original && (
                    <div className="verified-fact-box">
                      <span className="fact-label">Verified Finding:</span>{' '}
                      <strong>{original.observed_value}</strong> vs threshold {original.benchmark_threshold}.
                    </div>
                  )}

                  <div className="exp-section">
                    <h5>Operational Root Cause</h5>
                    <p>{exp.operational_context}</p>
                  </div>

                  <div className="exp-section exp-risk">
                    <h5>Systemic Risk</h5>
                    <p>{exp.systemic_risk}</p>
                  </div>

                  {/* Actions List */}
                  <div className="exp-actions-section">
                    <h5>Recommended Staff Actions</h5>
                    <div className="action-cards-grid">
                      {exp.suggested_actions.map((act, idx) => (
                        <div key={idx} className={`action-item urgency-${act.urgency}`}>
                          <div className="action-top">
                            <span className={`urgency-badge badge-${act.urgency}`}>
                              {act.urgency.replace('_', ' ').toUpperCase()}
                            </span>
                            <span className="role-tag">Role: {act.target_role}</span>
                          </div>
                          <div className="action-body">{act.action}</div>
                          <div className="action-impact">
                            <strong>Expected Relief:</strong> {act.expected_impact}
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

      {/* Initial Empty State before running */}
      {!isLoading && !insights && (
        <div className="ai-empty-state">
          <h3>Ready for AI Operations Intelligence</h3>
          <p>
            Click <strong>&quot;Run AI Analysis&quot;</strong> above to send the {bottlenecks.length} active verified
            operational bottlenecks to Google Gemini for root-cause synthesis and suggested staff interventions.
          </p>
          <button className="primary-ai-btn" onClick={handleRunAnalysis}>
            Run Analysis Now
          </button>
        </div>
      )}

      {/* Safety & Non-Clinical Disclaimer */}
      <div className="disclaimer-callout">
        <div className="disclaimer-text">
          <strong>Decision-Support Notice:</strong>{' '}
          {insights?.disclaimer ||
            'CareSync operational recommendations are generated by AI from simulated operational metrics. They are intended solely for workflow review by hospital staff and do NOT constitute clinical diagnosis, medical advice, or clinical care decisions.'}
        </div>
      </div>
    </div>
  );
};

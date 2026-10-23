import React from 'react';
import { BottleneckAlert } from '../types';

interface BottleneckBannerProps {
  bottlenecks: BottleneckAlert[];
  onAnalyzeBottleneck?: (id?: string) => void;
}

export const BottleneckBanner: React.FC<BottleneckBannerProps> = ({
  bottlenecks,
  onAnalyzeBottleneck,
}) => {
  if (bottlenecks.length === 0) {
    return (
      <div className="banner banner-success">
        <span className="banner-icon">✓</span>
        <div className="banner-text">
          <strong>Normal Hospital Throughput:</strong> All operational metrics are currently within target thresholds.
        </div>
      </div>
    );
  }

  const criticalCount = bottlenecks.filter((b) => b.severity === 'critical').length;
  const highCount = bottlenecks.filter((b) => b.severity === 'high').length;

  return (
    <div className="bottleneck-banner-container">
      <div className="banner-headline">
        <div className="banner-title-row">
          <span className="alert-pulse-icon">⚠️</span>
          <div className="banner-title-text">
            <h4>Deterministic Operational Bottlenecks Detected ({bottlenecks.length})</h4>
            <p>
              {criticalCount} critical, {highCount} high severity capacity &amp; workflow delays verified by backend rules.
            </p>
          </div>
        </div>

        {onAnalyzeBottleneck && (
          <button
            className="ai-analyze-btn"
            onClick={() => onAnalyzeBottleneck()}
            title="Send all verified findings to Gemini for operational root cause analysis"
          >
            ⚡ Explain with AI
          </button>
        )}
      </div>

      <div className="bottleneck-chips-grid">
        {bottlenecks.map((b) => (
          <div key={b.id} className={`bottleneck-chip chip-${b.severity}`}>
            <div className="chip-header">
              <span className={`chip-badge badge-${b.severity}`}>
                {b.severity.toUpperCase()}
              </span>
              <span className="chip-unit">{b.department_or_unit}</span>
            </div>
            <div className="chip-metric">
              <strong>{b.metric_name}:</strong> {b.observed_value}
            </div>
            <div className="chip-desc">{b.description}</div>
            {onAnalyzeBottleneck && (
              <button
                className="chip-action-link"
                onClick={() => onAnalyzeBottleneck(b.id)}
              >
                Analyze this issue →
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  IconShieldAlert,
  IconAlertTriangle,
  IconInfo,
  IconFilter,
  IconZap,
} from './Icons';
import { OperationalAlertItem } from '../types';

interface AlertsSectionProps {
  alerts: OperationalAlertItem[];
  onTriggerAi?: (id?: string) => void;
  onNavigateToTab?: (tab: any) => void;
}

export const AlertsSection: React.FC<AlertsSectionProps> = ({
  alerts,
  onTriggerAi,
  onNavigateToTab,
}) => {
  const [filterSeverity, setFilterSeverity] = useState<'ALL' | 'critical' | 'warning' | 'info'>('ALL');
  const [filterDept, setFilterDept] = useState<string>('ALL');

  const departments = Array.from(new Set(alerts.map((a) => a.department)));

  const filteredAlerts = alerts.filter((a) => {
    if (filterSeverity !== 'ALL' && a.severity !== filterSeverity) return false;
    if (filterDept !== 'ALL' && a.department !== filterDept) return false;
    return true;
  });

  const criticalCount = alerts.filter((a) => a.severity === 'critical').length;
  const warningCount = alerts.filter((a) => a.severity === 'warning').length;
  const infoCount = alerts.filter((a) => a.severity === 'info').length;

  return (
    <div className="alerts-console-card">
      {/* Header and Summary */}
      <div className="alerts-console-header">
        <div>
          <div className="alerts-title-row">
            <h2 className="alerts-title">Operational Alert Console</h2>
            <span className="alerts-badge">Real-Time Exception Management</span>
          </div>
          <p className="alerts-subtitle">
            Prioritized operational notifications distinguishing acute safety ceiling breaches, warning escalations, and facility communications.
          </p>
        </div>

        {onTriggerAi && (
          <button
            className="ai-batch-analyze-btn"
            onClick={() => onTriggerAi()}
            title="Perform comprehensive AI triage on all active alerts"
          >
            <IconZap size={16} />
            <span>AI Triage All Alerts</span>
          </button>
        )}
      </div>

      {/* Severity Metric Tiles */}
      <div className="alerts-summary-grid">
        <div
          className={`alert-summary-tile tile-critical ${filterSeverity === 'critical' ? 'tile-active' : ''}`}
          onClick={() => setFilterSeverity(filterSeverity === 'critical' ? 'ALL' : 'critical')}
        >
          <div className="tile-icon">
            <IconShieldAlert size={22} />
          </div>
          <div className="tile-content">
            <span className="tile-count text-critical">{criticalCount}</span>
            <span className="tile-label">Critical Alerts</span>
          </div>
          <span className="tile-subtext">Immediate intervention required</span>
        </div>

        <div
          className={`alert-summary-tile tile-warning ${filterSeverity === 'warning' ? 'tile-active' : ''}`}
          onClick={() => setFilterSeverity(filterSeverity === 'warning' ? 'ALL' : 'warning')}
        >
          <div className="tile-icon">
            <IconAlertTriangle size={22} />
          </div>
          <div className="tile-content">
            <span className="tile-count text-warning">{warningCount}</span>
            <span className="tile-label">Warnings</span>
          </div>
          <span className="tile-subtext">Approaching capacity limit</span>
        </div>

        <div
          className={`alert-summary-tile tile-info ${filterSeverity === 'info' ? 'tile-active' : ''}`}
          onClick={() => setFilterSeverity(filterSeverity === 'info' ? 'ALL' : 'info')}
        >
          <div className="tile-icon">
            <IconInfo size={22} />
          </div>
          <div className="tile-content">
            <span className="tile-count text-cyan">{infoCount}</span>
            <span className="tile-label">Informational</span>
          </div>
          <span className="tile-subtext">Workflow &amp; shift notices</span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="alerts-filter-toolbar">
        <div className="filter-chips-row">
          <span className="filter-label">Filter Severity:</span>
          <button
            className={`filter-chip ${filterSeverity === 'ALL' ? 'chip-selected' : ''}`}
            onClick={() => setFilterSeverity('ALL')}
          >
            All Alerts ({alerts.length})
          </button>
          <button
            className={`filter-chip chip-critical ${filterSeverity === 'critical' ? 'chip-selected' : ''}`}
            onClick={() => setFilterSeverity('critical')}
          >
            Critical ({criticalCount})
          </button>
          <button
            className={`filter-chip chip-warning ${filterSeverity === 'warning' ? 'chip-selected' : ''}`}
            onClick={() => setFilterSeverity('warning')}
          >
            Warnings ({warningCount})
          </button>
          <button
            className={`filter-chip chip-info ${filterSeverity === 'info' ? 'chip-selected' : ''}`}
            onClick={() => setFilterSeverity('info')}
          >
            Informational ({infoCount})
          </button>
        </div>

        <div className="filter-dept-wrap">
          <IconFilter size={15} className="filter-icon" />
          <select
            className="filter-dept-select"
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
          >
            <option value="ALL">All Departments ({departments.length})</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Alerts List */}
      <div className="alerts-stream-list">
        {filteredAlerts.length === 0 ? (
          <div className="empty-alerts-box">
            <IconInfo size={32} />
            <p>No active alerts matching your current filter criteria.</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const isCritical = alert.severity === 'critical';
            const isWarning = alert.severity === 'warning';

            return (
              <div
                key={alert.id}
                className={`alert-entry-card alert-sev-${alert.severity}`}
              >
                <div className="alert-entry-left">
                  <div className="alert-entry-status-col">
                    <span className={`alert-type-icon icon-${alert.severity}`}>
                      {isCritical ? (
                        <IconShieldAlert size={20} />
                      ) : isWarning ? (
                        <IconAlertTriangle size={20} />
                      ) : (
                        <IconInfo size={20} />
                      )}
                    </span>
                    <span className={`alert-badge-pill badge-${alert.severity}`}>
                      {alert.severity.toUpperCase()}
                    </span>
                  </div>

                  <div className="alert-entry-body">
                    <div className="alert-entry-headline">
                      <h4 className="alert-entry-title">{alert.title}</h4>
                      <span className="alert-entry-dept">{alert.department}</span>
                      <span className="alert-entry-time">{alert.timestamp}</span>
                    </div>

                    <p className="alert-entry-msg">{alert.message}</p>

                    {alert.metric && (
                      <div className="alert-telemetry-badge">
                        <span className="badge-name">{alert.metric}:</span>
                        <strong className={isCritical ? 'text-critical' : isWarning ? 'text-warning' : 'text-cyan'}>
                          {alert.observed}
                        </strong>
                        <span className="badge-thresh">(Threshold: {alert.threshold})</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="alert-entry-actions">
                  {onTriggerAi && (
                    <button
                      className="alert-btn-ai"
                      onClick={() => onTriggerAi(alert.id)}
                      title="Run AI explanation"
                    >
                      <IconZap size={14} />
                      <span>Analyze</span>
                    </button>
                  )}

                  {alert.actionLabel && onNavigateToTab && alert.targetTab && (
                    <button
                      className="alert-btn-action"
                      onClick={() => onNavigateToTab(alert.targetTab)}
                    >
                      {alert.actionLabel} →
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

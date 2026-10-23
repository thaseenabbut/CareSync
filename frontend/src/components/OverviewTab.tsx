import React from 'react';
import { HospitalOperationalSnapshot } from '../types';
import { StatCard } from './StatCard';
import { BottleneckBanner } from './BottleneckBanner';

interface OverviewTabProps {
  metrics: HospitalOperationalSnapshot;
  onNavigateToTab: (tab: any) => void;
  onTriggerAi: (id?: string) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  metrics,
  onNavigateToTab,
  onTriggerAi,
}) => {
  const occRate = metrics.overall_occupancy_rate_percent;
  const occStatus = occRate >= 90 ? 'critical' : occRate >= 85 ? 'warning' : 'normal';

  const availableBeds = metrics.total_capacity_beds - metrics.total_occupied_beds;
  const criticalDeptCount = metrics.departments.filter((d) => d.status === 'critical').length;

  return (
    <div className="tab-container">
      {/* KPI Cards Row */}
      <div className="stats-row">
        <StatCard
          label="Hospital Bed Occupancy"
          value={`${occRate}%`}
          subValue={`${metrics.total_occupied_beds} of ${metrics.total_capacity_beds} beds`}
          status={occStatus}
          benchmark="Target < 85.0%"
          icon="🛏️"
        />
        <StatCard
          label="ED Boarded Patients"
          value={metrics.emergency_boarded_patients}
          subValue="Awaiting inpatient bed assignment"
          status={metrics.emergency_boarded_patients >= 8 ? 'critical' : 'normal'}
          benchmark="Target < 8 patients"
          icon="🚨"
        />
        <StatCard
          label="Pending Discharges"
          value={metrics.total_pending_discharges}
          subValue="Across all inpatient units"
          status={metrics.total_pending_discharges >= 20 ? 'warning' : 'normal'}
          benchmark="Target < 15 pending"
          icon="📋"
        />
        <StatCard
          label="Available Inpatient Beds"
          value={availableBeds}
          subValue={`${criticalDeptCount} units at critical threshold`}
          status={availableBeds < 35 ? 'warning' : 'normal'}
          benchmark="Surge reserve: 30 beds"
          icon="🚪"
        />
      </div>

      {/* Verified Bottlenecks Banner */}
      <BottleneckBanner
        bottlenecks={metrics.active_bottlenecks}
        onAnalyzeBottleneck={onTriggerAi}
      />

      {/* Overview Department Capacity Summary Grid */}
      <div className="section-card">
        <div className="section-card-header">
          <div>
            <h3>Departmental Capacity &amp; Utilization</h3>
            <p className="section-subtitle">
              Calculated deterministically from simulated census and admission feeds.
            </p>
          </div>
          <button
            className="secondary-btn"
            onClick={() => onNavigateToTab('beds')}
          >
            Detailed Bed View →
          </button>
        </div>

        <div className="departments-table-wrap">
          <table className="ops-table">
            <thead>
              <tr>
                <th>Department</th>
                <th>Capacity</th>
                <th>Occupied</th>
                <th>Pending Discharges</th>
                <th>Occupancy Rate</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {metrics.departments.map((dept) => {
                const isCritical = dept.status === 'critical';
                const isWarning = dept.status === 'warning';
                return (
                  <tr key={dept.department}>
                    <td>
                      <strong>{dept.department}</strong>
                    </td>
                    <td>{dept.total_beds} beds</td>
                    <td>{dept.occupied_beds}</td>
                    <td>{dept.pending_discharge_beds}</td>
                    <td>
                      <div className="progress-cell">
                        <div className="progress-bar-bg">
                          <div
                            className={`progress-bar-fill ${
                              isCritical ? 'fill-critical' : isWarning ? 'fill-warning' : 'fill-normal'
                            }`}
                            style={{ width: `${Math.min(dept.occupancy_rate_percent, 100)}%` }}
                          />
                        </div>
                        <span className="progress-label">{dept.occupancy_rate_percent}%</span>
                      </div>
                    </td>
                    <td>
                      <span
                        className={`status-pill ${
                          isCritical ? 'pill-critical' : isWarning ? 'pill-warning' : 'pill-normal'
                        }`}
                      >
                        {dept.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Launch Cards */}
      <div className="quick-actions-row">
        <div
          className="action-card action-card-ai"
          onClick={() => onNavigateToTab('ai')}
        >
          <div className="action-card-icon">🧠</div>
          <div className="action-card-text">
            <h4>AI Operational Intelligence</h4>
            <p>Generate root-cause explanations and suggested workflow actions using Google Gemini.</p>
          </div>
          <span className="action-arrow">→</span>
        </div>

        <div
          className="action-card action-card-sim"
          onClick={() => onNavigateToTab('simulator')}
        >
          <div className="action-card-icon">⚗️</div>
          <div className="action-card-text">
            <h4>Interactive Scenario Simulator</h4>
            <p>Model staff adjustments, machine repairs, and accelerated discharges in real-time.</p>
          </div>
          <span className="action-arrow">→</span>
        </div>
      </div>
    </div>
  );
};

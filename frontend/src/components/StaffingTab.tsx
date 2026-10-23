import React from 'react';
import { HospitalOperationalSnapshot } from '../types';
import { StaffAvailabilityChart } from './charts/StaffAvailabilityChart';
import { ResourceUtilizationChart } from './charts/ResourceUtilizationChart';
import { deriveDashboardData } from '../lib/mockData';
import { IconAlertTriangle } from './Icons';

interface StaffingTabProps {
  metrics: HospitalOperationalSnapshot;
  onNavigateToTab?: (tab: any) => void;
}

export const StaffingTab: React.FC<StaffingTabProps> = ({ metrics, onNavigateToTab }) => {
  const dashboardData = deriveDashboardData(metrics);

  const criticalShortageDept = metrics.staffing_indicators.find(
    (s) => s.status === 'critical_shortage'
  );

  return (
    <div className="tab-container">
      {/* High-level staffing warning banner */}
      {criticalShortageDept && (
        <div className="alert-callout-box box-critical">
          <div className="alert-callout-icon">
            <IconAlertTriangle size={22} />
          </div>
          <div className="alert-callout-content">
            <h4>Critical Workforce Shortage: {criticalShortageDept.department} at {criticalShortageDept.patient_to_nurse_ratio}:1 Ratio</h4>
            <p>
              Nursing team has only {criticalShortageDept.active_nurses} active RNs on duty against a target of {criticalShortageDept.target_nurses}.
              The resulting ratio exceeds the benchmark ceiling of {criticalShortageDept.target_ratio}:1, increasing workload strain and delaying inpatient medication rounds.
            </p>
          </div>
          {onNavigateToTab && (
            <button
              className="btn-primary-cyan btn-sm"
              onClick={() => onNavigateToTab('simulator')}
            >
              Model Float RNs in Simulator →
            </button>
          )}
        </div>
      )}

      {/* Analytics Row: Horizontal Staff Availability Bar Chart + Resource Utilization Bar Chart */}
      <div className="analytics-grid-two-col">
        <div className="col-half">
          <StaffAvailabilityChart data={dashboardData.staffAvailability} />
        </div>
        <div className="col-half">
          <ResourceUtilizationChart data={dashboardData.resourceUtilization} />
        </div>
      </div>

      {/* Department Staffing Details Cards */}
      <div className="section-title-row mt-8">
        <h3>Workforce Roster &amp; Acuity Workload Ratios</h3>
        <span className="grounded-badge">Active Shift Telemetry</span>
      </div>

      <div className="staffing-grid">
        {metrics.staffing_indicators.map((staff) => {
          const isCritical = staff.status === 'critical_shortage';
          const isStrained = staff.status === 'strained';
          const ratioDelta = (staff.patient_to_nurse_ratio - staff.target_ratio).toFixed(1);
          const coverage = Math.round((staff.active_nurses / staff.target_nurses) * 100);

          return (
            <div
              key={staff.department}
              className={`staff-card ${isCritical ? 'card-border-critical' : isStrained ? 'card-border-warning' : ''}`}
            >
              <div className="staff-card-header">
                <div>
                  <h4 className="staff-dept-name">{staff.department}</h4>
                  <span className="unit-label">Inpatient Unit</span>
                </div>
                <span
                  className={`status-pill ${
                    isCritical ? 'pill-critical' : isStrained ? 'pill-warning' : 'pill-normal'
                  }`}
                >
                  {isCritical ? 'CRITICAL SHORTAGE' : isStrained ? 'STRAINED' : 'ADEQUATE'}
                </span>
              </div>

              <div className="staff-ratio-row">
                <div className="ratio-stat">
                  <span className="ratio-label">Current Acuity Ratio</span>
                  <span className={`ratio-number ${isCritical ? 'text-critical' : isStrained ? 'text-warning' : 'text-success'}`}>
                    {staff.patient_to_nurse_ratio}:1
                  </span>
                </div>
                <div className="ratio-divider">vs</div>
                <div className="ratio-stat">
                  <span className="ratio-label">Target Benchmark</span>
                  <span className="ratio-number text-muted">
                    {staff.target_ratio}:1
                  </span>
                </div>
              </div>

              <div className="staff-counts-row">
                <div className="staff-count-box">
                  <span className="count-num text-cyan">{staff.active_nurses}</span>
                  <span className="count-lbl">Active RNs</span>
                </div>
                <div className="staff-count-box">
                  <span className="count-num text-muted">{staff.target_nurses}</span>
                  <span className="count-lbl">Required RNs</span>
                </div>
                <div className="staff-count-box">
                  <span className={`count-num ${coverage < 75 ? 'text-critical' : coverage < 85 ? 'text-warning' : 'text-success'}`}>
                    {coverage}%
                  </span>
                  <span className="count-lbl">Coverage</span>
                </div>
              </div>

              {Number(ratioDelta) > 0 && (
                <div className="staff-ratio-warning">
                  ⚠️ Patient workload is <strong>{ratioDelta} pts/nurse</strong> above benchmark safety target.
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

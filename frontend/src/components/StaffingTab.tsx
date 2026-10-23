import React from 'react';
import { HospitalOperationalSnapshot } from '../types';

interface StaffingTabProps {
  metrics: HospitalOperationalSnapshot;
}

export const StaffingTab: React.FC<StaffingTabProps> = ({ metrics }) => {
  return (
    <div className="tab-container">
      <div className="tab-header-block">
        <h2>Nursing Staffing &amp; Workload Ratios</h2>
        <p>
          Deterministic staffing assessment across care units. Tracks patient-to-nurse ratios against safety benchmarks.
        </p>
      </div>

      <div className="staffing-grid">
        {metrics.staffing_indicators.map((staff) => {
          const isCritical = staff.status === 'critical_shortage';
          const isStrained = staff.status === 'strained';
          const ratioDelta = (staff.patient_to_nurse_ratio - staff.target_ratio).toFixed(1);

          return (
            <div
              key={staff.department}
              className={`staff-card ${isCritical ? 'card-border-critical' : isStrained ? 'card-border-warning' : ''}`}
            >
              <div className="staff-card-header">
                <div>
                  <h4>{staff.department}</h4>
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
                  <span className="ratio-label">Current Ratio</span>
                  <span className={`ratio-number ${isCritical ? 'text-critical' : isStrained ? 'text-warning' : ''}`}>
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
                  <span className="count-num">{staff.active_nurses}</span>
                  <span className="count-lbl">Active RNs</span>
                </div>
                <div className="staff-count-box">
                  <span className="count-num">{staff.target_nurses}</span>
                  <span className="count-lbl">Target RNs</span>
                </div>
                <div className="staff-count-box">
                  <span className={`count-num ${staff.target_nurses - staff.active_nurses > 0 ? 'text-critical' : ''}`}>
                    {staff.active_nurses - staff.target_nurses > 0
                      ? `+${staff.active_nurses - staff.target_nurses}`
                      : staff.active_nurses - staff.target_nurses}
                  </span>
                  <span className="count-lbl">RN Variance</span>
                </div>
              </div>

              {Number(ratioDelta) > 0 && (
                <div className="staff-ratio-warning">
                  Patient workload is {ratioDelta} patients/nurse above benchmark target.
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

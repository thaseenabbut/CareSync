import React from 'react';
import { HospitalOperationalSnapshot } from '../types';

interface BedsTabProps {
  metrics: HospitalOperationalSnapshot;
}

export const BedsTab: React.FC<BedsTabProps> = ({ metrics }) => {
  return (
    <div className="tab-container">
      <div className="tab-header-block">
        <h2>Bed Occupancy &amp; Unit Availability</h2>
        <p>
          Real-time tracking of inpatient bed supply, acute occupancy thresholds, and discharge readiness.
        </p>
      </div>

      {/* High-level emergency boarding alert */}
      {metrics.emergency_boarded_patients > 0 && (
        <div className="alert-callout callout-critical">
          <div>
            <strong>Emergency Department Boarding Crisis:</strong>{' '}
            {metrics.emergency_boarded_patients} admitted patients are currently waiting in ED hallways/bays
            because downstream inpatient units (ICU, Med/Surg) are at near-max capacity.
          </div>
        </div>
      )}

      {/* Grid of Department Cards */}
      <div className="department-cards-grid">
        {metrics.departments.map((dept) => {
          const available = dept.total_beds - dept.occupied_beds;
          const isCritical = dept.status === 'critical';
          const isWarning = dept.status === 'warning';

          return (
            <div
              key={dept.department}
              className={`dept-card ${isCritical ? 'card-border-critical' : isWarning ? 'card-border-warning' : ''}`}
            >
              <div className="dept-card-header">
                <div>
                  <h3 className="dept-name">{dept.department}</h3>
                  <span className="dept-type">Inpatient Unit</span>
                </div>
                <span
                  className={`status-pill ${
                    isCritical ? 'pill-critical' : isWarning ? 'pill-warning' : 'pill-normal'
                  }`}
                >
                  {dept.status.toUpperCase()}
                </span>
              </div>

              <div className="dept-meter-wrap">
                <div className="meter-label-row">
                  <span>Occupancy</span>
                  <strong className={isCritical ? 'text-critical' : ''}>
                    {dept.occupancy_rate_percent}%
                  </strong>
                </div>
                <div className="meter-track">
                  <div
                    className={`meter-bar ${
                      isCritical ? 'fill-critical' : isWarning ? 'fill-warning' : 'fill-normal'
                    }`}
                    style={{ width: `${Math.min(dept.occupancy_rate_percent, 100)}%` }}
                  />
                </div>
              </div>

              <div className="dept-stats-grid">
                <div className="dept-stat-box">
                  <span className="box-val">{dept.occupied_beds}</span>
                  <span className="box-lbl">Occupied</span>
                </div>
                <div className="dept-stat-box">
                  <span className={`box-val ${available <= 2 ? 'text-critical' : ''}`}>
                    {available}
                  </span>
                  <span className="box-lbl">Available</span>
                </div>
                <div className="dept-stat-box">
                  <span className="box-val">{dept.pending_discharge_beds}</span>
                  <span className="box-lbl">Pending DC</span>
                </div>
                <div className="dept-stat-box">
                  <span className="box-val">{dept.total_beds}</span>
                  <span className="box-lbl">Total Capacity</span>
                </div>
              </div>

              {dept.pending_discharge_beds > 0 && (
                <div className="dept-footer-note">
                  Expediting {dept.pending_discharge_beds} pending discharges would lower occupancy to{' '}
                  {Math.round(((dept.occupied_beds - dept.pending_discharge_beds) / dept.total_beds) * 100)}%.
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

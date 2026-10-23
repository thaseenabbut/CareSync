import React from 'react';
import { HospitalOperationalSnapshot } from '../types';
import { BedOccupancyChart } from './charts/BedOccupancyChart';
import { HospitalCapacityDonut } from './charts/HospitalCapacityDonut';
import { deriveDashboardData } from '../lib/mockData';
import { IconAlertTriangle } from './Icons';

interface BedsTabProps {
  metrics: HospitalOperationalSnapshot;
  onNavigateToTab?: (tab: any) => void;
}

export const BedsTab: React.FC<BedsTabProps> = ({ metrics, onNavigateToTab }) => {
  const dashboardData = deriveDashboardData(metrics);

  return (
    <div className="tab-container">
      {/* High-level emergency boarding alert */}
      {metrics.emergency_boarded_patients > 0 && (
        <div className="alert-callout-box box-critical">
          <div className="alert-callout-icon">
            <IconAlertTriangle size={22} />
          </div>
          <div className="alert-callout-content">
            <h4>Critical Inpatient Capacity: {metrics.emergency_boarded_patients} Admitted Patients Boarding in ED</h4>
            <p>
              Emergency room bays are constrained because downstream units (ICU at 95.8%, General Medicine at 93.3%) are at or above critical saturation thresholds.
            </p>
          </div>
          {onNavigateToTab && (
            <button
              className="btn-primary-cyan btn-sm"
              onClick={() => onNavigateToTab('simulator')}
            >
              Simulate Discharges →
            </button>
          )}
        </div>
      )}

      {/* Analytics Row: Stacked Bed Bar Chart + Hospital Capacity Donut */}
      <div className="analytics-grid-two-col">
        <div className="col-span-two-thirds">
          <BedOccupancyChart data={dashboardData.bedBreakdown} />
        </div>
        <div className="col-span-one-third">
          <HospitalCapacityDonut
            totalCapacity={dashboardData.kpis.totalCapacity}
            totalOccupied={dashboardData.kpis.totalOccupied}
            totalAvailable={dashboardData.kpis.totalAvailable}
            totalUnavailable={dashboardData.kpis.totalUnavailable}
            occupancyRate={dashboardData.kpis.occupancyRate}
          />
        </div>
      </div>

      {/* Grid of Department Cards */}
      <div className="section-title-row mt-8">
        <h3>Departmental Bed Allocation &amp; Unit Surge Readiness</h3>
        <span className="grounded-badge">5 Active Inpatient Wings</span>
      </div>

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
                  <h4 className="dept-name">{dept.department}</h4>
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
                  <span>Occupancy Rate</span>
                  <strong className={isCritical ? 'text-critical' : isWarning ? 'text-warning' : 'text-cyan'}>
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
                  <span className={`box-val ${available <= 2 ? 'text-critical' : 'text-success'}`}>
                    {available}
                  </span>
                  <span className="box-lbl">Available</span>
                </div>
                <div className="dept-stat-box">
                  <span className="box-val text-warning">{dept.pending_discharge_beds}</span>
                  <span className="box-lbl">Pending DC</span>
                </div>
                <div className="dept-stat-box">
                  <span className="box-val">{dept.total_beds}</span>
                  <span className="box-lbl">Total Beds</span>
                </div>
              </div>

              {dept.pending_discharge_beds > 0 && (
                <div className="dept-footer-note">
                  Expediting {dept.pending_discharge_beds} pending discharges would lower occupancy to{' '}
                  <strong>{Math.round(((dept.occupied_beds - dept.pending_discharge_beds) / dept.total_beds) * 100)}%</strong>.
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Pending Discharges Table */}
      <div className="section-card mt-8">
        <div className="section-card-header">
          <div>
            <h3>Medically Cleared Delayed Inpatient Discharges</h3>
            <p className="section-subtitle">
              Patients medically cleared for release delayed &gt; 4.0 hours holding acute beds due to logistical friction.
            </p>
          </div>
          <span className="badge-warning">
            {metrics.pending_discharges.length} Patients Delayed
          </span>
        </div>

        <div className="table-responsive">
          <table className="ops-table">
            <thead>
              <tr>
                <th>Patient ID</th>
                <th>Inpatient Ward</th>
                <th>Clearance Delay</th>
                <th>Logistical Hold Reason</th>
                <th>Operational Bottleneck Impact</th>
              </tr>
            </thead>
            <tbody>
              {metrics.pending_discharges.map((pt) => {
                const isExtended = pt.cleared_for_hours >= 5.0;
                return (
                  <tr key={pt.patient_identifier}>
                    <td>
                      <code>{pt.patient_identifier}</code>
                    </td>
                    <td>
                      <strong>{pt.ward}</strong>
                    </td>
                    <td>
                      <span className={`delay-badge ${isExtended ? 'delay-critical' : 'delay-warning'}`}>
                        {pt.cleared_for_hours} hrs post-clearance
                      </span>
                    </td>
                    <td>
                      <span className="hold-reason-tag">{pt.hold_reason}</span>
                    </td>
                    <td className="text-muted">
                      Blocks bed turnover for incoming ED or transfer admissions
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

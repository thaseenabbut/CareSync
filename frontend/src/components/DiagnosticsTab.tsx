import React from 'react';
import { HospitalOperationalSnapshot } from '../types';
import { WaitingTimeChart } from './charts/WaitingTimeChart';
import { deriveDashboardData } from '../lib/mockData';
import { IconAlertTriangle } from './Icons';

interface DiagnosticsTabProps {
  metrics: HospitalOperationalSnapshot;
  onNavigateToTab?: (tab: any) => void;
}

export const DiagnosticsTab: React.FC<DiagnosticsTabProps> = ({ metrics, onNavigateToTab }) => {
  const dashboardData = deriveDashboardData(metrics);
  const ctScan = metrics.diagnostic_backlogs.find((d) => d.modality === 'CT Scan');

  return (
    <div className="tab-container">
      {/* Top Banner if CT scan is delayed */}
      {ctScan && ctScan.status === 'critical' && (
        <div className="alert-callout-box box-critical">
          <div className="alert-callout-icon">
            <IconAlertTriangle size={22} />
          </div>
          <div className="alert-callout-content">
            <h4>Diagnostic Imaging Bottleneck: CT Scanner #3 Offline (185 min avg wait)</h4>
            <p>
              Only {ctScan.in_service_machines} of {ctScan.total_machines} CT scanners are operational due to scheduled tube calibration.
              With {ctScan.pending_scans} scans currently queued, diagnostic delays are blocking emergency admissions and acute trauma decisions.
            </p>
          </div>
          {onNavigateToTab && (
            <button
              className="btn-primary-cyan btn-sm"
              onClick={() => onNavigateToTab('simulator')}
            >
              Simulate Restoring CT Scanner →
            </button>
          )}
        </div>
      )}

      {/* Waiting Times Chart */}
      <div className="chart-full-width">
        <WaitingTimeChart data={dashboardData.waitingTimes} />
      </div>

      {/* Diagnostics Modalities Section */}
      <div className="section-card mt-8">
        <div className="section-card-header">
          <div>
            <h3>Diagnostic Imaging Queues &amp; Equipment Availability</h3>
            <p className="section-subtitle">
              Active backlog across radiology equipment. Benchmark threshold: wait times under 90 minutes.
            </p>
          </div>
        </div>

        <div className="diag-grid">
          {metrics.diagnostic_backlogs.map((diag) => {
            const isCritical = diag.status === 'critical';
            const isElevated = diag.status === 'elevated';
            const machineAlert = diag.in_service_machines < diag.total_machines;

            return (
              <div
                key={diag.modality}
                className={`diag-card ${isCritical ? 'card-border-critical' : isElevated ? 'card-border-warning' : ''}`}
              >
                <div className="diag-card-top">
                  <h4>{diag.modality}</h4>
                  <span
                    className={`status-pill ${
                      isCritical ? 'pill-critical' : isElevated ? 'pill-warning' : 'pill-normal'
                    }`}
                  >
                    {diag.status.toUpperCase()}
                  </span>
                </div>

                <div className="diag-wait-metric">
                  <span className={`wait-value ${isCritical ? 'text-critical' : isElevated ? 'text-warning' : 'text-success'}`}>
                    {diag.average_wait_minutes}
                  </span>
                  <span className="wait-unit">min avg wait</span>
                </div>

                <div className="diag-details-list">
                  <div className="diag-detail-row">
                    <span>Pending Orders:</span>
                    <strong className="text-cyan">{diag.pending_scans} queued</strong>
                  </div>
                  <div className="diag-detail-row">
                    <span>Active Equipment:</span>
                    <strong className={machineAlert ? 'text-critical font-semibold' : 'text-success'}>
                      {diag.in_service_machines} of {diag.total_machines} active
                    </strong>
                  </div>
                </div>

                {machineAlert && (
                  <div className="diag-equipment-alert">
                    ⚠️ {diag.total_machines - diag.in_service_machines} machine offline for calibration.
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Pending Discharges Table Section */}
      <div className="section-card mt-8">
        <div className="section-card-header">
          <div>
            <h3>Medically Cleared Discharge Delays</h3>
            <p className="section-subtitle">
              Patients medically cleared for discharge delayed &gt; 4 hours holding acute inpatient beds.
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
                <th>Time Since Clearance</th>
                <th>Hold Reason</th>
                <th>Operational Impact</th>
              </tr>
            </thead>
            <tbody>
              {metrics.pending_discharges.map((pt) => {
                const isExtendedDelay = pt.cleared_for_hours >= 5.0;
                return (
                  <tr key={pt.patient_identifier}>
                    <td>
                      <code>{pt.patient_identifier}</code>
                    </td>
                    <td>{pt.ward}</td>
                    <td>
                      <span className={`delay-badge ${isExtendedDelay ? 'delay-critical' : 'delay-warning'}`}>
                        {pt.cleared_for_hours} hours
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

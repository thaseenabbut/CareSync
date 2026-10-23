import React from 'react';
import { HospitalOperationalSnapshot } from '../types';
import { PatientFlowChart } from './charts/PatientFlowChart';
import { WaitingTimeChart } from './charts/WaitingTimeChart';
import { deriveDashboardData } from '../lib/mockData';
import { IconAlertTriangle, IconActivity } from './Icons';

interface PatientFlowTabProps {
  metrics: HospitalOperationalSnapshot;
  onNavigateToTab?: (tab: any) => void;
}

export const PatientFlowTab: React.FC<PatientFlowTabProps> = ({
  metrics,
  onNavigateToTab,
}) => {
  const dashboardData = deriveDashboardData(metrics);

  return (
    <div className="tab-container">
      {/* Top Banner if emergency boarding is active */}
      {metrics.emergency_boarded_patients > 0 && (
        <div className="alert-callout-box box-critical">
          <div className="alert-callout-icon">
            <IconAlertTriangle size={22} />
          </div>
          <div className="alert-callout-content">
            <h4>Emergency Department Boarding Bottleneck: {metrics.emergency_boarded_patients} Patients Waiting</h4>
            <p>
              14 admitted patients are currently holding acute ED treatment bays because downstream inpatient beds (General Medicine, ICU) have not yet turned over.
              Average ED wait time has inflated to 58 minutes (+13 min over SLA target).
            </p>
          </div>
          {onNavigateToTab && (
            <button
              className="btn-primary-cyan btn-sm"
              onClick={() => onNavigateToTab('beds')}
            >
              Expedite Inpatient Beds →
            </button>
          )}
        </div>
      )}

      {/* Main Flow Chart */}
      <div className="chart-full-width">
        <PatientFlowChart
          hourlyData={dashboardData.hourlyFlow}
          dailyData={dashboardData.dailyFlow}
        />
      </div>

      {/* Velocity and Throughput Metric Tiles */}
      <div className="throughput-metrics-grid mt-6">
        <div className="throughput-tile">
          <div className="tile-top">
            <span className="tile-label">ADMISSIONS VELOCITY</span>
            <span className="dot dot-cyan" />
          </div>
          <div className="tile-number text-cyan">51 / day</div>
          <p className="tile-desc">Peak intake window: 10:00 - 14:00 (19 - 24 pts/hr)</p>
          <div className="tile-meta">Planned surgical &amp; direct clinic transfers</div>
        </div>

        <div className="throughput-tile">
          <div className="tile-top">
            <span className="tile-label">DISCHARGE CLEARANCE</span>
            <span className="dot dot-emerald" />
          </div>
          <div className="tile-number text-success">48 / day</div>
          <p className="tile-desc">Peak discharge window: 11:00 - 15:00 (14 - 20 pts/hr)</p>
          <div className="tile-meta">26 pending discharges currently flagged</div>
        </div>

        <div className="throughput-tile">
          <div className="tile-top">
            <span className="tile-label">EMERGENCY INTAKE VELOCITY</span>
            <span className="dot dot-violet" />
          </div>
          <div className="tile-number text-violet">74 / day</div>
          <p className="tile-desc">Afternoon arrival surge: 26 acute arrivals/hr</p>
          <div className="tile-meta">58 min average emergency room wait</div>
        </div>

        <div className="throughput-tile">
          <div className="tile-top">
            <span className="tile-label">NET CENSUS DELTA</span>
            <IconActivity size={16} className="text-warning" />
          </div>
          <div className="tile-number text-warning">+3 Patients / Shift</div>
          <p className="tile-desc">Arrivals exceeding discharge turnover velocity</p>
          <div className="tile-meta">Surge reserve capacity shrinking</div>
        </div>
      </div>

      {/* Waiting Times Chart Row */}
      <div className="mt-6">
        <WaitingTimeChart data={dashboardData.waitingTimes} />
      </div>

      {/* Active ED Boarding Queue Table */}
      <div className="section-card mt-6">
        <div className="section-card-header">
          <div>
            <h3>Emergency Department Admitted Patient Boarding Roster</h3>
            <p className="section-subtitle">
              Patients admitted under emergency care awaiting inpatient ward bed assignments.
            </p>
          </div>
          <span className="badge-critical">
            {metrics.emergency_boarded_patients} Patients Boarding
          </span>
        </div>

        <div className="table-responsive">
          <table className="ops-table">
            <thead>
              <tr>
                <th>Patient Tag</th>
                <th>Acuity Tier</th>
                <th>Boarding Duration</th>
                <th>Assigned Inpatient Unit</th>
                <th>Current Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>SIM-ED-101</code></td>
                <td><span className="chip-badge badge-critical">ESI 2 (Urgent)</span></td>
                <td><span className="text-critical font-semibold">3.8 hours</span></td>
                <td>General Medicine (Telemetry)</td>
                <td>Awaiting terminal cleaning of Bed 402</td>
              </tr>
              <tr>
                <td><code>SIM-ED-102</code></td>
                <td><span className="chip-badge badge-critical">ESI 2 (Urgent)</span></td>
                <td><span className="text-critical font-semibold">3.2 hours</span></td>
                <td>Intensive Care Unit</td>
                <td>ICU currently at 95.8% capacity (1 bed reserve)</td>
              </tr>
              <tr>
                <td><code>SIM-ED-103</code></td>
                <td><span className="chip-badge badge-warning">ESI 3 (Moderate)</span></td>
                <td><span className="text-warning font-semibold">2.9 hours</span></td>
                <td>General Medicine</td>
                <td>Awaiting pharmacy discharge release of Bed 404</td>
              </tr>
              <tr>
                <td><code>SIM-ED-104</code></td>
                <td><span className="chip-badge badge-warning">ESI 3 (Moderate)</span></td>
                <td><span className="text-warning font-semibold">2.5 hours</span></td>
                <td>Surgical Ward</td>
                <td>Bed 508 prepared, transport pending</td>
              </tr>
              <tr>
                <td><code>SIM-ED-105</code></td>
                <td><span className="chip-badge badge-warning">ESI 3 (Moderate)</span></td>
                <td><span className="text-warning font-semibold">2.1 hours</span></td>
                <td>General Medicine</td>
                <td>Awaiting nursing handover</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

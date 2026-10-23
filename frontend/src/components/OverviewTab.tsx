import React from 'react';
import { HospitalOperationalSnapshot, ExplainResponse } from '../types';
import { KpiCards } from './KpiCards';
import { PatientFlowChart } from './charts/PatientFlowChart';
import { BedOccupancyChart } from './charts/BedOccupancyChart';
import { WaitingTimeChart } from './charts/WaitingTimeChart';
import { HospitalCapacityDonut } from './charts/HospitalCapacityDonut';
import { AiInsightsPanel } from './AiInsightsPanel';
import { AlertsSection } from './AlertsSection';
import { deriveDashboardData } from '../lib/mockData';
import { DashboardNavTab } from './Sidebar';

interface OverviewTabProps {
  metrics: HospitalOperationalSnapshot;
  insights: ExplainResponse | null;
  isLoadingAi: boolean;
  onRequestInsights: (id?: string) => void;
  onNavigateToTab: (tab: DashboardNavTab) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  metrics,
  insights,
  isLoadingAi,
  onRequestInsights,
  onNavigateToTab,
}) => {
  const dashboardData = deriveDashboardData(metrics);

  return (
    <div className="overview-container">
      {/* 6 KPI Cards Row */}
      <KpiCards
        totalPatients={dashboardData.kpis.totalPatients}
        availableBeds={dashboardData.kpis.totalAvailable}
        occupancyRate={dashboardData.kpis.occupancyRate}
        averageWaitMinutes={dashboardData.kpis.averageWaitMinutes}
        staffAvailabilityPercent={dashboardData.kpis.staffAvailabilityPercent}
        activeAlertsCount={dashboardData.kpis.activeAlertsCount}
        criticalAlertsCount={dashboardData.kpis.criticalAlertsCount}
        totalCapacity={dashboardData.kpis.totalCapacity}
        totalActiveRNs={dashboardData.kpis.totalActiveRNs}
        totalTargetRNs={dashboardData.kpis.totalTargetRNs}
        onCardClick={(tab) => onNavigateToTab(tab as DashboardNavTab)}
      />

      {/* Main Analytics Grid Row 1: Patient Flow Line Chart + Capacity Donut */}
      <div className="analytics-grid-two-col">
        <div className="col-span-two-thirds">
          <PatientFlowChart
            hourlyData={dashboardData.hourlyFlow}
            dailyData={dashboardData.dailyFlow}
          />
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

      {/* Main Analytics Grid Row 2: Bed Occupancy Stacked Bar + Waiting Time Bar */}
      <div className="analytics-grid-two-col mt-6">
        <div className="col-half">
          <BedOccupancyChart data={dashboardData.bedBreakdown} />
        </div>
        <div className="col-half">
          <WaitingTimeChart data={dashboardData.waitingTimes} />
        </div>
      </div>

      {/* Section 3: AI Operational Insights Dedicated Panel */}
      <div className="mt-6">
        <AiInsightsPanel
          bottlenecks={metrics.active_bottlenecks}
          insights={insights}
          isLoading={isLoadingAi}
          onRequestInsights={onRequestInsights}
          onNavigateToTab={onNavigateToTab}
        />
      </div>

      {/* Section 4: Operational Alerts Console */}
      <div className="mt-6">
        <AlertsSection
          alerts={dashboardData.alerts}
          onTriggerAi={onRequestInsights}
          onNavigateToTab={onNavigateToTab}
        />
      </div>

      {/* Section 5: Real-time Inpatient Census Summary Table */}
      <div className="section-card mt-6">
        <div className="section-card-header">
          <div>
            <h3>Departmental Bed Census &amp; Operational Turnover</h3>
            <p className="section-subtitle">
              Calculated deterministically from verified simulated admissions and patient tracking feeds.
            </p>
          </div>
          <button
            className="btn-secondary"
            onClick={() => onNavigateToTab('beds')}
          >
            Comprehensive Bed Management →
          </button>
        </div>

        <div className="departments-table-wrap">
          <table className="ops-table">
            <thead>
              <tr>
                <th>Department / Unit</th>
                <th>Total Capacity</th>
                <th>Occupied</th>
                <th>Available</th>
                <th>Pending DC</th>
                <th>Occupancy Rate</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.bedBreakdown.map((dept) => {
                const isCritical = dept.status === 'critical';
                const isWarning = dept.status === 'warning';
                return (
                  <tr key={dept.department}>
                    <td>
                      <strong>{dept.department}</strong>
                    </td>
                    <td>{dept.total} beds</td>
                    <td>
                      <span className="font-semibold text-main">{dept.occupied}</span>
                    </td>
                    <td>
                      <span className={dept.available <= 2 ? 'text-critical font-semibold' : 'text-success'}>
                        {dept.available}
                      </span>
                    </td>
                    <td>{dept.unavailable} cleaning/hold</td>
                    <td>
                      <div className="progress-cell">
                        <div className="progress-bar-bg">
                          <div
                            className={`progress-bar-fill ${
                              isCritical ? 'fill-critical' : isWarning ? 'fill-warning' : 'fill-normal'
                            }`}
                            style={{ width: `${Math.min(dept.occupancyPercent, 100)}%` }}
                          />
                        </div>
                        <span className={`progress-label ${isCritical ? 'text-critical' : isWarning ? 'text-warning' : 'text-main'}`}>
                          {dept.occupancyPercent}%
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className={`status-pill ${isCritical ? 'pill-critical' : isWarning ? 'pill-warning' : 'pill-normal'}`}>
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
    </div>
  );
};

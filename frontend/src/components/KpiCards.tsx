import React from 'react';
import {
  IconActivity,
  IconBeds,
  IconClock,
  IconStaff,
  IconAlerts,
  IconTrendingUp,
} from './Icons';

// Simple activity icon alias
const IconTotalPatients = IconActivity;

interface KpiCardsProps {
  totalPatients: number;
  availableBeds: number;
  occupancyRate: number;
  averageWaitMinutes: number;
  staffAvailabilityPercent: number;
  activeAlertsCount: number;
  criticalAlertsCount: number;
  totalCapacity: number;
  totalActiveRNs: number;
  totalTargetRNs: number;
  onCardClick?: (targetTab: string) => void;
}

export const KpiCards: React.FC<KpiCardsProps> = ({
  totalPatients,
  availableBeds,
  occupancyRate,
  averageWaitMinutes,
  staffAvailabilityPercent,
  activeAlertsCount,
  criticalAlertsCount,
  totalCapacity,
  totalActiveRNs,
  totalTargetRNs,
  onCardClick,
}) => {
  const getOccupancyStatus = (rate: number) => {
    if (rate >= 90) return { type: 'critical', text: 'Critical Overcrowding' };
    if (rate >= 85) return { type: 'warning', text: 'Approaching Threshold' };
    return { type: 'success', text: 'Within Optimal Range' };
  };

  const getWaitTimeStatus = (wait: number) => {
    if (wait > 75) return { type: 'critical', text: 'Severe Queue Delay' };
    if (wait > 45) return { type: 'warning', text: 'Exceeds SLA Target' };
    return { type: 'success', text: 'Optimal Triage Flow' };
  };

  const getStaffingStatus = (pct: number) => {
    if (pct < 75) return { type: 'critical', text: 'Acute Staffing Shortage' };
    if (pct < 85) return { type: 'warning', text: 'Strained RN Coverage' };
    return { type: 'success', text: 'Adequate Workforce' };
  };

  const occStatus = getOccupancyStatus(occupancyRate);
  const waitStatus = getWaitTimeStatus(averageWaitMinutes);
  const staffStatus = getStaffingStatus(staffAvailabilityPercent);

  return (
    <div className="kpi-grid">
      {/* 1. Total Patients */}
      <div
        className="kpi-card"
        onClick={() => onCardClick && onCardClick('patient-flow')}
        role="button"
        tabIndex={0}
      >
        <div className="kpi-header">
          <span className="kpi-label">TOTAL PATIENTS</span>
          <span className="kpi-icon-wrap icon-cyan">
            <IconTotalPatients size={18} />
          </span>
        </div>
        <div className="kpi-body">
          <div className="kpi-value">{totalPatients}</div>
          <div className="kpi-subtext">
            <span>247 Inpatients · 14 ED Boarding</span>
          </div>
        </div>
        <div className="kpi-footer">
          <span className="kpi-trend trend-up">
            <IconTrendingUp size={13} /> +3.8%
          </span>
          <span className="kpi-benchmark">vs previous 12h shift</span>
        </div>
      </div>

      {/* 2. Available Beds */}
      <div
        className="kpi-card"
        onClick={() => onCardClick && onCardClick('beds')}
        role="button"
        tabIndex={0}
      >
        <div className="kpi-header">
          <span className="kpi-label">AVAILABLE BEDS</span>
          <span className="kpi-icon-wrap icon-emerald">
            <IconBeds size={18} />
          </span>
        </div>
        <div className="kpi-body">
          <div className={`kpi-value ${availableBeds <= 25 ? 'text-critical' : availableBeds <= 35 ? 'text-warning' : 'text-success'}`}>
            {availableBeds}
          </div>
          <div className="kpi-subtext">
            <span>{totalCapacity - availableBeds} of {totalCapacity} beds in use</span>
          </div>
        </div>
        <div className="kpi-footer">
          <span className={`kpi-status-badge badge-${availableBeds <= 25 ? 'critical' : 'warning'}`}>
            {availableBeds <= 25 ? 'Low Surge Reserve' : 'Limited Buffer'}
          </span>
          <span className="kpi-benchmark">Min reserve: 30 beds</span>
        </div>
      </div>

      {/* 3. Bed Occupancy Rate */}
      <div
        className={`kpi-card kpi-border-${occStatus.type}`}
        onClick={() => onCardClick && onCardClick('beds')}
        role="button"
        tabIndex={0}
      >
        <div className="kpi-header">
          <span className="kpi-label">BED OCCUPANCY RATE</span>
          <span className={`kpi-icon-wrap icon-${occStatus.type === 'critical' ? 'critical' : occStatus.type === 'warning' ? 'warning' : 'cyan'}`}>
            <IconBeds size={18} />
          </span>
        </div>
        <div className="kpi-body">
          <div className={`kpi-value text-${occStatus.type === 'critical' ? 'critical' : occStatus.type === 'warning' ? 'warning' : 'cyan'}`}>
            {occupancyRate}%
          </div>
          <div className="kpi-subtext">
            <span>{occStatus.text}</span>
          </div>
        </div>
        <div className="kpi-footer">
          <span className="kpi-trend trend-up">
            <IconTrendingUp size={13} /> +2.1%
          </span>
          <span className="kpi-benchmark">Safety ceiling &lt; 85.0%</span>
        </div>
      </div>

      {/* 4. Average Waiting Time */}
      <div
        className={`kpi-card kpi-border-${waitStatus.type}`}
        onClick={() => onCardClick && onCardClick('patient-flow')}
        role="button"
        tabIndex={0}
      >
        <div className="kpi-header">
          <span className="kpi-label">AVERAGE WAITING TIME</span>
          <span className={`kpi-icon-wrap icon-${waitStatus.type === 'critical' ? 'critical' : waitStatus.type === 'warning' ? 'warning' : 'cyan'}`}>
            <IconClock size={18} />
          </span>
        </div>
        <div className="kpi-body">
          <div className={`kpi-value text-${waitStatus.type === 'critical' ? 'critical' : waitStatus.type === 'warning' ? 'warning' : 'success'}`}>
            {averageWaitMinutes}m
          </div>
          <div className="kpi-subtext">
            <span>ED triage: 58m · Imaging: 185m</span>
          </div>
        </div>
        <div className="kpi-footer">
          <span className="kpi-trend trend-up">
            <IconTrendingUp size={13} /> +13 min
          </span>
          <span className="kpi-benchmark">SLA Target &lt; 45 mins</span>
        </div>
      </div>

      {/* 5. Staff Availability */}
      <div
        className={`kpi-card kpi-border-${staffStatus.type}`}
        onClick={() => onCardClick && onCardClick('staff-resources')}
        role="button"
        tabIndex={0}
      >
        <div className="kpi-header">
          <span className="kpi-label">STAFF AVAILABILITY</span>
          <span className={`kpi-icon-wrap icon-${staffStatus.type === 'critical' ? 'critical' : staffStatus.type === 'warning' ? 'warning' : 'emerald'}`}>
            <IconStaff size={18} />
          </span>
        </div>
        <div className="kpi-body">
          <div className={`kpi-value text-${staffStatus.type === 'critical' ? 'critical' : staffStatus.type === 'warning' ? 'warning' : 'success'}`}>
            {staffAvailabilityPercent}%
          </div>
          <div className="kpi-subtext">
            <span>{totalActiveRNs} Active of {totalTargetRNs} Required RNs</span>
          </div>
        </div>
        <div className="kpi-footer">
          <span className={`kpi-status-badge badge-${staffStatus.type}`}>
            {staffStatus.text}
          </span>
          <span className="kpi-benchmark">Min target: 85%</span>
        </div>
      </div>

      {/* 6. Active Alerts */}
      <div
        className="kpi-card kpi-border-critical"
        onClick={() => onCardClick && onCardClick('alerts')}
        role="button"
        tabIndex={0}
      >
        <div className="kpi-header">
          <span className="kpi-label">ACTIVE ALERTS</span>
          <span className="kpi-icon-wrap icon-critical">
            <IconAlerts size={18} />
          </span>
        </div>
        <div className="kpi-body">
          <div className="kpi-value text-critical">{activeAlertsCount}</div>
          <div className="kpi-subtext">
            <span className="text-critical">{criticalAlertsCount} Critical</span> · {activeAlertsCount - criticalAlertsCount} Warning
          </div>
        </div>
        <div className="kpi-footer">
          <span className="kpi-status-badge badge-critical">Attention Needed</span>
          <span className="kpi-benchmark">Click to triage</span>
        </div>
      </div>
    </div>
  );
};

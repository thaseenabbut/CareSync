import React, { useState } from 'react';
import {
  IconMenu,
  IconRefresh,
  IconAlerts,
  IconUser,
} from './Icons';
import { DashboardNavTab } from './Sidebar';

interface TopNavProps {
  activeTab: DashboardNavTab;
  onNavigateToTab: (tab: DashboardNavTab) => void;
  onRefresh: () => void;
  isLoading: boolean;
  totalAlertsCount: number;
  criticalAlertsCount: number;
  onToggleMobileMenu: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  activeTab,
  onNavigateToTab,
  onRefresh,
  isLoading,
  totalAlertsCount,
  criticalAlertsCount,
  onToggleMobileMenu,
}) => {
  const [showNotifications, setShowNotifications] = useState<boolean>(false);

  const getPageTitle = (tab: DashboardNavTab) => {
    switch (tab) {
      case 'overview':
        return {
          title: 'Hospital Operations Command Centre',
          subtitle: 'Live multi-wing operational telemetry, throughput velocity, and AI bottleneck tracking',
        };
      case 'patient-flow':
        return {
          title: 'Patient Flow Dynamics',
          subtitle: 'Admissions velocity, acute emergency intake, and discharge clearance trends',
        };
      case 'beds':
        return {
          title: 'Bed Inventory & Capacity Management',
          subtitle: 'Unit-by-unit census tracking, ICU saturation limits, and discharge delays',
        };
      case 'staff-resources':
        return {
          title: 'Workforce Staffing & Resource Utilization',
          subtitle: 'Nurse-to-patient acuity ratios, operating suites, and diagnostic equipment workloads',
        };
      case 'ai':
        return {
          title: 'AI Operational Intelligence & Root Cause',
          subtitle: 'Google Gemini synthesis of hospital bottlenecks and actionable intervention plans',
        };
      case 'alerts':
        return {
          title: 'Operational Alert Console',
          subtitle: 'Triage critical threshold breaches, warning escalations, and system event logs',
        };
      case 'simulator':
        return {
          title: 'Interactive Operational Simulator',
          subtitle: 'Model float nurse deployments, machine restorations, and accelerated discharge scenarios',
        };
      default:
        return {
          title: 'CareSync Command Centre',
          subtitle: 'AI-Powered Hospital Operations Intelligence',
        };
    }
  };

  const { title, subtitle } = getPageTitle(activeTab);

  return (
    <header className="command-top-nav">
      {/* Left Column: Menu Button (Mobile) + Page Header */}
      <div className="top-nav-left">
        <button
          className="mobile-menu-trigger"
          onClick={onToggleMobileMenu}
          aria-label="Toggle navigation menu"
        >
          <IconMenu size={20} />
        </button>

        <div className="page-header-text">
          <div className="page-title-row">
            <h1 className="page-main-title">{title}</h1>
            <span className="live-pill">
              <span className="live-dot" />
              LIVE TELEMETRY
            </span>
          </div>
          <p className="page-subtitle-text">{subtitle}</p>
        </div>
      </div>

      {/* Right Column: Controls, Demo Badge, Notifications, Admin Profile */}
      <div className="top-nav-right">
        {/* Demo Data Indicator */}
        <div className="demo-indicator-pill" title="Telemetry generated from verified deterministic hospital operational models">
          <span className="demo-pulse-ring" />
          <span className="demo-dot" />
          <span className="demo-text">Simulated Telemetry</span>
        </div>

        {/* Notifications Icon with active alerts badge */}
        <div className="notification-wrapper">
          <button
            className={`icon-action-btn ${showNotifications ? 'active' : ''}`}
            onClick={() => setShowNotifications(!showNotifications)}
            title="Operational Alerts"
          >
            <IconAlerts size={18} />
            {totalAlertsCount > 0 && (
              <span className={`alert-badge-count ${criticalAlertsCount > 0 ? 'badge-crit' : 'badge-warn'}`}>
                {totalAlertsCount}
              </span>
            )}
          </button>

          {/* Quick Notifications Popover */}
          {showNotifications && (
            <div className="notifications-popover">
              <div className="popover-header">
                <span className="popover-title">Active Operational Alerts ({totalAlertsCount})</span>
                <button
                  className="popover-link-btn"
                  onClick={() => {
                    setShowNotifications(false);
                    onNavigateToTab('alerts');
                  }}
                >
                  View Console →
                </button>
              </div>

              <div className="popover-list">
                <div
                  className="popover-item item-critical"
                  onClick={() => {
                    setShowNotifications(false);
                    onNavigateToTab('beds');
                  }}
                >
                  <div className="popover-item-header">
                    <span className="popover-badge badge-crit">CRITICAL</span>
                    <span className="popover-time">8m ago</span>
                  </div>
                  <div className="popover-item-title">ICU Approaching Capacity (95.8%)</div>
                  <div className="popover-item-desc">Only 1 ICU bed available. Immediate risk of acute diversion.</div>
                </div>

                <div
                  className="popover-item item-critical"
                  onClick={() => {
                    setShowNotifications(false);
                    onNavigateToTab('beds');
                  }}
                >
                  <div className="popover-item-header">
                    <span className="popover-badge badge-crit">CRITICAL</span>
                    <span className="popover-time">14m ago</span>
                  </div>
                  <div className="popover-item-title">14 Patients Boarding in ED</div>
                  <div className="popover-item-desc">Emergency beds held by admitted patients awaiting inpatient transfer.</div>
                </div>

                <div
                  className="popover-item item-warning"
                  onClick={() => {
                    setShowNotifications(false);
                    onNavigateToTab('staff-resources');
                  }}
                >
                  <div className="popover-item-header">
                    <span className="popover-badge badge-warn">WARNING</span>
                    <span className="popover-time">35m ago</span>
                  </div>
                  <div className="popover-item-title">CT Scanner #3 Offline</div>
                  <div className="popover-item-desc">Queue delay reached 185 min with 19 pending orders.</div>
                </div>
              </div>

              <div className="popover-footer">
                <button
                  className="popover-all-btn"
                  onClick={() => {
                    setShowNotifications(false);
                    onNavigateToTab('alerts');
                  }}
                >
                  Open Comprehensive Alert Center
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sync / Refresh Button */}
        <button
          className="sync-action-btn"
          onClick={onRefresh}
          disabled={isLoading}
          title="Synchronize real-time operational telemetry"
        >
          <IconRefresh size={16} className={isLoading ? 'spin-animation' : ''} />
          <span>{isLoading ? 'Syncing...' : 'Sync'}</span>
        </button>

        {/* Administrator Profile */}
        <div className="admin-profile-pill">
          <div className="admin-avatar">
            <IconUser size={16} />
          </div>
          <div className="admin-info">
            <span className="admin-name">Dr. Sarah Chen</span>
            <span className="admin-role">Chief Medical Ops</span>
          </div>
        </div>
      </div>
    </header>
  );
};

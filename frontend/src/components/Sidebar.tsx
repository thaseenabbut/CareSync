import React from 'react';
import {
  IconOverview,
  IconPatientFlow,
  IconBeds,
  IconStaff,
  IconAi,
  IconAlerts,
  IconSimulator,
  IconSettings,
} from './Icons';
import { HealthStatus } from '../types';

export type DashboardNavTab =
  | 'overview'
  | 'patient-flow'
  | 'beds'
  | 'staff-resources'
  | 'ai'
  | 'alerts'
  | 'simulator';

interface SidebarProps {
  activeTab: DashboardNavTab;
  onSelectTab: (tab: DashboardNavTab) => void;
  onOpenSettings: () => void;
  criticalAlertsCount: number;
  totalAlertsCount: number;
  health: HealthStatus | null;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  onOpenSettings,
  criticalAlertsCount,
  totalAlertsCount,
  health,
  isOpenMobile,
  onCloseMobile,
}) => {
  const isHealthy = health?.status === 'healthy';
  const isDemo = health?.status === 'demo_mode';

  const navItems = [
    {
      id: 'overview' as const,
      label: 'Overview',
      icon: <IconOverview size={18} />,
    },
    {
      id: 'patient-flow' as const,
      label: 'Patient Flow',
      icon: <IconPatientFlow size={18} />,
    },
    {
      id: 'beds' as const,
      label: 'Bed Management',
      icon: <IconBeds size={18} />,
      badge: '95.8% ICU',
      badgeType: 'critical',
    },
    {
      id: 'staff-resources' as const,
      label: 'Staff & Resources',
      icon: <IconStaff size={18} />,
      badge: '84% Cover',
      badgeType: 'warning',
    },
    {
      id: 'ai' as const,
      label: 'AI Insights',
      icon: <IconAi size={18} />,
      badge: 'Gemini',
      badgeType: 'cyan',
    },
    {
      id: 'alerts' as const,
      label: 'Alerts',
      icon: <IconAlerts size={18} />,
      badge: criticalAlertsCount > 0 ? `${criticalAlertsCount} Crit` : `${totalAlertsCount}`,
      badgeType: criticalAlertsCount > 0 ? 'critical' : 'warning',
    },
    {
      id: 'simulator' as const,
      label: 'Scenario Simulator',
      icon: <IconSimulator size={18} />,
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div className="sidebar-backdrop" onClick={onCloseMobile} />
      )}

      <aside className={`dashboard-sidebar ${isOpenMobile ? 'sidebar-open-mobile' : ''}`}>
        {/* Brand Header */}
        <div className="sidebar-brand">
          <div className="brand-logo-mark">
            <span className="brand-dot-pulse" />
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M2 17L12 22L22 17" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M2 12L12 17L22 12" stroke="#34D399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="brand-copy">
            <span className="brand-app-name">CareSync</span>
            <span className="brand-app-sub">AI Command Centre</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="sidebar-nav">
          <div className="nav-section-label">OPERATIONS</div>
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                className={`sidebar-nav-item ${isActive ? 'nav-item-active' : ''}`}
                onClick={() => {
                  onSelectTab(item.id);
                  onCloseMobile();
                }}
              >
                <span className="nav-item-icon">{item.icon}</span>
                <span className="nav-item-text">{item.label}</span>
                {item.badge && (
                  <span className={`nav-item-badge badge-${item.badgeType}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="nav-section-label mt-4">SYSTEM</div>
          <button
            className="sidebar-nav-item"
            onClick={() => {
              onOpenSettings();
              onCloseMobile();
            }}
          >
            <span className="nav-item-icon">
              <IconSettings size={18} />
            </span>
            <span className="nav-item-text">Settings</span>
          </button>
        </nav>

        {/* Sidebar Footer System Status Card */}
        <div className="sidebar-footer">
          <div className="system-status-card">
            <div className="status-header">
              <span className={`status-beacon ${isHealthy ? 'beacon-green' : isDemo ? 'beacon-cyan' : 'beacon-amber'}`} />
              <span className="status-name">
                {isHealthy ? 'Backend Active' : isDemo ? 'Demo Telemetry' : 'Connecting...'}
              </span>
            </div>
            <div className="status-facility">Metro General Hospital</div>
            <div className="status-meta">
              <span>Model: {health?.ai?.model || 'Gemini 3.5'}</span>
              <span className="status-ping">100% SLA</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

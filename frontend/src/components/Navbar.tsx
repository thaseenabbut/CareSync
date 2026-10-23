import React from 'react';
import { HealthStatus } from '../types';

export type ActiveTab = 'overview' | 'beds' | 'diagnostics' | 'staffing' | 'ai' | 'simulator';

interface NavbarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  health: HealthStatus | null;
  bottleneckCount: number;
  onRefresh: () => void;
  isLoading: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  health,
  bottleneckCount,
  onRefresh,
  isLoading,
}) => {
  const isHealthy = health?.status === 'healthy';
  const isAiReady = Boolean(health?.ai?.configured);

  return (
    <header className="navbar">
      <div className="navbar-brand">
        <div className="brand-logo">
          <span className="brand-icon">🏥</span>
          <div className="brand-text">
            <span className="brand-title">CareSync</span>
            <span className="brand-badge">Simulated Operations</span>
          </div>
        </div>

        <div className="system-pill">
          <span className={`pill-dot ${isHealthy ? 'dot-green' : 'dot-red'}`} />
          <span className="pill-label">
            {isHealthy ? 'Backend Connected' : 'Connecting...'}
          </span>
          {isAiReady && (
            <span className="ai-status-tag">
              ⚡ {health?.ai?.model || 'Gemini'}
            </span>
          )}
        </div>
      </div>

      <nav className="navbar-nav">
        <button
          className={`nav-tab ${activeTab === 'overview' ? 'tab-active' : ''}`}
          onClick={() => onSelectTab('overview')}
        >
          Overview
        </button>
        <button
          className={`nav-tab ${activeTab === 'beds' ? 'tab-active' : ''}`}
          onClick={() => onSelectTab('beds')}
        >
          Beds &amp; Units
        </button>
        <button
          className={`nav-tab ${activeTab === 'diagnostics' ? 'tab-active' : ''}`}
          onClick={() => onSelectTab('diagnostics')}
        >
          Diagnostics &amp; Discharges
        </button>
        <button
          className={`nav-tab ${activeTab === 'staffing' ? 'tab-active' : ''}`}
          onClick={() => onSelectTab('staffing')}
        >
          Staffing
        </button>
        <button
          className={`nav-tab nav-tab-ai ${activeTab === 'ai' ? 'tab-active' : ''}`}
          onClick={() => onSelectTab('ai')}
        >
          <span>AI Intelligence</span>
          {bottleneckCount > 0 && (
            <span className="tab-alert-badge">{bottleneckCount}</span>
          )}
        </button>
        <button
          className={`nav-tab nav-tab-sim ${activeTab === 'simulator' ? 'tab-active' : ''}`}
          onClick={() => onSelectTab('simulator')}
        >
          Scenario Simulator
        </button>
      </nav>

      <div className="navbar-actions">
        <button
          className="refresh-btn"
          onClick={onRefresh}
          disabled={isLoading}
          title="Refresh metrics from backend"
        >
          <span className={isLoading ? 'spin-icon' : ''}>↻</span>
          <span>{isLoading ? 'Updating...' : 'Sync'}</span>
        </button>
      </div>
    </header>
  );
};

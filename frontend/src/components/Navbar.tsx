import React, { useState } from 'react';
import { HealthStatus } from '../types';
import { getActiveApiBase, setActiveApiBase } from '../lib/api';

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
  const [showSettings, setShowSettings] = useState(false);
  const [customUrl, setCustomUrl] = useState(getActiveApiBase());

  const isHealthy = health?.status === 'healthy';
  const isDemo = health?.status === 'demo_mode';
  const isAiReady = Boolean(health?.ai?.configured);

  const handleSaveUrl = () => {
    setActiveApiBase(customUrl);
    setShowSettings(false);
    onRefresh();
  };

  const handleResetUrl = () => {
    setActiveApiBase(null);
    setCustomUrl('/api');
    setShowSettings(false);
    onRefresh();
  };

  return (
    <header className="navbar">
      <div className="navbar-brand">
        <div className="brand-logo">
          <div className="brand-text">
            <span className="brand-title">CareSync</span>
            <span className="brand-badge">Simulated Operations</span>
          </div>
        </div>

        <div className="system-pill">
          <span
            className={`pill-dot ${
              isHealthy ? 'dot-green' : isDemo ? 'dot-amber' : 'dot-red'
            }`}
          />
          <span className="pill-label">
            {isHealthy
              ? 'Backend Connected'
              : isDemo
              ? 'Demo Mode (Offline)'
              : 'Connecting...'}
          </span>
          {isAiReady && (
            <span className="ai-status-tag">
              {health?.ai?.model || 'Gemini'}
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
          className="settings-btn"
          onClick={() => setShowSettings(!showSettings)}
          title="Backend Connection Settings"
        >
          Settings
        </button>
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

      {/* Settings Modal */}
      {showSettings && (
        <div className="settings-modal-backdrop" onClick={() => setShowSettings(false)}>
          <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Backend API Configuration</h3>
              <button className="close-btn" onClick={() => setShowSettings(false)}>
                &times;
              </button>
            </div>
            <div className="modal-body">
              <p className="modal-desc">
                When deployed on static hosts like Vercel, CareSync automatically runs in{' '}
                <strong>Demo Mode</strong> with simulated hospital metrics and deterministic calculations.
              </p>
              <div className="input-group">
                <label>Backend API Base URL:</label>
                <input
                  type="text"
                  className="ops-input"
                  placeholder="e.g. http://localhost:8000/api or https://my-backend.onrender.com/api"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                />
                <span className="input-help">
                  Leave as <code>/api</code> for local Vite dev proxy, or enter your deployed FastAPI URL.
                </span>
              </div>
            </div>
            <div className="modal-footer">
              <button className="secondary-btn" onClick={handleResetUrl}>
                Reset to Default
              </button>
              <button className="primary-ai-btn" onClick={handleSaveUrl}>
                Save &amp; Connect
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

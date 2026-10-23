import React, { useState } from 'react';
import { IconClose, IconSettings } from './Icons';
import { getActiveApiBase, setActiveApiBase } from '../lib/api';
import { HealthStatus } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  health: HealthStatus | null;
  onRefresh: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  health,
  onRefresh,
}) => {
  const [customUrl, setCustomUrl] = useState<string>(getActiveApiBase());
  const [savedNotice, setSavedNotice] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSave = () => {
    setActiveApiBase(customUrl);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
    onRefresh();
  };

  const handleReset = () => {
    setActiveApiBase(null);
    setCustomUrl('/api');
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
    onRefresh();
  };

  const isHealthy = health?.status === 'healthy';

  return (
    <div className="settings-modal-backdrop" onClick={onClose}>
      <div className="settings-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="settings-modal-header">
          <div className="header-title-row">
            <IconSettings size={20} className="header-icon" />
            <h3>Command Centre &amp; API Configuration</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <IconClose size={18} />
          </button>
        </div>

        <div className="settings-modal-body">
          {/* Telemetry Status Card */}
          <div className="system-health-banner">
            <div className="banner-left">
              <span className={`status-circle ${isHealthy ? 'circle-green' : 'circle-cyan'}`} />
              <div>
                <strong>Current Status: {isHealthy ? 'FastAPI Backend Online' : 'Simulated Operations Mode (Zero-Crash Fallback)'}</strong>
                <p className="health-sub">
                  Provider: {health?.ai?.provider || 'Google Gemini'} · Model: {health?.ai?.model || 'gemini-3.5-flash'}
                </p>
              </div>
            </div>
          </div>

          <p className="settings-desc">
            CareSync automatically runs with full deterministic fidelity and interactive simulation on static hosting deployments.
            To connect a custom live FastAPI backend or remote server instance, enter the base URL below.
          </p>

          <div className="setting-input-group">
            <label htmlFor="api-base-input">Backend API Base URL</label>
            <input
              id="api-base-input"
              type="text"
              className="ops-input-field"
              placeholder="e.g. http://localhost:8000/api or https://my-backend.onrender.com/api"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
            />
            <span className="setting-help-text">
              Default is <code>/api</code> (uses Vite reverse proxy in development). Leave blank or reset to restore default.
            </span>
          </div>

          {savedNotice && (
            <div className="save-success-alert">
              ✓ API endpoint configuration saved. Refreshing live telemetry...
            </div>
          )}
        </div>

        <div className="settings-modal-footer">
          <button className="btn-secondary" onClick={handleReset}>
            Reset to Default
          </button>
          <div className="footer-actions-right">
            <button className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button className="btn-primary-cyan" onClick={handleSave}>
              Save &amp; Connect
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

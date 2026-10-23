import { useState, useEffect, useCallback } from 'react';
import './App.css';
import { fetchExplainInsights, fetchHealth, fetchMetrics } from './lib/api';
import {
  ExplainResponse,
  HealthStatus,
  HospitalOperationalSnapshot,
} from './types';
import { Sidebar, DashboardNavTab } from './components/Sidebar';
import { TopNav } from './components/TopNav';
import { OverviewTab } from './components/OverviewTab';
import { PatientFlowTab } from './components/PatientFlowTab';
import { BedsTab } from './components/BedsTab';
import { StaffingTab } from './components/StaffingTab';
import { AiInsightsPanel } from './components/AiInsightsPanel';
import { AlertsSection } from './components/AlertsSection';
import { SimulatorTab } from './components/SimulatorTab';
import { SettingsModal } from './components/SettingsModal';
import { deriveDashboardData } from './lib/mockData';

function App() {
  const [activeTab, setActiveTab] = useState<DashboardNavTab>('overview');
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [metrics, setMetrics] = useState<HospitalOperationalSnapshot | null>(null);
  const [insights, setInsights] = useState<ExplainResponse | null>(null);

  const [isLoadingMetrics, setIsLoadingMetrics] = useState<boolean>(true);
  const [isLoadingAi, setIsLoadingAi] = useState<boolean>(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Load initial health and metrics
  const loadInitialData = useCallback(async () => {
    setIsLoadingMetrics(true);
    setGlobalError(null);
    try {
      const [h, m] = await Promise.all([fetchHealth(), fetchMetrics()]);
      setHealth(h);
      setMetrics(m);
    } catch (err: any) {
      setGlobalError(err.message || 'Failed to connect to CareSync backend.');
    } finally {
      setIsLoadingMetrics(false);
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Trigger AI analysis on demand
  const handleRequestInsights = async (bottleneckId?: string) => {
    setIsLoadingAi(true);
    try {
      const targetIds = bottleneckId ? [bottleneckId] : undefined;
      const data = await fetchExplainInsights(targetIds);
      setInsights(data);
    } catch (err: any) {
      setInsights({
        status: 'error',
        verified_bottlenecks_analyzed: metrics?.active_bottlenecks || [],
        explanations: [],
        error_message: err.message || 'Failed to contact AI service.',
        disclaimer:
          'CareSync AI suggestions are based on simulated data and must be verified by hospital staff.',
      });
    } finally {
      setIsLoadingAi(false);
    }
  };

  const dashboardData = metrics ? deriveDashboardData(metrics) : null;
  const criticalCount = dashboardData?.kpis.criticalAlertsCount || 0;
  const totalAlerts = dashboardData?.alerts.length || 0;

  return (
    <div className="command-centre-layout">
      {/* 1. Left Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenSettings={() => setIsSettingsOpen(true)}
        criticalAlertsCount={criticalCount}
        totalAlertsCount={totalAlerts}
        health={health}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* 2. Main Command Centre Body */}
      <div className="command-centre-main">
        {/* Top Navigation Bar */}
        <TopNav
          activeTab={activeTab}
          onNavigateToTab={setActiveTab}
          onRefresh={loadInitialData}
          isLoading={isLoadingMetrics}
          totalAlertsCount={totalAlerts}
          criticalAlertsCount={criticalCount}
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />

        {/* Global Connection Error Callout */}
        {globalError && (
          <div className="alert-callout-box box-critical m-6 mb-0">
            <div>
              <strong>Telemetry Service Notice:</strong> {globalError}
              <p className="subtext">
                CareSync is operating safely with full deterministic simulation models.
              </p>
            </div>
          </div>
        )}

        {/* Content Viewport */}
        <main className="command-viewport">
          {isLoadingMetrics && !metrics && (
            <div className="loading-viewport">
              <div className="command-spinner" />
              <h3>Initializing Hospital Command Centre Telemetry...</h3>
              <p>Establishing encrypted link with facility census &amp; telemetry streams</p>
            </div>
          )}

          {metrics && (
            <>
              {activeTab === 'overview' && (
                <OverviewTab
                  metrics={metrics}
                  insights={insights}
                  isLoadingAi={isLoadingAi}
                  onRequestInsights={handleRequestInsights}
                  onNavigateToTab={setActiveTab}
                />
              )}

              {activeTab === 'patient-flow' && (
                <PatientFlowTab
                  metrics={metrics}
                  onNavigateToTab={setActiveTab}
                />
              )}

              {activeTab === 'beds' && (
                <BedsTab
                  metrics={metrics}
                  onNavigateToTab={setActiveTab}
                />
              )}

              {activeTab === 'staff-resources' && (
                <StaffingTab
                  metrics={metrics}
                  onNavigateToTab={setActiveTab}
                />
              )}

              {activeTab === 'ai' && (
                <div className="tab-container">
                  <AiInsightsPanel
                    bottlenecks={metrics.active_bottlenecks}
                    insights={insights}
                    isLoading={isLoadingAi}
                    onRequestInsights={handleRequestInsights}
                    onNavigateToTab={setActiveTab}
                  />
                </div>
              )}

              {activeTab === 'alerts' && (
                <div className="tab-container">
                  <AlertsSection
                    alerts={dashboardData?.alerts || []}
                    onTriggerAi={handleRequestInsights}
                    onNavigateToTab={setActiveTab}
                  />
                </div>
              )}

              {activeTab === 'simulator' && <SimulatorTab />}
            </>
          )}
        </main>

        {/* Bottom Operations Footer */}
        <footer className="command-footer">
          <div className="footer-left">
            <span className="dot dot-cyan" />
            <span>CareSync Operations Intelligence · Palette 2: Midnight Navy &amp; Cyan</span>
          </div>
          <div className="footer-right">
            <span>Simulated Telemetry · Non-Clinical Decision Support Only</span>
          </div>
        </footer>
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        health={health}
        onRefresh={loadInitialData}
      />
    </div>
  );
}

export default App;

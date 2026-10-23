import { useState, useEffect, useCallback } from 'react';
import './App.css';
import { fetchExplainInsights, fetchHealth, fetchMetrics } from './lib/api';
import {
  ExplainResponse,
  HealthStatus,
  HospitalOperationalSnapshot,
} from './types';
import { Navbar, ActiveTab } from './components/Navbar';
import { OverviewTab } from './components/OverviewTab';
import { BedsTab } from './components/BedsTab';
import { DiagnosticsTab } from './components/DiagnosticsTab';
import { StaffingTab } from './components/StaffingTab';
import { AiInsightsTab } from './components/AiInsightsTab';
import { SimulatorTab } from './components/SimulatorTab';

function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [metrics, setMetrics] = useState<HospitalOperationalSnapshot | null>(null);
  const [insights, setInsights] = useState<ExplainResponse | null>(null);

  const [isLoadingMetrics, setIsLoadingMetrics] = useState<boolean>(true);
  const [isLoadingAi, setIsLoadingAi] = useState<boolean>(false);
  const [selectedBottleneckId, setSelectedBottleneckId] = useState<string | undefined>(undefined);
  const [globalError, setGlobalError] = useState<string | null>(null);

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

  // Quick navigation from banner or card to AI tab
  const handleTriggerAiFromOtherTab = (bottleneckId?: string) => {
    setSelectedBottleneckId(bottleneckId);
    setActiveTab('ai');
    handleRequestInsights(bottleneckId);
  };

  return (
    <div className="shell">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        health={health}
        bottleneckCount={metrics?.active_bottlenecks.length || 0}
        onRefresh={loadInitialData}
        isLoading={isLoadingMetrics}
      />

      {/* Main Content Area */}
      <main className="main-content">
        {globalError && (
          <div className="alert-callout callout-critical">
            <div>
              <strong>Connection Error:</strong> {globalError}
              <p className="subtext">
                Ensure the FastAPI backend is running on port 8000 (<code>uvicorn main:app --port 8000</code>).
              </p>
            </div>
          </div>
        )}

        {isLoadingMetrics && !metrics && (
          <div className="loading-screen">
            <div className="ai-loading-spinner" />
            <p>Loading real-time hospital operational snapshot...</p>
          </div>
        )}

        {metrics && (
          <>
            {activeTab === 'overview' && (
              <OverviewTab
                metrics={metrics}
                onNavigateToTab={setActiveTab}
                onTriggerAi={handleTriggerAiFromOtherTab}
              />
            )}

            {activeTab === 'beds' && <BedsTab metrics={metrics} />}

            {activeTab === 'diagnostics' && <DiagnosticsTab metrics={metrics} />}

            {activeTab === 'staffing' && <StaffingTab metrics={metrics} />}

            {activeTab === 'ai' && (
              <AiInsightsTab
                bottlenecks={metrics.active_bottlenecks}
                insights={insights}
                isLoading={isLoadingAi}
                onRequestInsights={handleRequestInsights}
                selectedBottleneckId={selectedBottleneckId}
                onSelectBottleneckId={setSelectedBottleneckId}
              />
            )}

            {activeTab === 'simulator' && <SimulatorTab />}
          </>
        )}
      </main>

      {/* Global Disclaimer Footer */}
      <footer className="shell-footer">
        <div className="footer-content">
          <p>
            <strong>CareSync Prototype:</strong> Operational decision-support platform using clearly labeled simulated data.
            AI-generated recommendations by Google Gemini are advisory logistical suggestions for staff review, not clinically validated,
            and do NOT substitute for clinical judgment, medical diagnosis, or patient care decisions.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;

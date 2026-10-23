import { useState, useEffect } from 'react';

interface HealthStatus {
  status: string;
  service: string;
  version: string;
}

function App() {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/health')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: HealthStatus) => setHealth(data))
      .catch((err: Error) => setError(err.message));
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <div className="logo">
          <span className="logo-icon">🏥</span>
          <h1>CareSync</h1>
        </div>
        <p className="subtitle">Hospital Operations Intelligence</p>
      </header>

      <main className="app-main">
        <div className="status-card">
          <h2>System Status</h2>
          {error && (
            <div className="status-indicator status-error">
              <span className="status-dot" />
              <span>Backend unreachable: {error}</span>
            </div>
          )}
          {health && (
            <div className="status-indicator status-ok">
              <span className="status-dot" />
              <span>
                {health.service} v{health.version} — {health.status}
              </span>
            </div>
          )}
          {!health && !error && (
            <div className="status-indicator status-loading">
              <span className="status-dot" />
              <span>Connecting to backend…</span>
            </div>
          )}
        </div>

        <div className="placeholder-grid">
          <div className="placeholder-card">
            <div className="placeholder-icon">📊</div>
            <h3>Operational Metrics</h3>
            <p>Real-time hospital KPIs</p>
          </div>
          <div className="placeholder-card">
            <div className="placeholder-icon">🛏️</div>
            <h3>Bed Management</h3>
            <p>Occupancy &amp; availability tracking</p>
          </div>
          <div className="placeholder-card">
            <div className="placeholder-icon">🧠</div>
            <h3>AI Insights</h3>
            <p>Bottleneck analysis &amp; recommendations</p>
          </div>
          <div className="placeholder-card">
            <div className="placeholder-icon">⚗️</div>
            <h3>Scenario Simulator</h3>
            <p>Explore hypothetical changes</p>
          </div>
        </div>
      </main>

      <footer className="app-footer">
        <p>
          ⚠️ This is an operational decision-support prototype using simulated
          data. Not for clinical use. AI recommendations are not clinically
          validated.
        </p>
      </footer>
    </div>
  );
}

export default App;

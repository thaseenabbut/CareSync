import { useState, useEffect } from 'react';
import './App.css';

interface HealthStatus {
  status: string;
  service: string;
  version: string;
}

function StatusDot({ state }: { state: 'ok' | 'error' | 'loading' }) {
  return <span className={`dot ${state}`} />;
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
    <div className="shell">
      <header>
        <h1>CareSync</h1>
        <span className="tag">Operations Intelligence</span>
      </header>

      <main>
        <section className="status">
          <h2>System</h2>
          {error && (
            <p className="status-line error">
              <StatusDot state="error" />
              Backend unreachable — {error}
            </p>
          )}
          {health && (
            <p className="status-line ok">
              <StatusDot state="ok" />
              {health.service} v{health.version}
            </p>
          )}
          {!health && !error && (
            <p className="status-line loading">
              <StatusDot state="loading" />
              Connecting…
            </p>
          )}
        </section>

        <section className="modules">
          <div className="card">
            <h3>Metrics</h3>
            <p>Operational KPIs across departments</p>
          </div>
          <div className="card">
            <h3>Beds</h3>
            <p>Occupancy and discharge tracking</p>
          </div>
          <div className="card">
            <h3>Insights</h3>
            <p>Bottleneck detection and analysis</p>
          </div>
          <div className="card">
            <h3>Scenarios</h3>
            <p>Model hypothetical operational changes</p>
          </div>
        </section>
      </main>

      <footer>
        <p>
          Decision-support prototype · Simulated data · AI outputs are not
          clinically validated
        </p>
      </footer>
    </div>
  );
}

export default App;

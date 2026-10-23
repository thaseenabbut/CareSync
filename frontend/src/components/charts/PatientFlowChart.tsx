import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { PatientFlowPoint } from '../../types';

interface PatientFlowChartProps {
  hourlyData: PatientFlowPoint[];
  dailyData: PatientFlowPoint[];
}

export const PatientFlowChart: React.FC<PatientFlowChartProps> = ({
  hourlyData,
  dailyData,
}) => {
  const [viewMode, setViewMode] = useState<'hourly' | 'daily'>('hourly');
  const data = viewMode === 'hourly' ? hourlyData : dailyData;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="chart-tooltip">
          <div className="tooltip-title">
            {viewMode === 'hourly' ? `Timeline: ${label}` : `Day: ${label}`}
          </div>
          <div className="tooltip-items">
            {payload.map((item: any) => (
              <div key={item.dataKey} className="tooltip-row">
                <span className="tooltip-indicator" style={{ backgroundColor: item.color }} />
                <span className="tooltip-name">{item.name}:</span>
                <span className="tooltip-value">{item.value} patients</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="chart-card">
      <div className="chart-card-header">
        <div>
          <div className="chart-title-row">
            <h3 className="chart-title">Patient Flow Dynamics</h3>
            <span className="chart-badge">Admissions vs Discharges vs Emergency</span>
          </div>
          <p className="chart-subtitle">
            Real-time patient census movement across the hospital. Distinguishes planned admissions from acute arrivals.
          </p>
        </div>

        <div className="chart-controls">
          <div className="toggle-group">
            <button
              className={`toggle-btn ${viewMode === 'hourly' ? 'active' : ''}`}
              onClick={() => setViewMode('hourly')}
            >
              Hourly (24h)
            </button>
            <button
              className={`toggle-btn ${viewMode === 'daily' ? 'active' : ''}`}
              onClick={() => setViewMode('daily')}
            >
              Daily (7 Days)
            </button>
          </div>
        </div>
      </div>

      <div className="chart-body" style={{ height: 320, width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 16, right: 24, left: 8, bottom: 8 }}>
            <CartesianGrid stroke="#263449" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="timeLabel"
              stroke="#94A3B8"
              tick={{ fill: '#94A3B8', fontSize: 12 }}
              tickLine={{ stroke: '#263449' }}
            />
            <YAxis
              width={38}
              stroke="#94A3B8"
              tick={{ fill: '#94A3B8', fontSize: 12 }}
              tickLine={{ stroke: '#263449' }}
              domain={[0, 'auto']}
              unit=""
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: '10px' }}
              iconType="circle"
              formatter={(val) => <span style={{ color: '#E5EDF7', fontSize: 13, marginRight: 14 }}>{val}</span>}
            />

            {/* Cyan: Admissions */}
            <Line
              type="monotone"
              dataKey="admissions"
              name="Admissions"
              stroke="#38BDF8"
              strokeWidth={2.5}
              dot={{ r: 3, fill: '#38BDF8' }}
              activeDot={{ r: 6, fill: '#38BDF8', stroke: '#0B1220', strokeWidth: 2 }}
            />

            {/* Emerald: Discharges */}
            <Line
              type="monotone"
              dataKey="discharges"
              name="Discharges"
              stroke="#34D399"
              strokeWidth={2.5}
              dot={{ r: 3, fill: '#34D399' }}
              activeDot={{ r: 6, fill: '#34D399', stroke: '#0B1220', strokeWidth: 2 }}
            />

            {/* Violet: Emergency Arrivals */}
            <Line
              type="monotone"
              dataKey="emergencyArrivals"
              name="Emergency Arrivals"
              stroke="#818CF8"
              strokeWidth={2.5}
              strokeDasharray="4 2"
              dot={{ r: 3, fill: '#818CF8' }}
              activeDot={{ r: 6, fill: '#818CF8', stroke: '#0B1220', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-footer-metrics">
        <div className="footer-metric-pill">
          <span className="dot dot-cyan" />
          <span className="label">Admissions Velocity:</span>
          <strong>{viewMode === 'hourly' ? '18/hr peak' : '396/week'}</strong>
        </div>
        <div className="footer-metric-pill">
          <span className="dot dot-emerald" />
          <span className="label">Discharge Clearance:</span>
          <strong>{viewMode === 'hourly' ? '20/hr peak' : '371/week'}</strong>
        </div>
        <div className="footer-metric-pill">
          <span className="dot dot-violet" />
          <span className="label">Emergency Intake:</span>
          <strong>{viewMode === 'hourly' ? '26/hr peak' : '523/week'}</strong>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from 'recharts';
import { StaffAvailabilityItem } from '../../types';

interface StaffAvailabilityChartProps {
  data: StaffAvailabilityItem[];
}

export const StaffAvailabilityChart: React.FC<StaffAvailabilityChartProps> = ({ data }) => {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item: StaffAvailabilityItem = payload[0].payload;
      const gap = item.requiredStaff - item.availableStaff;

      return (
        <div className="chart-tooltip">
          <div className="tooltip-title">{item.department}</div>
          <div className="tooltip-row mt-2">
            <span className="tooltip-name">Active Staff (RNs):</span>
            <strong className="text-cyan">{item.availableStaff} active</strong>
          </div>
          <div className="tooltip-row">
            <span className="tooltip-name">Required Roster:</span>
            <span className="tooltip-value">{item.requiredStaff} target</span>
          </div>
          <div className="tooltip-row">
            <span className="tooltip-name">Coverage Level:</span>
            <strong className={item.coveragePercent < 75 ? 'text-critical' : item.coveragePercent < 85 ? 'text-warning' : 'text-success'}>
              {item.coveragePercent}%
            </strong>
          </div>
          <div className="tooltip-row">
            <span className="tooltip-name">Patient/Nurse Ratio:</span>
            <span className="tooltip-value">{item.patientToStaffRatio}:1 (Target {item.targetRatio}:1)</span>
          </div>
          <div className={`tooltip-flag ${gap > 0 ? 'flag-alert' : 'flag-ok'}`}>
            {gap > 0 ? `⚠️ Deficit of ${gap} nurses on duty` : '✓ Fully staffed to target roster'}
          </div>
        </div>
      );
    }
    return null;
  };

  const getBarColor = (coveragePercent: number) => {
    if (coveragePercent < 75) return '#F87171'; // Critical shortage (red)
    if (coveragePercent < 85) return '#FBBF24'; // Strained warning (amber)
    return '#34D399'; // Adequate (emerald)
  };

  return (
    <div className="chart-card">
      <div className="chart-card-header">
        <div>
          <div className="chart-title-row">
            <h3 className="chart-title">Staff Availability &amp; Workforce Coverage</h3>
            <span className="chart-badge">Active vs Required Staff</span>
          </div>
          <p className="chart-subtitle">
            Horizontal evaluation of nursing shift staffing levels against patient acuity benchmarks.
          </p>
        </div>

        <div className="chart-legend-pills">
          <span className="legend-badge badge-critical">&lt; 75% Critical Shortage</span>
          <span className="legend-badge badge-warning">&lt; 85% Strained</span>
          <span className="legend-badge badge-normal">&ge; 85% Adequate</span>
        </div>
      </div>

      <div className="chart-body" style={{ height: 300, width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={data}
            margin={{ top: 16, right: 32, left: 10, bottom: 8 }}
            barSize={18}
          >
            <CartesianGrid stroke="#263449" strokeDasharray="3 3" horizontal={false} />
            <XAxis
              type="number"
              stroke="#94A3B8"
              tick={{ fill: '#94A3B8', fontSize: 12 }}
              tickLine={{ stroke: '#263449' }}
              unit=" RNs"
            />
            <YAxis
              type="category"
              dataKey="department"
              stroke="#94A3B8"
              tick={{ fill: '#E5EDF7', fontSize: 11 }}
              tickLine={{ stroke: '#263449' }}
              width={155}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: '10px' }}
              formatter={(val) => <span style={{ color: '#E5EDF7', fontSize: 13, marginRight: 14 }}>{val}</span>}
            />

            <Bar dataKey="availableStaff" name="Active Staff on Shift">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.coveragePercent)} />
              ))}
            </Bar>
            <Bar dataKey="requiredStaff" name="Target Required Staff" fill="#263449" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-footer-metrics">
        {data.map((item) => (
          <div key={item.department} className="footer-metric-pill">
            <span className="label">{item.department}:</span>
            <strong className={item.coveragePercent < 75 ? 'text-critical' : item.coveragePercent < 85 ? 'text-warning' : 'text-success'}>
              {item.availableStaff}/{item.requiredStaff} ({item.coveragePercent}%)
            </strong>
          </div>
        ))}
      </div>
    </div>
  );
};

import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ReferenceLine,
} from 'recharts';
import { ResourceUtilizationItem } from '../../types';

interface ResourceUtilizationChartProps {
  data: ResourceUtilizationItem[];
}

export const ResourceUtilizationChart: React.FC<ResourceUtilizationChartProps> = ({ data }) => {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item: ResourceUtilizationItem = payload[0].payload;
      return (
        <div className="chart-tooltip">
          <div className="tooltip-title">{item.resource}</div>
          <div className="tooltip-category">{item.category}</div>
          <div className="tooltip-row mt-2">
            <span className="tooltip-name">Utilization Rate:</span>
            <strong className={item.utilizationPercent >= 90 ? 'text-critical' : item.utilizationPercent >= 80 ? 'text-warning' : 'text-success'}>
              {item.utilizationPercent}%
            </strong>
          </div>
          <div className="tooltip-row">
            <span className="tooltip-name">Currently In-Service:</span>
            <span className="tooltip-value">{item.inUse} of {item.totalCapacity} {item.unit}</span>
          </div>
          <div className="tooltip-row">
            <span className="tooltip-name">Available Spare Capacity:</span>
            <span className="tooltip-value">{item.available} {item.unit}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  const getBarColor = (pct: number) => {
    if (pct >= 90) return '#F87171'; // Critical (red)
    if (pct >= 80) return '#FBBF24'; // Warning (amber)
    return '#38BDF8'; // Cyan accent for normal operational utilization
  };

  return (
    <div className="chart-card">
      <div className="chart-card-header">
        <div>
          <div className="chart-title-row">
            <h3 className="chart-title">Resource &amp; Modality Utilization</h3>
            <span className="chart-badge">Asset Utilization %</span>
          </div>
          <p className="chart-subtitle">
            Operating suites, intensive care beds, and advanced medical diagnostics active load vs reserve margin.
          </p>
        </div>

        <div className="chart-legend-pills">
          <span className="legend-badge badge-critical">&ge; 90% Near Saturation</span>
          <span className="legend-badge badge-warning">&ge; 80% High Load</span>
          <span className="legend-badge badge-normal">Balanced Load</span>
        </div>
      </div>

      <div className="chart-body" style={{ height: 300, width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 16, right: 24, left: 10, bottom: 8 }}
            barSize={28}
          >
            <CartesianGrid stroke="#263449" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="resource"
              stroke="#94A3B8"
              tick={{ fill: '#94A3B8', fontSize: 11 }}
              tickLine={{ stroke: '#263449' }}
              interval={0}
            />
            <YAxis
              width={42}
              stroke="#94A3B8"
              tick={{ fill: '#94A3B8', fontSize: 12 }}
              tickLine={{ stroke: '#263449' }}
              domain={[0, 100]}
              unit="%"
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={85} stroke="#FBBF24" strokeDasharray="3 3" label={{ value: '85% Target', fill: '#FBBF24', fontSize: 10, position: 'insideTopRight' }} />

            <Bar dataKey="utilizationPercent" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.utilizationPercent)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-footer-metrics">
        {data.map((item) => (
          <div key={item.resource} className="footer-metric-pill">
            <span className="label">{item.resource}:</span>
            <strong className={item.utilizationPercent >= 90 ? 'text-critical' : item.utilizationPercent >= 80 ? 'text-warning' : 'text-cyan'}>
              {item.utilizationPercent}%
            </strong>
          </div>
        ))}
      </div>
    </div>
  );
};

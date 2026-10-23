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
  ReferenceLine,
} from 'recharts';
import { BedDepartmentBreakdown } from '../../types';

interface BedOccupancyChartProps {
  data: BedDepartmentBreakdown[];
}

export const BedOccupancyChart: React.FC<BedOccupancyChartProps> = ({ data }) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dept = data.find((d) => d.department === label);
      return (
        <div className="chart-tooltip">
          <div className="tooltip-title">{label}</div>
          <div className="tooltip-meta">
            <span>Occupancy:</span>
            <strong className={dept?.status === 'critical' ? 'text-critical' : dept?.status === 'warning' ? 'text-warning' : 'text-cyan'}>
              {dept?.occupancyPercent}%
            </strong>
            <span className="meta-sub"> (Threshold: {dept?.threshold}%)</span>
          </div>
          <div className="tooltip-items">
            {payload.map((item: any) => (
              <div key={item.dataKey} className="tooltip-row">
                <span className="tooltip-indicator" style={{ backgroundColor: item.color }} />
                <span className="tooltip-name">{item.name}:</span>
                <span className="tooltip-value">{item.value} beds</span>
              </div>
            ))}
          </div>
          <div className="tooltip-total">
            <span>Total Capacity:</span>
            <strong>{dept?.total} beds</strong>
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
            <h3 className="chart-title">Bed Occupancy &amp; Department Capacity</h3>
            <span className="chart-badge">Stacked Census Distribution</span>
          </div>
          <p className="chart-subtitle">
            Departmental bed allocations comparing occupied, operational available, and offline turnaround beds.
          </p>
        </div>

        <div className="chart-legend-pills">
          <span className="legend-badge badge-critical">Critical &gt; 90%</span>
          <span className="legend-badge badge-warning">Warning &gt; 85%</span>
          <span className="legend-badge badge-normal">Healthy</span>
        </div>
      </div>

      <div className="chart-body" style={{ height: 320, width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 16, right: 24, left: 10, bottom: 8 }}
            barSize={32}
          >
            <CartesianGrid stroke="#263449" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="department"
              stroke="#94A3B8"
              tick={{ fill: '#94A3B8', fontSize: 11 }}
              tickLine={{ stroke: '#263449' }}
              interval={0}
            />
            <YAxis
              width={65}
              stroke="#94A3B8"
              tick={{ fill: '#94A3B8', fontSize: 11.5 }}
              tickLine={{ stroke: '#263449' }}
              unit=" beds"
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: '10px' }}
              iconType="square"
              formatter={(val) => <span style={{ color: '#E5EDF7', fontSize: 13, marginRight: 14 }}>{val}</span>}
            />
            <ReferenceLine y={100} stroke="#F87171" strokeDasharray="3 3" strokeOpacity={0.4} />

            {/* Stacked Bar 1: Occupied */}
            <Bar
              dataKey="occupied"
              name="Occupied Beds"
              stackId="beds"
              fill="#38BDF8"
              radius={[0, 0, 0, 0]}
            />

            {/* Stacked Bar 2: Available */}
            <Bar
              dataKey="available"
              name="Available Beds"
              stackId="beds"
              fill="#34D399"
              radius={[0, 0, 0, 0]}
            />

            {/* Stacked Bar 3: Unavailable (Maintenance / Cleaning) */}
            <Bar
              dataKey="unavailable"
              name="Temporarily Unavailable"
              stackId="beds"
              fill="#64748B"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-dept-indicators">
        {data.map((dept) => (
          <div key={dept.department} className={`dept-pill-item status-${dept.status}`}>
            <span className="dept-name-short">{dept.department}:</span>
            <span className="dept-pct">{dept.occupancyPercent}%</span>
            <span className={`status-dot dot-${dept.status}`} />
          </div>
        ))}
      </div>
    </div>
  );
};

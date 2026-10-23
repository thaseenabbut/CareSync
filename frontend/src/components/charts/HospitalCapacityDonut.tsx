import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

interface HospitalCapacityDonutProps {
  totalCapacity: number;
  totalOccupied: number;
  totalAvailable: number;
  totalUnavailable: number;
  occupancyRate: number;
}

export const HospitalCapacityDonut: React.FC<HospitalCapacityDonutProps> = ({
  totalCapacity,
  totalOccupied,
  totalAvailable,
  totalUnavailable,
  occupancyRate,
}) => {
  const data = [
    { name: 'Occupied Beds', value: totalOccupied, color: occupancyRate >= 90 ? '#F87171' : '#38BDF8' },
    { name: 'Available Beds', value: totalAvailable, color: '#34D399' },
    { name: 'Unavailable Beds', value: totalUnavailable, color: '#64748B' },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0];
      const percent = ((item.value / totalCapacity) * 100).toFixed(1);
      return (
        <div className="chart-tooltip">
          <div className="tooltip-title">{item.name}</div>
          <div className="tooltip-row mt-2">
            <span className="tooltip-name">Count:</span>
            <strong className="text-cyan">{item.value} beds</strong>
          </div>
          <div className="tooltip-row">
            <span className="tooltip-name">Proportion:</span>
            <span className="tooltip-value">{percent}%</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="chart-card donut-card">
      <div className="chart-card-header">
        <div>
          <div className="chart-title-row">
            <h3 className="chart-title">Hospital Bed Capacity</h3>
            <span className="chart-badge">Overall Utilization</span>
          </div>
          <p className="chart-subtitle">
            Global inpatient bed inventory distribution across all hospital wings.
          </p>
        </div>
      </div>

      <div className="donut-container" style={{ position: 'relative', height: 260, width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={<CustomTooltip />} />
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={98}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="#151F32" strokeWidth={2} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Total number of beds in the chart center */}
        <div className="donut-center-content">
          <span className="donut-center-number">{totalCapacity}</span>
          <span className="donut-center-label">Total Beds</span>
          <span className={`donut-center-pct ${occupancyRate >= 90 ? 'text-critical' : occupancyRate >= 85 ? 'text-warning' : 'text-cyan'}`}>
            {occupancyRate}% Occupied
          </span>
        </div>
      </div>

      <div className="donut-legend-grid">
        <div className="donut-legend-item">
          <span className="legend-swatch" style={{ backgroundColor: occupancyRate >= 90 ? '#F87171' : '#38BDF8' }} />
          <div className="legend-info">
            <span className="legend-lbl">Occupied</span>
            <span className="legend-val">{totalOccupied} ({((totalOccupied / totalCapacity) * 100).toFixed(1)}%)</span>
          </div>
        </div>

        <div className="donut-legend-item">
          <span className="legend-swatch" style={{ backgroundColor: '#34D399' }} />
          <div className="legend-info">
            <span className="legend-lbl">Available</span>
            <span className="legend-val">{totalAvailable} ({((totalAvailable / totalCapacity) * 100).toFixed(1)}%)</span>
          </div>
        </div>

        <div className="donut-legend-item">
          <span className="legend-swatch" style={{ backgroundColor: '#64748B' }} />
          <div className="legend-info">
            <span className="legend-lbl">Unavailable</span>
            <span className="legend-val">{totalUnavailable} ({((totalUnavailable / totalCapacity) * 100).toFixed(1)}%)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

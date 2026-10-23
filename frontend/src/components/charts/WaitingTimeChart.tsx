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
import { WaitingTimeItem } from '../../types';

interface WaitingTimeChartProps {
  data: WaitingTimeItem[];
}

export const WaitingTimeChart: React.FC<WaitingTimeChartProps> = ({ data }) => {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item: WaitingTimeItem = payload[0].payload;
      const isExceeded = item.waitMinutes > item.targetMinutes;
      const delta = item.waitMinutes - item.targetMinutes;

      return (
        <div className="chart-tooltip">
          <div className="tooltip-title">{item.department}</div>
          <div className="tooltip-category">{item.category} Intake</div>
          <div className="tooltip-row mt-2">
            <span className="tooltip-name">Average Wait Time:</span>
            <strong className={item.status === 'critical' ? 'text-critical' : item.status === 'warning' ? 'text-warning' : 'text-success'}>
              {item.waitMinutes} minutes
            </strong>
          </div>
          <div className="tooltip-row">
            <span className="tooltip-name">Configured Target:</span>
            <span className="tooltip-value">{item.targetMinutes} minutes</span>
          </div>
          {item.queuedCount !== undefined && (
            <div className="tooltip-row">
              <span className="tooltip-name">Currently Queued:</span>
              <span className="tooltip-value">{item.queuedCount} patients</span>
            </div>
          )}
          <div className={`tooltip-flag ${isExceeded ? 'flag-alert' : 'flag-ok'}`}>
            {isExceeded
              ? `⚠️ Exceeds SLA benchmark by +${delta} mins`
              : '✓ Within SLA target threshold'}
          </div>
        </div>
      );
    }
    return null;
  };

  const getColor = (item: WaitingTimeItem) => {
    if (item.status === 'critical') return '#F87171'; // Critical red
    if (item.status === 'warning') return '#FBBF24'; // Warning amber
    return '#34D399'; // Success emerald
  };

  return (
    <div className="chart-card">
      <div className="chart-card-header">
        <div>
          <div className="chart-title-row">
            <h3 className="chart-title">Patient Waiting Times by Department</h3>
            <span className="chart-badge">Minutes &amp; SLA Compliance</span>
          </div>
          <p className="chart-subtitle">
            Average wait times across emergency triage, outpatient admissions, and diagnostic scan queues.
          </p>
        </div>

        <div className="chart-legend-pills">
          <span className="legend-badge badge-critical">Critical Overdue</span>
          <span className="legend-badge badge-warning">Target Exceeded</span>
          <span className="legend-badge badge-normal">Within SLA</span>
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
              dataKey="department"
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
              unit="m"
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={60} stroke="#FBBF24" strokeDasharray="3 3" label={{ value: '60m Benchmark', fill: '#FBBF24', fontSize: 10, position: 'insideTopRight' }} />

            <Bar dataKey="waitMinutes" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getColor(entry)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-footer-metrics">
        <div className="footer-metric-pill">
          <span className="label">Composite Acute Wait:</span>
          <strong>58 mins</strong>
        </div>
        <div className="footer-metric-pill">
          <span className="label">Longest Queue:</span>
          <strong className="text-critical">CT Scan (185 mins)</strong>
        </div>
        <div className="footer-metric-pill">
          <span className="label">Optimal Intake:</span>
          <strong className="text-success">Surgical Prep (28 mins)</strong>
        </div>
      </div>
    </div>
  );
};

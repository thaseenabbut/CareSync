import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  status?: 'normal' | 'warning' | 'critical' | 'info';
  benchmark?: string;
  icon?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subValue,
  status = 'normal',
  benchmark,
  icon,
}) => {
  return (
    <div className={`stat-card stat-${status}`}>
      <div className="stat-card-header">
        <span className="stat-label">{label}</span>
        {icon && <span className="stat-icon">{icon}</span>}
      </div>

      <div className="stat-card-body">
        <div className="stat-value">{value}</div>
        {subValue && <div className="stat-subvalue">{subValue}</div>}
      </div>

      {benchmark && (
        <div className="stat-benchmark">
          <span className="benchmark-bullet" />
          <span>{benchmark}</span>
        </div>
      )}
    </div>
  );
};

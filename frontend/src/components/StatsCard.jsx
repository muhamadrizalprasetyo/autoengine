import React from 'react';

const StatsCard = ({ title, value, icon: Icon, trend, trendValue, color = 'primary' }) => {
  const colorClasses = {
    primary: 'bg-primary/10 text-primary',
    secondary: 'bg-secondary/10 text-secondary',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    error: 'bg-error/10 text-error',
  };

  const trendClasses = {
    up: 'text-success',
    down: 'text-error',
    neutral: 'text-neutral-500',
  };

  return (
    <div className="card">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-neutral-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-neutral-800">{value}</p>
          {trend && (
            <p className={`text-sm mt-1 ${trendClasses[trend]}`}>
              {trend === 'up' && '↑ '}
              {trend === 'down' && '↓ '}
              {trendValue}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;

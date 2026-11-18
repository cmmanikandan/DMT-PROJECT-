import React from 'react';

export interface StatusBadgeProps {
  variant?: 'green' | 'amber' | 'red' | 'blue' | 'purple' | 'gray';
  children: React.ReactNode;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  variant = 'blue',
  children,
  size = 'sm'
}) => {
  const styles = {
    green: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    red: 'bg-rose-50 text-rose-700 border-rose-200',
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    gray: 'bg-slate-50 text-slate-700 border-slate-200'
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[11px] font-medium',
    md: 'px-2.5 py-1 text-[12px] font-medium'
  };

  return (
    <span
      className={`inline-flex items-center rounded-md border ${styles[variant]} ${sizes[size]}`}
    >
      {children}
    </span>
  );
};

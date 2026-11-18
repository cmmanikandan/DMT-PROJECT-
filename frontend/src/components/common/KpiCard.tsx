import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingBag, 
  Users, 
  Package, 
  Activity,
  type LucideIcon 
} from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string;
  change: string;
  isPositive?: boolean;
  comparisonText?: string;
  icon?: string;
}

const iconMap: Record<string, LucideIcon> = {
  DollarSign,
  ShoppingBag,
  Users,
  Package,
  Activity
};

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  change,
  isPositive = true,
  comparisonText = "vs last month",
  icon = "Activity"
}) => {
  const IconComponent = iconMap[icon] || Activity;

  // Sanitize against NaN, undefined, or null
  const cleanValue = (!value || value === "NaN" || value.includes("NaN") || value.includes("undefined"))
    ? "0"
    : value;

  return (
    <div className="dashboard-card p-4 flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-medium text-text-muted">{title}</span>
        <div className="w-8 h-8 rounded-lg bg-primary-light flex items-center justify-center text-primary">
          <IconComponent className="w-4 h-4" />
        </div>
      </div>

      <div className="mt-2.5 mb-1.5">
        <h3 className="text-[24px] font-semibold text-text-main tracking-tight leading-none">
          {cleanValue}
        </h3>
      </div>

      <div className="flex items-center gap-1.5 text-[12px] pt-1 border-t border-slate-100 mt-1.5">
        <span
          className={`inline-flex items-center gap-0.5 font-medium ${
            isPositive ? 'text-brand-green' : 'text-brand-red'
          }`}
        >
          {isPositive ? (
            <TrendingUp className="w-3.5 h-3.5 stroke-[2.5]" />
          ) : (
            <TrendingDown className="w-3.5 h-3.5 stroke-[2.5]" />
          )}
          {change}
        </span>
        <span className="text-text-light text-[11px]">{comparisonText}</span>
      </div>
    </div>
  );
};

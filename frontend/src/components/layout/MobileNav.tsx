import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, LineChart, TrendingUp, User } from 'lucide-react';

export const MobileNav: React.FC = () => {
  const items = [
    { path: '/', label: 'Home', icon: LayoutDashboard },
    { path: '/sales-analysis', label: 'Analysis', icon: LineChart },
    { path: '/prediction', label: 'Predict', icon: TrendingUp },
    { path: '/settings', label: 'Profile', icon: User },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-[56px] bg-white border-t border-surface-border flex items-center justify-around z-40 px-2 shadow-lg">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-1 px-3 text-[11px] font-medium transition-colors ${
                isActive ? 'text-primary' : 'text-text-muted hover:text-text-main'
              }`
            }
          >
            <Icon className="w-4 h-4 mb-0.5" />
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
};

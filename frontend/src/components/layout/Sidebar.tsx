import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Sliders, 
  Database, 
  Sparkles, 
  LineChart, 
  TrendingUp, 
  Package, 
  Users, 
  ShoppingBag, 
  FileText, 
  Settings,
  LogOut,
  AlertTriangle,
  ShieldAlert,
  ChevronRight,
  Zap,
  Activity
} from 'lucide-react';
import { useDataset } from '../../context/DatasetContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

interface NavSection {
  title: string;
  items: {
    path: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
    badgeColor?: string;
  }[];
}

const navSections: NavSection[] = [
  {
    title: 'Intelligence',
    items: [
      { path: '/', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/prediction', label: 'Sales Prediction', icon: TrendingUp, badge: 'ML' },
    ]
  },
  {
    title: 'Data Mining & ML',
    items: [
      { path: '/sales-analysis', label: 'Sales Analysis', icon: LineChart },
      { path: '/customer-segmentation', label: 'Customer Clusters', icon: Users },
      { path: '/market-basket', label: 'Market Basket', icon: ShoppingBag },
      { path: '/anomalies', label: 'Anomaly Audit', icon: ShieldAlert },
    ]
  },
  {
    title: 'Operations & Stock',
    items: [
      { path: '/product-analysis', label: 'Product Analysis', icon: Package },
      { path: '/inventory-alerts', label: 'Inventory Alerts', icon: AlertTriangle },
      { path: '/preprocessing', label: 'Data Health & ETL', icon: Sparkles },
    ]
  },
  {
    title: 'Management',
    items: [
      { path: '/dataset', label: 'Dataset Center', icon: Database },
      { path: '/reports', label: 'Reports & Export', icon: FileText },
      { path: '/settings', label: 'Settings', icon: Settings },
    ]
  }
];

export const Sidebar: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { backendOnline, datasetMeta } = useDataset();
  const { logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    showToast('Signed out successfully', 'info');
    navigate('/login');
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-[240px] bg-slate-950 text-slate-300 flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } border-r border-slate-800/80 shadow-2xl`}
      >
        {/* Top: Brand Header */}
        <div className="flex-1 overflow-y-auto">
          <div className="h-[64px] px-4 flex items-center justify-between border-b border-slate-800/80 bg-slate-950">
            <div className="flex items-center gap-3">
              <img 
                src="/LOGO.png" 
                alt="EcomSight Logo" 
                className="w-8 h-8 object-contain rounded-lg shadow-sm" 
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[16px] font-black tracking-tight leading-none text-white">
                    EcomSight
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-blue-600 text-white">
                    AI
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium">Enterprise Analytics</p>
              </div>
            </div>
          </div>

          {/* Grouped Nav Items */}
          <div className="py-4 px-3 space-y-6">
            {navSections.map((section, sIdx) => (
              <div key={sIdx} className="space-y-1">
                <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  {section.title}
                </p>

                <div className="space-y-0.5 pt-1">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={onClose}
                        className={({ isActive }) =>
                          `group flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 ${
                            isActive
                              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 font-bold'
                              : 'text-slate-400 hover:text-white hover:bg-slate-900/80'
                          }`
                        }
                      >
                        {({ isActive }) => (
                          <>
                            <div className="flex items-center gap-2.5 truncate">
                              <Icon className={`w-4 h-4 flex-shrink-0 transition-transform ${
                                isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                              }`} />
                              <span className="truncate">{item.label}</span>
                            </div>

                            {item.badge && (
                              <span className={`px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider ${
                                item.badgeColor || (isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-300')
                              }`}>
                                {item.badge}
                              </span>
                            )}
                          </>
                        )}
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section: Active Dataset & Sign Out */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/80 space-y-2">
          {/* Active Dataset Pill */}
          <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800/80 flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-2 min-w-0">
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${backendOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <div className="truncate">
                <p className="text-[11px] font-semibold text-slate-200 truncate">
                  {datasetMeta?.filename || 'E-Commerce Store'}
                </p>
                <p className="text-[10px] text-slate-500">
                  {datasetMeta?.rows ? `${datasetMeta.rows.toLocaleString()} records` : 'Sample Data'}
                </p>
              </div>
            </div>
            <Activity className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

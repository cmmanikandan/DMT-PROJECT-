import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Database, 
  Sparkles, 
  LineChart, 
  TrendingUp, 
  Layers, 
  Users, 
  ShoppingBag, 
  FileText, 
  Settings,
  Cpu,
  LogOut,
  AlertTriangle,
  ShieldAlert
} from 'lucide-react';
import { useDataset } from '../../context/DatasetContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/dataset', label: 'Dataset', icon: Database },
  { path: '/preprocessing', label: 'Preprocessing', icon: Sparkles },
  { path: '/sales-analysis', label: 'Sales Analysis', icon: LineChart },
  { path: '/prediction', label: 'Prediction', icon: TrendingUp },
  { path: '/product-analysis', label: 'Product Analysis', icon: Layers },
  { path: '/inventory-alerts', label: 'Inventory Alerts', icon: AlertTriangle },
  { path: '/anomalies', label: 'Anomaly Detection', icon: ShieldAlert },
  { path: '/customer-segmentation', label: 'Customer Segmentation', icon: Users },
  { path: '/market-basket', label: 'Market Basket', icon: ShoppingBag },
  { path: '/reports', label: 'Reports', icon: FileText },
  { path: '/settings', label: 'Settings', icon: Settings },
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
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-[232px] bg-navy-900 text-slate-300 flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } border-r border-navy-850 shadow-xl`}
      >
        {/* Top: Logo & App title */}
        <div>
          <div className="h-[68px] px-4 flex items-center gap-3 border-b border-navy-850 bg-navy-950/40">
            {/* Custom Brand Logo */}
            <img 
              src="/LOGO.png" 
              alt="EcomSight Logo" 
              className="w-9 h-9 object-contain drop-shadow-md flex-shrink-0 rounded-lg hover:scale-105 transition-transform" 
            />
            <div className="overflow-hidden">
              <div className="flex items-center gap-1.5">
                <span className="text-[17px] font-black tracking-tight leading-none bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300 bg-clip-text text-transparent">
                  EcomSight
                </span>
                <span className="px-1.5 py-0.5 rounded text-[9.5px] font-black uppercase tracking-wider bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-xs">
                  AI
                </span>
              </div>
              <p className="text-[10px] text-cyan-200/60 font-medium tracking-wide mt-1 truncate">
                Sales Intelligence Engine
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-lg text-[12.5px] font-medium transition-all ${
                      isActive
                        ? 'bg-primary text-white shadow-sm font-semibold'
                        : 'text-slate-300 hover:text-white hover:bg-navy-850/80'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: Sign Out & Dataset Engine Status */}
        <div>
          {/* Sign Out Button */}
          <div className="px-3 pb-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-rose-950/40 text-[12.5px] font-medium transition-colors border border-transparent hover:border-rose-900/40 group"
            >
              <LogOut className="w-4 h-4 text-slate-400 group-hover:text-brand-red transition-colors flex-shrink-0" />
              <span className="group-hover:text-rose-200">Sign Out</span>
            </button>
          </div>

          {/* Bottom System Status */}
          <div className="p-3 border-t border-navy-850 m-2 rounded-lg bg-navy-950/80 border border-navy-850/60">
            <div className="flex items-center justify-between text-[11px] mb-1.5">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Cpu className="w-3 h-3 text-primary" />
                Dataset Engine
              </span>
              <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium ${
                backendOnline ? 'bg-emerald-500/20 text-emerald-300' : 'bg-blue-500/20 text-blue-300'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${backendOnline ? 'bg-emerald-400 animate-pulse' : 'bg-blue-400'}`} />
                {backendOnline ? 'FastAPI Live' : 'Active Engine'}
              </span>
            </div>
            <div className="text-[10px] text-slate-400 flex justify-between">
              <span className="truncate max-w-[110px]" title={datasetMeta.filename}>{datasetMeta.filename}</span>
              <span className="text-slate-400 font-medium">{datasetMeta.rows > 0 ? `${datasetMeta.rows.toLocaleString()} rows` : '0 rows'}</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

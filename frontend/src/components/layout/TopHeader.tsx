import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  ChevronDown, 
  Menu, 
  LogOut, 
  ShieldCheck, 
  Database,
  Radio
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useDataset } from '../../context/DatasetContext';
import { useToast } from '../../context/ToastContext';
import { useNavigate } from 'react-router-dom';

interface TopHeaderProps {
  onToggleMobileSidebar: () => void;
  onOpenCommandPalette?: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ onToggleMobileSidebar, onOpenCommandPalette }) => {
  const { user, logout } = useAuth();
  const { backendOnline, dbStatus, datasetMeta, checkStatus } = useDataset();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showDbModal, setShowDbModal] = useState(false);
  const [isCheckingDb, setIsCheckingDb] = useState(false);

  const handleTestConnection = async () => {
    setIsCheckingDb(true);
    showToast('Pinging database connection...', 'info');
    await checkStatus();
    setIsCheckingDb(false);
    showToast(
      dbStatus?.status === 'connected' 
        ? `Connected to ${dbStatus.engine} (${dbStatus.database}) with ${dbStatus.total_transactions?.toLocaleString()} records!` 
        : 'Backend or MySQL is currently offline. Follow the troubleshooting steps below.',
      dbStatus?.status === 'connected' ? 'success' : 'error'
    );
  };

  const isDbConnected = dbStatus?.status === 'connected';
  const engineName = dbStatus?.engine || (isDbConnected ? 'MySQL' : 'Database');
  const dbName = dbStatus?.database || 'ecomsight_db';
  const txCount = dbStatus?.total_transactions ?? 0;

  return (
    <header className="h-[60px] bg-white border-b border-surface-border sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between shadow-header">
      {/* Left: Mobile Toggle & Search Field */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <button
          onClick={onToggleMobileSidebar}
          className="p-1.5 rounded-lg text-text-muted hover:text-text-main hover:bg-slate-100 lg:hidden"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div 
          onClick={onOpenCommandPalette}
          className="relative w-full max-w-xs cursor-pointer group"
        >
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-blue-500 transition-colors" />
          <div className="w-full pl-9 pr-12 py-1.5 text-[12.5px] bg-slate-100/80 hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-500 flex items-center justify-between transition-all">
            <span>Quick search or jump to...</span>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-bold text-slate-400 bg-white border border-slate-200 rounded shadow-xs">
              ⌘K
            </kbd>
          </div>
        </div>
      </div>

      {/* Right: Data Mode Badge, MySQL DB Badge, Notifications, User Profile */}
      <div className="flex items-center gap-3">
        {/* MySQL Database Indicator (Clickable with Diagnostic Modal) */}
        <button
          type="button"
          onClick={() => setShowDbModal(true)}
          className={`hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-medium transition-all shadow-xs cursor-pointer ${
            isDbConnected
              ? 'border-emerald-200 bg-emerald-50/80 text-emerald-800 hover:bg-emerald-100'
              : 'border-amber-200 bg-amber-50/80 text-amber-800 hover:bg-amber-100'
          }`}
          title="Click to view Database Connection Status and Configuration"
        >
          <Database className={`w-3.5 h-3.5 ${isDbConnected ? 'text-emerald-600' : 'text-amber-600 animate-pulse'}`} />
          <span>
            {isDbConnected 
              ? `${engineName.includes('MySQL') ? 'MySQL' : 'SQLite'}: ${dbName} (${txCount.toLocaleString()} rows)` 
              : 'MySQL: Inactive (Click for Help)'}
          </span>
        </button>

        {/* Live Engine Indicator */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-surface-border bg-slate-50 text-[11px] font-medium text-text-muted">
          <span
            className={`w-2 h-2 rounded-full ${
              backendOnline ? 'bg-brand-green animate-pulse' : 'bg-primary'
            }`}
          />
          <span>{backendOnline ? 'FastAPI ML Live' : 'Active Engine'}</span>
        </div>

        {/* Notifications Icon */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg text-text-muted hover:text-text-main hover:bg-slate-100 relative transition-colors"
            title="System Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="w-1.5 h-1.5 rounded-full bg-primary absolute top-2 right-2" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-surface-border py-2 z-40">
              <div className="px-3 py-1.5 border-b border-slate-100 font-semibold text-[12px] text-text-main flex justify-between items-center">
                <span>System Alerts</span>
                <span className="text-[10px] text-primary font-normal">Mark all read</span>
              </div>
              <div className="p-3 text-[11px] text-text-muted space-y-2">
                <div className="p-2 rounded bg-slate-50 border border-slate-100">
                  <p className="font-medium text-text-main">Data Cleaning Finished</p>
                  <p className="text-[10px] text-text-light">Processed 50,860 records with 0 remaining missing values.</p>
                </div>
                <div className="p-2 rounded bg-slate-50 border border-slate-100">
                  <p className="font-medium text-text-main">Next Month Forecast Ready</p>
                  <p className="text-[10px] text-text-light">RandomForest model achieved R² 0.91 on test validation.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Avatar & Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 pl-2 pr-1.5 py-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-navy-900 text-white flex items-center justify-center text-[12px] font-semibold">
              AD
            </div>
            <div className="hidden md:block text-left text-[12.5px] leading-tight">
              <p className="font-semibold text-text-main">{user?.name || 'Admin'}</p>
              <p className="text-[10px] text-text-muted">Lead Analyst</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-text-muted" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-lg border border-surface-border py-1.5 z-40">
              <div className="px-3 py-2 border-b border-slate-100">
                <p className="text-[12px] font-semibold text-text-main">{user?.name || 'Admin'}</p>
                <p className="text-[11px] text-text-muted">{user?.email || 'admin@ecomsight.ai'}</p>
              </div>

              <div className="py-1 text-[12px]">
                <div className="px-3 py-1.5 text-text-muted flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-brand-green" />
                  <span>Role: DMT Reviewer</span>
                </div>
                <div className="px-3 py-1.5 text-text-muted flex items-center gap-2">
                  <Database className="w-3.5 h-3.5 text-primary" />
                  <span>Rows: {datasetMeta.rows.toLocaleString()}</span>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-1">
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    logout();
                    showToast('Signed out successfully', 'info');
                    navigate('/login');
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-[12px] text-brand-red hover:bg-rose-50 text-left transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Database Diagnostic & Troubleshooting Hub Modal */}
      {showDbModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-surface-border text-left relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isDbConnected ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-[16px] font-bold text-text-main">Database Engine Hub</h3>
                  <p className="text-[11px] text-text-muted">Connection diagnostics and storage architecture</p>
                </div>
              </div>
              <button
                onClick={() => setShowDbModal(false)}
                className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-4">
              {/* Connection Status Box */}
              <div className={`p-4 rounded-xl border ${isDbConnected ? 'bg-emerald-50/60 border-emerald-200' : 'bg-amber-50/60 border-amber-200'}`}>
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-medium text-slate-700">Connection State</span>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${isDbConnected ? 'bg-emerald-200/70 text-emerald-900' : 'bg-amber-200/70 text-amber-900'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${isDbConnected ? 'bg-emerald-600' : 'bg-amber-600'}`} />
                    {isDbConnected ? 'Active & Synchronized' : 'Inactive / Standby'}
                  </span>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-[12px]">
                  <div>
                    <span className="text-text-muted block text-[11px]">Database Engine</span>
                    <span className="font-semibold text-text-main">{engineName}</span>
                  </div>
                  <div>
                    <span className="text-text-muted block text-[11px]">Database Name</span>
                    <span className="font-semibold text-text-main">{dbName}</span>
                  </div>
                  <div>
                    <span className="text-text-muted block text-[11px]">Host / Port</span>
                    <span className="font-semibold text-text-main">{dbStatus?.host || 'localhost'}:{dbStatus?.port || 3306}</span>
                  </div>
                  <div>
                    <span className="text-text-muted block text-[11px]">Indexed Records</span>
                    <span className="font-semibold text-text-main">{txCount > 0 ? `${txCount.toLocaleString()} rows` : 'Offline'}</span>
                  </div>
                </div>
              </div>

              {/* Troubleshooting Guide if Inactive */}
              {!isDbConnected ? (
                <div className="space-y-2.5 bg-slate-50 p-4 rounded-xl border border-slate-200 text-[12px]">
                  <p className="font-semibold text-slate-900 text-[13px] flex items-center gap-1.5">
                    <span>💡</span> Showing MySQL Inactive? What you can do:
                  </p>
                  <ol className="list-decimal list-inside space-y-1.5 text-slate-700 pl-1 leading-relaxed">
                    <li>
                      <strong className="text-slate-900">Run the Launcher:</strong> Double-click <code className="bg-white px-1.5 py-0.5 rounded border border-slate-300 font-mono text-[11px]">run.bat</code> in the project folder to start both backend & frontend together.
                    </li>
                    <li>
                      <strong className="text-slate-900">Start MySQL Service:</strong> Open PowerShell as Administrator and run <code className="bg-white px-1.5 py-0.5 rounded border border-slate-300 font-mono text-[11px]">net start MySQL80</code> (or start MySQL in XAMPP).
                    </li>
                    <li>
                      <strong className="text-slate-900">Verify Password:</strong> Ensure your MySQL root password matches <code className="bg-white px-1.5 py-0.5 rounded border border-slate-300 font-mono text-[11px]">backend/.env</code> (<code className="font-mono text-[11px]">MYSQL_PASSWORD=...</code>).
                    </li>
                    <li>
                      <strong className="text-slate-900">Zero-Config Auto-Fallback:</strong> Even without MySQL, EcomSight AI automatically falls back to local SQLite (<code className="font-mono text-[11px]">backend/ecomsight.db</code>) with zero interruptions!
                    </li>
                  </ol>
                </div>
              ) : (
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-[11px] text-text-muted">
                  <p className="font-semibold text-text-main mb-1">Indexed Datasets in MySQL:</p>
                  <p className="leading-relaxed">
                    All 5 specialized domain datasets (General E-Commerce, Festive Diwali Sale, Beauty & Lifestyle, Footwear & Apparel, Electronics & Tech) are stored and indexed for real-time querying.
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowDbModal(false)}
                className="px-3.5 py-2 text-[12px] font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={isCheckingDb}
                className="px-4 py-2 text-[12px] font-semibold text-white bg-primary hover:bg-primary-hover rounded-lg transition-colors shadow-sm disabled:opacity-50"
              >
                {isCheckingDb ? 'Testing Connection...' : 'Ping & Reconnect Now'}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

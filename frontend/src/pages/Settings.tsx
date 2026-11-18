import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Save, 
  Cpu, 
  Database, 
  Server, 
  CheckCircle2, 
  Globe, 
  Calendar, 
  DollarSign, 
  Shield 
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { useDataset } from '../context/DatasetContext';

export const Settings: React.FC = () => {
  const { showToast } = useToast();
  const { backendOnline, datasetMeta } = useDataset();

  const [appName, setAppName] = useState('EcomSight');
  const [timezone, setTimezone] = useState('(UTC+05:30) India Standard Time');
  const [dateFormat, setDateFormat] = useState('DD-MM-YYYY');
  const [currency, setCurrency] = useState('₹ INR (Indian Rupee)');
  const [saving, setSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      showToast('Settings saved successfully!', 'success');
    }, 400);
  };

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Title */}
      <div>
        <h1 className="text-[22px] font-semibold text-text-main tracking-tight leading-none">
          Settings & System Configuration
        </h1>
        <p className="text-[13px] text-text-muted mt-1.5">
          Manage system parameters, localization defaults, and machine learning backend connections.
        </p>
      </div>

      {/* General Settings Card */}
      <div className="dashboard-card p-5">
        <div className="flex items-center justify-between pb-3 border-b border-surface-border mb-4">
          <div className="flex items-center gap-2">
            <SettingsIcon className="w-4 h-4 text-primary" />
            <h2 className="text-[15px] font-semibold text-text-main">
              General Settings
            </h2>
          </div>
          <span className="text-[11px] text-text-muted">Application Identity</span>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-medium text-text-main mb-1.5">
                Application Name
              </label>
              <input
                type="text"
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
                className="w-full px-3 py-2 text-[12.5px] bg-slate-50 border border-surface-border rounded-lg text-text-main focus:bg-white focus:border-primary outline-none"
              />
            </div>

            <div>
              <label className="block text-[12px] font-medium text-text-main mb-1.5">
                Timezone
              </label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full px-3 py-2 text-[12.5px] bg-slate-50 border border-surface-border rounded-lg text-text-main focus:bg-white focus:border-primary outline-none"
              >
                <option value="(UTC+05:30) India Standard Time">(UTC+05:30) India Standard Time</option>
                <option value="(UTC+00:00) UTC / GMT">(UTC+00:00) UTC / GMT</option>
                <option value="(UTC-05:00) Eastern Time (US & Canada)">(UTC-05:00) Eastern Time (US & Canada)</option>
              </select>
            </div>

            <div>
              <label className="block text-[12px] font-medium text-text-main mb-1.5">
                Date Format
              </label>
              <select
                value={dateFormat}
                onChange={(e) => setDateFormat(e.target.value)}
                className="w-full px-3 py-2 text-[12.5px] bg-slate-50 border border-surface-border rounded-lg text-text-main focus:bg-white focus:border-primary outline-none"
              >
                <option value="DD-MM-YYYY">DD-MM-YYYY (e.g. 16-09-2026)</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD (ISO standard)</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY (US standard)</option>
              </select>
            </div>

            <div>
              <label className="block text-[12px] font-medium text-text-main mb-1.5">
                Default Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3 py-2 text-[12.5px] bg-slate-50 border border-surface-border rounded-lg text-text-main focus:bg-white focus:border-primary outline-none"
              >
                <option value="₹ INR (Indian Rupee)">₹ INR (Indian Rupee)</option>
                <option value="$ USD (US Dollar)">$ USD (US Dollar)</option>
                <option value="€ EUR (Euro)">€ EUR (Euro)</option>
              </select>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-[12.5px] font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* System Information Card */}
      <div className="dashboard-card p-5">
        <div className="flex items-center justify-between pb-3 border-b border-surface-border mb-4">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-primary" />
            <h2 className="text-[15px] font-semibold text-text-main">
              System Information & DMT Architecture
            </h2>
          </div>
          <span className="text-[11px] text-text-muted">Environment Status</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[12px]">
          <div className="p-3 rounded-lg bg-slate-50 border border-surface-border flex items-center justify-between">
            <span className="text-text-muted">Application Version</span>
            <span className="font-semibold text-text-main">1.0.0 (DMT Academic Build)</span>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-surface-border flex items-center justify-between">
            <span className="text-text-muted">FastAPI ML Backend</span>
            <span className={`font-semibold flex items-center gap-1.5 ${
              backendOnline ? 'text-brand-green' : 'text-primary'
            }`}>
              <span className={`w-2 h-2 rounded-full ${backendOnline ? 'bg-brand-green animate-pulse' : 'bg-primary'}`} />
              {backendOnline ? 'Online (Port 8000)' : 'Client-Side Mode Active'}
            </span>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-surface-border flex items-center justify-between">
            <span className="text-text-muted">Database Engine</span>
            <span className="font-semibold text-text-main">PostgreSQL / Supabase Schema</span>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-surface-border flex items-center justify-between">
            <span className="text-text-muted">Active Dataset Records</span>
            <span className="font-semibold text-text-main">{datasetMeta.rows.toLocaleString()} Rows</span>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-surface-border flex items-center justify-between">
            <span className="text-text-muted">Data Mining Algorithms</span>
            <span className="font-semibold text-text-main">Apriori, K-Means, RandomForest</span>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-surface-border flex items-center justify-between">
            <span className="text-text-muted">Last System Update</span>
            <span className="font-semibold text-text-main">16-09-2026 09:45 IST</span>
          </div>
        </div>
      </div>
    </div>
  );
};

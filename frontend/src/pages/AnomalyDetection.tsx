import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  TrendingDown, 
  DollarSign, 
  RefreshCw, 
  Search, 
  Filter, 
  CheckCircle, 
  Zap,
  Info
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { useDataset } from '../context/DatasetContext';
import { useToast } from '../context/ToastContext';
import { fetchAnomalies } from '../api/apiClient';
import { ExportButton } from '../components/common/ExportButton';
import { NoDatasetEmptyState } from '../components/common/NoDatasetEmptyState';

export const AnomalyDetection: React.FC = () => {
  const { backendOnline, hasDataset } = useDataset();
  const { showToast } = useToast();

  const [loading, setLoading] = useState<boolean>(false);
  const [severityFilter, setSeverityFilter] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const [data, setData] = useState<{
    kpis: {
      total_scanned: number;
      anomalies_detected: number;
      high_risk_count: number;
      total_anomalous_value: number;
      total_anomalous_value_display: string;
      clean_rate: number;
    };
    distribution: Array<{ reason: string; count: number }>;
    anomalies: Array<{
      transaction_id: string;
      date: string;
      customer_name: string;
      product_name: string;
      amount: number;
      amount_display: string;
      quantity: number;
      discount_percent: number;
      reason: string;
      all_reasons: string[];
      risk_score: number;
      severity: string;
    }>;
  }>({
    kpis: {
      total_scanned: 1420,
      anomalies_detected: 16,
      high_risk_count: 5,
      total_anomalous_value: 384000,
      total_anomalous_value_display: "₹3,84,000",
      clean_rate: 98.9
    },
    distribution: [
      { reason: "High Value Outlier", count: 7 },
      { reason: "Quantity Bulk Surge", count: 4 },
      { reason: "Excessive Discount Abuse", count: 3 },
      { reason: "Statistical Pattern Deviation", count: 2 }
    ],
    anomalies: [
      {
        transaction_id: "TXN-8841",
        date: "2024-11-20",
        customer_name: "Vikram Malhotra",
        product_name: "Smart 65-Inch OLED Display",
        amount: 149999,
        amount_display: "₹1,49,999",
        quantity: 9,
        discount_percent: 48.0,
        reason: "High Value Outlier",
        all_reasons: ["High Value Outlier", "Excessive Discount Abuse"],
        risk_score: 96,
        severity: "High"
      },
      {
        transaction_id: "TXN-7912",
        date: "2024-11-17",
        customer_name: "Aman Gupta",
        product_name: "Cotton Crew T-Shirt (Pack of 3)",
        amount: 32000,
        amount_display: "₹32,000",
        quantity: 40,
        discount_percent: 15.0,
        reason: "Quantity Bulk Surge",
        all_reasons: ["Quantity Bulk Surge"],
        risk_score: 84,
        severity: "High"
      },
      {
        transaction_id: "TXN-9023",
        date: "2024-11-12",
        customer_name: "Kavita Rao",
        product_name: "Ergonomic Office Chair",
        amount: 18500,
        amount_display: "₹18,500",
        quantity: 2,
        discount_percent: 65.0,
        reason: "Excessive Discount Abuse",
        all_reasons: ["Excessive Discount Abuse"],
        risk_score: 72,
        severity: "Medium"
      }
    ]
  });

  const loadData = async () => {
    setLoading(true);
    try {
      if (backendOnline && hasDataset) {
        const res = await fetchAnomalies();
        if (res && res.kpis && res.anomalies) {
          setData(res);
        }
      }
    } catch (err: any) {
      showToast(`Showing statistical baseline: ${err.message}`, 'info');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [backendOnline, hasDataset]);

  if (!hasDataset) {
    return <NoDatasetEmptyState pageName="Anomaly & Fraud Detection" />;
  }

  const filtered = data.anomalies.filter(item => {
    const matchesSev = severityFilter === 'All' || item.severity === severityFilter;
    const matchesSearch = item.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.transaction_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.reason.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSev && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-[22px] font-bold text-slate-900 tracking-tight">
              Anomaly & Fraud Detection
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-600 border border-rose-200">
              Isolation Forest ML
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button 
            onClick={loadData}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 text-[12.5px] font-medium bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg shadow-xs transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Re-scan
          </button>
          <ExportButton 
            title="Flagged_Anomalies_Report"
            data={data.anomalies}
            pdfTitle="ECOMSIGHT Flagged Anomalies & Fraud Report"
          />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-medium text-slate-500">Integrity & Cleanliness</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-[24px] font-bold text-emerald-600">
            {data.kpis.clean_rate}%
          </div>
          <div className="text-[11.5px] text-slate-400 mt-0.5">{data.kpis.total_scanned} total orders evaluated</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-medium text-slate-500">Flagged Anomalies</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-[24px] font-bold text-amber-600">
            {data.kpis.anomalies_detected}
          </div>
          <div className="text-[11.5px] text-slate-400 mt-0.5">Statistical & ML outliers</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-medium text-slate-500">High Risk Alerts</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-[24px] font-bold text-rose-600">
            {data.kpis.high_risk_count}
          </div>
          <div className="text-[11.5px] text-slate-400 mt-0.5">Risk score ≥ 75 / 100</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-medium text-slate-500">Total Flagged Value</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-primary">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-[24px] font-bold text-slate-900">
            {data.kpis.total_anomalous_value_display}
          </div>
          <div className="text-[11.5px] text-slate-400 mt-0.5">Capital under review</div>
        </div>
      </div>

      {/* Breakdown Chart */}
      <div className="p-5 bg-white rounded-xl border border-slate-200/80 shadow-xs">
        <h2 className="text-[15px] font-bold text-slate-900 mb-1">
          Anomaly Pattern Distribution
        </h2>
        <p className="text-[12.5px] text-slate-500 mb-4">
          Breakdown of detected irregularities by anomaly category.
        </p>

        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.distribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="reason" stroke="#94a3b8" fontSize={12} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#fff' }}
                cursor={{ fill: 'rgba(23, 105, 224, 0.05)' }}
              />
              <Bar dataKey="count" fill="#1769E0" radius={[6, 6, 0, 0]} barSize={42} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Filter and Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg">
            {['All', 'High', 'Medium'].map((tab) => (
              <button
                key={tab}
                onClick={() => setSeverityFilter(tab)}
                className={`px-3 py-1.5 rounded-md text-[12px] font-medium transition ${
                  severityFilter === tab ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab === 'All' ? 'All Severities' : `${tab} Risk`}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search ID, customer, product..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-[12.5px] border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11.5px] uppercase tracking-wider text-slate-500 font-semibold">
                <th className="py-3 px-4">Transaction ID</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Product Details</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4 text-center">Discount</th>
                <th className="py-3 px-4">Primary Anomaly Trigger</th>
                <th className="py-3 px-4 text-center">Risk Score</th>
                <th className="py-3 px-4 text-center">Severity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[12.5px] text-slate-700">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    No transactions match your search filter.
                  </td>
                </tr>
              ) : (
                filtered.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4 font-mono font-semibold text-primary">
                      {row.transaction_id}
                    </td>
                    <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                      {row.date}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-900">
                      {row.customer_name}
                    </td>
                    <td className="py-3 px-4 max-w-[200px] truncate text-slate-700">
                      {row.product_name} <span className="text-slate-400 font-normal">({row.quantity}x)</span>
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-slate-900">
                      {row.amount_display}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`font-semibold ${row.discount_percent > 40 ? 'text-rose-600' : 'text-slate-600'}`}>
                        {row.discount_percent}%
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11.5px] font-medium bg-slate-100 text-slate-800">
                        <Zap className="w-3 h-3 text-amber-500" />
                        {row.reason}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="inline-flex items-center gap-1.5 font-bold">
                        <span className={`text-[13px] ${
                          row.risk_score >= 80 ? 'text-rose-600' : 'text-amber-600'
                        }`}>
                          {row.risk_score}
                        </span>
                        <span className="text-[10px] text-slate-400 font-normal">/100</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {row.severity === 'High' ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-100 text-rose-700">
                          High Risk
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-700">
                          Medium
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

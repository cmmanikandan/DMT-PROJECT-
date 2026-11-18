import React, { useState, useEffect } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart,
  Area,
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { 
  TrendingUp, 
  Sparkles, 
  ArrowUpRight, 
  ChevronRight, 
  Package, 
  Calendar,
  Sliders,
  AlertTriangle,
  Zap,
  DollarSign,
  ShoppingBag,
  Users,
  Layers,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { StatusBadge } from '../components/common/StatusBadge';
import { ExportButton } from '../components/common/ExportButton';
import { useDataset } from '../context/DatasetContext';
import { 
  DEMO_SALES_TREND, 
  DEMO_CATEGORIES, 
  DEMO_TOP_PRODUCTS 
} from '../data/demoData';
import { fetchSalesAnalytics } from '../api/apiClient';
import { getCategoryColor } from '../utils/categoryColors';
import { NoDatasetEmptyState } from '../components/common/NoDatasetEmptyState';

export const Dashboard: React.FC = () => {
  const { backendOnline, hasDataset, datasetMeta } = useDataset();
  const [salesTrend, setSalesTrend] = useState(DEMO_SALES_TREND);
  const [categories, setCategories] = useState(DEMO_CATEGORIES);
  const [topProducts, setTopProducts] = useState(DEMO_TOP_PRODUCTS);
  const [trendPeriod, setTrendPeriod] = useState<'monthly' | 'weekly'>('monthly');
  const [dateFilter, setDateFilter] = useState<'30D' | '90D' | 'YTD' | 'All'>('30D');
  const [kpis, setKpis] = useState<any>({
    total_revenue_display: "₹12,84,500",
    total_revenue_growth: "+12.6%",
    total_orders: 18450,
    total_orders_growth: "+8.2%",
    total_customers: 2450,
    total_customers_growth: "+7.4%",
    aov_display: "₹695",
    date_range: "Jan 2025 – Dec 2025"
  });

  useEffect(() => {
    if (backendOnline && hasDataset) {
      fetchSalesAnalytics(trendPeriod)
        .then((data) => {
          if (data.trend && data.trend.length > 0) setSalesTrend(data.trend);
          if (data.categories && data.categories.length > 0) setCategories(data.categories);
          if (data.top_products && data.top_products.length > 0) setTopProducts(data.top_products);
          if (data.kpis) setKpis(data.kpis);
        })
        .catch(() => {});
    }
  }, [backendOnline, hasDataset, trendPeriod]);

  if (!hasDataset) {
    return <NoDatasetEmptyState pageName="Dashboard Overview" />;
  }

  const formatNumber = (val: any, fallback: number = 0) => {
    if (val === null || val === undefined) return fallback.toLocaleString();
    if (typeof val === 'number') return isNaN(val) ? fallback.toLocaleString() : val.toLocaleString();
    const clean = String(val).replace(/,/g, '').trim();
    const n = Number(clean);
    return isNaN(n) ? fallback.toLocaleString() : n.toLocaleString();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Welcome Title with Date Pills */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Executive Overview
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
              Live AI Metrics
            </span>
          </div>
        </div>

        {/* Quick Date Range & Export Button */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Quick Filter Pills */}
          <div className="hidden md:flex items-center gap-1 bg-white border border-slate-200 p-1 rounded-xl shadow-xs text-xs font-semibold text-slate-600">
            {(['30D', '90D', 'YTD', 'All'] as const).map(pill => (
              <button
                key={pill}
                onClick={() => setDateFilter(pill)}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  dateFilter === pill 
                    ? 'bg-slate-900 text-white shadow-xs' 
                    : 'hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {pill}
              </button>
            ))}
          </div>

          <ExportButton
            title="Dashboard Overview"
            data={salesTrend}
            pdfTitle="EcomSight Performance & Sales Overview"
          />
        </div>
      </div>

      {/* AI Morning Briefing Card (High-Contrast Guaranteed) */}
      <div 
        className="bento-card p-5 rounded-2xl border border-slate-800 shadow-md relative overflow-hidden"
        style={{ backgroundColor: '#0B132B', color: '#FFFFFF' }}
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-blue-500/20 text-cyan-300 border border-cyan-400/30">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Automated AI Executive Briefing
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
              Revenue pacing +12.6% ahead of baseline with strong Electronics momentum.
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              ⚡ <strong className="text-cyan-300">3 Recommended Actions:</strong> Review forward SKU demand trajectories, reorder 3 low-stock SKUs in Footwear, and activate Market Basket bundling rules on checkout.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <Link
              to="/product-analysis"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md"
            >
              <Package className="w-3.5 h-3.5" />
              View Product Analysis
            </Link>
          </div>
        </div>
      </div>

      {/* Bento Grid: 4 Core KPIs with Sparklines */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Revenue */}
        <div className="bento-card p-5 bg-white border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Net Revenue</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{kpis.total_revenue_display || "₹12,84,500"}</p>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 text-xs">
            <span className="text-emerald-600 font-bold flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> {kpis.total_revenue_growth || "+12.6%"}
            </span>
            <span className="text-slate-400 text-[11px]">vs last period</span>
          </div>
        </div>

        {/* KPI 2: Total Orders */}
        <div className="bento-card p-5 bg-white border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Order Volume</span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{formatNumber(kpis.total_orders, 18450)}</p>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 text-xs">
            <span className="text-emerald-600 font-bold flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> {kpis.total_orders_growth || "+8.2%"}
            </span>
            <span className="text-slate-400 text-[11px]">fulfillment rate 99.1%</span>
          </div>
        </div>

        {/* KPI 3: Active Customers */}
        <div className="bento-card p-5 bg-white border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Customers</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{formatNumber(kpis.total_customers, 2450)}</p>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 text-xs">
            <span className="text-emerald-600 font-bold flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> {kpis.total_customers_growth || "+7.4%"}
            </span>
            <span className="text-slate-400 text-[11px]">68% repeat rate</span>
          </div>
        </div>

        {/* KPI 4: AOV */}
        <div className="bento-card p-5 bg-white border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Average Basket (AOV)</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{kpis.aov_display || "₹695"}</p>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 text-xs">
            <span className="text-emerald-600 font-bold flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> +4.1%
            </span>
            <span className="text-slate-400 text-[11px]">2.4 items / cart</span>
          </div>
        </div>
      </div>

      {/* Middle Row: Sales Area Trajectory (2 Cols) + Category Donut (1 Col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Overview with Gradient Area Chart */}
        <div className="lg:col-span-2 bento-card p-5 bg-white border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                Sales Trajectory & Momentum
              </h2>
            </div>

            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs font-semibold">
              <button
                onClick={() => setTrendPeriod('monthly')}
                className={`px-3 py-1 rounded-md transition-all ${
                  trendPeriod === 'monthly'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setTrendPeriod('weekly')}
                className={`px-3 py-1 rounded-md transition-all ${
                  trendPeriod === 'weekly'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Weekly
              </button>
            </div>
          </div>

          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis 
                  dataKey="period" 
                  tick={{ fontSize: 11, fill: '#64748B' }} 
                  axisLine={{ stroke: '#E2E8F0' }}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 11, fill: '#64748B' }} 
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: '#1E293B',
                    borderRadius: '10px',
                    fontSize: '12px',
                    color: '#F8FAFC'
                  }}
                  itemStyle={{ color: '#F8FAFC' }}
                  formatter={(val: any) => [`₹${Number(val).toLocaleString()}`, 'Net Revenue']}
                />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#2563EB"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#revenueGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Categories Donut */}
        <div className="bento-card p-5 bg-white border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Category Distribution
            </h2>
            <Link 
              to="/sales-analysis" 
              className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-0.5"
            >
              Details
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="h-[180px] w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categories}
                  innerRadius={52}
                  outerRadius={76}
                  paddingAngle={3}
                  dataKey="percentage"
                >
                  {categories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getCategoryColor(entry.name, index, entry.color)} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any, name: any) => [`${val}%`, name]}
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: '#1E293B',
                    borderRadius: '8px',
                    fontSize: '11px',
                    color: '#F8FAFC'
                  }}
                  itemStyle={{ color: '#F8FAFC' }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Callout */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Leading</span>
              <span className="text-sm font-black text-slate-900">37.5%</span>
            </div>
          </div>

          {/* Category Chips */}
          <div className="space-y-1.5 pt-3 border-t border-slate-100 text-xs">
            {categories.slice(0, 4).map((cat, idx) => {
              const chipColor = getCategoryColor(cat.name, idx, cat.color);
              return (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span 
                      className="w-2.5 h-2.5 rounded-sm flex-shrink-0" 
                      style={{ backgroundColor: chipColor }} 
                    />
                    <span className="text-slate-700 font-medium">{cat.name}</span>
                  </div>
                  <span className="text-slate-900 font-bold">{cat.percentage}%</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Row: Top Selling SKU Performance Table + Predictive Forward Callout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Selling Products (2 cols) */}
        <div className="lg:col-span-2 bento-card p-5 bg-white border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                Hero SKU Performance
              </h2>
            </div>
            <Link
              to="/product-analysis"
              className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-0.5"
            >
              Product Analysis
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left data-table">
              <thead>
                <tr>
                  <th>Product SKU</th>
                  <th>Category</th>
                  <th className="text-right">Revenue</th>
                  <th className="text-right">Units</th>
                  <th className="text-right">Velocity</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((p) => (
                  <tr key={p.id}>
                    <td className="font-semibold text-slate-800 flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                        <Package className="w-3.5 h-3.5" />
                      </div>
                      <span className="truncate max-w-[160px]">{p.name}</span>
                    </td>
                    <td>
                      <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700">
                        {p.category}
                      </span>
                    </td>
                    <td className="text-right font-bold text-slate-900">{p.salesDisplay}</td>
                    <td className="text-right text-slate-600">{p.quantity} units</td>
                    <td className="text-right">
                      <span className="inline-flex items-center gap-0.5 text-emerald-600 font-bold text-xs">
                        <TrendingUp className="w-3 h-3" />
                        {p.trend}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Next Month Predictive Callout Card */}
        <div className="bento-card p-5 bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/40 border border-blue-200/60 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-100 text-indigo-700 border border-indigo-200">
                <Sparkles className="w-3 h-3" />
                ML Prediction
              </span>
              <span className="text-[11px] text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full font-bold">
                94.2% Confidence
              </span>
            </div>

            <h3 className="text-sm font-bold text-slate-800">
              Projected Next-Month Run Rate
            </h3>
            <p className="text-2xl font-black text-blue-600 mt-2">
              ₹14,48,000
            </p>
            <p className="text-xs text-slate-500 mt-1">
              +12.7% expected acceleration driven by festival shopping surge.
            </p>

            <div className="mt-4 p-3 rounded-xl bg-white/90 border border-slate-200/80 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Predicted Units:</span>
                <span className="font-bold text-slate-900">20,800 units</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Top Growth Category:</span>
                <span className="font-bold text-blue-600">Electronics (+18.4%)</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Recommended Buffer:</span>
                <span className="font-bold text-amber-600">+15% safety stock</span>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <Link
              to="/prediction"
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs"
            >
              <span>Explore Predictive Engine</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

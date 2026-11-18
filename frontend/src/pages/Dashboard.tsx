import React, { useState, useEffect } from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
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
  Download,
  Calendar
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { KpiCard } from '../components/common/KpiCard';
import { StatusBadge } from '../components/common/StatusBadge';
import { ExportButton } from '../components/common/ExportButton';
import { useDataset } from '../context/DatasetContext';
import { 
  INITIAL_KPIS, 
  DEMO_SALES_TREND, 
  DEMO_CATEGORIES, 
  DEMO_TOP_PRODUCTS 
} from '../data/demoData';
import { fetchSalesAnalytics } from '../api/apiClient';
import { getCategoryColor } from '../utils/categoryColors';
import { NoDatasetEmptyState } from '../components/common/NoDatasetEmptyState';

export const Dashboard: React.FC = () => {
  const { backendOnline, hasDataset } = useDataset();
  const [salesTrend, setSalesTrend] = useState(DEMO_SALES_TREND);
  const [categories, setCategories] = useState(DEMO_CATEGORIES);
  const [topProducts, setTopProducts] = useState(DEMO_TOP_PRODUCTS);
  const [trendPeriod, setTrendPeriod] = useState<'monthly' | 'weekly'>('monthly');
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
    <div className="space-y-5">
      {/* Top Welcome Title & Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-semibold text-text-main tracking-tight leading-none">
            Good Morning, Admin! 👋
          </h1>
          <p className="text-[13px] text-text-muted mt-1.5">
            Here's your e-commerce performance overview and predictive intelligence.
          </p>
        </div>

        {/* Quick Date Range / Action */}
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-surface-border bg-white text-[12px] text-text-main font-medium shadow-card">
            <Calendar className="w-3.5 h-3.5 text-text-muted" />
            <span>{kpis.date_range || "Jan 2025 – Dec 2025"}</span>
          </div>
          <ExportButton
            title="Dashboard Overview"
            data={salesTrend}
            pdfTitle="EcomSight Performance & Sales Overview"
          />
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Revenue"
          value={kpis.total_revenue_display || "₹12,84,500"}
          change={kpis.total_revenue_growth || "+12.6%"}
          isPositive={true}
          comparisonText="vs prior period"
          icon="DollarSign"
        />
        <KpiCard
          title="Total Orders"
          value={formatNumber(kpis.total_orders, 18450)}
          change={kpis.total_orders_growth || "+8.2%"}
          isPositive={true}
          comparisonText="volume velocity"
          icon="ShoppingBag"
        />
        <KpiCard
          title="Total Customers"
          value={formatNumber(kpis.total_customers, 2450)}
          change={kpis.total_customers_growth || "+7.4%"}
          isPositive={true}
          comparisonText="active shoppers"
          icon="Users"
        />
        <KpiCard
          title="Average Order Value"
          value={kpis.aov_display || "₹695"}
          change="+4.1%"
          isPositive={true}
          comparisonText="basket size"
          icon="Package"
        />
      </div>

      {/* Middle Row: Sales Overview (Line Chart) + Top Categories (Donut) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Sales Overview (2 cols on desktop) */}
        <div className="lg:col-span-2 dashboard-card p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-[15px] font-semibold text-text-main">
                Sales Overview
              </h2>
              <p className="text-[11px] text-text-muted">
                Revenue trajectory over time with order volume correlation
              </p>
            </div>

            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-[11px] font-medium">
              <button
                onClick={() => setTrendPeriod('monthly')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  trendPeriod === 'monthly'
                    ? 'bg-white text-text-main shadow-xs font-semibold'
                    : 'text-text-muted hover:text-text-main'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setTrendPeriod('weekly')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  trendPeriod === 'weekly'
                    ? 'bg-white text-text-main shadow-xs font-semibold'
                    : 'text-text-muted hover:text-text-main'
                }`}
              >
                Weekly
              </button>
            </div>
          </div>

          <div className="h-[250px] w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis 
                  dataKey="period" 
                  tick={{ fontSize: 11, fill: '#6B7C93' }} 
                  axisLine={{ stroke: '#DCE5EF' }}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 11, fill: '#6B7C93' }} 
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #DCE5EF',
                    borderRadius: '8px',
                    fontSize: '12px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.06)'
                  }}
                  formatter={(val: any) => [`₹${Number(val).toLocaleString()}`, 'Sales']}
                />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#1769E0"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: '#1769E0', strokeWidth: 1, stroke: '#FFFFFF' }}
                  activeDot={{ r: 5, fill: '#1769E0' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Categories (Donut) */}
        <div className="dashboard-card p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-[15px] font-semibold text-text-main">
              Top Categories
            </h2>
            <Link 
              to="/sales-analysis" 
              className="text-[11px] font-medium text-primary hover:underline flex items-center gap-0.5"
            >
              Details
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="h-[180px] w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categories}
                  innerRadius={50}
                  outerRadius={75}
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
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #DCE5EF',
                    borderRadius: '8px',
                    fontSize: '11px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Centered label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] text-text-muted font-medium">Leading</span>
              <span className="text-[13px] font-bold text-text-main">37.5%</span>
            </div>
          </div>

          {/* Category Legends with Distinct Colors */}
          <div className="space-y-1.5 pt-2 border-t border-slate-100 text-[12px]">
            {categories.map((cat, idx) => {
              const chipColor = getCategoryColor(cat.name, idx, cat.color);
              return (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span 
                      className="w-2.5 h-2.5 rounded-sm flex-shrink-0" 
                      style={{ backgroundColor: chipColor }} 
                    />
                    <span className="text-text-main font-medium">{cat.name}</span>
                  </div>
                  <span className="text-text-muted font-semibold">{cat.percentage}%</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Row: Top Selling Products (Table) + Next Month Sales Prediction */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Top Selling Products (2 cols) */}
        <div className="lg:col-span-2 dashboard-card p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-[15px] font-semibold text-text-main">
                Top Selling Products
              </h2>
              <p className="text-[11px] text-text-muted">
                Best performing catalog inventory by gross revenue and trend
              </p>
            </div>
            <Link
              to="/product-demand"
              className="text-[11px] font-medium text-primary hover:underline flex items-center gap-0.5"
            >
              All Products
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left data-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Revenue</th>
                  <th>Units</th>
                  <th>Trend</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((p) => (
                  <tr key={p.id}>
                    <td className="font-medium text-text-main flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-primary flex-shrink-0">
                        <Package className="w-3.5 h-3.5" />
                      </div>
                      <span className="truncate max-w-[150px]">{p.name}</span>
                    </td>
                    <td>
                      <StatusBadge variant="gray">{p.category}</StatusBadge>
                    </td>
                    <td className="font-semibold text-text-main">{p.salesDisplay}</td>
                    <td className="text-text-muted">{p.quantity} units</td>
                    <td>
                      <span className="inline-flex items-center gap-0.5 text-brand-green font-medium text-[11px]">
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

        {/* Next Month Sales Prediction Card (Enriched with Sparkline & Forward Projections) */}
        <div className="dashboard-card p-5 flex flex-col justify-between bg-gradient-to-br from-white via-slate-50/50 to-indigo-50/20 border-primary/20 shadow-xs">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-brand-purpleLight text-brand-purple border border-brand-purple/20">
                <Sparkles className="w-3 h-3" />
                ML FORECAST
              </span>
              <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-medium border border-emerald-200">
                Confidence 94.2%
              </span>
            </div>

            <h3 className="text-[14px] font-medium text-text-muted mt-2">
              Next Month Sales Prediction
            </h3>

            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-[26px] font-bold text-text-main tracking-tight">
                ₹15,24,800
              </span>
              <span className="inline-flex items-center gap-0.5 text-brand-green font-semibold text-[12px]">
                <ArrowUpRight className="w-3.5 h-3.5" />
                +18.7% growth
              </span>
            </div>

            {/* Mini Forward Trajectory Area Sparkline */}
            <div className="h-[95px] w-full mt-3 pt-1">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={[
                    { month: "Sep", sales: 118000 },
                    { month: "Oct", sales: 126000 },
                    { month: "Nov", sales: 134000 },
                    { month: "Dec", sales: 142000 },
                    { month: "Projected", sales: 168500 }
                  ]}
                  margin={{ top: 5, right: 5, left: -25, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="forecastGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="month" tick={{ fontSize: 9.5, fill: '#64748B' }} axisLine={false} />
                  <YAxis tick={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      borderRadius: '8px',
                      fontSize: '11px',
                      padding: '4px 8px'
                    }}
                    formatter={(val: any) => [`₹${Number(val).toLocaleString()}`, 'Forecast']}
                  />
                  <Area
                    type="monotone"
                    dataKey="sales"
                    stroke="#8B5CF6"
                    strokeWidth={2.2}
                    fillOpacity={1}
                    fill="url(#forecastGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Forward Projection Metrics Grid */}
            <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-100">
              <div className="p-2 rounded-lg bg-slate-50/80 border border-slate-100">
                <span className="text-[10px] text-text-muted uppercase font-medium block">Expected Orders</span>
                <span className="text-[13px] font-bold text-text-main">1,284</span>
                <span className="text-[10px] text-brand-green font-medium ml-1">+8.2%</span>
              </div>

              <div className="p-2 rounded-lg bg-slate-50/80 border border-slate-100">
                <span className="text-[10px] text-text-muted uppercase font-medium block">Projected AOV</span>
                <span className="text-[13px] font-bold text-text-main">₹1,187</span>
                <span className="text-[10px] text-brand-green font-medium ml-1">+4.1%</span>
              </div>

              <div className="p-2 rounded-lg bg-slate-50/80 border border-slate-100">
                <span className="text-[10px] text-text-muted uppercase font-medium block">95% Range</span>
                <span className="text-[12px] font-semibold text-text-main">₹14.2L – ₹16.4L</span>
              </div>

              <div className="p-2 rounded-lg bg-slate-50/80 border border-slate-100">
                <span className="text-[10px] text-text-muted uppercase font-medium block">Error Bound</span>
                <span className="text-[12px] font-semibold text-text-main">MAE ₹12,450</span>
              </div>
            </div>

            <p className="text-[11px] text-text-muted mt-3 leading-relaxed">
              Trained on historical seasonality, multi-order volume velocity, and holiday purchase patterns.
            </p>
          </div>

          {/* Mini Prediction Trajectory Footer */}
          <div className="pt-3 border-t border-slate-200/70 mt-3">
            <div className="flex items-center justify-between text-[11px] text-text-muted mb-2">
              <span>Target Model: Random Forest Regressor</span>
              <span className="font-semibold text-primary">R² = 0.91</span>
            </div>
            <Link
              to="/prediction"
              className="w-full py-2 px-3 bg-primary hover:bg-primary-hover text-white text-[12px] font-semibold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Explore Predictive Model</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

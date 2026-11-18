import React, { useState, useEffect } from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Layers, 
  TrendingUp, 
  ArrowUpRight, 
  PackageCheck, 
  AlertCircle,
  Sparkles,
  Search,
  Package,
  TrendingDown,
  ShoppingBag,
  Filter
} from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge';
import { ExportButton } from '../components/common/ExportButton';
import { useDataset } from '../context/DatasetContext';
import { fetchProductDemand } from '../api/apiClient';
import { DEMO_DEMAND_PRODUCTS, DEMO_CATEGORIES } from '../data/demoData';
import { NoDatasetEmptyState } from '../components/common/NoDatasetEmptyState';

type ViewMode = 'demand' | 'performance';
type FilterTab = 'Best Selling' | 'Lowest Selling' | 'Highest Revenue' | 'Fast Growing';

export const ProductDemand: React.FC = () => {
  const { backendOnline, hasDataset, datasetMeta } = useDataset();
  const [demandData, setDemandData] = useState<any[]>(DEMO_DEMAND_PRODUCTS);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('demand');
  const [performanceFilter, setPerformanceFilter] = useState<FilterTab>('Highest Revenue');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    if (backendOnline && hasDataset) {
      setIsLoading(true);
      fetchProductDemand()
        .then((data) => {
          if (isMounted && Array.isArray(data) && data.length > 0) {
            setDemandData(data);
          }
        })
        .catch((err) => {
          console.warn("Failed fetching live product demand:", err);
        })
        .finally(() => {
          if (isMounted) setIsLoading(false);
        });
    }
    return () => { isMounted = false; };
  }, [backendOnline, hasDataset, datasetMeta.filename]);

  if (!hasDataset) {
    return <NoDatasetEmptyState pageName="Product Analysis" />;
  }

  // Normalize data items for robust table and chart rendering
  const normalizedData = demandData.map((d: any) => {
    const cur = Number(d.currentSales ?? d.current_demand ?? 10);
    const pred = Number(d.predictedSales ?? d.predicted_demand ?? Math.round(cur * 1.15));
    const demandLvl = d.demandLevel ?? d.urgency ?? (pred > 60 ? 'High' : pred > 25 ? 'Medium' : 'Low');
    const growthStr = d.growth || `+${Math.round((pred - cur) / Math.max(1, cur) * 100)}%`;
    const rev = Number(d.revenue ?? cur * 1250);
    const revDisplay = d.revenue_display || `₹${rev.toLocaleString()}`;

    return {
      product: d.product || d.Product_Name || 'Product SKU',
      category: d.category || d.Category || 'General',
      currentSales: cur,
      predictedSales: pred,
      demandLevel: demandLvl,
      growth: growthStr,
      revenue: rev,
      revenue_display: revDisplay,
      isPositive: pred >= cur
    };
  });

  const filteredDemand = normalizedData.filter(d => 
    d.product.toLowerCase().includes(search.toLowerCase()) ||
    d.category.toLowerCase().includes(search.toLowerCase())
  );

  const getFilteredPerformance = () => {
    switch (performanceFilter) {
      case 'Best Selling':
        return [...normalizedData].sort((a, b) => b.currentSales - a.currentSales);
      case 'Lowest Selling':
        return [...normalizedData].sort((a, b) => a.currentSales - b.currentSales);
      case 'Highest Revenue':
        return [...normalizedData].sort((a, b) => b.revenue - a.revenue);
      case 'Fast Growing':
        return [...normalizedData].sort((a, b) => b.predictedSales - a.predictedSales);
      default:
        return normalizedData;
    }
  };

  const performanceList = getFilteredPerformance().filter(p =>
    p.product.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  // Group by category for distribution
  const categoryMap: Record<string, number> = {};
  normalizedData.forEach(d => {
    categoryMap[d.category] = (categoryMap[d.category] || 0) + d.revenue;
  });
  const categoryBreakdown = Object.entries(categoryMap).map(([name, sales]) => ({
    name,
    sales,
    percentage: Math.round(sales / Math.max(1, Object.values(categoryMap).reduce((a, b) => a + b, 0)) * 100)
  }));

  const PIE_COLORS = ['#1769E0', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4'];

  return (
    <div className="space-y-5">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-semibold text-text-main tracking-tight leading-none">
            Product Analysis
          </h1>
          <p className="text-[13px] text-text-muted mt-1.5">
            SKU demand forecasting, velocity metrics, restock urgency, and catalog revenue performance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <ExportButton
            title={`Product_Analysis_${datasetMeta.filename.split('.')[0]}`}
            data={normalizedData}
            pdfTitle={`ECOMSIGHT Product Analysis Report (${datasetMeta.filename})`}
          />
        </div>
      </div>

      {/* Active Dataset Context Badge */}
      <div className="p-3.5 rounded-xl bg-slate-50 border border-surface-border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[12px]">
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 text-primary" />
          <span className="text-text-muted">Analyzing Active Catalog:</span>
          <span className="font-semibold text-text-main bg-white px-2.5 py-0.5 rounded-md border border-slate-200">
            {datasetMeta.filename}
          </span>
          <span className="text-text-muted font-mono text-[11px]">
            ({normalizedData.length} distinct catalog SKUs modeled)
          </span>
        </div>
        <span className="text-[11px] text-text-muted">
          {isLoading ? 'Computing machine learning projections...' : 'Projections fit against historical transaction volume'}
        </span>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex items-center justify-between gap-3 border-b border-surface-border pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('demand')}
            className={`px-4 py-2 rounded-lg text-[13px] font-semibold transition-all flex items-center gap-2 ${
              viewMode === 'demand'
                ? 'bg-primary text-white shadow-xs'
                : 'bg-white border border-surface-border text-text-muted hover:text-text-main hover:bg-slate-50'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Demand Forecasting & Velocity</span>
          </button>

          <button
            onClick={() => setViewMode('performance')}
            className={`px-4 py-2 rounded-lg text-[13px] font-semibold transition-all flex items-center gap-2 ${
              viewMode === 'performance'
                ? 'bg-primary text-white shadow-xs'
                : 'bg-white border border-surface-border text-text-muted hover:text-text-main hover:bg-slate-50'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Catalog Revenue Performance</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative max-w-xs w-full hidden sm:block">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-text-light" />
          <input
            type="text"
            placeholder="Search SKU or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-[12px] bg-white border border-surface-border rounded-lg text-text-main focus:border-primary outline-none"
          />
        </div>
      </div>

      {viewMode === 'demand' ? (
        <>
          {/* Predicted vs Current Sales Grouped Bar Chart */}
          <div className="dashboard-card p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-[15px] font-semibold text-text-main">
                  Forecasted SKU Demand Velocity
                </h3>
                <p className="text-[11px] text-text-muted">
                  Baseline units sold vs projected demand volume for top SKUs
                </p>
              </div>

              <div className="flex items-center gap-4 text-[12px] font-medium">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-slate-400 inline-block" />
                  <span className="text-text-muted">Current Sales</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-primary inline-block" />
                  <span className="text-primary font-semibold">Predicted Demand</span>
                </div>
              </div>
            </div>

            <div className="h-[290px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={filteredDemand.slice(0, 10)} margin={{ top: 15, right: 15, left: -20, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis 
                    dataKey="product" 
                    tick={{ fontSize: 10, fill: '#6B7C93' }} 
                    axisLine={{ stroke: '#DCE5EF' }}
                    interval={0}
                    angle={-15}
                    textAnchor="end"
                  />
                  <YAxis 
                    tick={{ fontSize: 11, fill: '#6B7C93' }} 
                    axisLine={false} 
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #DCE5EF',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                    formatter={(val: any, name: any) => [
                      `${Number(val).toLocaleString()} units`, 
                      name === 'currentSales' ? 'Current Sales' : 'Predicted Demand'
                    ]}
                  />
                  <Bar dataKey="currentSales" fill="#94A3B8" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="predictedSales" fill="#1769E0" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* SKU Demand Prediction Table */}
          <div className="dashboard-card p-5">
            <div className="flex items-center justify-between pb-3 border-b border-surface-border mb-3">
              <div>
                <h2 className="text-[15px] font-semibold text-text-main">
                  SKU Demand & Restock Hierarchy
                </h2>
                <p className="text-[11px] text-text-muted">
                  Classification of catalog items by forward projection and restock priority
                </p>
              </div>
              <span className="text-[11px] text-text-muted">
                {filteredDemand.length} SKUs Modeled
              </span>
            </div>

            <div className="overflow-x-auto border border-surface-border rounded-lg">
              <table className="w-full text-left data-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Current Units</th>
                    <th>Predicted Units</th>
                    <th>Restock Urgency</th>
                    <th>Forecast Growth</th>
                    <th>Revenue Impact</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDemand.map((item, idx) => (
                    <tr key={idx}>
                      <td className="font-semibold text-text-main">
                        {item.product}
                      </td>
                      <td className="text-text-muted text-[12px]">
                        {item.category}
                      </td>
                      <td className="text-text-muted font-medium">
                        {item.currentSales.toLocaleString()} units
                      </td>
                      <td className="text-text-main font-bold">
                        {item.predictedSales.toLocaleString()} units
                      </td>
                      <td>
                        <StatusBadge
                          variant={
                            item.demandLevel === 'High'
                              ? 'red'
                              : item.demandLevel === 'Medium'
                              ? 'amber'
                              : 'green'
                          }
                        >
                          {item.demandLevel} Urgency
                        </StatusBadge>
                      </td>
                      <td>
                        <span className="inline-flex items-center gap-0.5 text-brand-green font-medium text-[11px]">
                          <ArrowUpRight className="w-3 h-3" />
                          {item.growth}
                        </span>
                      </td>
                      <td className="font-semibold text-slate-800 text-[12.5px]">
                        {item.revenue_display}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Performance Filter Pills */}
          <div className="dashboard-card p-2 flex flex-wrap items-center gap-1.5 bg-white border border-surface-border">
            {(['Highest Revenue', 'Best Selling', 'Lowest Selling', 'Fast Growing'] as FilterTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setPerformanceFilter(tab)}
                className={`px-3.5 py-1.5 rounded-lg text-[12px] font-semibold transition-all ${
                  performanceFilter === tab
                    ? 'bg-primary text-white shadow-xs'
                    : 'text-text-muted hover:text-text-main hover:bg-slate-100'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Catalog Performance Table (2 cols) */}
            <div className="lg:col-span-2 dashboard-card p-5">
              <div className="flex items-center justify-between pb-3 border-b border-surface-border mb-3">
                <div>
                  <h2 className="text-[15px] font-semibold text-text-main">
                    Catalog Performance Ranking
                  </h2>
                  <span className="text-[11px] text-text-muted">
                    Filtered by: <strong className="text-text-main">{performanceFilter}</strong>
                  </span>
                </div>
                <span className="text-[11px] text-text-muted">{performanceList.length} items</span>
              </div>

              <div className="overflow-x-auto border border-surface-border rounded-lg">
                <table className="w-full text-left data-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Category</th>
                      <th>Units Sold</th>
                      <th>Total Revenue</th>
                      <th>Trajectory</th>
                    </tr>
                  </thead>
                  <tbody>
                    {performanceList.map((item, idx) => (
                      <tr key={idx}>
                        <td className="font-semibold text-text-main">
                          {item.product}
                        </td>
                        <td className="text-text-muted text-[12px]">
                          {item.category}
                        </td>
                        <td className="text-text-main font-semibold">
                          {item.currentSales.toLocaleString()}
                        </td>
                        <td className="font-bold text-text-main">
                          {item.revenue_display}
                        </td>
                        <td>
                          <span className="inline-flex items-center gap-0.5 text-brand-green font-medium text-[11px]">
                            <ArrowUpRight className="w-3 h-3" />
                            {item.growth}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Category Revenue Contribution Donut */}
            <div className="dashboard-card p-5 flex flex-col justify-between">
              <div>
                <h3 className="text-[15px] font-semibold text-text-main">
                  Category Revenue Share
                </h3>
                <p className="text-[11px] text-text-muted mt-0.5">
                  Proportional distribution across departments
                </p>

                <div className="h-[200px] w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryBreakdown}
                        dataKey="sales"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={75}
                        paddingAngle={3}
                      >
                        {categoryBreakdown.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(val: any) => [`₹${Number(val).toLocaleString()}`, 'Revenue']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-2 mt-4 pt-3 border-t border-slate-100">
                  {categoryBreakdown.map((cat, idx) => (
                    <div key={idx} className="flex items-center justify-between text-[12px]">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }}
                        />
                        <span className="text-text-main font-medium">{cat.name}</span>
                      </div>
                      <span className="font-semibold text-text-main">{cat.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

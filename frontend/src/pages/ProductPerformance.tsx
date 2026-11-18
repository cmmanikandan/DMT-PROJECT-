import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { 
  Package, 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  ArrowDownRight,
  Filter,
  Layers
} from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge';
import { ExportButton } from '../components/common/ExportButton';
import { DEMO_CATEGORIES } from '../data/demoData';
import { getCategoryColor } from '../utils/categoryColors';
import { useDataset } from '../context/DatasetContext';
import { NoDatasetEmptyState } from '../components/common/NoDatasetEmptyState';

type FilterTab = 'Best Selling' | 'Lowest Selling' | 'Highest Revenue' | 'Fast Growing' | 'Declining';

interface PerformanceProduct {
  id: string;
  name: string;
  category: string;
  sales: number;
  salesDisplay: string;
  units: number;
  trend: string;
  isPositive: boolean;
  margin: string;
}

const ALL_PRODUCTS: PerformanceProduct[] = [
  { id: "P1", name: "Wireless Earbuds", category: "Electronics", sales: 245000, salesDisplay: "₹2,45,000", units: 98, trend: "+15.2%", isPositive: true, margin: "42%" },
  { id: "P2", name: "Running Shoes", category: "Footwear", sales: 198400, salesDisplay: "₹1,98,400", units: 62, trend: "+11.8%", isPositive: true, margin: "38%" },
  { id: "P3", name: "Smart Watch v2", category: "Electronics", sales: 184000, salesDisplay: "₹1,84,000", units: 46, trend: "+9.4%", isPositive: true, margin: "45%" },
  { id: "P4", name: "Ergonomic Laptop Backpack", category: "Accessories", sales: 142500, salesDisplay: "₹1,42,500", units: 75, trend: "+6.1%", isPositive: true, margin: "52%" },
  { id: "P5", name: "Slim Fit Denim Jeans", category: "Apparel", sales: 124000, salesDisplay: "₹1,24,000", units: 69, trend: "+4.9%", isPositive: true, margin: "48%" },
  { id: "P6", name: "Cotton Crew T-Shirt", category: "Apparel", sales: 98000, salesDisplay: "₹98,000", units: 140, trend: "+2.3%", isPositive: true, margin: "35%" },
  { id: "P7", name: "Polarized Sunglasses", category: "Accessories", sales: 64500, salesDisplay: "₹64,500", units: 50, trend: "-3.1%", isPositive: false, margin: "55%" },
  { id: "P8", name: "Bluetooth Speaker", category: "Electronics", sales: 56900, salesDisplay: "₹56,900", units: 30, trend: "-5.4%", isPositive: false, margin: "32%" },
  { id: "P9", name: "Leather Formal Shoes", category: "Footwear", sales: 44990, salesDisplay: "₹44,990", units: 10, trend: "-8.2%", isPositive: false, margin: "40%" },
  { id: "P10", name: "Sports Socks (Pack of 3)", category: "Footwear", sales: 23940, salesDisplay: "₹23,940", units: 60, trend: "-1.5%", isPositive: false, margin: "28%" }
];

export const ProductPerformance: React.FC = () => {
  const { hasDataset } = useDataset();
  const [activeTab, setActiveTab] = useState<FilterTab>('Best Selling');

  if (!hasDataset) {
    return <NoDatasetEmptyState pageName="Product Performance" />;
  }

  const getFilteredProducts = () => {
    switch (activeTab) {
      case 'Best Selling':
        return [...ALL_PRODUCTS].sort((a, b) => b.units - a.units);
      case 'Lowest Selling':
        return [...ALL_PRODUCTS].sort((a, b) => a.units - b.units);
      case 'Highest Revenue':
        return [...ALL_PRODUCTS].sort((a, b) => b.sales - a.sales);
      case 'Fast Growing':
        return [...ALL_PRODUCTS].filter(p => p.isPositive);
      case 'Declining':
        return [...ALL_PRODUCTS].filter(p => !p.isPositive);
      default:
        return ALL_PRODUCTS;
    }
  };

  const displayedProducts = getFilteredProducts();

  const categoryBarData = DEMO_CATEGORIES.map(c => ({
    name: c.name,
    sales: c.sales,
    units: Math.round(c.sales / 1200)
  }));

  return (
    <div className="space-y-5">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-semibold text-text-main tracking-tight leading-none">
            Product Performance
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <ExportButton
            title="Product_Performance_Report"
            data={displayedProducts}
            pdfTitle="ECOMSIGHT Product Performance Analytics"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="dashboard-card p-2 flex flex-wrap items-center gap-1.5 bg-white border border-surface-border">
        {(['Best Selling', 'Lowest Selling', 'Highest Revenue', 'Fast Growing', 'Declining'] as FilterTab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3.5 py-1.5 rounded-lg text-[12px] font-semibold transition-all ${
              activeTab === tab
                ? 'bg-primary text-white shadow-xs'
                : 'text-text-muted hover:text-text-main hover:bg-slate-100'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Main Table Card */}
      <div className="dashboard-card p-5">
        <div className="flex items-center justify-between pb-3 border-b border-surface-border mb-3">
          <div>
            <h2 className="text-[15px] font-semibold text-text-main">
              Catalog Performance Table
            </h2>
            <span className="text-[11px] text-text-muted">
              Filtered by: <strong className="text-text-main">{activeTab}</strong>
            </span>
          </div>

          <StatusBadge variant="blue">
            {displayedProducts.length} Items Listed
          </StatusBadge>
        </div>

        <div className="overflow-x-auto border border-surface-border rounded-lg">
          <table className="w-full text-left data-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Total Revenue</th>
                <th>Units Sold</th>
                <th>Profit Margin</th>
                <th>Trend</th>
              </tr>
            </thead>
            <tbody>
              {displayedProducts.map((p) => (
                <tr key={p.id}>
                  <td className="font-semibold text-text-main flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-primary flex-shrink-0">
                      <Package className="w-3.5 h-3.5" />
                    </div>
                    <span>{p.name}</span>
                  </td>
                  <td>
                    <StatusBadge variant="gray">{p.category}</StatusBadge>
                  </td>
                  <td className="font-bold text-text-main">{p.salesDisplay}</td>
                  <td className="text-text-muted font-medium">{p.units} units</td>
                  <td className="text-text-main font-semibold">{p.margin}</td>
                  <td>
                    <span className={`inline-flex items-center gap-0.5 text-[11px] font-medium ${
                      p.isPositive ? 'text-brand-green' : 'text-brand-red'
                    }`}>
                      {p.isPositive ? (
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      ) : (
                        <ArrowDownRight className="w-3.5 h-3.5" />
                      )}
                      {p.trend}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Below: Sales by Category (Bar Chart) + Top Categories (Donut Chart) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Sales by Category Bar */}
        <div className="dashboard-card p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[15px] font-semibold text-text-main">
              Sales by Category (Revenue)
            </h3>
            <span className="text-[11px] text-text-muted">Aggregate volume</span>
          </div>

          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryBarData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#6B7C93' }} axisLine={{ stroke: '#DCE5EF' }} />
                <YAxis tick={{ fontSize: 11, fill: '#6B7C93' }} axisLine={false} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
                <Tooltip formatter={(val: any) => [`₹${Number(val).toLocaleString()}`, 'Revenue']} />
                <Bar dataKey="sales" radius={[4, 4, 0, 0]}>
                  {categoryBarData.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={getCategoryColor(entry.name, index)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Categories Donut */}
        <div className="dashboard-card p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[15px] font-semibold text-text-main">
              Top Categories Share
            </h3>
            <span className="text-[11px] text-text-muted">Proportional Split</span>
          </div>

          <div className="h-[180px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={DEMO_CATEGORIES}
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="percentage"
                >
                  {DEMO_CATEGORIES.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getCategoryColor(entry.name, index, entry.color)} />
                  ))}
                </Pie>
                <Tooltip formatter={(val: any, name: any) => [`${val}%`, name]} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-[12px]">
            {DEMO_CATEGORIES.map((c, idx) => {
              const chipColor = getCategoryColor(c.name, idx, c.color);
              return (
                <div key={idx} className="flex items-center justify-between p-1.5 rounded bg-slate-50">
                  <span className="flex items-center gap-1.5 font-medium text-text-main">
                    <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: chipColor }} />
                    {c.name}
                  </span>
                  <span className="font-semibold text-text-muted">{c.percentage}%</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

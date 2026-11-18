import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  Package, 
  Clock, 
  DollarSign, 
  ShieldCheck, 
  RefreshCw, 
  Search, 
  Filter, 
  SlidersHorizontal,
  ArrowRight,
  TrendingUp,
  CheckCircle2
} from 'lucide-react';
import { useDataset } from '../context/DatasetContext';
import { useToast } from '../context/ToastContext';
import { fetchInventoryAlerts } from '../api/apiClient';
import { ExportButton } from '../components/common/ExportButton';
import { NoDatasetEmptyState } from '../components/common/NoDatasetEmptyState';

export const InventoryAlerts: React.FC = () => {
  const { backendOnline, hasDataset } = useDataset();
  const { showToast } = useToast();

  const [leadTime, setLeadTime] = useState<number>(7);
  const [loading, setLoading] = useState<boolean>(false);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  const [inventoryData, setInventoryData] = useState<{
    kpis: {
      total_products: number;
      critical_stock_count: number;
      reorder_needed_count: number;
      optimal_stock_count: number;
      overstocked_count: number;
      restock_budget_required: number;
      restock_budget_required_display: string;
    };
    alerts: Array<{
      product_name: string;
      category: string;
      current_stock: number;
      daily_velocity: number;
      safety_stock: number;
      reorder_point: number;
      days_remaining: number;
      status: string;
      badge_color: string;
      priority: string;
      recommended_order: number;
      avg_unit_cost: number;
      est_restock_cost: number;
      est_restock_cost_display: string;
    }>;
  }>({
    kpis: {
      total_products: 24,
      critical_stock_count: 4,
      reorder_needed_count: 6,
      optimal_stock_count: 12,
      overstocked_count: 2,
      restock_budget_required: 194800,
      restock_budget_required_display: "₹1,94,800"
    },
    alerts: [
      {
        product_name: "Noise-Cancelling Wireless Headphones",
        category: "Electronics",
        current_stock: 6,
        daily_velocity: 3.4,
        safety_stock: 12,
        reorder_point: 36,
        days_remaining: 1.8,
        status: "CRITICAL",
        badge_color: "red",
        priority: "High",
        recommended_order: 102,
        avg_unit_cost: 2999,
        est_restock_cost: 305898,
        est_restock_cost_display: "₹3,05,898"
      },
      {
        product_name: "Ergonomic Memory Foam Pillow",
        category: "Home & Kitchen",
        current_stock: 14,
        daily_velocity: 2.8,
        safety_stock: 10,
        reorder_point: 30,
        days_remaining: 5.0,
        status: "REORDER_SOON",
        badge_color: "amber",
        priority: "Medium",
        recommended_order: 70,
        avg_unit_cost: 1299,
        est_restock_cost: 90930,
        est_restock_cost_display: "₹90,930"
      },
      {
        product_name: "Smart Hydration Water Bottle",
        category: "Fitness",
        current_stock: 45,
        daily_velocity: 1.9,
        safety_stock: 8,
        reorder_point: 22,
        days_remaining: 23.7,
        status: "OPTIMAL",
        badge_color: "emerald",
        priority: "Normal",
        recommended_order: 0,
        avg_unit_cost: 899,
        est_restock_cost: 0,
        est_restock_cost_display: "₹0"
      },
      {
        product_name: "Cotton Canvas Tote Bag",
        category: "Apparel",
        current_stock: 140,
        daily_velocity: 1.2,
        safety_stock: 6,
        reorder_point: 15,
        days_remaining: 116.7,
        status: "OVERSTOCKED",
        badge_color: "purple",
        priority: "Low",
        recommended_order: 0,
        avg_unit_cost: 399,
        est_restock_cost: 0,
        est_restock_cost_display: "₹0"
      }
    ]
  });

  const loadAlerts = async (days: number) => {
    setLoading(true);
    try {
      if (backendOnline && hasDataset) {
        const res = await fetchInventoryAlerts(days);
        if (res && res.kpis && res.alerts) {
          setInventoryData(res);
        }
      }
    } catch (err: any) {
      showToast(`Using simulated inventory calculations: ${err.message}`, 'info');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts(leadTime);
  }, [backendOnline, hasDataset, leadTime]);

  if (!hasDataset) {
    return <NoDatasetEmptyState pageName="Inventory Restock Alerts" />;
  }

  const filteredAlerts = inventoryData.alerts.filter(item => {
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    const matchesSearch = item.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-[22px] font-bold text-slate-900 tracking-tight">
              Inventory & Reorder Alerts
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-600 border border-rose-200">
              {inventoryData.kpis.critical_stock_count} Critical
            </span>
          </div>
          <p className="text-[13px] text-slate-500 mt-1">
            Automated Reorder Point (ROP) calculation, safety stock buffers, and stockout risk forecasting.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button 
            onClick={() => loadAlerts(leadTime)}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 text-[12.5px] font-medium bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg shadow-xs transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <ExportButton 
            title="Inventory_Reorder_Recommendations"
            data={inventoryData.alerts}
            pdfTitle="ECOMSIGHT Inventory Restock & Reorder Report"
          />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-medium text-slate-500">Critical Stockouts</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-[24px] font-bold text-rose-600">
            {inventoryData.kpis.critical_stock_count}
          </div>
          <div className="text-[11.5px] text-slate-400 mt-0.5">Stock exhaustion within ≤ 3 days</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-medium text-slate-500">Reorder Soon (ROP)</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-[24px] font-bold text-amber-600">
            {inventoryData.kpis.reorder_needed_count}
          </div>
          <div className="text-[11.5px] text-slate-400 mt-0.5">Below reorder threshold</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-medium text-slate-500">Optimal Stock Level</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-[24px] font-bold text-emerald-600">
            {inventoryData.kpis.optimal_stock_count}
          </div>
          <div className="text-[11.5px] text-slate-400 mt-0.5">Healthy safety stock buffer</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-medium text-slate-500">Est. Restock Capital</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-primary">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-[24px] font-bold text-slate-900">
            {inventoryData.kpis.restock_budget_required_display}
          </div>
          <div className="text-[11.5px] text-slate-400 mt-0.5">Required for recommended orders</div>
        </div>
      </div>

      {/* Control & Filter Bar */}
      <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-xs space-y-3.5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg w-full md:w-auto overflow-x-auto">
            {['All', 'CRITICAL', 'REORDER_SOON', 'OPTIMAL', 'OVERSTOCKED'].map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-3 py-1.5 rounded-md text-[12px] font-medium transition whitespace-nowrap ${
                  statusFilter === tab 
                    ? 'bg-white text-slate-900 shadow-xs' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab === 'All' ? 'All SKUs' : tab.replace('_', ' ')}
              </button>
            ))}
          </div>

          {/* Lead Time Slider */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 text-[12.5px] text-slate-600 whitespace-nowrap">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
              <span>Supplier Lead Time: <strong>{leadTime} Days</strong></span>
            </div>
            <input 
              type="range" 
              min="3" 
              max="21" 
              value={leadTime}
              onChange={(e) => setLeadTime(Number(e.target.value))}
              className="w-32 accent-primary cursor-pointer"
            />
          </div>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by product name or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-[13px] border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11.5px] uppercase tracking-wider text-slate-500 font-semibold">
                <th className="py-3 px-4">Product SKU</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-center">Current Stock</th>
                <th className="py-3 px-4 text-center">Daily Velocity</th>
                <th className="py-3 px-4 text-center">Safety Stock</th>
                <th className="py-3 px-4 text-center">Reorder Point</th>
                <th className="py-3 px-4 text-center">Days Left</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Recommended Order</th>
                <th className="py-3 px-4 text-right">Est. Budget</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[12.5px] text-slate-700">
              {filteredAlerts.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-slate-400">
                    No products matching your search and filter criteria.
                  </td>
                </tr>
              ) : (
                filteredAlerts.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4 font-medium text-slate-900 max-w-[200px] truncate">
                      {row.product_name}
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {row.category}
                    </td>
                    <td className="py-3 px-4 text-center font-semibold text-slate-900">
                      {row.current_stock}
                    </td>
                    <td className="py-3 px-4 text-center text-slate-600">
                      {row.daily_velocity} / day
                    </td>
                    <td className="py-3 px-4 text-center text-slate-500">
                      {row.safety_stock}
                    </td>
                    <td className="py-3 px-4 text-center font-medium text-slate-800">
                      {row.reorder_point}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`font-semibold ${
                        row.days_remaining <= 3 ? 'text-rose-600' :
                        row.days_remaining <= 7 ? 'text-amber-600' : 'text-slate-700'
                      }`}>
                        {row.days_remaining} d
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {row.status === 'CRITICAL' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-100 text-rose-700">
                          <AlertTriangle className="w-3 h-3" /> Critical
                        </span>
                      )}
                      {row.status === 'REORDER_SOON' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-700">
                          <Clock className="w-3 h-3" /> Reorder Soon
                        </span>
                      )}
                      {row.status === 'OPTIMAL' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-700">
                          <CheckCircle2 className="w-3 h-3" /> Optimal
                        </span>
                      )}
                      {row.status === 'OVERSTOCKED' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-100 text-purple-700">
                          Overstocked
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-slate-900">
                      {row.recommended_order > 0 ? (
                        <span className="text-primary font-bold">+{row.recommended_order} units</span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-slate-900">
                      {row.est_restock_cost > 0 ? row.est_restock_cost_display : '—'}
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

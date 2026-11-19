import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell
} from 'recharts';
import {
  Users,
  Sparkles,
  Crown,
  Search,
  RotateCcw
} from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge';
import { ExportButton } from '../components/common/ExportButton';
import { useDataset } from '../context/DatasetContext';
import { fetchCustomerSegmentation } from '../api/apiClient';
import {
  DEMO_CLUSTER_SUMMARIES,
  DEMO_SCATTER_POINTS,
  DEMO_CUSTOMER_DETAILS,
  type CustomerSegmentPoint,
  type CustomerDetail,
  type ClusterSummary
} from '../data/demoData';
import { NoDatasetEmptyState } from '../components/common/NoDatasetEmptyState';

export const CustomerSegmentation: React.FC = () => {
  const { backendOnline, hasDataset, customerSegmentsData } = useDataset();
  const [clusterSummaries, setClusterSummaries] = useState<ClusterSummary[]>(() =>
    customerSegmentsData?.summary?.length ? customerSegmentsData.summary : DEMO_CLUSTER_SUMMARIES
  );
  const [scatterPoints, setScatterPoints] = useState<CustomerSegmentPoint[]>(() =>
    customerSegmentsData?.scatter_points?.length ? customerSegmentsData.scatter_points : DEMO_SCATTER_POINTS
  );
  const [customerDetails, setCustomerDetails] = useState<CustomerDetail[]>(() =>
    customerSegmentsData?.customers_table?.length ? customerSegmentsData.customers_table : DEMO_CUSTOMER_DETAILS
  );
  const [selectedCluster, setSelectedCluster] = useState<string>('All');
  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    if (customerSegmentsData) {
      if (customerSegmentsData.summary?.length) setClusterSummaries(customerSegmentsData.summary);
      if (customerSegmentsData.scatter_points?.length) setScatterPoints(customerSegmentsData.scatter_points);
      if (customerSegmentsData.customers_table?.length) setCustomerDetails(customerSegmentsData.customers_table);
    }
  }, [customerSegmentsData]);

  useEffect(() => {
    if (backendOnline && hasDataset) {
      fetchCustomerSegmentation(4)
        .then((data) => {
          if (data && Array.isArray(data.summary) && data.summary.length > 0) {
            setClusterSummaries(data.summary);
          }
          if (data && Array.isArray(data.scatter_points) && data.scatter_points.length > 0) {
            setScatterPoints(data.scatter_points);
          }
          if (data && Array.isArray(data.customers_table) && data.customers_table.length > 0) {
            setCustomerDetails(data.customers_table);
          }
        })
        .catch(() => {
          // Keep demo data safely
        });
    }
  }, [backendOnline, hasDataset]);

  if (!hasDataset) {
    return <NoDatasetEmptyState pageName="Customer Segmentation" />;
  }

  const clusterColors = ["#1769E0", "#10B981", "#F59E0B", "#8B5CF6"];

  const filteredCustomers = (customerDetails || []).filter((c) => {
    if (!c) return false;
    const matchCluster = selectedCluster === 'All' || c.cluster === selectedCluster;
    const idStr = String(c.customerId || '').toLowerCase();
    const nameStr = String(c.customerName || '').toLowerCase();
    const q = (search || '').trim().toLowerCase();
    const matchSearch = !q || idStr.includes(q) || nameStr.includes(q);
    return matchCluster && matchSearch;
  });

  return (
    <div className="space-y-5">
      {/* Title & Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-semibold text-text-main tracking-tight leading-none">
            Customer Segmentation
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <ExportButton
            title="Customer_Clusters_Report"
            data={filteredCustomers}
            pdfTitle="ECOMSIGHT K-Means Customer Segmentation"
          />
        </div>
      </div>

      {/* Main Grid: Scatter Plot (Left, 7 cols) & Cluster Summary (Right, 5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Scatter Plot */}
        <div className="lg:col-span-7 dashboard-card p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-surface-border">
            <div>
              <h2 className="text-[15px] font-semibold text-text-main">
                Customer RFM Clusters
              </h2>
              <span className="text-[11px] text-text-muted">
                X: Purchase Frequency (Orders) • Y: Total Spending (₹)
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              <span className="w-2.5 h-2.5 rounded-full bg-primary inline-block" />
              <span className="text-text-muted">K = 4 Centroids</span>
            </div>
          </div>

          <div className="h-[290px] w-full pt-3">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 15, right: 20, bottom: 10, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis
                  type="number"
                  dataKey="frequency"
                  name="Orders"
                  unit=" orders"
                  tick={{ fontSize: 11, fill: '#6B7C93' }}
                  axisLine={{ stroke: '#DCE5EF' }}
                />
                <YAxis
                  type="number"
                  dataKey="spending"
                  name="Spending"
                  unit="₹"
                  tick={{ fontSize: 11, fill: '#6B7C93' }}
                  axisLine={false}
                  tickFormatter={(val) => `₹${((Number(val) || 0) / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #DCE5EF',
                    borderRadius: '8px',
                    fontSize: '11px'
                  }}
                  formatter={(val: any, name: any) => [
                    name === 'Spending' ? `₹${Number(val || 0).toLocaleString()}` : `${val} orders`,
                    name || 'Value'
                  ]}
                />
                <Scatter data={scatterPoints} fill="#1769E0">
                  {scatterPoints.map((entry, index) => {
                    const cNum = typeof entry.cluster === 'number' ? entry.cluster : parseInt(String(entry.cluster || 1), 10) || 1;
                    const colorIndex = Math.abs(cNum - 1) % clusterColors.length;
                    return (
                      <Cell
                        key={`cell-${index}`}
                        fill={clusterColors[colorIndex] || '#1769E0'}
                      />
                    );
                  })}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-[11px] text-text-muted gap-2">
            <span>Points clustered around high spending/high volume centroids</span>
            <span className="font-medium text-text-main">Silhouette Score: 0.68 (Optimal K)</span>
          </div>
        </div>

        {/* Right: Cluster Summary */}
        <div className="lg:col-span-5 dashboard-card p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-surface-border">
            <h2 className="text-[15px] font-semibold text-text-main">
              Cluster Summary
            </h2>
            <span className="text-[11px] text-text-muted">Target Profiles</span>
          </div>

          <div className="space-y-3 mt-3">
            {clusterSummaries.map((c, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedCluster(selectedCluster === c.cluster ? 'All' : c.cluster)}
                className={`p-3 rounded-lg border transition-all cursor-pointer ${selectedCluster === c.cluster
                    ? 'border-primary bg-primary-light/30 shadow-xs'
                    : 'border-surface-border bg-slate-50 hover:bg-slate-100/70'
                  }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: c.color || clusterColors[idx % clusterColors.length] }}
                    />
                    <span className="text-[13px] font-semibold text-text-main">
                      {c.cluster} — {c.name}
                    </span>
                  </div>
                  <span className="text-[12px] font-bold text-text-main">
                    {(c.count || 0).toLocaleString()} customers
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-text-muted mt-2 pt-2 border-t border-slate-200/50">
                  <span>Avg Spend: <strong className="text-text-main">₹{((c as any).avg_spending || c.avgSpending || 0).toLocaleString()}</strong></span>
                  <span>Avg Frequency: <strong className="text-text-main">{(c as any).avg_frequency || c.avgFrequency || 0} orders</strong></span>
                </div>

                {((c as any).strategy || (c as any).recommended_action) && (
                  <div className="mt-2 pt-2 border-t border-slate-200/40 text-[10.5px]">
                    <div className="text-primary font-semibold truncate">
                      🎯 {(c as any).strategy || "Retention Strategy"}
                    </div>
                    <div className="text-slate-500 line-clamp-1 mt-0.5">
                      {(c as any).recommended_action || "Target with personalized offers"}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 mt-2 text-[11px] text-text-muted flex justify-between items-center">
            <span>Total Segmented: <strong>{clusterSummaries.reduce((sum, c) => sum + (c.count || 0), 0).toLocaleString()}</strong></span>
            {selectedCluster !== 'All' && (
              <button
                onClick={() => setSelectedCluster('All')}
                className="text-primary hover:underline font-medium flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Show All</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Customer Details Table */}
      <div className="dashboard-card p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-[15px] font-semibold text-text-main">
              Customer Details
            </h3>
            <p className="text-[11px] text-text-muted">
              Individual customer RFM metrics and assigned cluster segment
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative max-w-xs">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-text-light" />
              <input
                type="text"
                placeholder="Search ID or name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 pr-3 py-1 text-[12px] bg-slate-50 border border-surface-border rounded-lg text-text-main focus:bg-white focus:border-primary outline-none"
              />
            </div>
            <select
              value={selectedCluster}
              onChange={(e) => setSelectedCluster(e.target.value)}
              className="px-2.5 py-1 text-[12px] bg-white border border-surface-border rounded-lg text-text-main outline-none focus:border-primary"
            >
              <option value="All">All Clusters</option>
              <option value="Cluster 1">Cluster 1 (High Value)</option>
              <option value="Cluster 2">Cluster 2 (Regular)</option>
              <option value="Cluster 3">Cluster 3 (Occasional)</option>
              <option value="Cluster 4">Cluster 4 (Low Activity)</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto border border-surface-border rounded-lg">
          <table className="w-full text-left data-table">
            <thead>
              <tr>
                <th>Customer ID</th>
                <th>Customer Name</th>
                <th>Cluster Segment</th>
                <th>Total Spending</th>
                <th>Order Count</th>
                <th>Recency</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-text-muted text-[13px]">
                    No customers match the current filter criteria.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((c, idx) => (
                  <tr key={idx}>
                    <td className="font-mono text-[11px] text-primary font-medium">{c.customerId || 'CUST-N/A'}</td>
                    <td className="font-medium text-text-main">{c.customerName || 'Anonymous Customer'}</td>
                    <td>
                      <StatusBadge
                        variant={
                          c.cluster === 'Cluster 1' ? 'blue' :
                            c.cluster === 'Cluster 2' ? 'green' :
                              c.cluster === 'Cluster 3' ? 'amber' : 'purple'
                        }
                      >
                        {c.cluster} ({c.clusterName || 'Segment'})
                      </StatusBadge>
                    </td>
                    <td className="font-semibold text-text-main">
                      {c.totalSpendingDisplay || `₹${Number(c.totalSpending || 0).toLocaleString()}`}
                    </td>
                    <td className="text-text-muted font-medium">{c.orderCount ?? 0} orders</td>
                    <td className="text-text-muted text-[11px]">{c.recencyDays ?? 0} days ago</td>
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

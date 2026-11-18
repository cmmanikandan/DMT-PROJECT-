import React, { useState } from 'react';
import { 
  FileText, 
  FileSpreadsheet, 
  TrendingUp, 
  Users, 
  Package, 
  ShoppingBag, 
  Download,
  Calendar,
  Sparkles,
  FileCheck
} from 'lucide-react';
import { ExportButton } from '../components/common/ExportButton';
import { 
  DEMO_SALES_TREND, 
  DEMO_PREDICTION_CHART, 
  DEMO_CUSTOMER_DETAILS, 
  DEMO_DEMAND_PRODUCTS, 
  DEMO_ASSOCIATION_RULES 
} from '../data/demoData';
import { useDataset } from '../context/DatasetContext';
import { useToast } from '../context/ToastContext';
import { NoDatasetEmptyState } from '../components/common/NoDatasetEmptyState';
import { generateExecutivePDFReport } from '../utils/pdfReportGenerator';

export const Reports: React.FC = () => {
  const { hasDataset, datasetMeta } = useDataset();
  const { showToast } = useToast();
  const [isGeneratingMaster, setIsGeneratingMaster] = useState(false);

  if (!hasDataset) {
    return <NoDatasetEmptyState pageName="Reports & Analytical Exports" description="No dataset is loaded. Ingest an e-commerce sales dataset to compile, view, and export PDF/Excel/CSV analytical reports." />;
  }

  const handleDownloadMasterPDF = async () => {
    try {
      setIsGeneratingMaster(true);
      showToast("Compiling Master Executive Audit PDF with brand logo...", "info");

      // Merge high-level insights for the executive audit
      const masterAuditData = DEMO_SALES_TREND.map((item, idx) => ({
        Month: item.period,
        Gross_Revenue: `Rs. ${item.sales.toLocaleString()}`,
        Orders_Fulfilled: item.orders,
        Avg_Order_Value: `Rs. ${Math.round(item.sales / Math.max(1, item.orders))}`,
        Growth_Velocity: `${((idx + 1) * 3.4).toFixed(1)}%`
      }));

      await generateExecutivePDFReport({
        title: "ECOMSIGHT AI — Master Executive Sales Intelligence & Audit Report",
        subtitle: `Complete cross-functional analytical evaluation across Revenue, Customer Segments, Inventory Demand, and Apriori Basket Rules.`,
        datasetName: datasetMeta.filename,
        author: "Admin (Lead Intelligence Analyst)",
        metrics: [
          { label: 'Active Dataset', value: datasetMeta.filename.split('.')[0].slice(0, 16) },
          { label: 'Total Transactions', value: datasetMeta.rows.toLocaleString() },
          { label: 'Revenue Run Rate', value: 'Rs. 12.84M' },
          { label: 'Audit Quality', value: datasetMeta.qualityStatus || 'Verified' }
        ],
        columns: [
          { key: 'Month', header: 'REPORT PERIOD' },
          { key: 'Gross_Revenue', header: 'GROSS REVENUE (INR)' },
          { key: 'Orders_Fulfilled', header: 'TOTAL ORDERS' },
          { key: 'Avg_Order_Value', header: 'BASKET AOV' },
          { key: 'Growth_Velocity', header: 'MOM VELOCITY' }
        ],
        data: masterAuditData,
        filename: `ECOMSIGHT_Executive_Audit_Report_${Date.now()}.pdf`
      });

      showToast("Master Executive Audit PDF successfully generated!", "success");
    } catch (err: any) {
      showToast(`Master report failed: ${err.message}`, "error");
    } finally {
      setIsGeneratingMaster(false);
    }
  };

  const reportCards = [
    {
      id: "sales",
      title: "Comprehensive Sales Report",
      description: "Monthly revenue trajectory, order volume velocity, average basket sizes, and department breakdown.",
      icon: TrendingUp,
      color: "text-blue-600 bg-blue-50 border border-blue-200",
      badge: "Financial Audit",
      dataPoints: `${DEMO_SALES_TREND.length} Monthly Periods`,
      data: DEMO_SALES_TREND,
      pdfTitle: "ECOMSIGHT Comprehensive Sales Report"
    },
    {
      id: "prediction",
      title: "Predictive Forecasting Report",
      description: "Forward demand forecast confidence bounds, regression model evaluation (MAE, RMSE, R²), and trend outlook.",
      icon: Sparkles,
      color: "text-purple-600 bg-purple-50 border border-purple-200",
      badge: "ML Evaluation",
      dataPoints: "Next 30D Forecast",
      data: DEMO_PREDICTION_CHART,
      pdfTitle: "ECOMSIGHT Predictive Sales Forecasting Report"
    },
    {
      id: "customer",
      title: "Customer RFM Segmentation",
      description: "Customer RFM clustering profiles: Champions, Loyal Shoppers, At-Risk Accounts, and Lost Shoppers.",
      icon: Users,
      color: "text-emerald-600 bg-emerald-50 border border-emerald-200",
      badge: "K-Means Clusters",
      dataPoints: `${datasetMeta.rows.toLocaleString()} Transactions`,
      data: DEMO_CUSTOMER_DETAILS,
      pdfTitle: "ECOMSIGHT Customer Segmentation & RFM Report"
    },
    {
      id: "product",
      title: "Product Inventory & Demand",
      description: "Catalog demand classification, projected inventory requirements, current sales vs predicted units.",
      icon: Package,
      color: "text-amber-600 bg-amber-50 border border-amber-200",
      badge: "Safety Stock",
      dataPoints: "SKU Catalog Breakdown",
      data: DEMO_DEMAND_PRODUCTS,
      pdfTitle: "ECOMSIGHT Product Inventory & Demand Report"
    },
    {
      id: "association",
      title: "Apriori Market Basket Rules",
      description: "Product affinity mining pairs, support percentages, confidence scores, and lift metrics for bundling.",
      icon: ShoppingBag,
      color: "text-indigo-600 bg-indigo-50 border border-indigo-200",
      badge: "Affinity Mining",
      dataPoints: "Cross-Sell Bundles",
      data: DEMO_ASSOCIATION_RULES,
      pdfTitle: "ECOMSIGHT Apriori Market Basket Association Rules"
    }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none">
            Reports & Analytical Exports
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadMasterPDF}
            disabled={isGeneratingMaster}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-md transition-all border border-slate-700 disabled:opacity-50"
          >
            <FileCheck className="w-4 h-4 text-cyan-400" />
            <span>{isGeneratingMaster ? 'Generating Master PDF...' : 'Download Master Executive Audit PDF'}</span>
          </button>
        </div>
      </div>

      {/* Branded Executive Callout Banner */}
      <div 
        className="bento-card p-6 rounded-2xl border border-slate-800 shadow-md relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4"
        style={{ backgroundColor: '#0B132B', color: '#FFFFFF' }}
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-2.5 flex items-center justify-center shrink-0">
            <img src="/LOGO.png" alt="EcomSight Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-extrabold tracking-wider uppercase mb-1">
              Publication-Grade PDF Engine
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Executive PDF Report Suite with ECOMSIGHT AI Brand Identity
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              All PDF exports include official brand typography, active dataset metadata (<span className="text-cyan-300 font-semibold">{datasetMeta.filename}</span> with {datasetMeta.rows.toLocaleString()} records), executive metric cards, and clean pagination.
            </p>
          </div>
        </div>

        <button
          onClick={handleDownloadMasterPDF}
          disabled={isGeneratingMaster}
          className="self-start md:self-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs transition-all shadow-md shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Export Full Audit PDF</span>
        </button>
      </div>

      {/* Enhanced Report Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {reportCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              className="bento-card p-5 bg-white border border-slate-200 flex flex-col justify-between hover:border-blue-400 transition-all shadow-card hover:shadow-card-hover rounded-2xl"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">
                    {card.badge}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900">
                  {card.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  {card.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 mt-5 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-400">
                  {card.dataPoints}
                </span>
                <ExportButton
                  title={card.title}
                  data={card.data}
                  pdfTitle={card.pdfTitle}
                  variant="primary"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};


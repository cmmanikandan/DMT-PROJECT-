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
      title: "Sales Report",
      description: "View detailed sales report with monthly trajectory, order volumes, and revenue breakdown.",
      icon: TrendingUp,
      color: "text-primary bg-primary-light",
      data: DEMO_SALES_TREND,
      pdfTitle: "ECOMSIGHT Comprehensive Sales Report"
    },
    {
      id: "prediction",
      title: "Prediction Report",
      description: "Download sales prediction results, forward forecast confidence bounds, and regression model evaluation metrics (MAE, RMSE, R²).",
      icon: Sparkles,
      color: "text-brand-purple bg-brand-purpleLight",
      data: DEMO_PREDICTION_CHART,
      pdfTitle: "ECOMSIGHT Predictive Sales Forecasting Report"
    },
    {
      id: "customer",
      title: "Customer Report",
      description: "Comprehensive customer RFM clustering data, recency scores, frequency distribution, and monetary segment profiles.",
      icon: Users,
      color: "text-brand-green bg-brand-greenLight",
      data: DEMO_CUSTOMER_DETAILS,
      pdfTitle: "ECOMSIGHT Customer Segmentation & RFM Report"
    },
    {
      id: "product",
      title: "Product Report",
      description: "Catalog demand classification, projected inventory requirements, current sales vs predicted units, and margin health.",
      icon: Package,
      color: "text-brand-amber bg-brand-amberLight",
      data: DEMO_DEMAND_PRODUCTS,
      pdfTitle: "ECOMSIGHT Product Inventory & Demand Report"
    },
    {
      id: "association",
      title: "Association Rules Report",
      description: "Apriori market basket mining findings, frequent item pairs, support percentages, confidence scores, and lift metrics.",
      icon: ShoppingBag,
      color: "text-indigo-600 bg-indigo-50",
      data: DEMO_ASSOCIATION_RULES,
      pdfTitle: "ECOMSIGHT Apriori Market Basket Association Rules"
    }
  ];

  return (
    <div className="space-y-5">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-semibold text-text-main tracking-tight leading-none">
            Reports & Analytical Exports
          </h1>
          <p className="text-[13px] text-text-muted mt-1.5">
            Download print-ready analytical reports, raw spreadsheets, and data mining audit summaries with brand identity.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadMasterPDF}
            disabled={isGeneratingMaster}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-navy-900 hover:bg-navy-850 text-white text-[12px] font-medium shadow-md transition-all border border-navy-800 disabled:opacity-50"
          >
            <FileCheck className="w-4 h-4 text-cyan-400" />
            <span>{isGeneratingMaster ? 'Generating Branded PDF...' : 'Download Master Executive Audit PDF'}</span>
          </button>
        </div>
      </div>

      {/* Branded Executive Callout Banner */}
      <div className="bg-navy-950 bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 text-white rounded-xl p-5 border border-navy-800 shadow-lg relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 p-2 flex items-center justify-center shrink-0">
            <img src="/LOGO.png" alt="EcomSight Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-semibold tracking-wider uppercase mb-1">
              Publication-Grade PDF Engine
            </div>
            <h2 className="text-[16px] font-bold text-white tracking-tight">
              Executive PDF Report Suite with ECOMSIGHT AI Brand Identity
            </h2>
            <p className="text-[12px] text-slate-300 mt-0.5 max-w-xl">
              All PDF exports include official brand typography, active dataset metadata (<span className="text-cyan-300 font-medium">{datasetMeta.filename}</span> with {datasetMeta.rows.toLocaleString()} records), executive metric cards, and clean pagination.
            </p>
          </div>
        </div>

        <button
          onClick={handleDownloadMasterPDF}
          disabled={isGeneratingMaster}
          className="self-start md:self-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-[13px] transition-all shadow-md shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Export Full Audit PDF</span>
        </button>
      </div>

      {/* Report Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reportCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              className="dashboard-card p-5 flex flex-col justify-between hover:border-primary/40 transition-all shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${card.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-medium text-text-light uppercase tracking-wider">
                    Format: PDF / XLSX
                  </span>
                </div>

                <h3 className="text-[15px] font-semibold text-text-main">
                  {card.title}
                </h3>
                <p className="text-[12px] text-text-muted mt-1.5 leading-relaxed">
                  {card.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between">
                <span className="text-[11px] text-text-muted">Instant Export</span>
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


import React, { useState } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  ShieldCheck, 
  SlidersHorizontal,
  FileCheck,
  RotateCcw,
  Check,
  Eye
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDataset } from '../context/DatasetContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { ExportButton } from '../components/common/ExportButton';
import { NoDatasetEmptyState } from '../components/common/NoDatasetEmptyState';

export const Preprocessing: React.FC = () => {
  const { isCleaned, cleanData, cleaningReport, datasetMeta, hasDataset } = useDataset();
  const [cleaning, setCleaning] = useState(false);
  const navigate = useNavigate();

  const handleRunCleaning = async () => {
    setCleaning(true);
    await cleanData();
    setCleaning(false);
  };

  if (!hasDataset) {
    return <NoDatasetEmptyState pageName="Data Preprocessing" description="No dataset is loaded. Ingest an e-commerce sales dataset to run automated cleaning, missing value imputation, and outlier detection." />;
  }

  const cleaningSteps = [
    { label: "Handle Missing Values", desc: "Impute numeric medians & categorical modes", completed: isCleaned },
    { label: "Remove Duplicates", desc: "Deduplicate identical transaction hash IDs", completed: isCleaned },
    { label: "Detect Outliers", desc: "Apply IQR (1.5x - 3.0x) statistical filter on quantity", completed: isCleaned },
    { label: "Normalize Data", desc: "Scale numerical features & standardize currencies", completed: isCleaned },
    { label: "Encode Categories", desc: "One-hot & label encoding on regions and payment", completed: isCleaned },
    { label: "Convert Date Format", desc: "Cast all date formats to standard ISO YYYY-MM-DD", completed: isCleaned },
    { label: "Feature Selection", desc: "Derive RFM customer vectors & basket pairs", completed: isCleaned },
  ];

  return (
    <div className="space-y-5">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-semibold text-text-main tracking-tight leading-none">
            Data Preprocessing
          </h1>
          <p className="text-[13px] text-text-muted mt-1.5">
            Data mining pipeline: cleaning, anomaly detection, deduplication, and feature engineering.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <StatusBadge variant={isCleaned ? 'green' : 'amber'} size="md">
            {isCleaned ? 'Dataset Cleaned & Ready' : 'Cleaning Required'}
          </StatusBadge>
          <ExportButton
            title="Preprocessing_Audit_Log"
            data={cleaningReport.actions_taken.map((a: string, i: number) => ({ step: i + 1, action: a }))}
          />
        </div>
      </div>

      {/* Main Grid: Card 1 (Before) & Card 2 (Steps Checklist) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* CARD 1: Data Quality (Before Cleaning) */}
        <div className="dashboard-card p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-surface-border">
              <div>
                <h2 className="text-[15px] font-semibold text-text-main">
                  Data Quality
                </h2>
                <span className="text-[11px] text-text-muted">
                  (Before Cleaning)
                </span>
              </div>
              <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
                Raw Input Data
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="p-3.5 rounded-lg bg-slate-50 border border-surface-border">
                <span className="text-[12px] text-text-muted font-medium block">
                  Missing Values
                </span>
                <span className="text-[24px] font-semibold text-brand-amber mt-1 block">
                  {cleaningReport.before.missing_values}
                </span>
                <span className="text-[10px] text-text-light">Blanks across region/payment</span>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 border border-surface-border">
                <span className="text-[12px] text-text-muted font-medium block">
                  Duplicate Rows
                </span>
                <span className="text-[24px] font-semibold text-brand-red mt-1 block">
                  {cleaningReport.before.duplicates}
                </span>
                <span className="text-[10px] text-text-light">Redundant identical transactions</span>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 border border-surface-border">
                <span className="text-[12px] text-text-muted font-medium block">
                  Invalid Values
                </span>
                <span className="text-[24px] font-semibold text-brand-red mt-1 block">
                  {cleaningReport.before.invalid_values}
                </span>
                <span className="text-[10px] text-text-light">Negative prices / corrupt codes</span>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 border border-surface-border">
                <span className="text-[12px] text-text-muted font-medium block">
                  Outliers
                </span>
                <span className="text-[24px] font-semibold text-text-main mt-1 block">
                  {cleaningReport.before.outliers}
                </span>
                <span className="text-[10px] text-text-light">Extreme quantity anomalies</span>
              </div>
            </div>
          </div>

          <div className="mt-5 p-3 rounded-lg bg-slate-50 border border-surface-border text-[11px] text-text-muted">
            <span className="font-semibold text-text-main">Data Mining Note: </span>
            Noise and duplicate samples distort linear regression weights and cluster centroid locations in K-Means.
          </div>
        </div>

        {/* CARD 2: Cleaning Steps */}
        <div className="dashboard-card p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-surface-border">
              <div>
                <h2 className="text-[15px] font-semibold text-text-main">
                  Cleaning Steps
                </h2>
                <span className="text-[11px] text-text-muted">
                  Automated Scikit-learn & Pandas preprocessing pipeline
                </span>
              </div>
              <SlidersHorizontal className="w-4 h-4 text-primary" />
            </div>

            <div className="space-y-2 mt-4">
              {cleaningSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-50 hover:bg-slate-100/70 border border-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                      step.completed ? 'bg-brand-green text-white' : 'bg-primary-light text-primary'
                    }`}>
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                    <div>
                      <span className="text-[12.5px] font-medium text-text-main block">
                        {step.label}
                      </span>
                      <span className="text-[10.5px] text-text-muted">
                        {step.desc}
                      </span>
                    </div>
                  </div>

                  <span className={`text-[11px] font-medium ${
                    step.completed ? 'text-brand-green' : 'text-primary'
                  }`}>
                    {step.completed ? 'Done' : 'Ready'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-surface-border flex items-center justify-between">
            <span className="text-[11px] text-text-muted">
              {isCleaned ? 'Pipeline executed successfully' : 'Ready to execute 7 cleaning passes'}
            </span>

            <button
              onClick={handleRunCleaning}
              disabled={cleaning}
              className="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-[12.5px] font-semibold rounded-lg shadow-sm transition-colors inline-flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{cleaning ? 'Cleaning Dataset...' : 'Clean Dataset'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* CARD 3: Data Quality (After Cleaning) */}
      <div className="dashboard-card p-5 bg-gradient-to-br from-white via-white to-emerald-50/20 border-emerald-200/60">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-surface-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-brand-greenLight text-brand-green flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-[15px] font-semibold text-text-main">
                Data Quality
              </h2>
              <span className="text-[11px] text-brand-green font-medium">
                (After Cleaning)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/dataset')}
              className="px-3 py-1.5 rounded-lg border border-surface-border bg-white text-text-main text-[12px] font-medium hover:bg-slate-50 transition-colors inline-flex items-center gap-1.5 shadow-xs"
            >
              <Eye className="w-3.5 h-3.5 text-text-muted" />
              <span>View Cleaned Dataset</span>
            </button>

            <button
              onClick={() => navigate('/sales-analysis')}
              className="px-3 py-1.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-[12px] font-semibold transition-colors inline-flex items-center gap-1.5 shadow-sm"
            >
              <span>Proceed to Sales Analysis</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-4">
          <div className="p-3.5 rounded-lg bg-white border border-surface-border shadow-xs">
            <span className="text-[12px] text-text-muted font-medium block">Cleaned Rows</span>
            <span className="text-[22px] font-semibold text-text-main mt-0.5 block">
              {cleaningReport.after.total_rows.toLocaleString()}
            </span>
            <span className="text-[10px] text-brand-green font-medium">100% Retained Valid</span>
          </div>

          <div className="p-3.5 rounded-lg bg-white border border-surface-border shadow-xs">
            <span className="text-[12px] text-text-muted font-medium block">Missing Values</span>
            <span className="text-[22px] font-semibold text-brand-green mt-0.5 block">
              {cleaningReport.after.missing_values}
            </span>
            <span className="text-[10px] text-brand-green font-medium">Fully Imputed</span>
          </div>

          <div className="p-3.5 rounded-lg bg-white border border-surface-border shadow-xs">
            <span className="text-[12px] text-text-muted font-medium block">Duplicates</span>
            <span className="text-[22px] font-semibold text-brand-green mt-0.5 block">
              {cleaningReport.after.duplicates}
            </span>
            <span className="text-[10px] text-brand-green font-medium">All Dropped</span>
          </div>

          <div className="p-3.5 rounded-lg bg-white border border-surface-border shadow-xs">
            <span className="text-[12px] text-text-muted font-medium block">Invalid Values</span>
            <span className="text-[22px] font-semibold text-brand-green mt-0.5 block">
              {cleaningReport.after.invalid_values}
            </span>
            <span className="text-[10px] text-brand-green font-medium">None Remaining</span>
          </div>

          <div className="p-3.5 rounded-lg bg-white border border-surface-border shadow-xs col-span-2 sm:col-span-1">
            <span className="text-[12px] text-text-muted font-medium block">Capped Outliers</span>
            <span className="text-[22px] font-semibold text-text-main mt-0.5 block">
              {cleaningReport.after.outliers}
            </span>
            <span className="text-[10px] text-text-muted font-medium">Boundary Clamped</span>
          </div>
        </div>

        {/* Cleaning Action Log */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block mb-2">
            Execution Log
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] text-text-muted">
            {cleaningReport.actions_taken.map((action: string, i: number) => (
              <div key={i} className="flex items-center gap-2 p-1.5 rounded bg-slate-50/80 border border-slate-100">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-green flex-shrink-0" />
                <span className="truncate">{action}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

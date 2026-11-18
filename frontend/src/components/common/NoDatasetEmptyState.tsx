import React from 'react';
import { Database, RefreshCw, UploadCloud, ArrowRight, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDataset } from '../../context/DatasetContext';

interface NoDatasetEmptyStateProps {
  pageName: string;
  description?: string;
}

export const NoDatasetEmptyState: React.FC<NoDatasetEmptyStateProps> = ({ 
  pageName, 
  description = "No active dataset is currently loaded. Analytical metrics and machine learning models require an ingested dataset to compute live insights." 
}) => {
  const navigate = useNavigate();
  const { loadSampleDataset } = useDataset();

  return (
    <div className="dashboard-card p-10 sm:p-14 text-center max-w-2xl mx-auto my-8 border-dashed border-2 border-slate-300">
      <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200/60 text-brand-amber mx-auto flex items-center justify-center mb-4 shadow-sm">
        <Database className="w-7 h-7" />
      </div>

      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-text-muted text-[11px] font-semibold mb-2">
        <AlertCircle className="w-3.5 h-3.5 text-brand-amber" />
        <span>Dataset Required for {pageName}</span>
      </div>

      <h2 className="text-[20px] font-bold text-text-main tracking-tight">
        No Active Dataset Loaded
      </h2>

      <p className="text-[13px] text-text-muted mt-2 leading-relaxed max-w-lg mx-auto">
        {description}
      </p>

      {/* Actions */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={() => loadSampleDataset()}
          className="px-4 py-2.5 bg-primary hover:bg-primary-hover text-white text-[12.5px] font-semibold rounded-lg shadow-sm transition-colors inline-flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Reload Sample Dataset (3,481 rows)</span>
        </button>

        <button
          onClick={() => navigate('/dataset')}
          className="px-4 py-2.5 bg-white border border-surface-border hover:bg-slate-50 text-text-main text-[12.5px] font-semibold rounded-lg shadow-xs transition-colors inline-flex items-center gap-2"
        >
          <UploadCloud className="w-4 h-4 text-primary" />
          <span>Upload New Dataset</span>
          <ArrowRight className="w-3.5 h-3.5 text-text-muted" />
        </button>
      </div>

      <p className="text-[11px] text-text-light mt-4">
        Supports multi-column CSV and Excel (.xlsx) transaction files.
      </p>
    </div>
  );
};

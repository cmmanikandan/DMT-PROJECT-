import React, { useRef, useState, useEffect } from 'react';
import { 
  UploadCloud, 
  FileSpreadsheet, 
  Eye, 
  Sparkles, 
  ArrowRight,
  RefreshCw,
  Search,
  Trash2,
  AlertCircle,
  FileX,
  Table,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Database,
  Layers,
  ArrowUpDown
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDataset } from '../context/DatasetContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { ExportButton } from '../components/common/ExportButton';
import { fetchDatasetPreview } from '../api/apiClient';
import { SAMPLE_DATASET_ROWS } from '../data/sampleDatasetRows';

export const Dataset: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { 
    backendOnline,
    dbStatus,
    availableDatasets,
    switchDataset,
    datasetMeta, 
    uploadFile, 
    isCleaned, 
    deleteDataset, 
    loadSampleDataset, 
    uploadedRows,
    hasDataset
  } = useDataset();
  
  const [dragActive, setDragActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [tableRows, setTableRows] = useState<any[]>([]);
  const [totalRowsCount, setTotalRowsCount] = useState<number>(0);
  const [totalPagesCount, setTotalPagesCount] = useState<number>(1);
  const [isLoadingPage, setIsLoadingPage] = useState(false);
  const navigate = useNavigate();

  // Load preview data from backend or fallback to local data
  useEffect(() => {
    let isMounted = true;

    const loadPageData = async () => {
      if (backendOnline && hasDataset) {
        setIsLoadingPage(true);
        try {
          const res = await fetchDatasetPreview(page, pageSize, searchTerm);
          if (isMounted && res.preview) {
            setTableRows(res.preview);
            setTotalRowsCount(res.total_rows || 0);
            setTotalPagesCount(res.total_pages || Math.max(1, Math.ceil((res.total_rows || 0) / pageSize)));
            setIsLoadingPage(false);
            return;
          }
        } catch (e) {
          console.warn("Failed fetching preview from API, falling back to local dataset:", e);
        }
        setIsLoadingPage(false);
      }

      // Local fallback pagination
      const fullList = uploadedRows.length > 0 ? uploadedRows : SAMPLE_DATASET_ROWS;
      const filtered = fullList.filter((row: any) =>
        Object.values(row).some((val) =>
          String(val).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );

      const total = filtered.length;
      const totalPages = Math.max(1, Math.ceil(total / pageSize));
      const validPage = Math.min(Math.max(1, page), totalPages);
      const startIdx = (validPage - 1) * pageSize;
      const sliced = filtered.slice(startIdx, startIdx + pageSize);

      if (isMounted) {
        setTableRows(sliced);
        setTotalRowsCount(total);
        setTotalPagesCount(totalPages);
      }
    };

    loadPageData();
    return () => { isMounted = false; };
  }, [backendOnline, hasDataset, page, pageSize, searchTerm, datasetMeta.filename, uploadedRows]);

  // Reset to page 1 on search or page size change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setPage(1);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      uploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      uploadFile(e.target.files[0]);
    }
  };

  // Helper to generate pagination page numbers array with 1 2 3 ...
  const getPaginationPages = () => {
    const pages: (number | string)[] = [];
    if (totalPagesCount <= 7) {
      for (let i = 1; i <= totalPagesCount; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push('...');
      
      const start = Math.max(2, page - 1);
      const end = Math.min(totalPagesCount - 1, page + 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (page < totalPagesCount - 2) pages.push('...');
      pages.push(totalPagesCount);
    }
    return pages;
  };

  return (
    <div className="space-y-5">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-semibold text-text-main tracking-tight leading-none">
            Dataset Management
          </h1>
          <p className="text-[13px] text-text-muted mt-1.5">
            Ingest, audit, and manage e-commerce sales datasets for live predictive modeling.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {hasDataset && (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-brand-red/30 bg-rose-50 text-brand-red text-[12px] font-medium hover:bg-rose-100/70 transition-colors shadow-xs"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Dataset</span>
            </button>
          )}

          <button
            onClick={loadSampleDataset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-primary/30 bg-primary-light text-primary text-[12px] font-medium hover:bg-primary-light/80 transition-colors shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reload Primary Dataset ({datasetMeta.rows.toLocaleString()} rows)</span>
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-5 shadow-xl border border-surface-border animate-in fade-in">
            <div className="w-10 h-10 rounded-full bg-rose-100 text-brand-red flex items-center justify-center mb-3">
              <Trash2 className="w-5 h-5" />
            </div>
            <h3 className="text-[16px] font-semibold text-text-main">
              Delete Active Dataset?
            </h3>
            <p className="text-[12.5px] text-text-muted mt-1 leading-relaxed">
              This will clear the current dataset ({datasetMeta.filename}) from memory and reset active analytics.
            </p>
            <div className="flex items-center justify-end gap-2 mt-5">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-3.5 py-1.5 rounded-lg border border-surface-border text-[12px] font-medium text-text-main hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await deleteDataset();
                  setShowDeleteConfirm(false);
                }}
                className="px-3.5 py-1.5 rounded-lg bg-brand-red text-white text-[12px] font-medium hover:bg-brand-red/90"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Available Datasets in MySQL Bar */}
      <div className="dashboard-card p-4 bg-gradient-to-r from-slate-50 to-indigo-50/30 border border-surface-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-primary" />
            <span className="text-[13px] font-semibold text-text-main">Available Datasets in MySQL (ecomsight_db)</span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-primary-light text-primary font-medium">
              {availableDatasets.length} Ready for Analysis
            </span>
          </div>
          <span className="text-[11px] text-text-muted">
            Click any dataset below to switch analysis context across models
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {availableDatasets.map((ds, idx) => {
            const isActive = datasetMeta.filename.includes(ds.name) || ds.name.includes(datasetMeta.filename);
            return (
              <div 
                key={idx}
                onClick={() => switchDataset(ds.name)}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  isActive 
                    ? 'bg-white border-primary shadow-sm ring-1 ring-primary' 
                    : 'bg-white/80 hover:bg-white border-surface-border hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-slate-400'}`} />
                    <span className="text-[12.5px] font-semibold text-text-main truncate max-w-[170px]" title={ds.name}>
                      {ds.name}
                    </span>
                  </div>
                  {isActive ? (
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Active
                    </span>
                  ) : (
                    <span className="text-[10px] text-text-muted bg-slate-100 px-2 py-0.5 rounded-full">
                      Select
                    </span>
                  )}
                </div>
                <div className="mt-2 flex items-center justify-between text-[11px] text-text-muted">
                  <span>{ds.rows.toLocaleString()} transactions</span>
                  <span className="font-mono text-[10px] text-slate-400">{ds.source}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dataset Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        <div className="dashboard-card p-4">
          <span className="text-[11px] font-medium text-text-muted uppercase tracking-wider block">Total Transactions</span>
          <p className="text-[20px] font-bold text-text-main mt-1 tracking-tight">
            {datasetMeta.rows.toLocaleString()}
          </p>
          <span className="text-[10.5px] text-text-muted mt-1 block">Active Ingested Rows</span>
        </div>

        <div className="dashboard-card p-4">
          <span className="text-[11px] font-medium text-text-muted uppercase tracking-wider block">Features / Columns</span>
          <p className="text-[20px] font-bold text-text-main mt-1 tracking-tight">
            {datasetMeta.columns}
          </p>
          <span className="text-[10.5px] text-text-muted mt-1 block">Transactional Attributes</span>
        </div>

        <div className="dashboard-card p-4">
          <span className="text-[11px] font-medium text-text-muted uppercase tracking-wider block">Missing Values</span>
          <p className={`text-[20px] font-bold mt-1 tracking-tight ${datasetMeta.missingValues > 0 ? 'text-brand-orange' : 'text-brand-green'}`}>
            {datasetMeta.missingValues}
          </p>
          <span className="text-[10.5px] text-text-muted mt-1 block">
            {datasetMeta.missingValues > 0 ? 'Imputation Required' : 'Zero Missing'}
          </span>
        </div>

        <div className="dashboard-card p-4">
          <span className="text-[11px] font-medium text-text-muted uppercase tracking-wider block">Duplicate Tuples</span>
          <p className={`text-[20px] font-bold mt-1 tracking-tight ${datasetMeta.duplicates > 0 ? 'text-brand-red' : 'text-brand-green'}`}>
            {datasetMeta.duplicates}
          </p>
          <span className="text-[10.5px] text-text-muted mt-1 block">
            {datasetMeta.duplicates > 0 ? 'Duplicates Detected' : 'Deduplicated'}
          </span>
        </div>

        <div className="dashboard-card p-4 col-span-2 lg:col-span-1">
          <span className="text-[11px] font-medium text-text-muted uppercase tracking-wider block">Quality Health</span>
          <div className="mt-1.5">
            <StatusBadge variant={isCleaned || datasetMeta.qualityStatus.includes("Cleaned") ? "green" : "amber"}>
              {datasetMeta.qualityStatus}
            </StatusBadge>
          </div>
          <span className="text-[10.5px] text-text-muted mt-1 block">Pipeline Status</span>
        </div>
      </div>

      {/* Upload Zone & Dataset Information */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Upload Card */}
        <div className="dashboard-card p-5 lg:col-span-1 flex flex-col justify-between">
          <div>
            <h3 className="text-[15px] font-semibold text-text-main mb-1">
              Ingest E-Commerce Dataset
            </h3>
            <p className="text-[11.5px] text-text-muted mb-4">
              Upload transactional CSV or XLSX datasets. Automatically audited & synchronized to MySQL.
            </p>

            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                dragActive 
                  ? 'border-primary bg-primary-light/40 scale-[1.01]' 
                  : 'border-slate-300 hover:border-primary/60 hover:bg-slate-50/80 bg-slate-50/40'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv, .xlsx, .xls"
                onChange={handleChange}
                className="hidden"
              />
              <div className="w-12 h-12 rounded-full bg-primary-light text-primary flex items-center justify-center mx-auto mb-3">
                <UploadCloud className="w-6 h-6" />
              </div>
              <p className="text-[13px] font-semibold text-text-main">
                Click to browse or drop file here
              </p>
              <p className="text-[11px] text-text-muted mt-1">
                CSV or XLSX formatted sales logs (up to 50MB)
              </p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-surface-border flex items-center justify-between text-[11px] text-text-muted">
            <div className="flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-primary" />
              <span>MySQL Sync:</span>
            </div>
            <span className="font-medium text-emerald-600">Auto-Persisted</span>
          </div>
        </div>

        {/* Dataset Meta & Pipeline Card */}
        <div className="dashboard-card p-5 lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-[15px] font-semibold text-text-main">
                  Active Dataset Ingestion Audit
                </h3>
                <p className="text-[11.5px] text-text-muted">
                  Schema verification and pipeline readiness check
                </p>
              </div>
              <StatusBadge variant="blue">
                {datasetMeta.filename}
              </StatusBadge>
            </div>

            <div className="space-y-3 mt-4">
              <div className="p-3 bg-slate-50 rounded-lg border border-surface-border">
                <div className="flex items-center justify-between text-[12.5px]">
                  <span className="text-text-muted">Active Dataset File:</span>
                  <span className="font-semibold text-text-main font-mono">{datasetMeta.filename}</span>
                </div>
                <div className="flex items-center justify-between text-[12.5px] mt-2">
                  <span className="text-text-muted">Audit Date:</span>
                  <span className="font-medium text-text-main">{datasetMeta.uploadDate}</span>
                </div>
                <div className="flex items-center justify-between text-[12.5px] mt-2">
                  <span className="text-text-muted">Database Engine:</span>
                  <span className="font-medium text-text-main flex items-center gap-1">
                    <Database className="w-3 h-3 text-emerald-600" />
                    MySQL 8.0 (ecomsight_db)
                  </span>
                </div>
              </div>

              {/* Quality Checklist */}
              <div className="grid grid-cols-2 gap-2 text-[12px]">
                <div className="flex items-center gap-2 p-2 rounded bg-slate-50 border border-surface-border">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-text-main">13 Target Attributes Validated</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded bg-slate-50 border border-surface-border">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-text-main">ISO Currency & Dates Standardized</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded bg-slate-50 border border-surface-border">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-text-main">Customer RFM Identifiers Active</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded bg-slate-50 border border-surface-border">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-text-main">Transaction Baskets Linked</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 mt-4 border-t border-surface-border">
            <button
              onClick={() => {
                const el = document.getElementById('preview-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-[12px] text-primary hover:text-primary-hover font-medium inline-flex items-center gap-1"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Jump to Preview Table Below</span>
            </button>

            <button
              onClick={() => navigate('/preprocessing')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-[12.5px] font-semibold hover:bg-primary-hover transition-colors shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Proceed to Data Cleaning</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Dataset Preview Table */}
      {hasDataset && (
        <div id="preview-section" className="dashboard-card p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-[15px] font-semibold text-text-main">
                  Dataset Preview Table
                </h3>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-text-muted font-medium">
                  {totalRowsCount.toLocaleString()} Total Records
                </span>
              </div>
              <p className="text-[11px] text-text-muted mt-0.5">
                Displaying transaction tuples with exact feature values from {datasetMeta.filename}
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Rows Per Page Selector */}
              <div className="flex items-center gap-1.5 text-[11.5px] text-text-muted">
                <span>Rows:</span>
                <select
                  value={pageSize}
                  onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                  className="px-2 py-1 bg-slate-50 border border-surface-border rounded-lg text-text-main text-[11.5px] outline-none focus:border-primary cursor-pointer"
                >
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-text-light" />
                <input
                  type="text"
                  placeholder="Search table rows..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="pl-8 pr-3 py-1 text-[12px] bg-slate-50 border border-surface-border rounded-lg text-text-main focus:bg-white focus:border-primary outline-none"
                />
              </div>

              <ExportButton
                title={`${datasetMeta.filename.replace('.csv', '')}_Export`}
                data={tableRows}
                variant="compact"
              />
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto border border-surface-border rounded-lg relative">
            {isLoadingPage && (
              <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10 backdrop-blur-[1px]">
                <RefreshCw className="w-5 h-5 text-primary animate-spin" />
              </div>
            )}
            <table className="w-full text-left data-table">
              <thead>
                <tr>
                  <th>Txn ID</th>
                  <th>Date</th>
                  <th>Customer ID</th>
                  <th>Customer Name</th>
                  <th>Region</th>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Unit Price</th>
                  <th>Qty</th>
                  <th>Discount</th>
                  <th>Total Amount</th>
                  <th>Payment</th>
                </tr>
              </thead>
              <tbody>
                {tableRows.length > 0 ? (
                  tableRows.map((row: any, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                      <td className="font-mono text-[11px] text-primary font-medium">{row.Transaction_ID}</td>
                      <td className="text-text-muted whitespace-nowrap">{row.Date}</td>
                      <td className="font-mono text-[11px] text-slate-600">{row.Customer_ID}</td>
                      <td className="font-medium text-text-main whitespace-nowrap">{row.Customer_Name || 'Standard Client'}</td>
                      <td>
                        <StatusBadge variant="gray">{row.Region || 'N/A'}</StatusBadge>
                      </td>
                      <td className="font-medium text-text-main whitespace-nowrap">{row.Product_Name}</td>
                      <td>
                        <StatusBadge variant={
                          row.Category === 'Footwear' ? 'purple' :
                          row.Category === 'Electronics' ? 'blue' :
                          row.Category === 'Apparel' ? 'green' : 'amber'
                        }>
                          {row.Category}
                        </StatusBadge>
                      </td>
                      <td className="text-text-muted">₹{Number(row.Unit_Price || 0).toLocaleString()}</td>
                      <td className="text-text-main font-semibold text-center">{row.Quantity}</td>
                      <td className="text-text-muted">{row.Discount_Percent || 0}%</td>
                      <td className="text-text-main font-bold">
                        {typeof row.Total_Amount === 'string' ? row.Total_Amount : `₹${Number(row.Total_Amount || 0).toLocaleString()}`}
                      </td>
                      <td className="text-text-muted text-[11px] whitespace-nowrap">{row.Payment_Method || 'Standard'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={12} className="text-center py-8 text-text-muted text-[13px]">
                      No transaction records found matching "{searchTerm}"
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Interactive Numbered Pagination: 1 2 3 ... */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[12px] text-text-muted pt-4 border-t border-surface-border mt-3">
            <div>
              <span>
                Showing <strong className="text-text-main">{tableRows.length > 0 ? (page - 1) * pageSize + 1 : 0}</strong> to{' '}
                <strong className="text-text-main">{Math.min(page * pageSize, totalRowsCount)}</strong> of{' '}
                <strong className="text-text-main">{totalRowsCount.toLocaleString()}</strong> active records
              </span>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {/* Prev Button */}
              <button 
                disabled={page <= 1} 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className="inline-flex items-center gap-1 px-2.5 py-1 border border-surface-border rounded-lg bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed font-medium text-[11.5px]"
                title="Previous Page"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Prev</span>
              </button>

              {/* Numbered Page Buttons: 1 2 3 ... */}
              <div className="flex items-center gap-1">
                {getPaginationPages().map((pageNum, idx) => {
                  if (pageNum === '...') {
                    return (
                      <span key={`dots-${idx}`} className="px-1.5 py-1 text-slate-400 select-none">
                        ...
                      </span>
                    );
                  }
                  const num = Number(pageNum);
                  const isActive = page === num;
                  return (
                    <button
                      key={num}
                      onClick={() => setPage(num)}
                      className={`min-w-[30px] h-[30px] flex items-center justify-center rounded-lg text-[11.5px] font-semibold transition-all ${
                        isActive
                          ? 'bg-primary text-white shadow-xs'
                          : 'border border-surface-border bg-white text-text-main hover:bg-slate-100 hover:border-slate-300'
                      }`}
                    >
                      {num}
                    </button>
                  );
                })}
              </div>

              {/* Next Button */}
              <button 
                disabled={page >= totalPagesCount} 
                onClick={() => setPage(p => Math.min(totalPagesCount, p + 1))}
                className="inline-flex items-center gap-1 px-2.5 py-1 border border-surface-border rounded-lg bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed font-medium text-[11.5px]"
                title="Next Page"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              {/* Quick Jump */}
              <div className="hidden lg:flex items-center gap-1 ml-2 pl-2 border-l border-surface-border text-[11px]">
                <span>Page:</span>
                <input
                  type="number"
                  min={1}
                  max={totalPagesCount}
                  value={page}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (val >= 1 && val <= totalPagesCount) {
                      setPage(val);
                    }
                  }}
                  className="w-12 px-1.5 py-1 bg-slate-50 border border-surface-border rounded text-center text-text-main text-[11.5px] outline-none focus:border-primary"
                />
                <span>/ {totalPagesCount}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { Download, FileSpreadsheet, FileText, ChevronDown } from 'lucide-react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useToast } from '../../context/ToastContext';

import { generateExecutivePDFReport } from '../../utils/pdfReportGenerator';

interface ExportButtonProps {
  title: string;
  data: any[];
  columns?: { key: string; header: string }[];
  pdfTitle?: string;
  variant?: 'primary' | 'secondary' | 'compact';
}

export const ExportButton: React.FC<ExportButtonProps> = ({
  title,
  data,
  columns,
  pdfTitle,
  variant = 'secondary'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { showToast } = useToast();

  const exportExcel = () => {
    try {
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Report");
      XLSX.writeFile(wb, `${title.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}.xlsx`);
      showToast(`Exported ${title} to Excel!`, 'success');
      setIsOpen(false);
    } catch (e: any) {
      showToast(`Export failed: ${e.message}`, 'error');
    }
  };

  const exportCSV = () => {
    try {
      const ws = XLSX.utils.json_to_sheet(data);
      const csvOutput = XLSX.utils.sheet_to_csv(ws);
      const blob = new Blob([csvOutput], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.setAttribute("download", `${title.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast(`Exported ${title} to CSV!`, 'success');
      setIsOpen(false);
    } catch (e: any) {
      showToast(`Export failed: ${e.message}`, 'error');
    }
  };

  const exportPDF = async () => {
    try {
      showToast(`Generating styled executive PDF for ${title}...`, 'info');
      await generateExecutivePDFReport({
        title: pdfTitle || title,
        subtitle: `Executive analytical data audit report for ${title}`,
        data: data,
        columns: columns,
        filename: `${title.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}.pdf`,
        metrics: [
          { label: 'Total Rows', value: (data?.length || 0).toLocaleString() },
          { label: 'Report Status', value: 'Verified' },
          { label: 'Classification', value: 'Internal Audit' }
        ]
      });
      showToast(`Exported ${title} to executive branded PDF!`, 'success');
      setIsOpen(false);
    } catch (e: any) {
      showToast(`PDF generation failed: ${e.message}`, 'error');
    }
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium rounded-lg transition-colors ${
          variant === 'primary'
            ? 'bg-primary text-white hover:bg-primary-hover shadow-sm'
            : variant === 'compact'
            ? 'bg-white border border-surface-border text-text-main hover:bg-slate-50'
            : 'bg-white border border-surface-border text-text-main hover:bg-slate-50 shadow-sm'
        }`}
      >
        <Download className="w-3.5 h-3.5" />
        <span>Export</span>
        <ChevronDown className="w-3 h-3 text-text-muted" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-40 bg-white rounded-lg shadow-lg border border-surface-border py-1 z-30">
          <button
            onClick={exportPDF}
            className="w-full flex items-center gap-2 px-3 py-2 text-[12px] text-text-main hover:bg-slate-50 text-left"
          >
            <FileText className="w-3.5 h-3.5 text-brand-red" />
            <span>Download PDF</span>
          </button>
          <button
            onClick={exportExcel}
            className="w-full flex items-center gap-2 px-3 py-2 text-[12px] text-text-main hover:bg-slate-50 text-left"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-brand-green" />
            <span>Download Excel</span>
          </button>
          <button
            onClick={exportCSV}
            className="w-full flex items-center gap-2 px-3 py-2 text-[12px] text-text-main hover:bg-slate-50 text-left"
          >
            <Download className="w-3.5 h-3.5 text-primary" />
            <span>Download CSV</span>
          </button>
        </div>
      )}
    </div>
  );
};

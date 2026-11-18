import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Helper to convert public image to base64 Data URL for jsPDF
export async function getLogoBase64(): Promise<string | null> {
  return new Promise((resolve) => {
    try {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            const dataURL = canvas.toDataURL('image/png');
            resolve(dataURL);
            return;
          }
          resolve(null);
        } catch (e) {
          console.warn('[PDF] Canvas drawing failed:', e);
          resolve(null);
        }
      };
      img.onerror = () => {
        console.warn('[PDF] Failed to load /LOGO.png');
        resolve(null);
      };
      img.src = '/LOGO.png';
    } catch {
      resolve(null);
    }
  });
}

export interface MetricSummary {
  label: string;
  value: string;
}

export interface PDFReportOptions {
  title: string;
  subtitle?: string;
  datasetName?: string;
  author?: string;
  metrics?: MetricSummary[];
  columns?: { key: string; header: string }[];
  data: any[];
  filename?: string;
}

export async function generateExecutivePDFReport(options: PDFReportOptions): Promise<void> {
  const {
    title,
    subtitle = "Enterprise Sales Intelligence & Predictive Analytics Platform",
    datasetName = "ecommerce_sales_dataset.csv",
    author = "Admin (Lead Analyst)",
    metrics = [],
    columns,
    data,
    filename
  } = options;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;

  // 1. Try to load brand logo
  const logoData = await getLogoBase64();

  // Draw Header Banner (Deep Navy #061B2E with Cyan Accent Line)
  doc.setFillColor(6, 27, 46); // Deep corporate navy
  doc.rect(0, 0, pageWidth, 38, 'F');

  // Cyan gradient bottom accent line
  doc.setFillColor(14, 165, 233); // Cyan 500
  doc.rect(0, 36.5, pageWidth, 1.5, 'F');

  let textStartX = margin;
  if (logoData) {
    try {
      doc.addImage(logoData, 'PNG', margin, 7, 24, 24);
      textStartX = margin + 28;
    } catch (err) {
      console.warn('[PDF] Image insertion error:', err);
    }
  }

  // Brand Name & Subtitle
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('ECOMSIGHT AI', textStartX, 15);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(147, 197, 253); // Light sky blue
  doc.text('Sales Intelligence & Predictive Engine', textStartX, 21);

  doc.setFontSize(7.5);
  doc.setTextColor(203, 213, 225); // Slate 300
  doc.text('Data Mining Technologies (DMT) Enterprise Suite', textStartX, 26);

  // Top-Right Metadata Badge
  const rightX = pageWidth - margin;
  doc.setFontSize(7.5);
  doc.setTextColor(147, 197, 253);
  doc.text(`CONFIDENTIAL / EXECUTIVE AUDIT`, rightX, 13, { align: 'right' });
  doc.setTextColor(255, 255, 255);
  doc.text(`Date: ${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}`, rightX, 19, { align: 'right' });
  doc.setTextColor(203, 213, 225);
  doc.text(`Auditor: ${author}`, rightX, 25, { align: 'right' });
  doc.text(`Dataset: ${datasetName.slice(0, 24)}`, rightX, 31, { align: 'right' });

  let currentY = 46;

  // 2. Report Document Title & Scope
  doc.setTextColor(15, 23, 42); // Slate 900
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.text(title, margin, currentY);

  currentY += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139); // Slate 500
  doc.text(subtitle, margin, currentY);

  currentY += 8;

  // 3. Executive KPI Metric Cards (if provided)
  if (metrics && metrics.length > 0) {
    const cardWidth = (pageWidth - 2 * margin - (metrics.length - 1) * 3) / metrics.length;
    const cardHeight = 16;

    metrics.forEach((m, idx) => {
      const cardX = margin + idx * (cardWidth + 3);
      // Card background
      doc.setFillColor(248, 250, 252); // Slate 50
      doc.setDrawColor(226, 232, 240); // Slate 200
      doc.roundedRect(cardX, currentY, cardWidth, cardHeight, 1.5, 1.5, 'FD');

      // Top cyan indicator
      doc.setFillColor(14, 165, 233);
      doc.rect(cardX, currentY, cardWidth, 1, 'F');

      // Metric Label
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(100, 116, 139);
      doc.text(m.label.toUpperCase(), cardX + 3, currentY + 6);

      // Metric Value
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(15, 23, 42);
      doc.text(m.value, cardX + 3, currentY + 12);
    });

    currentY += cardHeight + 8;
  }

  // 4. Data Table with jspdf-autotable
  if (data && data.length > 0) {
    const tableCols = columns 
      ? columns.map(c => c.header) 
      : Object.keys(data[0]).map(k => k.replace(/_/g, ' ').toUpperCase());

    const tableRows = data.map(item => {
      if (columns) {
        return columns.map(c => {
          const val = item[c.key];
          if (typeof val === 'number') {
            return val.toLocaleString();
          }
          return String(val ?? '-');
        });
      }
      return Object.values(item).map(v => {
        if (typeof v === 'number') {
          return v.toLocaleString();
        }
        return String(v ?? '-');
      });
    });

    autoTable(doc, {
      startY: currentY,
      head: [tableCols],
      body: tableRows,
      margin: { left: margin, right: margin, bottom: 20 },
      theme: 'grid',
      headStyles: {
        fillColor: [6, 27, 46],
        textColor: [255, 255, 255],
        fontSize: 8.5,
        fontStyle: 'bold',
        halign: 'left',
        cellPadding: 2.5
      },
      bodyStyles: {
        fontSize: 7.5,
        textColor: [30, 41, 59],
        cellPadding: 2.2
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252]
      },
      styles: {
        lineColor: [226, 232, 240],
        lineWidth: 0.1,
        overflow: 'linebreak'
      },
      didDrawPage: (dataHook) => {
        // Page Footer
        const totalPages = doc.internal.pages.length - 1;
        const pageNum = dataHook.pageNumber;

        doc.setFillColor(241, 245, 249);
        doc.rect(margin, pageHeight - 12, pageWidth - 2 * margin, 0.4, 'F');

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.setTextColor(148, 163, 184); // Slate 400
        doc.text(
          'ECOMSIGHT AI • Enterprise Sales Intelligence & Data Mining Suite • Highly Confidential',
          margin,
          pageHeight - 7
        );
        doc.text(
          `Page ${pageNum} of ${totalPages}`,
          pageWidth - margin,
          pageHeight - 7,
          { align: 'right' }
        );
      }
    });
  }

  const exportName = filename || `${title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${Date.now()}.pdf`;
  doc.save(exportName);
}

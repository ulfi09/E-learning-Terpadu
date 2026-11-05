import { jsPDF } from 'jspdf';
import { ModuleItem, Course } from '../types';

/**
 * Cleans mathematical notation into clean, readable scientific typography
 */
function cleanMathNotation(text: string): string {
  return text
    .replace(/\\lambda/g, 'λ')
    .replace(/\\theta/g, 'θ')
    .replace(/\\alpha/g, 'α')
    .replace(/\\beta/g, 'β')
    .replace(/\\gamma/g, 'γ')
    .replace(/\\pi/g, 'π')
    .replace(/\\mu/g, 'μ')
    .replace(/\\sigma/g, 'σ')
    .replace(/\\omega/g, 'ω')
    .replace(/\\Delta/g, 'Δ')
    .replace(/\\nabla/g, '∇')
    .replace(/\\cdot/g, ' · ')
    .replace(/\\times/g, ' × ')
    .replace(/\\approx/g, ' ≈ ')
    .replace(/\\neq/g, ' ≠ ')
    .replace(/\\le/g, ' ≤ ')
    .replace(/\\ge/g, ' ≥ ')
    .replace(/\\partial/g, '∂')
    .replace(/\\int/g, '∫')
    .replace(/\\sum/g, '∑')
    .replace(/\\infty/g, '∞')
    .replace(/\\dots/g, '...')
    .replace(/\\quad/g, '   ')
    .replace(/\\sin/g, 'sin')
    .replace(/\\cos/g, 'cos')
    .replace(/\\tan/g, 'tan')
    .replace(/\\left\(/g, '(')
    .replace(/\\right\)/g, ')')
    .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1 / $2)')
    .replace(/\$\$([^$]+)\$\$/g, '$1')
    .replace(/\$([^$]+)\$/g, '$1');
}

/**
 * Cleans basic markdown bold/italic tags for plain text rendering in PDF
 */
function cleanMarkdownText(text: string): string {
  const mathCleaned = cleanMathNotation(text);
  return mathCleaned
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1');
}

export const downloadModuleAsPdf = (module: ModuleItem, course?: Course) => {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
    const pageHeight = doc.internal.pageSize.getHeight(); // 297mm
    const margin = 18;
    const contentWidth = pageWidth - margin * 2; // 174mm
    const bottomLimit = pageHeight - 20;

    let y = 18;

    // Helper: ensure enough vertical space or create new page
    const checkPageBreak = (neededMm: number) => {
      if (y + neededMm > bottomLimit) {
        doc.addPage();
        y = 22; // Start position on subsequent pages

        // Running top header for page 2+
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(148, 163, 184); // Slate-400
        const headerTitle = module.title.length > 55 ? `${module.title.substring(0, 55)}...` : module.title;
        doc.text(`${course ? course.code + '  ·  ' : ''}${headerTitle}`, margin, 13);
        doc.setDrawColor(226, 232, 240);
        doc.setLineWidth(0.3);
        doc.line(margin, 15, pageWidth - margin, 15);
      }
    };

    // Helper: print wrapped text line by line with strict cursor management
    const printParagraph = (
      rawText: string,
      fontSize: number,
      fontStyle: 'normal' | 'bold' | 'italic',
      color: [number, number, number],
      lineSpacingMm: number,
      paragraphGapMm: number,
      indentMm = 0
    ) => {
      const text = cleanMarkdownText(rawText);
      doc.setFont('helvetica', fontStyle);
      doc.setFontSize(fontSize);
      doc.setTextColor(color[0], color[1], color[2]);

      const effectiveWidth = contentWidth - indentMm;
      const lines = doc.splitTextToSize(text, effectiveWidth);

      lines.forEach((line: string) => {
        checkPageBreak(lineSpacingMm);
        doc.text(line, margin + indentMm, y);
        y += lineSpacingMm;
      });

      y += paragraphGapMm;
    };

    // ==========================================
    // 1. HEADER BANNER
    // ==========================================
    doc.setFillColor(15, 23, 42); // Slate-900
    doc.roundedRect(margin, y, contentWidth, 11, 1.5, 1.5, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('LENTERA EDU', margin + 4, y + 7);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(203, 213, 225); // Slate-300
    doc.text('MODUL PEMBELAJARAN RESMI  ·  SEMESTER GANJIL 2026/2027', margin + 32, y + 7);

    y += 18;

    // ==========================================
    // 2. COURSE & INSTRUCTOR META
    // ==========================================
    if (course) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(79, 70, 229); // Indigo-600
      doc.text(`${course.code}  —  ${course.title.toUpperCase()}`, margin, y);
      y += 5.5;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(100, 116, 139); // Slate-500
      doc.text(`Dosen Pengampu: ${course.instructorName}   ·   Bobot: ${course.credits} SKS   ·   ${course.room}`, margin, y);
      y += 8;
    }

    // ==========================================
    // 3. MODULE TITLE & CHAPTER
    // ==========================================
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(99, 102, 241); // Indigo-500
    doc.text(module.chapter.toUpperCase(), margin, y);
    y += 5.5;

    // Title (split nicely)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42); // Slate-900
    const titleLines = doc.splitTextToSize(module.title, contentWidth);
    titleLines.forEach((tLine: string) => {
      checkPageBreak(7);
      doc.text(tLine, margin, y);
      y += 6.5;
    });

    y += 1.5;

    // Metadata line
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139); // Slate-500
    doc.text(
      `Diterbitkan: ${module.publishedAt}   ·   Tipe: ${module.contentType.toUpperCase()}`,
      margin,
      y
    );
    y += 4.5;

    // Divider line
    doc.setDrawColor(226, 232, 240); // Slate-200
    doc.setLineWidth(0.4);
    doc.line(margin, y, pageWidth - margin, y);
    y += 6;

    // ==========================================
    // 4. ABSTRACT / DESCRIPTION CALLOUT BOX
    // ==========================================
    if (module.description) {
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8.5);
      const descLines = doc.splitTextToSize(module.description, contentWidth - 8);
      const boxHeight = Math.max(14, descLines.length * 4.2 + 8);

      checkPageBreak(boxHeight + 4);

      doc.setFillColor(248, 250, 252); // Slate-50
      doc.setDrawColor(203, 213, 225); // Slate-300
      doc.setLineWidth(0.3);
      doc.roundedRect(margin, y, contentWidth, boxHeight, 1.5, 1.5, 'FD');

      doc.setTextColor(71, 85, 105); // Slate-600
      let descY = y + 5.5;
      descLines.forEach((dLine: string) => {
        doc.text(dLine, margin + 4, descY);
        descY += 4.2;
      });

      y += boxHeight + 8;
    }

    // ==========================================
    // 5. PARSE CONTENT LINE BY LINE
    // ==========================================
    const rawLines = module.textContent.split('\n');

    for (let i = 0; i < rawLines.length; i++) {
      const line = rawLines[i].trim();

      // Empty line -> add breathing room
      if (!line) {
        y += 2.5;
        continue;
      }

      // 1. Heading 1 (# Heading)
      if (line.startsWith('# ')) {
        const text = line.replace(/^#\s+/, '');
        checkPageBreak(14);
        y += 3;
        printParagraph(text, 13, 'bold', [15, 23, 42], 6, 3);
        // Accent underline under major chapter title
        doc.setDrawColor(99, 102, 241); // Indigo-500
        doc.setLineWidth(0.6);
        doc.line(margin, y - 1, margin + 40, y - 1);
        y += 4;
        continue;
      }

      // 2. Heading 2 (## Heading)
      if (line.startsWith('## ')) {
        const text = line.replace(/^##\s+/, '');
        checkPageBreak(12);
        y += 3;
        printParagraph(text, 11, 'bold', [30, 41, 59], 5.5, 2.5);
        continue;
      }

      // 3. Heading 3 (### Heading)
      if (line.startsWith('### ')) {
        const text = line.replace(/^###\s+/, '');
        checkPageBreak(10);
        y += 2;
        printParagraph(text, 9.5, 'bold', [79, 70, 229], 5, 2);
        continue;
      }

      // 4. Blockquote (> Quote)
      if (line.startsWith('> ')) {
        const quoteText = line.replace(/^>\s+/, '');
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(8.5);
        const quoteLines = doc.splitTextToSize(cleanMarkdownText(quoteText), contentWidth - 12);
        const qBoxHeight = quoteLines.length * 4.2 + 6;

        checkPageBreak(qBoxHeight + 4);

        doc.setFillColor(241, 245, 249); // Slate-100
        doc.rect(margin, y, contentWidth, qBoxHeight, 'F');

        // Indigo bar on left of quote
        doc.setFillColor(99, 102, 241);
        doc.rect(margin, y, 1.5, qBoxHeight, 'F');

        doc.setTextColor(71, 85, 105);
        let qY = y + 4.5;
        quoteLines.forEach((qLine: string) => {
          doc.text(qLine, margin + 5, qY);
          qY += 4.2;
        });

        y += qBoxHeight + 4;
        continue;
      }

      // 5. Mathematical Formula Block ($$...$$ or formula)
      if (line.startsWith('$$') || (line.includes('=') && (line.includes('\\') || line.includes('lambda') || line.includes('theta')))) {
        const cleanFormula = cleanMathNotation(line.replace(/\$\$/g, '').trim());
        checkPageBreak(14);

        doc.setFillColor(248, 250, 252);
        doc.setDrawColor(226, 232, 240);
        doc.setLineWidth(0.3);
        doc.roundedRect(margin, y, contentWidth, 9, 1, 1, 'FD');

        doc.setFont('courier', 'bold');
        doc.setFontSize(9.5);
        doc.setTextColor(30, 41, 59);
        doc.text(cleanFormula, margin + 6, y + 6);

        y += 13;
        continue;
      }

      // 6. Bullet lists (- or *)
      if (line.startsWith('- ') || line.startsWith('* ')) {
        const bulletText = line.replace(/^[-*]\s+/, '');
        checkPageBreak(5);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(99, 102, 241); // Indigo bullet
        doc.text('•', margin + 2, y);

        printParagraph(bulletText, 8.5, 'normal', [51, 65, 85], 4.2, 1.5, 6);
        continue;
      }

      // 7. Numbered lists (1. , 2. , etc.)
      const numberedMatch = line.match(/^(\d+\.)\s+(.+)$/);
      if (numberedMatch) {
        const numPrefix = numberedMatch[1];
        const numText = numberedMatch[2];
        checkPageBreak(5);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(79, 70, 229);
        doc.text(numPrefix, margin + 1, y);

        printParagraph(numText, 8.5, 'normal', [51, 65, 85], 4.2, 1.5, 7);
        continue;
      }

      // 8. Standard paragraph
      printParagraph(line, 8.5, 'normal', [51, 65, 85], 4.4, 2.5);
    }

    // ==========================================
    // 6. FOOTER & PAGE NUMBERING
    // ==========================================
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);

      // Footer divider line
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.3);
      doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);

      // Left footer
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(148, 163, 184); // Slate-400
      doc.text('Lentera Edu E-Learning LMS  ·  Hak Cipta Terpelihara © 2026/2027', margin, pageHeight - 7);

      // Right footer page count
      doc.text(`Halaman ${i} dari ${totalPages}`, pageWidth - margin, pageHeight - 7, { align: 'right' });
    }

    // Safe sanitized filename
    const safeTitle = module.title
      .replace(/[^a-zA-Z0-9_\-\s]/g, '')
      .trim()
      .replace(/\s+/g, '_');
    const safeCourse = course ? `${course.code}_` : '';
    const filename = `Modul_${safeCourse}${safeTitle}.pdf`;

    // Download document directly
    doc.save(filename);
    return true;
  } catch (err) {
    console.error('Error generating PDF, falling back to text format:', err);
    fallbackDownloadAsText(module, course);
    return false;
  }
};

const fallbackDownloadAsText = (module: ModuleItem, course?: Course) => {
  const safeTitle = module.title
    .replace(/[^a-zA-Z0-9_\-\s]/g, '')
    .trim()
    .replace(/\s+/g, '_');
  const safeCourse = course ? `${course.code}_` : '';
  const filename = `Modul_${safeCourse}${safeTitle}.txt`;

  const content = `================================================================================
LENTERA EDU - MODUL MATERI PEMBELAJARAN RESMI
================================================================================
Mata Pelajaran : ${course ? `${course.code} - ${course.title}` : '-'}
Dosen Pengampu : ${course ? course.instructorName : '-'}
Bab / Silabus  : ${module.chapter}
Judul Materi   : ${module.title}
Tipe Berkas    : ${module.contentType.toUpperCase()}
Tanggal Terbit : ${module.publishedAt}
================================================================================

RINGKASAN MATERI:
${module.description}

--------------------------------------------------------------------------------
ISI MATERI LENGKAP
--------------------------------------------------------------------------------

${cleanMathNotation(module.textContent)}

================================================================================
Diunduh dari Platform E-Learning Lentera Edu
Tahun Akademik 2026/2027
`;

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

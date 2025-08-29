export const addTitle = (doc, pageWidth, margin, formTitle) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(30, 30, 30);
    doc.text(formTitle, pageWidth / 2, 45, { align: 'center' });

    // Línea decorativa bajo el título
    doc.setDrawColor(22, 160, 133);
    doc.setLineWidth(0.5);
    doc.line(margin, 50, pageWidth - margin, 50);
};
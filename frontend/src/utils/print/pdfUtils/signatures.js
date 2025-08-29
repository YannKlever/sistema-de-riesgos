export const addSignatureSection = (doc, yPosition) => {
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 15;

    // Verificar si hay espacio suficiente en la página actual
    const requiredHeight = 60; // Altura estimada para la sección de firmas

    if (yPosition + requiredHeight > pageHeight - margin) {
        doc.addPage();
        yPosition = margin;
    }

    const boxWidth = 55;
    const boxHeight = 30;
    const spacing = (pageWidth - (margin * 2) - (boxWidth * 3)) / 2;

    addSignatureTitle(doc, pageWidth, yPosition);
    addSignatureBoxes(doc, pageWidth, yPosition, boxWidth, boxHeight, spacing, margin);
    addFooter(doc, pageWidth, pageHeight);

    return doc.lastAutoTable ? doc.lastAutoTable.finalY : yPosition + requiredHeight;
};

const addSignatureTitle = (doc, pageWidth, yPosition) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(22, 160, 133);
    doc.text('FIRMAS Y AUTORIZACIONES', pageWidth / 2, yPosition, { align: 'center' });

    doc.setDrawColor(22, 160, 133);
    doc.setLineWidth(0.3);
    doc.line(pageWidth / 2 - 35, yPosition + 2, pageWidth / 2 + 35, yPosition + 2);
};

const addSignatureBoxes = (doc, pageWidth, yPosition, boxWidth, boxHeight, spacing, margin) => {
    const startX = margin;
    const boxY = yPosition + 10;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(80, 80, 80);

    // Caja 1: Firma del Cliente
    doc.roundedRect(startX, boxY, boxWidth, boxHeight, 2, 2);
    doc.text('Firma del Cliente', startX + boxWidth / 2, boxY + boxHeight + 5, {
        align: 'center',
        fontStyle: 'bold'
    });

    // Caja 2: Firma del Representante
    doc.roundedRect(startX + boxWidth + spacing, boxY, boxWidth, boxHeight, 2, 2);
    doc.text('Firma del Representante', startX + boxWidth + spacing + boxWidth / 2, boxY + boxHeight + 5, {
        align: 'center',
        fontStyle: 'bold'
    });

    // Caja 3: Rúbrica de la Empresa
    doc.roundedRect(startX + (boxWidth * 2) + (spacing * 2), boxY, boxWidth, boxHeight, 2, 2);
    doc.text('Rúbrica de la Empresa', startX + (boxWidth * 2) + (spacing * 2) + boxWidth / 2, boxY + boxHeight + 5, {
        align: 'center',
        fontStyle: 'bold'
    });
};

const addFooter = (doc, pageWidth, pageHeight) => {
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    const now = new Date();
    const fechaHoraGeneracion = `${now.toLocaleDateString()} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    doc.text(`Documento generado el ${fechaHoraGeneracion}`, pageWidth - 15, pageHeight - 10, {
        align: 'right',
        fontStyle: 'italic'
    });

    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.2);
    doc.line(15, pageHeight - 12, pageWidth - 15, pageHeight - 12);
};
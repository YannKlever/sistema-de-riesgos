import autoTable from 'jspdf-autotable';

export const processSections = (doc, formData, sections, margin) => {
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const tableWidth = pageWidth - (margin * 2);
    const fieldColWidth = tableWidth * 0.35;
    const valueColWidth = tableWidth * 0.65;

    let startY = 55;

    sections.forEach((section, index) => {
        // Verificar si necesita nueva página
        const estimatedSectionHeight = section.fields.length * 8 + 20;
        if (startY + estimatedSectionHeight > pageHeight - margin) {
            doc.addPage();
            startY = margin;
        }

        const tableData = prepareTableData(section.fields, formData, fieldColWidth, valueColWidth);

        addSectionTitle(doc, section.title, startY, index);

        const tableStartY = calculateTableStartY(startY, index);

        generateSectionTable(doc, tableData, fieldColWidth, valueColWidth, tableStartY, margin);

        startY = updateStartY(doc, sections, index);
    });

    return doc.lastAutoTable ? doc.lastAutoTable.finalY : startY;
};


const prepareTableData = (fields, formData, fieldColWidth, valueColWidth) => {
    return fields.map(field => [
        {
            content: field.label,
            styles: { fontStyle: 'bold', cellWidth: fieldColWidth }
        },
        {
            content: formData[field.name] || 'No especificado',
            styles: { cellWidth: valueColWidth }
        }
    ]);
};

const addSectionTitle = (doc, title, startY, index) => {
    doc.setFontSize(14);
    doc.setTextColor(22, 160, 133);
    const sectionTitleY = index === 0 ? startY + 5 : startY - 5;
    doc.text(title, 15, sectionTitleY);
};

const calculateTableStartY = (startY, index) => {
    return index === 0 ? startY + 10 : startY + 3;
};

const generateSectionTable = (doc, tableData, fieldColWidth, valueColWidth, startY, margin) => {
    autoTable(doc, {
        head: [[
            { content: 'Campo', styles: { halign: 'left', cellWidth: fieldColWidth } },
            { content: 'Valor', styles: { halign: 'left', cellWidth: valueColWidth } }
        ]],
        body: tableData,
        startY: startY,
        margin: { left: margin, right: margin },
        styles: {
            fontSize: 9,
            cellPadding: 2,
            lineColor: [220, 220, 220],
            lineWidth: 0.2,
            minCellHeight: 6,
            overflow: 'linebreak'
        },
        headStyles: {
            fillColor: [22, 160, 133],
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            halign: 'left',
            cellPadding: 3
        },
        bodyStyles: {
            textColor: [50, 50, 50],
            cellPadding: 2,
            valign: 'top'
        },
        alternateRowStyles: {
            fillColor: [250, 250, 250]
        },
        columnStyles: {
            0: { cellWidth: fieldColWidth, fontStyle: 'bold' },
            1: { cellWidth: valueColWidth }
        },
        tableWidth: 'wrap',
        didDrawCell: (data) => {
            adjustCellHeight(data, valueColWidth);
        }
    });
};

const adjustCellHeight = (data, valueColWidth) => {
    if (data.section === 'body' && data.column.index === 1) {
        const lines = data.doc.splitTextToSize(data.cell.raw, valueColWidth - 4);
        if (lines.length > 1) {
            data.row.height = Math.max(data.row.height, lines.length * 4);
        }
    }
};

const updateStartY = (doc, sections, index) => {
    return doc.lastAutoTable.finalY + (index < sections.length - 1 ? 10 : 8);
};
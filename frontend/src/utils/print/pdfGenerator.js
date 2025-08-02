import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateFormPDF = (formData, formTitle, sections) => {
    try {
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm'
        });

        // ==============================================
        // NUEVO: Encabezado con logo y datos de empresa
        // ==============================================
        const logoPath = 'images/logo.jpg'; // Ruta relativa desde public
        const margin = 15; // Márgen en mm
        const pageWidth = doc.internal.pageSize.width;
        
        // Agregar logo (ajusta las coordenadas y tamaño según necesites)
        try {
            doc.addImage(logoPath, 'JPEG', margin, 10, 25, 25);
        } catch (error) {
            console.warn('No se pudo cargar el logo:', error);
        }

        // Datos de la empresa
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.setTextColor(30, 30, 30);
        
        // Nombre empresa
        doc.text('EMPRESA SEGUROS S.A.', pageWidth - margin, 15, { align: 'right' });
        
        // Información adicional (ajusta según tus necesidades)
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.text('NIT: 1234567890123', pageWidth - margin, 20, { align: 'right' });
        doc.text('Av. Principal 123, La Paz', pageWidth - margin, 25, { align: 'right' });
        doc.text('Teléfono: (123) 456-7890', pageWidth - margin, 30, { align: 'right' });

        // Línea divisoria
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.3);
        doc.line(margin, 35, pageWidth - margin, 35);

        // ==============================================
        // Título del formulario (existente, con ajustes de posición)
        // ==============================================
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(20);
        doc.setTextColor(30, 30, 30);
        doc.text(formTitle, pageWidth / 2, 45, { align: 'center' });

        // Línea decorativa bajo el título
        doc.setDrawColor(22, 160, 133);
        doc.setLineWidth(0.5);
        doc.line(margin, 50, pageWidth - margin, 50);

        // Ajustamos el startY para dar más espacio después del encabezado
        let startY = 55; // Aumentado para acomodar el nuevo encabezado

        // Ancho total disponible para la tabla (210mm - márgenes)
        const tableWidth = doc.internal.pageSize.width - 30; // 15mm cada lado
        const fieldColWidth = tableWidth * 0.35; // 35% para Campo
        const valueColWidth = tableWidth * 0.65; // 65% para Valor

        // Procesar cada sección
        sections.forEach((section, index) => {
            // Preparar datos para la tabla
            const tableData = section.fields.map(field => [
                { content: field.label, styles: { fontStyle: 'bold', cellWidth: fieldColWidth } },
                { content: formData[field.name] || 'No especificado', styles: { cellWidth: valueColWidth } }
            ]);

            // Añadir título de sección
            doc.setFontSize(14);
            doc.setTextColor(22, 160, 133);
            const sectionTitleY = index === 0 ? startY + 5 : startY - 5;
            doc.text(section.title, 15, sectionTitleY);

            // Ajustamos el startY para la tabla
            const tableStartY = index === 0 ? startY + 10 : startY + 3;

            // Generar tabla con ancho de columnas fijo y autoajuste de altura
            autoTable(doc, {
                head: [[
                    { content: 'Campo', styles: { halign: 'left', cellWidth: fieldColWidth } },
                    { content: 'Valor', styles: { halign: 'left', cellWidth: valueColWidth } }
                ]],
                body: tableData,
                startY: tableStartY,
                margin: { left: 15, right: 15 },
                styles: {
                    fontSize: 9,
                    cellPadding: 2,
                    lineColor: [220, 220, 220],
                    lineWidth: 0.2,
                    minCellHeight: 6,
                    overflow: 'linebreak' // Permite autoajuste de altura
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
                    valign: 'top' // Alineación vertical superior
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
                    // Autoajuste de altura basado en contenido
                    if (data.section === 'body' && data.column.index === 1) {
                        const lines = data.doc.splitTextToSize(data.cell.raw, valueColWidth - 4);
                        if (lines.length > 1) {
                            data.row.height = Math.max(data.row.height, lines.length * 4);
                        }
                    }
                }
            });

            // Espaciado entre secciones
            startY = doc.lastAutoTable.finalY + (index < sections.length - 1 ? 10 : 8);
        });

        // Añadir sección de firmas al final
        addSignatureSection(doc, doc.lastAutoTable.finalY + 7);

        return doc;
    } catch (error) {
        console.error('Error en generateFormPDF:', error);
        throw error;
    }
};

// Función para añadir la sección de firmas (se mantiene igual)
const addSignatureSection = (doc, yPosition) => {
    const pageWidth = doc.internal.pageSize.width;
    const boxWidth = 55;
    const boxHeight = 30;
    const spacing = (pageWidth - 35 - (boxWidth * 3)) / 2;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(22, 160, 133);
    doc.text('FIRMAS Y AUTORIZACIONES', pageWidth / 2, yPosition, { align: 'center' });

    doc.setDrawColor(22, 160, 133);
    doc.setLineWidth(0.3);
    doc.line(pageWidth / 2 - 30, yPosition + 2, pageWidth / 2 + 30, yPosition + 2);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);

    const startX = 15;

    doc.roundedRect(startX, yPosition + 10, boxWidth, boxHeight, 2, 2);
    doc.text('Firma del Cliente', startX + boxWidth / 2, yPosition + 10 + boxHeight + 8, {
        align: 'center',
        fontStyle: 'bold'
    });

    doc.roundedRect(startX + boxWidth + spacing, yPosition + 10, boxWidth, boxHeight, 2, 2);
    doc.text('Firma del Representante', startX + boxWidth + spacing + boxWidth / 2, yPosition + 10 + boxHeight + 8, {
        align: 'center',
        fontStyle: 'bold'
    });

    doc.roundedRect(startX + (boxWidth * 2) + (spacing * 2), yPosition + 10, boxWidth, boxHeight, 2, 2);
    doc.text('Rúbrica de la Empresa', startX + (boxWidth * 2) + (spacing * 2) + boxWidth / 2, yPosition + 10 + boxHeight + 8, {
        align: 'center',
        fontStyle: 'bold'
    });

    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    const now = new Date();
    const fechaHoraGeneracion = `${now.toLocaleDateString()} ${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    doc.text(`Documento generado el ${fechaHoraGeneracion}`, pageWidth - 15, doc.internal.pageSize.height - 10, {
        align: 'right',
        fontStyle: 'italic'
    });

    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.2);
    doc.line(15, doc.internal.pageSize.height - 12, pageWidth - 15, doc.internal.pageSize.height - 12);
};

export const downloadPDF = (pdf, fileName) => {
    try {
        const now = new Date();
        const dateTimeStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;

        const safeFileName = fileName
            .replace(/[^a-z0-9]/gi, '_')
            .toLowerCase();
        pdf.save(`${safeFileName}_${dateTimeStr}.pdf`);
    } catch (error) {
        console.error('Error en downloadPDF:', error);
        throw error;
    }
};
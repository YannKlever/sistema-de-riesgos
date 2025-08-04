// pdfGeneratorCuestionario.js
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateCuestionarioPDF = (formData, secciones, formTitle, detalles) => {
    try {
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm'
        });

        // Configuración compacta
        const margin = 10; // Reducir márgenes (antes 15)
        const pageWidth = doc.internal.pageSize.width;
        const compactSpacing = 3; // Espaciado reducido entre elementos

        // ==============================================
        // Encabezado compacto
        // ==============================================
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10); // Reducido de 12
        doc.setTextColor(30, 30, 30);
        doc.text('EMPRESA SEGUROS S.A.', pageWidth - margin, 10, { align: 'right' }); // Posición más alta

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7); // Reducido de 9
        doc.text('NIT: 1234567890123', pageWidth - margin, 14, { align: 'right' });
        doc.text('Av. Principal 123, La Paz', pageWidth - margin, 18, { align: 'right' });
        doc.text('Teléfono: (123) 456-7890', pageWidth - margin, 22, { align: 'right' });

        // Línea divisoria más fina
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.2); // Reducido de 0.3
        doc.line(margin, 26, pageWidth - margin, 26); // Posición más alta

        // ==============================================
        // Título del formulario compacto
        // ==============================================
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16); // Reducido de 20
        doc.setTextColor(30, 30, 30);
        doc.text(formTitle, pageWidth / 2, 34, { align: 'center' }); // Posición más alta

        doc.setDrawColor(22, 160, 133);
        doc.setLineWidth(0.3); // Reducido de 0.5
        doc.line(margin, 38, pageWidth - margin, 38); // Posición más alta

        let startY = 42; // Posición inicial más alta

        // ==============================================
        // Configuración compacta para tablas
        // ==============================================
        const tableConfig = {
            margin: { left: margin, right: margin },
            styles: {
                fontSize: 8, // Reducido de 9
                cellPadding: 2, // Reducido de 3
                lineColor: [220, 220, 220],
                lineWidth: 0.1, // Reducido de 0.2
                minCellHeight: 6, // Reducido de 8
                overflow: 'linebreak'
            },
            headStyles: {
                fillColor: [22, 160, 133],
                textColor: [255, 255, 255],
                fontStyle: 'bold',
                halign: 'left',
                fontSize: 8 // Reducido
            },
            bodyStyles: {
                textColor: [50, 50, 50],
                cellPadding: 1, // Reducido de 2
                valign: 'top'
            },
            columnStyles: {
                0: { cellWidth: 120, fontStyle: 'bold' },
                1: { cellWidth: 70 }
            }
        };

        // Procesar cada sección del cuestionario
        secciones.forEach((seccion, index) => {
            // Preparar datos para la tabla
            const tableData = seccion.preguntas.map(pregunta => {
                const respuesta = formData[pregunta.id]?.texto || 'No respondida';
                return [
                    { content: pregunta.texto, styles: { fontStyle: 'bold', cellWidth: 120 } },
                    { content: respuesta, styles: { cellWidth: 70 } }
                ];
            });

            // Añadir título de sección compacto
            doc.setFontSize(12); // Reducido de 14
            doc.setTextColor(22, 160, 133);
            doc.text(seccion.titulo, margin, startY + compactSpacing);

            // Generar tabla compacta
            autoTable(doc, {
                ...tableConfig,
                head: [[
                    { content: 'Pregunta', styles: { halign: 'left', cellWidth: 120 } },
                    { content: 'Respuesta', styles: { halign: 'left', cellWidth: 70 } }
                ]],
                body: tableData,
                startY: startY + compactSpacing * 2,
                didDrawCell: (data) => {
                    // Autoajuste de altura más compacto
                    if (data.section === 'body') {
                        const lines = data.doc.splitTextToSize(data.cell.raw, data.cell.width - 2); // Margen reducido
                        if (lines.length > 1) {
                            data.row.height = Math.max(data.row.height, lines.length * 3.5); // Altura reducida
                        }
                    }
                }
            });

            // Espaciado reducido entre secciones
            startY = doc.lastAutoTable.finalY + (index < secciones.length - 1 ? compactSpacing * 2 : compactSpacing);
        });

        // Detalles adicionales compactos
        if (detalles && detalles.trim() !== '') {
            doc.setFontSize(10); // Reducido de 12
            doc.setTextColor(22, 160, 133);
            doc.text('Detalles Adicionales', margin, startY + compactSpacing);

            doc.setFontSize(8); // Reducido de 10
            doc.setTextColor(50, 50, 50);
            const lines = doc.splitTextToSize(detalles, pageWidth - 2 * margin);
            doc.text(lines, margin, startY + compactSpacing * 3); // Espaciado reducido

            startY += compactSpacing * 3 + (lines.length * 3.5); // Altura de línea reducida
        }

        // Sección de firmas compacta
        addCompactSignatureSection(doc, startY + compactSpacing * 2);

        return doc;
    } catch (error) {
        console.error('Error en generateCuestionarioPDF:', error);
        throw error;
    }
};

// Función para añadir la sección de firmas compacta
const addCompactSignatureSection = (doc, yPosition) => {
    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;
    const marginBottom = 15; // Margen inferior reducido
    
    // Verificar espacio para versión compacta (40mm en lugar de 60mm)
    if (yPosition + 40 > pageHeight - marginBottom) {
        doc.addPage();
        yPosition = 15; // Posición más alta en nueva página
    }

    const boxWidth = 50; // Reducido de 55
    const boxHeight = 25; // Reducido de 30
    const spacing = (pageWidth - 2 * 10 - (boxWidth * 2)) / 1; // Márgenes más ajustados

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10); // Reducido de 12
    doc.setTextColor(22, 160, 133);
    doc.text('FIRMAS Y AUTORIZACIONES', pageWidth / 2, yPosition, { align: 'center' });

    doc.setDrawColor(22, 160, 133);
    doc.setLineWidth(0.2); // Reducido de 0.3
    doc.line(pageWidth / 2 - 25, yPosition + 2, pageWidth / 2 + 25, yPosition + 2); // Línea más corta

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8); // Reducido de 10
    doc.setTextColor(80, 80, 80);

    const startX = 10; // Márgen más ajustado

    // Cajas de firma más pequeñas
    doc.roundedRect(startX, yPosition + 8, boxWidth, boxHeight, 1.5, 1.5); // Radio reducido
    doc.text('Firma del Evaluador', startX + boxWidth / 2, yPosition + 8 + boxHeight + 6, { // Espaciado reducido
        align: 'center',
        fontStyle: 'bold',
        fontSize: 8 // Reducido
    });

    doc.roundedRect(startX + boxWidth + spacing, yPosition + 8, boxWidth, boxHeight, 1.5, 1.5);
    doc.text('Firma del Responsable', startX + boxWidth + spacing + boxWidth / 2, yPosition + 8 + boxHeight + 6, {
        align: 'center',
        fontStyle: 'bold',
        fontSize: 8 // Reducido
    });

    // Pie de página más compacto
    doc.setFontSize(7); // Reducido de 8
    doc.setTextColor(120, 120, 120);
    const now = new Date();
    const fechaHoraGeneracion = `${now.toLocaleDateString()} ${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`; // Sin segundos
    doc.text(`Documento generado el ${fechaHoraGeneracion}`, pageWidth - 10, doc.internal.pageSize.height - 8, { // Posición más alta
        align: 'right',
        fontStyle: 'italic'
    });

    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.1); // Reducido de 0.2
    doc.line(10, doc.internal.pageSize.height - 10, pageWidth - 10, doc.internal.pageSize.height - 10); // Línea más fina y alta
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
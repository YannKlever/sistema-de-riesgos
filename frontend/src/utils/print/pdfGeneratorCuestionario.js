import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { addHeader } from './pdfUtils/header';
import { databaseService } from '../../services/database';

export const generateCuestionarioPDF = async (formData, secciones, formTitle, detalles) => {
    try {
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm'
        });

        const margin = 10;
        const pageWidth = doc.internal.pageSize.width;
        const compactSpacing = 3;

        // ==============================================
        // Encabezado compacto (usando el componente modular)
        // ==============================================
        // Primero creamos un encabezado temporal para obtener los datos
        const tempDoc = new jsPDF();
        await addHeader(tempDoc, pageWidth, margin);
        
        // Ahora obtenemos los datos reales de la empresa
        let empresaData = {
            nombreEmpresa: 'EMPRESA SEGUROS S.A.',
            nit: 'NIT: 1234567890123',
            direccion: 'Av. Principal 123, La Paz',
            telefono: 'Teléfono: (123) 456-7890'
        };
        
        try {
            const empresaResult = await databaseService.obtenerEmpresa();
            if (empresaResult.success && empresaResult.data) {
                const empresa = empresaResult.data;
                empresaData.nombreEmpresa = empresa.nombre || empresaData.nombreEmpresa;
                empresaData.nit = empresa.nit ? `NIT: ${empresa.nit}` : empresaData.nit;
                empresaData.direccion = empresa.direccion || empresaData.direccion;
                empresaData.telefono = empresa.telefono ? `Teléfono: ${empresa.telefono}` : empresaData.telefono;
            }
        } catch (error) {
            console.error('Error al obtener datos de empresa:', error);
            // Usamos los valores por defecto en caso de error
        }

        // Creamos el encabezado compacto con los datos obtenidos
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10); // Compacto: 10px en lugar de 12px
        doc.setTextColor(30, 30, 30);
        doc.text(empresaData.nombreEmpresa, pageWidth - margin, 10, { align: 'right' });

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7); // Compacto: 7px en lugar de 9px
        doc.text(empresaData.nit, pageWidth - margin, 14, { align: 'right' });
        doc.text(empresaData.direccion, pageWidth - margin, 18, { align: 'right' });
        doc.text(empresaData.telefono, pageWidth - margin, 22, { align: 'right' });

        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.2); // Línea más fina
        doc.line(margin, 26, pageWidth - margin, 26); // Posición más alta

        // ==============================================
        // Título del formulario compacto
        // ==============================================
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16);
        doc.setTextColor(30, 30, 30);
        doc.text(formTitle, pageWidth / 2, 34, { align: 'center' });

        doc.setDrawColor(22, 160, 133);
        doc.setLineWidth(0.3);
        doc.line(margin, 38, pageWidth - margin, 38);

        let startY = 42;

        // ==============================================
        // Configuración compacta para tablas
        // ==============================================
        const tableConfig = {
            margin: { left: margin, right: margin },
            styles: {
                fontSize: 8,
                cellPadding: 2,
                lineColor: [220, 220, 220],
                lineWidth: 0.1,
                minCellHeight: 6,
                overflow: 'linebreak'
            },
            headStyles: {
                fillColor: [22, 160, 133],
                textColor: [255, 255, 255],
                fontStyle: 'bold',
                halign: 'left',
                fontSize: 8
            },
            bodyStyles: {
                textColor: [50, 50, 50],
                cellPadding: 1,
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
            doc.setFontSize(12);
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
                    if (data.section === 'body') {
                        const lines = data.doc.splitTextToSize(data.cell.raw, data.cell.width - 2);
                        if (lines.length > 1) {
                            data.row.height = Math.max(data.row.height, lines.length * 3.5);
                        }
                    }
                }
            });

            startY = doc.lastAutoTable.finalY + (index < secciones.length - 1 ? compactSpacing * 2 : compactSpacing);
        });

        // Detalles adicionales compactos
        if (detalles && detalles.trim() !== '') {
            doc.setFontSize(10);
            doc.setTextColor(22, 160, 133);
            doc.text('Detalles Adicionales', margin, startY + compactSpacing);

            doc.setFontSize(8);
            doc.setTextColor(50, 50, 50);
            const lines = doc.splitTextToSize(detalles, pageWidth - 2 * margin);
            doc.text(lines, margin, startY + compactSpacing * 3);

            startY += compactSpacing * 3 + (lines.length * 3.5);
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
    const marginBottom = 15;
    
    if (yPosition + 40 > pageHeight - marginBottom) {
        doc.addPage();
        yPosition = 15;
    }

    const boxWidth = 50;
    const boxHeight = 25;
    const spacing = (pageWidth - 2 * 10 - (boxWidth * 2)) / 1;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(22, 160, 133);
    doc.text('FIRMAS Y AUTORIZACIONES', pageWidth / 2, yPosition, { align: 'center' });

    doc.setDrawColor(22, 160, 133);
    doc.setLineWidth(0.2);
    doc.line(pageWidth / 2 - 25, yPosition + 2, pageWidth / 2 + 25, yPosition + 2);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(80, 80, 80);

    const startX = 10;

    doc.roundedRect(startX, yPosition + 8, boxWidth, boxHeight, 1.5, 1.5);
    doc.text('Firma del Evaluador', startX + boxWidth / 2, yPosition + 8 + boxHeight + 6, {
        align: 'center',
        fontStyle: 'bold',
        fontSize: 8
    });

    doc.roundedRect(startX + boxWidth + spacing, yPosition + 8, boxWidth, boxHeight, 1.5, 1.5);
    doc.text('Firma del Responsable', startX + boxWidth + spacing + boxWidth / 2, yPosition + 8 + boxHeight + 6, {
        align: 'center',
        fontStyle: 'bold',
        fontSize: 8
    });

    doc.setFontSize(7);
    doc.setTextColor(120, 120, 120);
    const now = new Date();
    const fechaHoraGeneracion = `${now.toLocaleDateString()} ${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
    doc.text(`Documento generado el ${fechaHoraGeneracion}`, pageWidth - 10, doc.internal.pageSize.height - 8, {
        align: 'right',
        fontStyle: 'italic'
    });

    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.1);
    doc.line(10, doc.internal.pageSize.height - 10, pageWidth - 10, doc.internal.pageSize.height - 10);
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
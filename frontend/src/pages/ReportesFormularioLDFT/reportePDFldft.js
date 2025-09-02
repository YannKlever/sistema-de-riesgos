import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { databaseService } from '../../services/database';

// Configuración de estilos para PDF
const PDF_STYLES = {
    header: {
        fillColor: [47, 85, 151],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 10,
        halign: 'center',
        valign: 'middle'
    },
    body: {
        textColor: [0, 0, 0],
        fontSize: 9,
        lineColor: [217, 217, 217]
    },
    alternateRow: {
        fillColor: [240, 240, 240]
    },
    number: {
        halign: 'right'
    },
    boolean: {
        halign: 'center'
    },
    page: {
        margins: {
            top: 45,
            right: 15,
            bottom: 40,
            left: 15
        }
    }
};

// Funciones auxiliares
const obtenerDatosEmpresa = async () => {
    try {
        const empresaResult = await databaseService.obtenerEmpresa();
        if (empresaResult.success && empresaResult.data) {
            const empresa = empresaResult.data;
            return {
                nombreEmpresa: empresa.nombre || 'EMPRESA SEGUROS S.A.',
                nit: empresa.nit ? `NIT: ${empresa.nit}` : 'NIT: 1234567890123',
                direccion: empresa.direccion || 'Av. Principal 123, La Paz',
                telefono: empresa.telefono ? `Teléfono: ${empresa.telefono}` : 'Teléfono: (123) 456-7890'
            };
        }
    } catch (error) {
        console.error('Error al obtener datos de empresa:', error);
    }

    return {
        nombreEmpresa: 'EMPRESA SEGUROS S.A.',
        nit: 'NIT: 1234567890123',
        direccion: 'Av. Principal 123, La Paz',
        telefono: 'Teléfono: (123) 456-7890'
    };
};

const agregarCabeceraEmpresa = (doc, empresaData) => {
    const pageWidth = doc.internal.pageSize.width;
    const margin = 10;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(30, 30, 30);
    doc.text(empresaData.nombreEmpresa, margin, 15);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(80, 80, 80);

    doc.text(empresaData.nit, pageWidth - margin, 12, { align: 'right' });
    doc.text(empresaData.direccion, pageWidth - margin, 17, { align: 'right' });
    doc.text(empresaData.telefono, pageWidth - margin, 22, { align: 'right' });

    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.line(margin, 28, pageWidth - margin, 28);

    return 35;
};

const formatearFechaEspanol = () => {
    const fecha = new Date();
    const opciones = {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    };

    return `Del ${fecha.toLocaleDateString('es-ES', opciones)}`;
};

const formatearValorPDF = (valor, tipo) => {
    if (valor === null || valor === undefined) {
        return '';
    }

    switch (tipo) {
        case 'numero':
            const num = typeof valor === 'number' ? valor : Number(valor);
            return isNaN(num) ? '' : num.toFixed(2);
        case 'boolean':
            return valor ? 'Sí' : 'No';
        case 'porcentaje':
            const porcentaje = typeof valor === 'number' ? valor : Number(valor);
            return isNaN(porcentaje) ? '' : `${porcentaje.toFixed(0)}%`;
        default:
            const texto = String(valor);
            return texto.length > 30 ? texto.substring(0, 27) + '...' : texto;
    }
};

const dividirColumnasEnGrupos = (columnasConfig, maxPorPagina = 10) => {
    const grupos = [];
    for (let i = 0; i < columnasConfig.length; i += maxPorPagina) {
        grupos.push(columnasConfig.slice(i, i + maxPorPagina));
    }
    return grupos;
};

// Función para agregar 2 firmas (solo en la última página)
const agregarFirmas = (doc) => {
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = PDF_STYLES.page.margins;

    // Línea separadora
    doc.setDrawColor(150, 150, 150);
    doc.setLineWidth(0.3);
    doc.line(
        margin.left,
        pageHeight - 45,
        pageWidth - margin.right,
        pageHeight - 45
    );

    // Espacio para 2 firmas
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');

    // Firma 1 (Izquierda)
    doc.text('_________________________',
        margin.left + 30,
        pageHeight - 35
    );
    doc.text('Firma Responsable',
        margin.left + 30,
        pageHeight - 30
    );

    // Firma 2 (Derecha)
    doc.text('_________________________',
        pageWidth - margin.right - 80,
        pageHeight - 35
    );
    doc.text('Firma Responsable',
        pageWidth - margin.right - 80,
        pageHeight - 30
    );
};

// Función principal de exportación a PDF para evaluaciones LDFT
export const exportarReporteLDFTPDF = async (
    datos,
    columnasConfig,
    nombreArchivo = 'reporte_ldft',
    opciones = {}
) => {
    if (!datos || datos.length === 0) {
        throw new Error('No hay datos para exportar');
    }

    if (!columnasConfig || columnasConfig.length === 0) {
        throw new Error('Configuración de columnas no proporcionada');
    }

    try {
        // Crear un nuevo documento PDF
        const doc = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a4'
        });

        // Obtener datos de la empresa
        const empresaData = await obtenerDatosEmpresa();

        // Dividir columnas en grupos de máximo 10
        const gruposColumnas = dividirColumnasEnGrupos(columnasConfig, 10);

        // Configurar metadatos del documento
        doc.setProperties({
            title: `Reporte de Evaluaciones LGI/FT-FPADM - ${new Date().toLocaleDateString()}`,
            subject: 'Reporte de evaluaciones de lavado de dinero y financiamiento al terrorismo',
            author: opciones.creador || 'Sistema de Reportes',
            keywords: 'LDFT, evaluación, riesgo, reporte',
            creator: 'Sistema de Gestión de Riesgos'
        });

        // Procesar cada grupo de columnas (páginas de datos)
        for (let grupoIndex = 0; grupoIndex < gruposColumnas.length; grupoIndex++) {
            const columnasGrupo = gruposColumnas[grupoIndex];

            // Agregar nueva página para cada grupo (excepto el primero)
            if (grupoIndex > 0) {
                doc.addPage();
            }

            // Agregar cabecera de empresa
            const startYAfterHeader = agregarCabeceraEmpresa(doc, empresaData);

            // Título del reporte
            doc.setFontSize(16);
            doc.setFont('helvetica', 'bold');
            doc.text('Reporte de Evaluaciones LGI/FT-FPADM',
                doc.internal.pageSize.width / 2,
                startYAfterHeader + 5,
                { align: 'center' }
            );

            // Subtítulo
            doc.setFontSize(12);
            doc.setFont('helvetica', 'normal');
            doc.text('Evaluaciones de gestión de riesgos de lavado de dinero y financiamiento al terrorismo',
                doc.internal.pageSize.width / 2,
                startYAfterHeader + 12,
                { align: 'center' }
            );

            // Fecha
            const fechaTexto = formatearFechaEspanol();
            doc.setFontSize(11);
            doc.text(fechaTexto,
                doc.internal.pageSize.width / 2,
                startYAfterHeader + 19,
                { align: 'center' }
            );

            // Indicador de grupo de columnas
            doc.setFontSize(10);
            doc.text(`Columnas ${grupoIndex + 1} de ${gruposColumnas.length}`,
                doc.internal.pageSize.width / 2,
                startYAfterHeader + 26,
                { align: 'center' }
            );

            // Preparar datos para la tabla
            const headers = columnasGrupo.map(col => col.nombre);

            const body = datos.map(item =>
                columnasGrupo.map(col =>
                    formatearValorPDF(item[col.id], col.tipo)
                )
            );

            // Calcular ancho de columnas
            const pageWidth = doc.internal.pageSize.width - PDF_STYLES.page.margins.left - PDF_STYLES.page.margins.right;
            const columnWidth = pageWidth / columnasGrupo.length;

            // Configurar autoTable SIN firmas en estas páginas
            autoTable(doc, {
                head: [headers],
                body: body,
                startY: startYAfterHeader + 35,
                theme: 'grid',
                headStyles: PDF_STYLES.header,
                bodyStyles: PDF_STYLES.body,
                alternateRowStyles: PDF_STYLES.alternateRow,
                margin: PDF_STYLES.page.margins,
                styles: {
                    fontSize: 9,
                    cellPadding: 3,
                    lineColor: PDF_STYLES.body.lineColor,
                    lineWidth: 0.1,
                    cellWidth: columnWidth
                },
                columnStyles: columnasGrupo.reduce((styles, col, index) => {
                    if (col.tipo === 'numero' || col.tipo === 'porcentaje') {
                        styles[index] = { ...PDF_STYLES.number, cellWidth: columnWidth };
                    } else if (col.tipo === 'boolean') {
                        styles[index] = { ...PDF_STYLES.boolean, cellWidth: columnWidth };
                    } else {
                        styles[index] = { cellWidth: columnWidth };
                    }
                    return styles;
                }, {}),
                didDrawPage: (data) => {
                    // Cabecera en cada página del mismo grupo
                    if (data.pageNumber === 1) {
                        agregarCabeceraEmpresa(doc, empresaData);
                    }

                    // Solo número de página en las páginas de datos (sin firmas)
                    const pageHeight = doc.internal.pageSize.height;
                    doc.setFontSize(9);
                    doc.setTextColor(100, 100, 100);
                    doc.text(
                        `Página ${data.pageNumber} - Columnas ${grupoIndex + 1}/${gruposColumnas.length}`,
                        doc.internal.pageSize.width - PDF_STYLES.page.margins.right,
                        pageHeight - 10,
                        { align: 'right' }
                    );
                }
            });
        }

        // Agregar página final con estadísticas Y FIRMAS
        doc.addPage();
        agregarCabeceraEmpresa(doc, empresaData);

        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('Resumen Estadístico',
            doc.internal.pageSize.width / 2,
            50,
            { align: 'center' }
        );

        // Calcular estadísticas
        const calcularPromedio = (campo) => {
            const valoresValidos = datos.filter(item => item[campo] !== null && !isNaN(item[campo]));
            if (valoresValidos.length === 0) return '0.00';

            const total = valoresValidos.reduce((sum, item) => sum + (Number(item[campo]) || 0), 0);
            return (total / valoresValidos.length).toFixed(2);
        };

        const estadisticas = [
            `Total de evaluaciones: ${datos.length}`,
            `Promedio de riesgo calculado: ${calcularPromedio('promedio_frontend')}`,
            `Promedio de riesgo validado: ${calcularPromedio('promedio_riesgo')}`,
            `Evaluación más reciente: ${obtenerFechaMasReciente(datos)}`
        ];

        let statsY = 70;

        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');

        estadisticas.forEach((text) => {
            doc.text(text, PDF_STYLES.page.margins.left + 20, statsY);
            statsY += 8;
        });

        // AGREGAR LAS 2 FIRMAS SOLO EN LA ÚLTIMA PÁGINA
        agregarFirmas(doc);

        // Número de página en la última página también
        const pageHeight = doc.internal.pageSize.height;
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        doc.text(
            `Página ${doc.internal.getNumberOfPages()}`,
            doc.internal.pageSize.width - PDF_STYLES.page.margins.right,
            pageHeight - 10,
            { align: 'right' }
        );

        // Guardar el PDF
        const nombreArchivoCompleto = `${nombreArchivo}_${new Date().toISOString().slice(0, 10)}.pdf`;
        doc.save(nombreArchivoCompleto);

        return true;
    } catch (error) {
        console.error('Error en exportación a PDF:', error);
        throw new Error(`Error al generar el archivo PDF: ${error.message}`);
    }
};

// Función auxiliar para obtener la fecha más reciente
const obtenerFechaMasReciente = (datos) => {
    if (datos.length === 0) return 'N/A';
    const fechas = datos.map(e => new Date(e.fecha_evaluacion || e.fecha_creacion));
    const masReciente = new Date(Math.max(...fechas));
    return masReciente.toLocaleDateString('es-ES');
};

// Hook para exportar a PDF
export const useExportarPDFLDFT = (datos, columnasConfig, opciones = {}) => {
    const exportar = async (nombrePersonalizado = 'reporte_ldft') => {
        try {
            return await exportarReporteLDFTPDF(
                datos,
                columnasConfig,
                nombrePersonalizado,
                opciones
            );
        } catch (error) {
            console.error('Error en useExportarPDFLDFT:', error);
            throw error;
        }
    };

    return exportar;
};

export default { exportarReporteLDFTPDF, useExportarPDFLDFT };
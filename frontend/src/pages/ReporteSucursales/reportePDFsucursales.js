import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { databaseService } from '../../services/database';

// Configuración de estilos para PDF (puedes reutilizar los mismos estilos)
const PDF_STYLES = {
    header: {
        fillColor: [47, 85, 151], // Azul #2F5597 en RGB
        textColor: [255, 255, 255], // Blanco
        fontStyle: 'bold',
        fontSize: 10,
        halign: 'center',
        valign: 'middle'
    },
    body: {
        textColor: [0, 0, 0], // Negro
        fontSize: 8,
        lineColor: [217, 217, 217] // Gris claro #D9D9D9
    },
    alternateRow: {
        fillColor: [240, 240, 240] // Gris muy claro para filas alternas
    },
    number: {
        halign: 'right'
    },
    boolean: {
        halign: 'center'
    },
    page: {
        margins: {
            top: 45, // Aumentado para la cabecera de empresa
            right: 15,
            bottom: 40,
            left: 15
        }
    }
};

// Función para obtener datos de la empresa (reutilizada)
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

    // Valores por defecto en caso de error
    return {
        nombreEmpresa: 'EMPRESA SEGUROS S.A.',
        nit: 'NIT: 1234567890123',
        direccion: 'Av. Principal 123, La Paz',
        telefono: 'Teléfono: (123) 456-7890'
    };
};

// Función para agregar cabecera de empresa (reutilizada)
const agregarCabeceraEmpresa = (doc, empresaData) => {
    const pageWidth = doc.internal.pageSize.width;
    const margin = 10;

    // Logo o nombre de empresa (izquierda)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(30, 30, 30);
    doc.text(empresaData.nombreEmpresa, margin, 15);

    // Información de empresa (derecha)
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(80, 80, 80);

    doc.text(empresaData.nit, pageWidth - margin, 12, { align: 'right' });
    doc.text(empresaData.direccion, pageWidth - margin, 17, { align: 'right' });
    doc.text(empresaData.telefono, pageWidth - margin, 22, { align: 'right' });

    // Línea separadora
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.line(margin, 28, pageWidth - margin, 28);

    return 35; // Retorna la posición Y después de la cabecera
};

// Función para formatear la fecha en español (reutilizada)
const formatearFechaEspanol = () => {
    const fecha = new Date();
    const opciones = {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    };

    const fechaFormateada = fecha.toLocaleDateString('es-ES', opciones);
    return `Del ${fechaFormateada}`;
};

// Función para formatear valores según su tipo (reutilizada)
const formatearValorPDF = (valor, tipo) => {
    if (valor === null || valor === undefined) {
        return '';
    }

    switch (tipo) {
        case 'numero':
            const num = typeof valor === 'number' ? valor : Number(valor);
            return isNaN(num) ? '' : num.toFixed(2);
        case 'boolean':
            if (typeof valor === 'boolean') {
                return valor ? 'Sí' : 'No';
            }
            return valor === 'true' || valor === 'Sí' ? 'Sí' : 'No';
        case 'fecha':
            try {
                const fecha = valor instanceof Date ? valor : new Date(valor);
                return fecha.toLocaleDateString();
            } catch {
                return String(valor);
            }
        default:
            if (typeof valor === 'object') {
                if (valor.value !== undefined) return valor.value;
                if (valor.nombre !== undefined) return valor.nombre;
                if (valor.texto !== undefined) return valor.texto;
                return JSON.stringify(valor);
            }
            // Truncar texto muy largo
            const texto = String(valor);
            return texto.length > 40 ? texto.substring(0, 37) + '...' : texto;
    }
};

// Función principal de exportación a PDF para sucursales
export const exportarReporteSucursalesPDF = async (
    datos,
    columnasConfig,
    nombreArchivo = 'reporte_sucursales',
    opciones = {}
) => {
    // Validaciones
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

        // Agregar cabecera de empresa
        const startYAfterHeader = agregarCabeceraEmpresa(doc, empresaData);

        // Configurar metadatos del documento
        doc.setProperties({
            title: `Reporte de Sucursales - ${new Date().toLocaleDateString()}`,
            subject: 'Reporte de gestión de riesgos por ubicación geográfica',
            author: opciones.creador || 'Sistema de Reportes',
            keywords: 'riesgo, sucursales, ubicación geográfica, reporte',
            creator: 'Sistema de Gestión de Riesgos'
        });

        // Título del reporte - CENTRADO
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('Reporte de Ubicación Geográfica',
            doc.internal.pageSize.width / 2,
            startYAfterHeader + 5,
            { align: 'center' }
        );

        // Fecha - CENTRADA y con formato especial
        const fechaTexto = formatearFechaEspanol();
        doc.setFontSize(11);
        doc.text(fechaTexto,
            doc.internal.pageSize.width / 2,
            startYAfterHeader + 12,
            { align: 'center' }
        );

        // Preparar datos para la tabla
        const headers = columnasConfig.map(col => col.nombre);

        const body = datos.map(item =>
            columnasConfig.map(col =>
                formatearValorPDF(item[col.id], col.tipo)
            )
        );

        // Calcular ancho uniforme para columnas
        const pageWidth = doc.internal.pageSize.width - PDF_STYLES.page.margins.left - PDF_STYLES.page.margins.right;
        const columnWidth = pageWidth / columnasConfig.length;

        // Configurar autoTable
        autoTable(doc, {
            head: [headers],
            body: body,
            startY: startYAfterHeader + 19,
            theme: 'grid',
            headStyles: PDF_STYLES.header,
            bodyStyles: PDF_STYLES.body,
            alternateRowStyles: PDF_STYLES.alternateRow,
            margin: PDF_STYLES.page.margins,
            styles: {
                fontSize: 8,
                cellPadding: 2,
                lineColor: PDF_STYLES.body.lineColor,
                lineWidth: 0.1,
                cellWidth: columnWidth
            },
            columnStyles: columnasConfig.reduce((styles, col, index) => {
                if (col.tipo === 'numero') {
                    styles[index] = { ...PDF_STYLES.number, cellWidth: columnWidth };
                } else if (col.tipo === 'boolean') {
                    styles[index] = { ...PDF_STYLES.boolean, cellWidth: columnWidth };
                } else {
                    styles[index] = { cellWidth: columnWidth };
                }
                return styles;
            }, {}),
            didDrawPage: (data) => {
                // Solo agregar cabecera en la primera página
                if (data.pageNumber === 1) {
                    agregarCabeceraEmpresa(doc, empresaData);
                }

                // Pie de página con firmas
                const pageHeight = doc.internal.pageSize.height;

                // Línea separadora
                doc.setDrawColor(150, 150, 150);
                doc.line(
                    PDF_STYLES.page.margins.left,
                    pageHeight - 35,
                    doc.internal.pageSize.width - PDF_STYLES.page.margins.right,
                    pageHeight - 35
                );

                // Espacio para firmas (2 personas)
                doc.setFontSize(9);
                doc.setFont('helvetica', 'normal');

                // Firma 1 (Izquierda)
                doc.text('_________________________',
                    PDF_STYLES.page.margins.left + 20,
                    pageHeight - 25
                );
                doc.text('Firma Responsable',
                    PDF_STYLES.page.margins.left + 20,
                    pageHeight - 20
                );

                // Firma 2 (Derecha)
                doc.text('_________________________',
                    doc.internal.pageSize.width - PDF_STYLES.page.margins.right - 50,
                    pageHeight - 25
                );
                doc.text('Firma Responsable',
                    doc.internal.pageSize.width - PDF_STYLES.page.margins.right - 50,
                    pageHeight - 20
                );

                // Número de página simple (solo número)
                doc.setFontSize(9);
                doc.setTextColor(100, 100, 100);
                doc.text(
                    `${data.pageNumber}`,
                    doc.internal.pageSize.width - PDF_STYLES.page.margins.right,
                    pageHeight - 10,
                    { align: 'right' }
                );
            }
        });

        // Añadir estadísticas al lado derecho si hay datos
        if (datos.length > 0 && doc.lastAutoTable) {
            const finalY = doc.lastAutoTable.finalY + 10;

            if (finalY < doc.internal.pageSize.height - 50) {
                // Calcular promedios
                const calcularPromedio = (campo) => {
                    const total = datos.reduce((sum, item) => sum + (Number(item[campo]) || 0), 0);
                    return (total / datos.length).toFixed(2);
                };

                const estadisticas = [
                    `Total de registros: ${datos.length}`,
                    `Promedio probabilidad: ${calcularPromedio('probabilidad')}`,
                    `Promedio impacto: ${calcularPromedio('impacto')}`,
                    `Promedio riesgo: ${calcularPromedio('factorRiesgoZonaGeografica')}`
                ];

                // Posicionar estadísticas al lado derecho
                const statsX = doc.internal.pageSize.width - PDF_STYLES.page.margins.right - 70;
                let statsY = finalY;

                doc.setFontSize(10);
                doc.setFont('helvetica', 'bold');
                doc.text('ESTADÍSTICAS', statsX, statsY);

                doc.setFontSize(9);
                doc.setFont('helvetica', 'normal');

                estadisticas.forEach((text, index) => {
                    statsY += 5;
                    doc.text(text, statsX, statsY + (index * 4));
                });
            }
        }

        // Guardar el PDF
        const nombreArchivoCompleto = `${nombreArchivo}_${new Date().toISOString().slice(0, 10)}.pdf`;
        doc.save(nombreArchivoCompleto);

        return true;
    } catch (error) {
        console.error('Error en exportación a PDF:', error);
        throw new Error(`Error al generar el archivo PDF: ${error.message}`);
    }
};

// Hook para exportar a PDF
export const useExportarPDFSucursales = (datos, columnasConfig, opciones = {}) => {
    const exportar = async (nombrePersonalizado = 'reporte_sucursales') => {
        try {
            return await exportarReporteSucursalesPDF(
                datos,
                columnasConfig,
                nombrePersonalizado,
                opciones
            );
        } catch (error) {
            console.error('Error en useExportarPDFSucursales:', error);
            throw error;
        }
    };

    return exportar;
};

export default { exportarReporteSucursalesPDF, useExportarPDFSucursales };
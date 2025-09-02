import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { databaseService } from '../../services/database';

// Configuración de estilos para PDF (mantener igual)
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

// Función para obtener datos de la empresa (reutilizable)
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

// Función para agregar cabecera de empresa
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

// Función para formatear la fecha en español
const formatearFechaEspanol = () => {
    const fecha = new Date();
    const opciones = {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    };

    return `Del ${fecha.toLocaleDateString('es-ES', opciones)}`;
};

// Función para detectar el tipo de columna basado en el ID
const detectarTipoColumna = (id) => {
    const columnasFecha = ['fecha_inicio', 'fecha_fin'];

    if (columnasFecha.includes(id)) {
        return 'fecha';
    } else {
        return 'texto';
    }
};

// Función para formatear valores según su tipo
const formatearValorPDF = (valor, tipo) => {
    if (valor === null || valor === undefined || valor === '') {
        return '';
    }

    switch (tipo) {
        case 'fecha':
            try {
                const fecha = valor instanceof Date ? valor : new Date(valor);
                return isNaN(fecha.getTime()) ? String(valor) : fecha.toLocaleDateString('es-ES');
            } catch {
                return String(valor);
            }
        default:
            const texto = String(valor);
            return texto.length > 30 ? texto.substring(0, 27) + '...' : texto;
    }
};

// Función para dividir columnas en grupos
const dividirColumnasEnGrupos = (columnasConfig, maxPorPagina = 10) => {
    const grupos = [];
    for (let i = 0; i < columnasConfig.length; i += maxPorPagina) {
        grupos.push(columnasConfig.slice(i, i + maxPorPagina));
    }
    return grupos;
};

// Función para agregar firmas (solo en la última página)
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
    doc.text('Firma Responsable 1',
        margin.left + 30,
        pageHeight - 30
    );

    // Firma 2 (Derecha)
    doc.text('_________________________',
        pageWidth - margin.right - 80,
        pageHeight - 35
    );
    doc.text('Firma Responsable 2',
        pageWidth - margin.right - 80,
        pageHeight - 30
    );
};

// Configuración de columnas para el reporte de alertas
export const COLUMNAS_ALERTAS = [
    { id: 'oficina', nombre: 'Oficina' },
    { id: 'nombres_propietario', nombre: 'Nombres' },
    { id: 'apellidos_propietario', nombre: 'Apellidos' },
    { id: 'nro_documento_propietario', nombre: 'Documento' },
    { id: 'razon_social', nombre: 'Razón Social' },
    { id: 'nit', nombre: 'NIT' },
    { id: 'compania', nombre: 'Compañía' },
    { id: 'ramo_seguro', nombre: 'Ramo Seguro' },
    { id: 'tipo_documento', nombre: 'Tipo Documento' },
    { id: 'fecha_inicio', nombre: 'Fecha Inicial' },
    { id: 'fecha_fin', nombre: 'Fecha Final' },
    { id: 'alertas_vinculacion', nombre: 'Alertas Vinculación' },
    { id: 'alertas_emision_renovacion', nombre: 'Alertas Emisión/Renovación' },
    { id: 'alertas_rescision', nombre: 'Alertas Rescisión' },
    { id: 'alertas_activos_virtuales', nombre: 'Alertas Activos Virtuales' }
];

// Función principal de exportación a PDF para alertas
export const exportarReporteAlertasPDF = async (
    datos,
    columnasConfig = COLUMNAS_ALERTAS,
    nombreArchivo = 'reporte_alertas',
    opciones = {}
) => {
    if (!datos || datos.length === 0) {
        throw new Error('No hay datos para exportar');
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

        // Añadir tipos a las columnas basado en sus IDs
        const columnasConTipos = columnasConfig.map(col => ({
            ...col,
            tipo: detectarTipoColumna(col.id)
        }));

        // Dividir columnas en grupos de máximo 10
        const gruposColumnas = dividirColumnasEnGrupos(columnasConTipos, 10);

        // Configurar metadatos del documento
        doc.setProperties({
            title: `Reporte de Alertas - ${new Date().toLocaleDateString()}`,
            subject: 'Reporte de clientes con alertas activas',
            author: opciones.creador || 'Sistema de Reportes',
            keywords: 'alertas, clientes, reporte',
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
            doc.text('Reporte de Alertas',
                doc.internal.pageSize.width / 2,
                startYAfterHeader + 5,
                { align: 'center' }
            );

            // Subtítulo
            doc.setFontSize(12);
            doc.setFont('helvetica', 'normal');
            doc.text('Clientes con alertas activas en el sistema',
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
                    if (col.tipo === 'fecha') {
                        styles[index] = { halign: 'center', cellWidth: columnWidth };
                    } else {
                        styles[index] = { halign: 'left', cellWidth: columnWidth };
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
        const totalClientes = datos.length;
        const alertasPorTipo = {
            vinculacion: datos.filter(item => item.alertas_vinculacion && item.alertas_vinculacion !== 'N/A').length,
            emision_renovacion: datos.filter(item => item.alertas_emision_renovacion && item.alertas_emision_renovacion !== 'N/A').length,
            rescision: datos.filter(item => item.alertas_rescision && item.alertas_rescision !== 'N/A').length,
            activos_virtuales: datos.filter(item => item.alertas_activos_virtuales && item.alertas_activos_virtuales !== 'N/A').length
        };

        let statsY = 70;

        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');

        doc.text(`Total de clientes con alertas: ${totalClientes}`, PDF_STYLES.page.margins.left + 20, statsY);
        statsY += 8;
        doc.text(`Clientes con alertas de vinculación: ${alertasPorTipo.vinculacion}`, PDF_STYLES.page.margins.left + 20, statsY);
        statsY += 8;
        doc.text(`Clientes con alertas de emisión/renovación: ${alertasPorTipo.emision_renovacion}`, PDF_STYLES.page.margins.left + 20, statsY);
        statsY += 8;
        doc.text(`Clientes con alertas de rescisión: ${alertasPorTipo.rescision}`, PDF_STYLES.page.margins.left + 20, statsY);
        statsY += 8;
        doc.text(`Clientes con alertas de activos virtuales: ${alertasPorTipo.activos_virtuales}`, PDF_STYLES.page.margins.left + 20, statsY);

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

// Hook para exportar a PDF
export const useExportarPDFAlertas = (datos, columnasConfig = COLUMNAS_ALERTAS, opciones = {}) => {
    const exportar = async (nombrePersonalizado = 'reporte_alertas') => {
        try {
            return await exportarReporteAlertasPDF(
                datos,
                columnasConfig,
                nombrePersonalizado,
                opciones
            );
        } catch (error) {
            console.error('Error en useExportarPDFAlertas:', error);
            throw error;
        }
    };

    return exportar;
};

export default { exportarReporteAlertasPDF, useExportarPDFAlertas, COLUMNAS_ALERTAS };
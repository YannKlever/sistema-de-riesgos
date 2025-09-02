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

// Función para obtener datos de la empresa
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
        nombreEmpresa: 'EMPRENA SEGUROS S.A.',
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
    // Columnas que definitivamente son numéricas
    const columnasNumericas = [
        'nacionalidad_numerico',
        'riesgo_profesion_actividad_numerico',
        'riesgo_zona_numerico',
        'ingresos_mensuales_numerico',
        'volumen_actividad_numerico',
        'frecuencia_actividad_numerico',
        'categoria_pep_numerico',
        'promedio_riesgo_producto_servicio',
        'riesgo_zona_uso_seguro_numerico',
        'promedio_riesgo_canal_distribucion',
        'integridad_documental_numerico',
        'exactitud_documental_numerico',
        'vigencia_documental_numerico',
        'relevancia_informacion_numerico',
        'consistencia_informacion_numerico',
        'comportamiento_cliente_numerico',
        'probabilidad',
        'impacto',
        'riesgo_inherente',
        'mitigacion_numerico',
        'riesgo_residual'
    ];

    // Columnas que son porcentajes
    const columnasPorcentaje = [
        'mitigacion_numerico'
    ];

    // Columnas que son fechas
    const columnasFecha = [
        'fecha_inicio',
        'fecha_fin'
    ];

    if (columnasFecha.includes(id)) {
        return 'fecha';
    } else if (columnasPorcentaje.includes(id)) {
        return 'porcentaje';
    } else if (columnasNumericas.includes(id)) {
        return 'numero';
    } else if (id.includes('fecha')) {
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
        case 'numero':
            // Si ya es número, úsalo directamente
            if (typeof valor === 'number') {
                return valor.toFixed(2);
            }
            // Si es string, intenta convertirlo
            const num = Number(valor);
            return isNaN(num) ? String(valor) : num.toFixed(2);

        case 'porcentaje':
            if (typeof valor === 'number') {
                return `${valor.toFixed(0)}%`;
            }
            const porcentaje = Number(valor);
            return isNaN(porcentaje) ? String(valor) : `${porcentaje.toFixed(0)}%`;

        case 'fecha':
            try {
                // Si ya es Date object
                if (valor instanceof Date) {
                    return valor.toLocaleDateString('es-ES');
                }
                // Si es string de fecha
                const fecha = new Date(valor);
                return isNaN(fecha.getTime()) ? String(valor) : fecha.toLocaleDateString('es-ES');
            } catch {
                return String(valor);
            }

        case 'boolean':
            return valor ? 'Sí' : 'No';

        default:
            // Para texto, limitar longitud pero mantener contenido completo
            const texto = String(valor);
            return texto.length > 30 ? texto.substring(0, 27) + '...' : texto;
    }
};

// Dividir columnas en grupos de máximo 10
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

// Función principal de exportación a PDF para clientes externos
export const exportarReporteClientesExternosPDF = async (
    datos,
    columnasConfig,
    nombreArchivo = 'reporte_clientes_externos',
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

        // Añadir tipos a las columnas basado en sus IDs
        const columnasConTipos = columnasConfig.map(col => ({
            ...col,
            tipo: detectarTipoColumna(col.id)
        }));

        // Dividir columnas en grupos de máximo 10
        const gruposColumnas = dividirColumnasEnGrupos(columnasConTipos, 10);

        // Configurar metadatos del documento
        doc.setProperties({
            title: `Reporte de Clientes Externos - ${new Date().toLocaleDateString()}`,
            subject: 'Reporte de gestión de riesgos de clientes externos',
            author: opciones.creador || 'Sistema de Reportes',
            keywords: 'riesgo, clientes externos, reporte',
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
            doc.text('Reporte de Clientes Externos',
                doc.internal.pageSize.width / 2,
                startYAfterHeader + 5,
                { align: 'center' }
            );

            // Subtítulo
            doc.setFontSize(12);
            doc.setFont('helvetica', 'normal');
            doc.text('Información formal de evaluación de riesgos',
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
                    } else if (col.tipo === 'fecha') {
                        styles[index] = { halign: 'center', cellWidth: columnWidth };
                    } else {
                        // Para texto, alinear a la izquierda
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

        // Calcular promedios
        const calcularPromedio = (campo) => {
            const total = datos.reduce((sum, item) => sum + (Number(item[campo]) || 0), 0);
            return (total / datos.length).toFixed(2);
        };

        const estadisticas = [
            `Total de clientes externos: ${datos.length}`,
            `Promedio de probabilidad: ${calcularPromedio('probabilidad')}`,
            `Promedio de impacto: ${calcularPromedio('impacto')}`,
            `Promedio de riesgo inherente: ${calcularPromedio('riesgo_inherente')}`,
            `Promedio de riesgo producto/servicio: ${calcularPromedio('promedio_riesgo_producto_servicio')}`,
            `Promedio de mitigación: ${calcularPromedio('mitigacion_numerico')}%`,
            `Promedio de riesgo residual: ${calcularPromedio('riesgo_residual')}`
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

// Hook para exportar a PDF
export const useExportarPDFClientesExternos = (datos, columnasConfig, opciones = {}) => {
    const exportar = async (nombrePersonalizado = 'reporte_clientes_externos') => {
        try {
            return await exportarReporteClientesExternosPDF(
                datos,
                columnasConfig,
                nombrePersonalizado,
                opciones
            );
        } catch (error) {
            console.error('Error en useExportarPDFClientesExternos:', error);
            throw error;
        }
    };

    return exportar;
};

export default { exportarReporteClientesExternosPDF, useExportarPDFClientesExternos };
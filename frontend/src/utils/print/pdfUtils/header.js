import { databaseService } from '../../../services/database';

export const addHeader = async (doc, pageWidth, margin) => {
    try {
        // Obtener datos de la empresa desde la base de datos
        const empresaResult = await databaseService.obtenerEmpresa();

        let nombreEmpresa = 'EMPRESA SEGUROS S.A.';
        let nit = 'NIT: 1234567890123';
        let direccion = 'Av. Principal 123, La Paz';
        let telefono = 'Teléfono: (123) 456-7890';

        // Si se obtuvieron datos de la empresa, usarlos
        if (empresaResult.success && empresaResult.data) {
            const empresa = empresaResult.data;
            nombreEmpresa = empresa.nombre || nombreEmpresa;
            nit = empresa.nit ? `NIT: ${empresa.nit}` : nit;
            direccion = empresa.direccion || direccion;
            telefono = empresa.telefono ? `Teléfono: ${empresa.telefono}` : telefono;
        }

        // Datos de la empresa
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.setTextColor(30, 30, 30);

        // Nombre empresa
        doc.text(nombreEmpresa, pageWidth - margin, 15, { align: 'right' });

        // Información adicional
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.text(nit, pageWidth - margin, 20, { align: 'right' });
        doc.text(direccion, pageWidth - margin, 25, { align: 'right' });
        doc.text(telefono, pageWidth - margin, 30, { align: 'right' });

        // Línea divisoria
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.3);
        doc.line(margin, 35, pageWidth - margin, 35);

    } catch (error) {
        console.error('Error al obtener datos de la empresa para el encabezado:', error);

        // Fallback a datos por defecto en caso de error
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.setTextColor(30, 30, 30);
        doc.text('EMPRESA SEGUROS S.A.', pageWidth - margin, 15, { align: 'right' });

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.text('NIT: 1234567890123', pageWidth - margin, 20, { align: 'right' });
        doc.text('Av. Principal 123, La Paz', pageWidth - margin, 25, { align: 'right' });
        doc.text('Teléfono: (123) 456-7890', pageWidth - margin, 30, { align: 'right' });

        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.3);
        doc.line(margin, 35, pageWidth - margin, 35);
    }
};
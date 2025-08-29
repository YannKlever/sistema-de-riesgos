import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { addHeader } from './header';
import { addTitle } from './title';
import { addSignatureSection } from './signatures';
import { processSections } from './sections';

export const generateFormPDF = async (formData, formTitle, sections) => {
    try {
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm'
        });

        const margin = 15;
        const pageWidth = doc.internal.pageSize.width;
        const pageHeight = doc.internal.pageSize.height;

        // Encabezado
        await addHeader(doc, pageWidth, margin);

        // Título del formulario
        addTitle(doc, pageWidth, margin, formTitle);

        // Procesar secciones
        let finalY = processSections(doc, formData, sections, margin);

        // Verificar espacio para firmas y añadir sección
        finalY = addSignatureSection(doc, finalY + 10);

        return doc;
    } catch (error) {
        console.error('Error en generateFormPDF:', error);
        throw error;
    }
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
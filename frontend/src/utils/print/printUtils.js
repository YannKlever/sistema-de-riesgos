import React from 'react';
import ReactDOM from 'react-dom';
import { useReactToPrint } from 'react-to-print';

/**
 * Componente para imprimir formularios
 * @param {Object} props - Propiedades del componente
 * @param {React.Ref} props.printRef - Referencia al componente a imprimir
 * @param {string} props.documentTitle - Título del documento
 * @param {Object} props.pageStyle - Estilos CSS para la página
 * @param {function} props.onBeforePrint - Callback antes de imprimir
 * @param {function} props.onAfterPrint - Callback después de imprimir
 * @param {React.ReactNode} props.trigger - Elemento que activa la impresión
 */
export const PrintForm = ({
  printRef,
  documentTitle = 'Documento',
  pageStyle = {},
  onBeforePrint = () => {},
  onAfterPrint = () => {},
  trigger = <button className="btn btn-primary">Imprimir</button>
}) => {
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle,
    onBeforePrint,
    onAfterPrint,
    pageStyle: {
      '@page': { size: 'A4', margin: '1cm' },
      '@media print': {
        body: { padding: '20px', fontSize: '12pt' },
        '.no-print': { display: 'none' },
        ...pageStyle
      }
    },
    removeAfterPrint: true
  });

  return React.cloneElement(trigger, { onClick: handlePrint });
};

/**
 * Hook para manejar la impresión de formularios
 * @returns {Object} - Referencia y función de impresión
 */
export const usePrintForm = () => {
  const printRef = React.useRef(null);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: 'Formulario',
    pageStyle: `
      @page { size: A4; margin: 1cm; }
      @media print {
        body { padding: 20px; font-size: 12pt; }
        .no-print { display: none; }
      }
    `
  });

  return { printRef, handlePrint };
};

/**
 * Componente de plantilla para formularios imprimibles
 * @param {Object} props - Propiedades del componente
 */
export const PrintableFormTemplate = ({ title, children, header, footer }) => {
  return (
    <div className="printable-form">
      <div className="printable-header">
        {header || (
          <>
            <h1>{title}</h1>
            <div className="print-meta">
              <span>Impreso el: {new Date().toLocaleDateString()}</span>
            </div>
          </>
        )}
      </div>
      
      <div className="printable-content">
        {children}
      </div>
      
      <div className="printable-footer">
        {footer || (
          <div className="signature-section">
            <div className="signature-line"></div>
            <p>Firma y sello</p>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Estilos CSS para formularios imprimibles
 */
export const PRINT_STYLES = {
  BASIC: `
    .printable-form {
      font-family: Arial, sans-serif;
      max-width: 800px;
      margin: 0 auto;
    }
    .printable-header {
      text-align: center;
      margin-bottom: 20px;
      border-bottom: 2px solid #333;
      padding-bottom: 10px;
    }
    .printable-footer {
      margin-top: 30px;
      border-top: 2px solid #333;
      padding-top: 10px;
    }
    .form-section {
      margin-bottom: 20px;
      page-break-inside: avoid;
    }
    .form-row {
      display: flex;
      flex-wrap: wrap;
      margin-bottom: 10px;
    }
    .form-field {
      margin-bottom: 8px;
      page-break-inside: avoid;
    }
    .field-label {
      font-weight: bold;
      margin-bottom: 4px;
    }
    .field-value {
      padding: 5px;
      border-bottom: 1px solid #ddd;
    }
    @media print {
      .no-print { display: none; }
      body { padding: 20px !important; }
    }
  `,
  COMPACT: `
    .printable-form { font-size: 10pt; }
    .form-section { margin-bottom: 10px; }
    .form-row { margin-bottom: 5px; }
    .field-label { font-size: 9pt; }
    .field-value { padding: 2px; }
  `
};
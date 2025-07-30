import React, { useState } from 'react';
import { parseExcelFile, validateImportData } from '../excelImporter';
import styles from './styles.module.css';

const ImportModal = ({ 
  onClose, 
  databaseService, 
  schema, 
  title = 'Importar Datos',
  importFunctionName,
  successMessage = 'Importación completada',
  allowedFileTypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
    'text/csv'
  ]
}) => {
  const [step, setStep] = useState(1);
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  const [validation, setValidation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [detailedErrors, setDetailedErrors] = useState(null);

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setLoading(true);
    setError(null);
    setDetailedErrors(null);

    try {
      if (!allowedFileTypes.includes(selectedFile.type)) {
        throw new Error('Tipo de archivo no soportado');
      }

      const parsedData = await parseExcelFile(selectedFile);
      const validationResult = validateImportData(parsedData, schema);
      
      setValidation(validationResult);
      if (validationResult.invalidCount > 0) {
        setDetailedErrors(validationResult.invalid);
      }

      setFile(selectedFile);
      setData(parsedData);
      setStep(2); // PREVIEW
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderErrorDetails = () => {
    if (!detailedErrors || detailedErrors.length === 0) return null;

    return (
      <div className={styles.errorDetails}>
        <h4>Detalle de errores (primeras 10 filas):</h4>
        <div className={styles.errorScrollContainer}>
          {detailedErrors.slice(0, 10).map((err, idx) => (
            <div key={idx} className={styles.errorItem}>
              <strong>Fila {err.row}:</strong>
              <ul>
                {err.errors.map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
              <div className={styles.errorDataPreview}>
                <pre>{JSON.stringify(err.originalData, null, 2)}</pre>
              </div>
            </div>
          ))}
        </div>
        {detailedErrors.length > 10 && (
          <p>+ {detailedErrors.length - 10} errores adicionales...</p>
        )}
      </div>
    );
  };

  const handleImport = async () => {
    setLoading(true);
    setError(null);

    try {
      if (!databaseService || !importFunctionName) {
        throw new Error('Servicio de importación no configurado correctamente');
      }

      const importFunction = databaseService[importFunctionName];
      if (typeof importFunction !== 'function') {
        throw new Error(`Función de importación '${importFunctionName}' no disponible`);
      }

      if (!window.confirm(
        `¿Está seguro que desea importar estos datos?\n\n` +
        `Total registros: ${validation.total}\n` +
        `Válidos: ${validation.validCount}\n` +
        `Inválidos: ${validation.invalidCount}\n\n` +
        `Esto borrará todos los registros existentes.`
      )) {
        setLoading(false);
        return;
      }

      const result = await importFunction(validation.valid);

      if (result.success) {
        onClose({
          success: true,
          importedCount: result.count,
          message: `${successMessage}: ${result.count} de ${validation.total} registros importados`,
          errors: result.errors
        });
      } else {
        throw new Error(result.error || 'Error desconocido al importar');
      }
    } catch (err) {
      console.error('Error en importación:', err);
      setError('Error al importar: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1: // SELECT_FILE
        return (
          <div className={styles.step}>
            <h3>Seleccionar archivo Excel/CSV</h3>
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileChange}
              disabled={loading}
            />
            {loading && <p>Cargando archivo...</p>}
          </div>
        );

      case 2: // PREVIEW
        return (
          <div className={styles.step}>
            <h3>Vista previa ({validation.validCount}/{validation.total} válidos)</h3>
            {validation.invalidCount > 0 && (
              <div className={styles.warning}>
                <strong>Advertencia:</strong> {validation.invalidCount} registros tienen problemas
              </div>
            )}

            {renderErrorDetails()}
            <div className={styles.previewContainer}>
              <table>
                <thead>
                  <tr>
                    {Object.keys(data[0] || {}).map(key => (
                      <th key={key}>{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.slice(0, 5).map((row, i) => (
                    <tr key={i}>
                      {Object.values(row).map((val, j) => (
                        <td key={j}>{val !== null ? String(val) : 'NULL'}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className={styles.actions}>
              <button onClick={() => setStep(1)}>
                Volver
              </button>
              <button
                onClick={handleImport}
                disabled={validation.validCount === 0 || loading}
              >
                {loading ? 'Importando...' : 'Confirmar Importación'}
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>{title}</h2>
        {error && <div className={styles.error}>{error}</div>}
        {renderStep()}
        <button className={styles.closeButton} onClick={() => onClose({ success: false })}>
          ×
        </button>
      </div>
    </div>
  );
};

export default ImportModal;
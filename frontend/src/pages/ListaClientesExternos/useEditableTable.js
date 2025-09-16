import { useCallback, useState } from 'react';
import { databaseService } from '../../services/database';

export const useEditableTable = (initialData = []) => {
    const [data, setData] = useState(initialData);
    const [editingRow, setEditingRow] = useState(null);
    const [tempData, setTempData] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const startEditing = useCallback((rowId, rowData) => {
        setEditingRow(rowId);
        setTempData({ ...rowData });
        setError('');
    }, []);

    const cancelEditing = useCallback(() => {
        setEditingRow(null);
        setTempData({});
        setError('');
    }, []);

    const updateTempField = useCallback((field, value) => {
        setTempData(prev => ({ 
            ...prev, 
            [field]: value 
        }));
    }, []);

    const saveEditing = useCallback(async () => {
        if (!editingRow) return;

        setLoading(true);
        setError('');

        try {
            const originalData = data.find(item => item.id === editingRow);
            const cambios = {};
            
            // Solo enviar campos que realmente cambiaron
            Object.keys(tempData).forEach(key => {
                if (tempData[key] !== originalData?.[key]) {
                    cambios[key] = tempData[key];
                }
            });

            if (Object.keys(cambios).length === 0) {
                cancelEditing();
                return true;
            }

            const resultado = await databaseService.actualizarClienteExterno(editingRow, cambios);

            if (resultado.success) {
                setData(prevData =>
                    prevData.map(item =>
                        item.id === editingRow
                            ? { ...item, ...cambios }
                            : item
                    )
                );
                cancelEditing();
                return true;
            } else {
                throw new Error(resultado.error || 'Error al actualizar');
            }
        } catch (err) {
            setError(`Error al actualizar: ${err.message}`);
            console.error('Error saving edits:', err);
            return false;
        } finally {
            setLoading(false);
        }
    }, [editingRow, tempData, data, cancelEditing]);

    const clearError = useCallback(() => {
        setError('');
    }, []);

    return {
        data,
        setData,
        editingRow,
        tempData,
        loading,
        error,
        startEditing,
        cancelEditing,
        updateTempField,
        saveEditing,
        clearError,
        isEditing: useCallback((rowId) => editingRow === rowId, [editingRow])
    };
};
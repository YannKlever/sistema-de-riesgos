import { useState, useEffect } from 'react';
import styles from './styles.module.css';
import { databaseService } from '../../../services/database';
import InFechaActual from '../InFechaActual/InFechaActual';
import InLabel from '../InLabel/InLabel';
import InSelect from '../InSelect/InSelect';

const HeaderInfoRegistro = ({
    titulo = "Formulario",
    oficinaDefault = "",
    ejecutivoDefault = "",
    onDatosChange = () => {} // Nueva prop para enviar todos los datos
}) => {
    const [oficina, setOficina] = useState(oficinaDefault);
    const [ejecutivo, setEjecutivo] = useState(ejecutivoDefault);
    const [sucursales, setSucursales] = useState([]);
    const [clientesInternos, setClientesInternos] = useState([]);
    const [loading, setLoading] = useState({ 
        sucursales: true, 
        clientesInternos: true 
    });
    const [error, setError] = useState({ 
        sucursales: null, 
        clientesInternos: null 
    });

    // Cargar sucursales (oficinas)
    useEffect(() => {
        const cargarSucursales = async () => {
            try {
                const resultado = await databaseService.listarSucursales();
                if (resultado.success) {
                    let oficinasUnicas = [...new Set(
                        resultado.data.map(s => s.oficina)
                    )].filter(Boolean).map(oficina => ({
                        value: oficina,
                        label: oficina
                    }));
                    
                    // Si no hay oficinas, agregar valor por defecto
                    if (oficinasUnicas.length === 0) {
                        oficinasUnicas = [{ value: 'centro', label: 'centro' }];
                    }
                    
                    setSucursales(oficinasUnicas);
                    
                    // Si no hay oficina seleccionada y hay opciones, seleccionar la primera
                    if (!oficinaDefault && oficinasUnicas.length > 0) {
                        setOficina(oficinasUnicas[0].value);
                        enviarDatos({ oficina: oficinasUnicas[0].value });
                    }
                } else {
                    setError(prev => ({ ...prev, sucursales: resultado.error || 'Error al cargar sucursales' }));
                    // En caso de error, establecer valor por defecto
                    setSucursales([{ value: 'centro', label: 'centro' }]);
                    setOficina('centro');
                    enviarDatos({ oficina: 'centro' });
                }
            } catch (err) {
                setError(prev => ({ ...prev, sucursales: err.message || 'Error al cargar sucursales' }));
                // En caso de error, establecer valor por defecto
                setSucursales([{ value: 'centro', label: 'centro' }]);
                setOficina('centro');
                enviarDatos({ oficina: 'centro' });
            } finally {
                setLoading(prev => ({ ...prev, sucursales: false }));
            }
        };

        cargarSucursales();
    }, []);

    // Cargar clientes internos (para seleccionar ejecutivo y obtener ID)
    useEffect(() => {
        const cargarClientesInternos = async () => {
            try {
                const resultado = await databaseService.listarClientesInternos();
                if (resultado.success) {
                    let clientesFormateados = resultado.data
                        .filter(cliente => cliente.ejecutivo) 
                        .map(cliente => ({
                            value: cliente.ejecutivo,
                            label: cliente.ejecutivo,                         
                            id: cliente.id,
                            datosCompletos: cliente
                        }));
                    
                    // Si no hay clientes internos, agregar valor por defecto
                    if (clientesFormateados.length === 0) {
                        clientesFormateados = [{ 
                            value: 'admin', 
                            label: 'admin',
                            id: 0,
                            datosCompletos: { ejecutivo: 'admin' }
                        }];
                    }
                    
                    setClientesInternos(clientesFormateados);
                    
                    // Si no hay ejecutivo seleccionado y hay opciones, seleccionar la primera
                    if (!ejecutivoDefault && clientesFormateados.length > 0) {
                        setEjecutivo(clientesFormateados[0].value);
                        enviarDatos({ 
                            ejecutivo: clientesFormateados[0].value,
                            cliente_interno_id: clientesFormateados[0].id,
                            datosClienteInterno: clientesFormateados[0].datosCompletos
                        });
                    }
                } else {
                    setError(prev => ({ ...prev, clientesInternos: resultado.error || 'Error al cargar clientes internos' }));
                    // En caso de error, establecer valor por defecto
                    const clienteDefault = { 
                        value: 'admin', 
                        label: 'admin',
                        id: 0,
                        datosCompletos: { ejecutivo: 'admin' }
                    };
                    setClientesInternos([clienteDefault]);
                    setEjecutivo('admin');
                    enviarDatos({ 
                        ejecutivo: 'admin',
                        cliente_interno_id: 0,
                        datosClienteInterno: { ejecutivo: 'admin' }
                    });
                }
            } catch (err) {
                setError(prev => ({ ...prev, clientesInternos: err.message || 'Error al cargar clientes internos' }));
                // En caso de error, establecer valor por defecto
                const clienteDefault = { 
                    value: 'admin', 
                    label: 'admin',
                    id: 0,
                    datosCompletos: { ejecutivo: 'admin' }
                };
                setClientesInternos([clienteDefault]);
                setEjecutivo('admin');
                enviarDatos({ 
                    ejecutivo: 'admin',
                    cliente_interno_id: 0,
                    datosClienteInterno: { ejecutivo: 'admin' }
                });
            } finally {
                setLoading(prev => ({ ...prev, clientesInternos: false }));
            }
        };

        cargarClientesInternos();
    }, []);

    const handleOficinaChange = (value) => {
        setOficina(value);
        enviarDatos({ oficina: value });
    };

    const handleEjecutivoChange = (value) => {
        setEjecutivo(value);
        
        // Buscar el cliente interno seleccionado para obtener todos sus datos
        const clienteSeleccionado = clientesInternos.find(cliente => cliente.value === value);
        
        if (clienteSeleccionado) {
            enviarDatos({ 
                ejecutivo: value,
                cliente_interno_id: clienteSeleccionado.id,
                datosClienteInterno: clienteSeleccionado.datosCompletos // Opcional: todos los datos
            });
        } else {
            enviarDatos({ ejecutivo: value });
        }
    };

    // Función para enviar todos los datos actualizados
    const enviarDatos = (nuevosDatos) => {
        const datosActuales = {
            oficina,
            ejecutivo,
            // otros datos que quieras incluir
            ...nuevosDatos
        };
        onDatosChange(datosActuales);
    };

    return (
        <div className={styles.headerContainer}>
            <h2 className={styles.formTitle}>{titulo}</h2>

            <div className={styles.fieldsContainer}>
                <div className={styles.headerField}>
                    <InFechaActual
                        name="fecha_registro"
                        label="Fecha:"
                    />
                </div>

                <div className={styles.headerField}>
                    {loading.sucursales ? (
                        <InLabel
                            name="oficina"
                            label="Oficina:"
                            value="Cargando..."
                        />
                    ) : error.sucursales ? (
                        <InLabel
                            name="oficina"
                            label="Oficina:"
                            value="Error al cargar"
                        />
                    ) : (
                        <InSelect
                            name="oficina"
                            label="Oficina:"
                            value={oficina}
                            onChange={handleOficinaChange}
                            options={sucursales}
                            required
                            placeholder="Seleccione una opción"
                        />
                    )}
                </div>

                <div className={styles.headerField}>
                    {loading.clientesInternos ? (
                        <InLabel
                            name="ejecutivo"
                            label="Ejecutivo:"
                            value="Cargando..."
                        />
                    ) : error.clientesInternos ? (
                        <InLabel
                            name="ejecutivo"
                            label="Ejecutivo:"
                            value="Error al cargar"
                        />
                    ) : (
                        <InSelect
                            name="ejecutivo"
                            label="Ejecutivo:"
                            value={ejecutivo}
                            onChange={handleEjecutivoChange}
                            options={clientesInternos}
                            required
                            placeholder="Seleccione un ejecutivo"
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default HeaderInfoRegistro;
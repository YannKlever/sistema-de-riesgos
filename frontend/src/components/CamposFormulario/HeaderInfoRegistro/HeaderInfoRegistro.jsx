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
    onDatosChange = () => {}
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
                    
                    if (oficinasUnicas.length === 0) {
                        oficinasUnicas = [{ value: 'centro', label: 'centro' }];
                    }
                    
                    setSucursales(oficinasUnicas);
                    
                    if (!oficinaDefault && oficinasUnicas.length > 0) {
                        setOficina(oficinasUnicas[0].value);
                        enviarDatos({ oficina: oficinasUnicas[0].value });
                    }
                } else {
                    setError(prev => ({ ...prev, sucursales: resultado.error || 'Error al cargar sucursales' }));
                    setSucursales([{ value: 'centro', label: 'centro' }]);
                    setOficina('centro');
                    enviarDatos({ oficina: 'centro' });
                }
            } catch (err) {
                setError(prev => ({ ...prev, sucursales: err.message || 'Error al cargar sucursales' }));
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
                        .filter(cliente => cliente.nombres_cliente_interno || cliente.apellidos_cliente_interno)
                        .map(cliente => {
                            const nombreCompleto = `${cliente.nombres_cliente_interno || ''} ${cliente.apellidos_cliente_interno || ''}`.trim();
                            return {
                                value: nombreCompleto,
                                label: nombreCompleto,
                                id: cliente.id,
                                datosCompletos: cliente
                            };
                        });
                    
                    if (clientesFormateados.length === 0) {
                        clientesFormateados = [{ 
                            value: 'admin', 
                            label: 'admin',
                            id: 0,
                            datosCompletos: { 
                                nombres_cliente_interno: 'admin',
                                apellidos_cliente_interno: '',
                                ejecutivo: 'admin'
                            }
                        }];
                    }
                    
                    setClientesInternos(clientesFormateados);
                    
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
                    const clienteDefault = { 
                        value: 'admin', 
                        label: 'admin',
                        id: 0,
                        datosCompletos: { 
                            nombres_cliente_interno: 'admin',
                            apellidos_cliente_interno: '',
                            ejecutivo: 'admin'
                        }
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
                const clienteDefault = { 
                    value: 'admin', 
                    label: 'admin',
                    id: 0,
                    datosCompletos: { 
                        nombres_cliente_interno: 'admin',
                        apellidos_cliente_interno: '',
                        ejecutivo: 'admin'
                    }
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
        
        const clienteSeleccionado = clientesInternos.find(cliente => cliente.value === value);
        
        if (clienteSeleccionado) {
            enviarDatos({ 
                ejecutivo: value,
                cliente_interno_id: clienteSeleccionado.id,
                datosClienteInterno: clienteSeleccionado.datosCompletos
            });
        } else {
            enviarDatos({ ejecutivo: value });
        }
    };

    const enviarDatos = (nuevosDatos) => {
        const datosActuales = {
            oficina,
            ejecutivo,
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
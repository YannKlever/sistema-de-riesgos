import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import styles from './seccionAlertas.module.css';

const SeccionAlertas = forwardRef((props, ref) => {
    const [selecciones, setSelecciones] = useState({
        clienteInterno: [],
        activosVirtuales: []
    });

    const [seccionesAbiertas, setSeccionesAbiertas] = useState({
        clienteInterno: false,
        activosVirtuales: false
    });

    useEffect(() => {
        const form = document.querySelector('form');
        if (!form) return;

        const handleReset = () => {
            setSelecciones({
                clienteInterno: [],
                activosVirtuales: []
            });
        };

        form.addEventListener('reset', handleReset);

        return () => {
            form.removeEventListener('reset', handleReset);
        };
    }, []);

    const opciones = {
        clienteInterno: [
            { id: 'c1', label: 'Omisión reiterada de Debida Diligencia' },
            { id: 'c2', label: 'Uso de dirección propia para documentación de clientes' },
            { id: 'c3', label: 'Estilo de vida no acorde a ingresos' },
            { id: 'c4', label: 'Renuencia no justificada a tomar vacaciones' },
            { id: 'c5', label: 'Permanencia frecuente fuera de horario sin justificación' },
            { id: 'c6', label: 'Ausencias frecuentes e injustificadas' },
            { id: 'c7', label: 'Cambio repentino favorable en estilo de vida' },
            { id: 'c8', label: 'Renuencia a cambios/promociones que impliquen cambio de funciones' },
            { id: 'c9', label: 'Evitación de controles internos' },
            { id: 'c10', label: 'Omisión de verificación de identidad' },
            { id: 'c11', label: 'Reuniones con clientes fuera de oficina sin justificación' },
            { id: 'c12', label: 'Ocultamiento de información sobre clientes' },
            { id: 'c13', label: 'Recepción constante de regalos de clientes' }
        ],
        activosVirtuales: [
            { id: 'a1', label: 'Operaciones declaradas como producto de AV' }
        ]
    };

    const toggleSeccion = (seccion) => {
        setSeccionesAbiertas(prev => ({
            ...prev,
            [seccion]: !prev[seccion]
        }));
    };

    const handleCheckboxChange = (seccion, id) => {
        setSelecciones(prev => {
            const nuevasSelecciones = [...prev[seccion]];
            const index = nuevasSelecciones.indexOf(id);

            if (index === -1) {
                if (id === 'ninguna') {
                    return { ...prev, [seccion]: ['ninguna'] };
                }
                const filtered = nuevasSelecciones.filter(item => item !== 'ninguna');
                return { ...prev, [seccion]: [...filtered, id] };
            } else {
                return { ...prev, [seccion]: nuevasSelecciones.filter(item => item !== id) };
            }
        });
    };

    useImperativeHandle(ref, () => ({
        getAlertasData: () => {
            const formatSelections = (arr) => {
                const filtered = arr.filter(x => x !== 'ninguna');
                return filtered.length > 0 ? filtered.join(', ') : '';
            };

            return {
                alertas_cliente_interno: formatSelections(selecciones.clienteInterno),
                alertas_activos_virtuales: formatSelections(selecciones.activosVirtuales)
            };
        },
        resetAlertas: () => {
            setSelecciones({
                clienteInterno: [],
                activosVirtuales: []
            });
        }
    }));

    const renderSubseccion = (titulo, seccion) => {
        return (
            <div className={styles.subseccion} key={seccion}>
                <div
                    className={styles.subseccionHeader}
                    onClick={() => toggleSeccion(seccion)}
                >
                    <h4 className={styles.subtitulo}>{titulo}</h4>
                    <span className={styles.arrowIcon}>
                        {seccionesAbiertas[seccion] ? '▼' : '►'}
                    </span>
                </div>

                {seccionesAbiertas[seccion] && (
                    <div className={styles.opcionesContainer}>
                        {opciones[seccion].map(opcion => (
                            <label key={opcion.id} className={styles.opcionLabel}>
                                <input
                                    type="checkbox"
                                    checked={selecciones[seccion].includes(opcion.id)}
                                    onChange={() => handleCheckboxChange(seccion, opcion.id)}
                                    className={styles.opcionCheckbox}
                                />
                                {opcion.label}
                            </label>
                        ))}
                        <label className={styles.opcionLabel}>
                            <input
                                type="checkbox"
                                checked={selecciones[seccion].includes('ninguna')}
                                onChange={() => handleCheckboxChange(seccion, 'ninguna')}
                                className={styles.opcionCheckbox}
                            />
                            Ninguna
                        </label>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className={styles.seccionPrincipal}>
            <h3 className={styles.tituloPrincipal}>Alertas de Riesgo</h3>
            {renderSubseccion('1. Cliente interno', 'clienteInterno')}
            {renderSubseccion('2. Activos virtuales', 'activosVirtuales')}

            {/* Campos ocultos para el formulario */}
            <input
                type="hidden"
                name="alertas_cliente_interno"
                value={selecciones.clienteInterno.filter(x => x !== 'ninguna').join('|') || ''}
                data-alerta
            />
            <input
                type="hidden"
                name="alertas_activos_virtuales"
                value={selecciones.activosVirtuales.filter(x => x !== 'ninguna').join('|') || ''}
                data-alerta
            />
        </div>
    );
});

export default SeccionAlertas;
import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import styles from './seccionAlertas.module.css';

const SeccionAlertas = forwardRef((props, ref) => {
    const [selecciones, setSelecciones] = useState({
        vinculacion: [],
        /*pagoPrima: [],*/
        emisionRenovacion: [],
        rescision: [],
        activosVirtuales: []
    });

    const [seccionesAbiertas, setSeccionesAbiertas] = useState({
        vinculacion: false,
        /*pagoPrima: false,*/
        emisionRenovacion: false,
        rescision: false,
        activosVirtuales: false
    });

    // Efecto para manejar el reset del formulario
    useEffect(() => {
        const form = document.querySelector('form');
        if (!form) return;

        const handleReset = () => {
            setSelecciones({
                vinculacion: [],
                /*pagoPrima: [],*/
                emisionRenovacion: [],
                rescision: [],
                activosVirtuales: []
            });
        };

        form.addEventListener('reset', handleReset);

        return () => {
            form.removeEventListener('reset', handleReset);
        };
    }, []);

    const opciones = {
        vinculacion: [
            { id: 'v1', label: 'Vinculación de clientes con socios/directores en común' },
            { id: 'v2', label: 'Clientes consecutivos con características similares que no se conocen' },
            { id: 'v3', label: 'Clientes consecutivos con mismo tipo/valor de bien asegurado' },
            { id: 'v4', label: 'Clientes con solvencia que no proporcionan información' },
            { id: 'v5', label: 'Clientes comparten dirección/teléfono sin relación aparente' },
            { id: 'v6', label: 'Clientes cambian datos frecuentemente sin justificación' },
            { id: 'v7', label: 'Formularios con información ilegible/falsa' },
            { id: 'v8', label: 'Clientes renuentes a identificación/documentación' },
            { id: 'v9', label: 'Vinculación en oficinas lejanas a domicilio/actividad' },
            { id: 'v10', label: 'Clientes sin antecedentes financieros esperados' },
            { id: 'v11', label: 'Clientes que exigen ser atendidos por persona específica' },
            { id: 'v12', label: 'Clientes no justifican origen de bienes asegurables' },
            { id: 'v13', label: 'Clientes piden exoneración por ser recomendados' },
            { id: 'v14', label: 'Monto bien asegurable no acorde con información socioeconómica' },
            { id: 'v15', label: 'Bienes asegurables no acordes con patrimonio/ingresos' },
            { id: 'v16', label: 'Actividad económica indefinida con bienes de alto valor' },
            { id: 'v17', label: 'Documentación no verificable o vencida con bienes de alto valor' },
            { id: 'v18', label: 'Bien asegurable sin relación con otros bienes del cliente' },
            { id: 'v19', label: 'PEP que evita documentación o no justifica fondos' },
            { id: 'v20', label: 'Seguros para mercancías que podrían ser drogas' },
            { id: 'v21', label: 'Vinculación muy rápida sin importar condiciones' },
            { id: 'v22', label: 'Bienes importados de alto valor sin documentación completa' },
            { id: 'v23', label: 'Clientes que no actúan en nombre propio' }
        ],
        /*pagoPrima: [
            { id: 'p1', label: 'Mismo pago por pólizas de distintos titulares' },
            { id: 'p2', label: 'Pago en efectivo en ciudad sin negocios del cliente' },
            { id: 'p3', label: 'Pago en efectivo de persona natural a jurídica sin relación' },
            { id: 'p4', label: 'Pagos frecuentes en efectivo por empresa que normalmente usa cheques' },
            { id: 'p5', label: 'Pago con cheques no acordes a actividad económica' },
            { id: 'p6', label: 'Pago con transferencias de cuentas de terceros sin justificación' }
        ],*/
        emisionRenovacion: [
            { id: 'e1', label: 'Múltiples pólizas similares con montos elevados' },
            { id: 'e2', label: 'Varias pólizas con beneficiarios similares sin relación aparente' },
            { id: 'e3', label: 'Cambio de beneficiarios sin justificación' },
            { id: 'e4', label: 'Adición de bienes asegurables con montos considerables' },
            { id: 'e5', label: 'Incremento exagerado de valor asegurado sin justificación' },
            { id: 'e6', label: 'Cambio de beneficiario durante vigencia sin justificación' },
            { id: 'e7', label: 'Participación de PEP sin justificación de origen de bienes' },
            { id: 'e8', label: 'Beneficiarios no familiares directos sin justificación' },
            { id: 'e9', label: 'Póliza a largo plazo pagada por anticipado con rápido préstamo' }
        ],
        rescision: [
            { id: 'r1', label: 'Rescisión con prima pagada en efectivo sin razón clara' },
            { id: 'r2', label: 'Rescisión para recibir cheque/transferencia sin otra razón' },
            { id: 'r3', label: 'Rescisión por persona diferente al cliente inicial' },
            { id: 'r4', label: 'Rescisión por empresa que alega cierre sin justificación' },
            { id: 'r5', label: 'Varias rescisiones con devolución cobrada por misma persona' },
            { id: 'r6', label: 'Rescisiones con cheques emitidos a misma persona' },
            { id: 'r7', label: 'Rescisión por posible suplantación de cliente/beneficiario' },
            { id: 'r8', label: 'Rescisión por inexistencia de actividad económica' },
            { id: 'r9', label: 'Rescisión por posible siniestro simulado' },
            { id: 'r10', label: 'Rescisión por posible sobre/infraseguro' },
            { id: 'r11', label: 'Rescisión con transferencias a sitios distantes sin justificación' },
            { id: 'r12', label: 'Rescisión con transferencia a cuentas de terceros' },
            { id: 'r13', label: 'Pagos en exceso para luego solicitar reembolso' }
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
                alertas_vinculacion: formatSelections(selecciones.vinculacion),
                /*alertas_pago_prima: formatSelections(selecciones.pagoPrima),*/
                alertas_emision_renovacion: formatSelections(selecciones.emisionRenovacion),
                alertas_rescision: formatSelections(selecciones.rescision),
                alertas_activos_virtuales: formatSelections(selecciones.activosVirtuales)
            };
        },
        resetAlertas: () => {
            setSelecciones({
                vinculacion: [],
                /*pagoPrima: [],*/
                emisionRenovacion: [],
                rescision: [],
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

            {renderSubseccion('1. Vinculación con el cliente', 'vinculacion')}
            {/*renderSubseccion('2. Pago de prima del seguro', 'pagoPrima')*/}
            {renderSubseccion('2. Emisión o renovación de pólizas', 'emisionRenovacion')}
            {renderSubseccion('3. Rescisión de póliza', 'rescision')}
            {renderSubseccion('4. Activos virtuales', 'activosVirtuales')}

            {/* Campos ocultos para el formulario */}
            <input
                type="hidden"
                name="alertas_vinculacion"
                value={selecciones.vinculacion.filter(x => x !== 'ninguna').join('|') || ''}
                data-alerta
            />
            {/*<input
                type="hidden"
                name="alertas_pago_prima"
                value={selecciones.pagoPrima.filter(x => x !== 'ninguna').join('|') || ''}
                data-alerta
            />*/}
            <input
                type="hidden"
                name="alertas_emision_renovacion"
                value={selecciones.emisionRenovacion.filter(x => x !== 'ninguna').join('|') || ''}
                data-alerta
            />
            <input
                type="hidden"
                name="alertas_rescision"
                value={selecciones.rescision.filter(x => x !== 'ninguna').join('|') || ''}
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
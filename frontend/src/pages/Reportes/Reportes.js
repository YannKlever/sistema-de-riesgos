import { useNavigate } from 'react-router-dom';
import { useState, useCallback } from 'react';
import styles from './styles.module.css';
import ModalOpciones from '../../components/BotonClientes/ModalOpciones/ModalOpciones';

const Reportes = () => {
    const navigate = useNavigate();
    const [showClientModal, setShowClientModal] = useState(false);

    const handleOpenClientModal = useCallback(() => {
        setShowClientModal(true);
    }, []);

    const handleCloseClientModal = useCallback(() => {
        setShowClientModal(false);
    }, []);

    const navigateToReport = useCallback((path) => {
        handleCloseClientModal();
        navigate(path);
    }, [navigate, handleCloseClientModal]);

    const clientOptions = [
        { text: "Clientes Externos", path: '/reportes/clientes-externos' },
        { text: "Clientes Internos", path: '/reportes/clientes-internos' },
        { text: "Accionistas y Socios", path: '/reportes/accionistasSocios' },
    ];

    const reportOptions = [
        {
            icon: '👥',
            title: 'Factor Cliente',
            description: 'Reportes relacionados con la evaluación de riesgo de clientes',
            action: handleOpenClientModal
        },
        {
            icon: '📦',
            title: 'Factor Productos/Servicios',
            description: 'Reportes de riesgo asociados a productos y servicios',
            path: '/reportes/productos-servicios'
        },
        {
            icon: '🌍',
            title: 'Factor Zona Geográfica',
            description: 'Reportes por ubicación geográfica y riesgo asociado',
            path: '/reportes/zona-geografica'
        },
        {
            icon: '🚚',
            title: 'Factor Canales de distribución',
            description: 'Reportes de riesgo por canales de distribución y venta',
            path: '/reportes/canales-distribucion'
        },
        // Nueva opción para Reportes LDFT
        {
            icon: '💰',
            title: 'Reporte LD/FT',
            description: 'Reportes de evaluación de riesgo de Lavado de Dinero y Financiamiento al Terrorismo',
            path: '/reportes/ld-ft'
        }
    ];

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <h2>Reportes de Gestión de Riesgos</h2>
                    <p>Seleccione el factor de riesgo para generar el reporte correspondiente</p>
                </div>

                <div className={styles.options}>
                    {reportOptions.map((option, index) => (
                        <div
                            key={index}
                            className={styles.optionCard}
                            onClick={option.path ? () => navigate(option.path) : option.action}
                        >
                            <div className={styles.optionIcon}>{option.icon}</div>
                            <h3>{option.title}</h3>
                            <p>{option.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            <ModalOpciones
                show={showClientModal}
                onHide={handleCloseClientModal}
                title="Seleccione tipo de cliente"
                buttons={clientOptions.map((option, index) => ({
                    ...option,
                    onClick: () => navigateToReport(option.path)
                }))}
            />
        </div>
    );
};

export default Reportes;
import { useNavigate } from 'react-router-dom';
import { useState, useCallback } from 'react';
import styles from './styles.module.css';
import ModalOpciones from '../../components/BotonClientes/ModalOpciones/ModalOpciones';

const Graficos = () => {
    const navigate = useNavigate();
    const [showChartModal, setShowChartModal] = useState(false);

    const handleOpenChartModal = useCallback(() => {
        setShowChartModal(true);
    }, []);

    const handleCloseChartModal = useCallback(() => {
        setShowChartModal(false);
    }, []);

    const navigateToChart = useCallback((path) => {
        handleCloseChartModal();
        navigate(path);
    }, [navigate, handleCloseChartModal]);

    const chartTypeOptions = [
        { text: "Gráficos de Clientes Externos", path: '/graficos/clientesExternos' },
        { text: "Gráficos de Clientes Internos", path: '/graficos/clientesInternos' },
        { text: "Gráficos de Accionistas o socios", path: '/graficos/accionistasSocios' },
        { text: "Gráficos de Clientes", path: '/graficos/circulares' },
    ];

    const chartOptions = [
        {
            icon: '📊',
            title: 'Riesgo del Factor Clientes',
            description: 'Visualización de riesgos asociados a diferentes tipos de clientes',
            action: handleOpenChartModal
        },
        {
            icon: '📈',
            title: 'Riesgo del Factor Producto',
            description: 'Visualización de riesgos asociados a los productos',
            path: '/graficos/producto-servicio'
        },
        {
            icon: '🧩',
            title: 'Riesgo del Factor Zona Geográfica',
            description: 'Visualización de riesgos asociados a la ubicación geográfica',
            path: '/graficos/zona-geografica'
        },
        {
            icon: '🔄',
            title: 'Riesgo del Factor Canales de distribución',
            description: 'Visualización de riesgos asociados a los medios de distribución de productos o servicios',
            path: '/graficos/canales-distribucion'
        },
        {
            icon: '⚠️',
            title: 'Riesgo LDFT',
            description: 'Visualización de riesgos asociados a Lavado de Dinero y Financiamiento al Terrorismo',
            path: '/graficos/riesgo-ldft'
        }
    ];

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <h2>Visualización de Datos de Riesgo</h2>
                    <p>Seleccione el tipo de gráfico para visualizar los datos de gestión de riesgos</p>
                </div>

                <div className={styles.options}>
                    {chartOptions.map((option, index) => (
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
                show={showChartModal}
                onHide={handleCloseChartModal}
                title="Seleccione tipo de gráfico"
                buttons={chartTypeOptions.map((option, index) => ({
                    ...option,
                    onClick: () => navigateToChart(option.path)
                }))}
            />
        </div>
    );
};

export default Graficos;
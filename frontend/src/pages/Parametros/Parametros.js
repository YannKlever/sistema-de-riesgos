import { useNavigate } from 'react-router-dom';
import styles from './styles.module.css';

const Parametros = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <h2>Parámetros de Gestión de Riesgos</h2>
                    <p>Seleccione el tipo de parámetro que desea configurar</p>
                </div>

                <div className={styles.options}>
                    <div
                        className={styles.optionCard}
                        onClick={() => navigate('/parametros/clientes-internos')}
                    >
                        <div className={styles.optionIcon}>👨‍💼</div>
                        <h3>Registrar Clientes Internos</h3>
                        <p>Configuración de parámetros para clientes internos de la organización</p>
                    </div>
                    <div
                        className={styles.optionCard}
                        onClick={() => navigate('/parametros/accionistas-directorio')}
                    >
                        <div className={styles.optionIcon}>👥</div>
                        <h3>Registrar Accionistas/Directorio</h3>
                        <p>Parámetros de gestión para accionistas y miembros del directorio</p>
                    </div>
                    <div
                        className={styles.optionCard}
                        onClick={() => navigate('/parametros/formulario-ld-ft')}
                    >
                        <div className={styles.optionIcon}>📋</div>
                        <h3>Registrar el Formulario LD-FT</h3>
                        <p>Evaluación de riesgo de Lavado de Dinero y Financiamiento al Terrorismo</p>
                    </div>

                    <div
                        className={styles.optionCard}
                        onClick={() => navigate('/parametros/lista-producto-servicio')}
                    >
                        <div className={styles.optionIcon}>📝</div>
                        <h3>Lista de Productos/Servicios</h3>
                        <p>Administración de productos y servicios con evaluación de riesgo</p>
                    </div>

                    <div
                        className={styles.optionCard}
                        onClick={() => navigate('/parametros/lista-sucursales')}
                    >
                        <div className={styles.optionIcon}>🏢</div>
                        <h3>Lista de Sucursales</h3>
                        <p>Gestión de sucursales y sus parámetros de riesgo</p>
                    </div>


                    <div
                        className={styles.optionCard}
                        onClick={() => navigate('/parametros/clientes-externos')}
                    >
                        <div className={styles.optionIcon}>👥</div>
                        <h3>Lista de Clientes Externos</h3>
                        <p>Gestión de clientes externos y sus parámetros de riesgo</p>
                    </div>
                    <div
                        className={styles.optionCard}
                        onClick={() => navigate('/parametros/lista-clientes-internos')}
                    >
                        <div className={styles.optionIcon}>👨‍💼👩‍💼</div>
                        <h3>Lista de Clientes Internos</h3>
                        <p>Gestión de clientes internos con sus respectivos logos e información</p>
                    </div>
                    <div
                        className={styles.optionCard}
                        onClick={() => navigate('/parametros/lista-accionistas-socios')}
                    >
                        <div className={styles.optionIcon}>🤝</div>
                        <h3>Lista de Accionistas y Socios</h3>
                        <p>Visualiza y gestiona la lista de accionistas y socios.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Parametros;
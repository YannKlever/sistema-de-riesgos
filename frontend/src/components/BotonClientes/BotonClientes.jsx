import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './styles.module.css';
import ModalOpciones from './ModalOpciones/ModalOpciones';

const BotonClientes = () => {
    const [currentModal, setCurrentModal] = useState(null);
    const [modalHistory, setModalHistory] = useState([]);
    const navigate = useNavigate();

    const handleOpenModal = (modalType) => {
        setModalHistory([...modalHistory, currentModal]);
        setCurrentModal(modalType);
    };

    const handleBack = () => {
        if (modalHistory.length > 0) {
            const previousModal = modalHistory[modalHistory.length - 1];
            setCurrentModal(previousModal);
            setModalHistory(modalHistory.slice(0, -1));
        } else {
            setCurrentModal(null);
        }
    };

    const handleClose = () => {
        setCurrentModal(null);
        setModalHistory([]);
    };

    const navigateToForm = (path) => {
        handleClose();
        navigate(path);
    };

    return (
        <div className={styles.pageContainer}>
            <div className={styles.contentWrapper}>
                <header className={styles.header}>
                    <h1 className={styles.title}>Registro de Cliente Externo</h1>
                    <p className={styles.subtitle}>
                        Seleccione el tipo de cliente para iniciar la evaluación
                    </p>
                </header>

                <div className={styles.heroSection}>
                    <img 
                        src="/images/registros.png" 
                        alt="Ilustración de gestión de riesgos" 
                        className={styles.heroImage}
                    />
                    <div className={styles.ctaContainer}>
                        <button
                            className={styles.mainButton}
                            onClick={() => handleOpenModal('externos')}
                            aria-label="Abrir menú de clientes"
                        >
                            <span className={styles.buttonText}>Iniciar Nueva Evaluación</span>
                            <span className={styles.buttonIcon}>→</span>
                        </button>
                        <p className={styles.helperText}>
                            Persona natural, jurídica o empresa pública
                        </p>
                    </div>
                </div>
            </div>
            <ModalOpciones
                show={currentModal === 'externos'}
                onHide={handleClose}
                title="Clientes Externos"
                buttons={[
                    {
                        text: "Persona Natural",
                        onClick: () => handleOpenModal('personaNatural')
                    },
                    {
                        text: "Empresa Unipersonal",
                        onClick: () => handleOpenModal('empresaUnipersonal')
                    },
                    {
                        text: "Persona Jurídica",
                        onClick: () => navigateToForm('/personaJuridica')
                    },
                    {
                        text: "Empresas Públicas",
                        onClick: () => navigateToForm('/empresa-publica')
                    }
                ]}
            />

            <ModalOpciones
                show={currentModal === 'personaNatural'}
                onHide={handleBack}
                title="Persona Natural - Seleccione Rango de Prima"
                buttons={[
                    {
                        text: "Prima mayor a $us100 y menor o igual a $us1000",
                        onClick: () => navigateToForm('/personaNatural100')
                    },
                    {
                        text: "Prima mayor a $us1000 y menor a $us5000",
                        onClick: () => navigateToForm('/personaNatural1000')
                    },
                    {
                        text: "Prima mayor o igual $us5000",
                        onClick: () => navigateToForm('/personaNatural5000')
                    }
                ]}
            />

            <ModalOpciones
                show={currentModal === 'empresaUnipersonal'}
                onHide={handleBack}
                title="Empresa Unipersonal - Seleccione Rango de Prima"
                buttons={[
                    {
                        text: "Prima mayor a $us100 y menor o igual a $us1000",
                        onClick: () => navigateToForm('/formulario-empresa/100')
                    },
                    {
                        text: "Prima mayor a $us1000 y menor a $us5000",
                        onClick: () => navigateToForm('/formulario-empresa/1000')
                    },
                    {
                        text: "Prima mayor o igual $us5000",
                        onClick: () => navigateToForm('/formulario-empresa/5000')
                    }
                ]}
            />
        </div>
    );
};

export default BotonClientes;
import React from 'react';
import styles from './styles.module.css';

const ModalOpciones = ({ show, onHide, title, buttons }) => {
    if (!show) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContainer}>
                <div className={styles.modalHeader}>
                    <h3 className={styles.modalTitle}>{title}</h3>
                    <button 
                        type="button" 
                        className={styles.closeButton}
                        onClick={onHide}
                        aria-label="Cerrar modal"
                    >
                        &times;
                    </button>
                </div>
                
                <div className={styles.modalBody}>
                    <div className={styles.buttonsContainer}>
                        {buttons.map((button, index) => (
                            <button
                                key={index}
                                className={styles.optionButton}
                                onClick={button.onClick}
                            >
                                {button.text}
                            </button>
                        ))}
                    </div>
                </div>
                
                <div className={styles.modalFooter}>
                    <button 
                        className={styles.secondaryButton}
                        onClick={onHide}
                    >
                        Volver
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalOpciones;
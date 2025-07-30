// components/LoadingSpinner/LoadingSpinner.jsx
import React from 'react';
import styles from './styles.module.css';

const LoadingSpinner = () => {
  return (
    <div className={styles.spinnerContainer}>
      <div className={styles.loadingSpinner}></div>
    </div>
  );
};

export default LoadingSpinner;
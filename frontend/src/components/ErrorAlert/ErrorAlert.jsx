import React from 'react';
import styles from './styles.module.css';

const ErrorAlert = ({ message }) => {
  if (!message) return null;
  
  return <div className={styles.errorAlert}>{message}</div>;
};

export default ErrorAlert;
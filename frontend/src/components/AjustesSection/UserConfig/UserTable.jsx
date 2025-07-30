// components/AjustesSection/UserConfig/UserTable.jsx
import React from 'react';
import styles from './styles.module.css';

const UserTable = ({ users, onEdit, onDelete }) => {
  return (
    <table className={styles.userTable}>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Email</th>
          <th>Rol</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {users.map(user => (
          <tr key={user.id}>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>{user.role}</td>
            <td>
              <div className={styles.actions}>
                <button 
                  className={styles.editButton}
                  onClick={() => onEdit(user)}
                >
                  Editar
                </button>
                <button 
                  className={`${styles.deleteButton} ${user.id === 1 ? styles.disabledButton : ''}`}
                  onClick={() => user.id !== 1 && onDelete(user.id)}
                  disabled={user.id === 1}
                >
                  Eliminar
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UserTable;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserTable from './UserTable';
import UserForm from './UserForm';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import styles from './styles.module.css';

const UserConfig = () => {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const navigate = useNavigate();

  // Cargar usuarios desde la base de datos
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await window.electronAPI.listarUsuarios();
        if (response.success) {
          setUsers(response.data);
        } else {
          setError(response.error || 'Error al cargar los usuarios');
        }
      } catch (err) {
        setError('Error al conectar con la base de datos');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, []);

  const handleEdit = async (user) => {
    try {
      const response = await window.electronAPI.obtenerUsuario(user.id);
      if (response.success) {
        setSelectedUser(response.data);
        setShowForm(true);
      } else {
        setError(response.error || 'Error al cargar el usuario');
      }
    } catch (err) {
      setError('Error al obtener los datos del usuario');
    }
  };

  const handleDeleteRequest = (userId) => {
    setUserToDelete(userId);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;
    
    try {
      const response = await window.electronAPI.eliminarUsuario(userToDelete);
      if (response.success) {
        setUsers(users.filter(user => user.id !== userToDelete));
        setSuccessMessage('Usuario desactivado correctamente');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError(response.error || 'Error al eliminar el usuario');
      }
    } catch (err) {
      setError('Error al eliminar el usuario');
    } finally {
      setShowDeleteModal(false);
      setUserToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  const handleUserSubmit = async (userData) => {
    try {
      let response;
      
      if (userData.id) {
        // Actualizar usuario existente
        response = await window.electronAPI.actualizarUsuario(userData.id, {
          nombre: userData.name,
          email: userData.email,
          rol: userData.role,
          ...(userData.password && { password: userData.password })
        });
      } else {
        // Crear nuevo usuario
        response = await window.electronAPI.crearUsuario({
          nombre: userData.name,
          email: userData.email,
          rol: userData.role,
          password: userData.password
        });
      }
      
      if (response.success) {
        // Actualizar la lista de usuarios
        const usersResponse = await window.electronAPI.listarUsuarios();
        if (usersResponse.success) {
          setUsers(usersResponse.data);
        }
        
        setSuccessMessage(userData.id ? 
          'Usuario actualizado correctamente' : 
          'Usuario creado correctamente');
        setTimeout(() => setSuccessMessage(''), 3000);
        setShowForm(false);
        setSelectedUser(null);
      } else {
        setError(response.error || 'Error al guardar el usuario');
      }
    } catch (err) {
      setError('Error al guardar el usuario');
    }
  };

  if (loading) return (
    <div className={styles.loadingContainer}>
      <div className={styles.spinner}></div>
      <p>Cargando usuarios...</p>
    </div>
  );

  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.container}>
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onCancel={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
      />
      
      <button 
        className={styles.backButton}
        onClick={() => navigate('/ajustes')}
      >
        ← Volver
      </button>
      
      <div className={styles.header}>
        <h2>Gestión de Usuarios</h2>
        <button 
          className={styles.addButton}
          onClick={() => {
            setSelectedUser(null);
            setShowForm(true);
          }}
          disabled={showForm}
        >
          + Nuevo Usuario
        </button>
      </div>

      {successMessage && (
        <div className={styles.success}>
          {successMessage}
        </div>
      )}

      {showForm ? (
        <UserForm 
          user={selectedUser}
          onCancel={() => {
            setShowForm(false);
            setSelectedUser(null);
          }}
          onSubmit={handleUserSubmit}
        />
      ) : (
        <UserTable 
          users={users} 
          onEdit={handleEdit}
          onDelete={handleDeleteRequest} 
        />
      )}
    </div>
  );
};

export default UserConfig;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserTable from './UserTable';
import UserForm from './UserForm';
import DeleteConfirmationModal from './DeleteConfirmationModal';

import { databaseService } from '../../../services/database';
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
        setLoading(true);
        setError('');
        const response = await databaseService.listarUsuarios();
        
        if (response.success) {
          // Mapear los nombres de campos si es necesario (nombre -> name, rol -> role)
          const formattedUsers = response.data.map(user => ({
            id: user.id,
            name: user.nombre,
            email: user.email,
            role: user.rol,
            activo: user.activo,
            ultimo_login: user.ultimo_login
          }));
          setUsers(formattedUsers);
        } else {
          setError(response.error || 'Error al cargar los usuarios');
        }
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Error al conectar con la base de datos');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, []);

  const handleEdit = async (user) => {
    try {
      setError('');
      const response = await databaseService.obtenerUsuario(user.id);
      
      if (response.success) {
        // Formatear los datos del usuario para el formulario
        const userData = {
          id: response.data.id,
          name: response.data.nombre,
          email: response.data.email,
          role: response.data.rol,
          password: '',
          confirmPassword: ''
        };
        setSelectedUser(userData);
        setShowForm(true);
      } else {
        setError(response.error || 'Error al cargar el usuario');
      }
    } catch (err) {
      console.error('Error getting user:', err);
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
      setError('');
      const response = await databaseService.eliminarUsuario(userToDelete);
      
      if (response.success) {
        setUsers(users.filter(user => user.id !== userToDelete));
        setSuccessMessage('Usuario desactivado correctamente');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError(response.error || 'Error al eliminar el usuario');
      }
    } catch (err) {
      console.error('Error deleting user:', err);
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
      setError('');
      let response;
      
      // Preparar los datos para la base de datos
      const dbData = {
        nombre: userData.name,
        email: userData.email,
        rol: userData.role,
        ...(userData.password && { password: userData.password })
      };
      
      if (userData.id) {
        // Actualizar usuario existente
        response = await databaseService.actualizarUsuario(userData.id, dbData);
      } else {
        // Crear nuevo usuario
        response = await databaseService.crearUsuario(dbData);
      }
      
      if (response.success) {
        // Actualizar la lista de usuarios
        const usersResponse = await databaseService.listarUsuarios();
        if (usersResponse.success) {
          const formattedUsers = usersResponse.data.map(user => ({
            id: user.id,
            name: user.nombre,
            email: user.email,
            role: user.rol,
            activo: user.activo,
            ultimo_login: user.ultimo_login
          }));
          setUsers(formattedUsers);
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
      console.error('Error saving user:', err);
      setError('Error al guardar el usuario');
    }
  };

  if (loading) return (
    <div className={styles.loadingContainer}>
      <div className={styles.spinner}></div>
      <p>Cargando usuarios...</p>
    </div>
  );

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

      {error && (
        <div className={styles.error}>
          {error}
        </div>
      )}

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
            setError('');
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
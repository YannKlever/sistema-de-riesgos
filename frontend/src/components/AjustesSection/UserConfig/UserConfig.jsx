import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import UserTable from './UserTable';
import UserForm from './UserForm';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import { databaseService } from '../../../services/database';
import { getCurrentUser } from '../../../services/authService';
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
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  
  const context = useOutletContext();

  useEffect(() => {
    console.log('Contexto recibido en UserConfig:', context);
    
    let userData;
    if (context && context.currentUser) {
      userData = context.currentUser;
      setCurrentUser(context.currentUser);
      setIsAdmin(context.currentUser?.role === 'admin');
    } else {
      userData = getCurrentUser();
      setCurrentUser(userData);
      setIsAdmin(userData?.role === 'admin');
    }
    
    console.log('Usuario en UserConfig:', userData);
    console.log('Es admin en UserConfig:', userData?.role === 'admin');
  }, [context]);

  useEffect(() => {
    if (!isAdmin) {
      console.log('No es admin, no cargando usuarios');
      setLoading(false);
      return;
    }
    
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError('');
        console.log('Cargando usuarios...');
        const response = await databaseService.listarUsuarios();
        
        console.log('Respuesta de listarUsuarios:', response);
        
        if (response.success) {
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
  }, [isAdmin]);

  const handleEdit = async (user) => {
    try {
      setError('');
      console.log('Editando usuario ID:', user.id);
      
      const response = await databaseService.obtenerUsuario(user.id);
      console.log('Respuesta de obtenerUsuario:', response);
      
      if (response.success) {
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
      setError('Error al obtener los datos del usuario: ' + err.message);
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
      console.log('Eliminando usuario ID:', userToDelete);
      
      const response = await databaseService.eliminarUsuario(userToDelete);
      console.log('Respuesta de eliminarUsuario:', response);
      
      if (response.success) {
        setUsers(users.filter(user => user.id !== userToDelete));
        setSuccessMessage('Usuario desactivado correctamente');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError(response.error || 'Error al eliminar el usuario');
      }
    } catch (err) {
      console.error('Error deleting user:', err);
      setError('Error al eliminar el usuario: ' + err.message);
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
    console.log('Datos del formulario:', userData);
    
    // Preparar datos para el backend (convertir name -> nombre, role -> rol)
    const dbData = {
      nombre: userData.name,
      email: userData.email,
      rol: userData.role
    };
    
    console.log('Datos para enviar al backend:', dbData);
    
    let response;
    
    if (userData.id) {
      // Editar usuario existente
      // Solo añadir password si se proporcionó y no está vacío
      if (userData.password && userData.password.trim().length > 0) {
        dbData.password = userData.password;
      }
      response = await databaseService.actualizarUsuario(userData.id, dbData);
      console.log('Respuesta de actualizarUsuario:', response);
    } else {
      // Crear nuevo usuario - password es obligatorio para creación
      if (!userData.password || userData.password.length < 8) {
        setError('La contraseña es requerida y debe tener al menos 8 caracteres');
        return;
      }
      // Añadir password para creación
      dbData.password = userData.password;
      response = await databaseService.crearUsuario(dbData);
      console.log('Respuesta de crearUsuario:', response);
    }
    
    if (response.success) {
      // Recargar lista de usuarios
      const usersResponse = await databaseService.listarUsuarios();
      console.log('Respuesta de listarUsuarios después de guardar:', usersResponse);
      
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
    setError('Error al guardar el usuario: ' + err.message);
  }
};

  if (!isAdmin) {
    return (
      <div className={styles.container}>
        <button 
          className={styles.backButton}
          onClick={() => navigate('/ajustes')}
        >
          ← Volver a Ajustes
        </button>
        <div className={styles.error}>
          No tienes permisos para acceder a esta sección. 
          Solo los administradores pueden gestionar usuarios.
        </div>
      </div>
    );
  }

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
        ← Volver a Ajustes
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
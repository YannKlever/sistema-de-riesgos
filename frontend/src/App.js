import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { isAuthenticated, getCurrentUser } from './services/authService';
import { ThemeProvider } from './context/ThemeContext';
import LayoutPrincipal from './components/HeaderSection/LayoutPrincipal/LayoutPrincipal';
import LoginPage from './pages/Login/LoginPage';
import HomePage from './pages/Inicio/HomePage';

import Ajustes from './pages/Ajustes/Ajustes';
import Parametros from './pages/Parametros/Parametros';
import UserConfig from './components/AjustesSection/UserConfig/UserConfig';
import GeneralConfig from './components/AjustesSection/GeneralConfig/GeneralConfig';
import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner';
import styles from './App.css';

// Componentes de formularios
import BotonClientes from './components/BotonClientes/BotonClientes';
import FormularioEmpresaPublica from './pages/FormularioEmpresaPublica/FormularioEmpresaPublica';
import FormularioPersonaJuridica from './pages/FormularioPersonaJuridica/FormularioPersonaJuridica';
import FormularioPersonaNatural100 from './pages/FormularioPersonaNatural100/FormularioPersonaNatural100';
import FormularioPersonaNatural1000 from './pages/FormularioPersonaNatural1000/FormularioPersonaNatural1000';
import FormularioPersonaNatural5000 from './pages/FormularioPersonaNatural5000/FormularioPersonaNatural5000';
import FormularioEmpresaUnipersonal100 from './pages/FormularioEmpresaUnipersonal100/FormularioEmpresaUnipersonal100';
import FormularioEmpresaUnipersonal1000 from './pages/FormularioEmpresaUnipersonal1000/FormularioEmpresaUnipersonal1000';
import FormularioEmpresaUnipersonal5000 from './pages/FormularioEmpresaUnipersonal5000/FormularioEmpresaUnipersonal5000';

// Componentes de parámetros
import FormularioLDFT from './pages/FormularioLD_FT/FormularioLD_FT';
import ListaProductoServicio from './pages/ListaProductoServicio/index';
import ListaSucursales from './pages/ListaSucursales/index';
import ClientesInternos from './pages/FormularioClienteInterno/FormularioClienteInterno';
import AccionistasDirectorio from './pages/FormularioAccionistasSocios/FormularioAccionistasSocios';
import ListaClientesExternos from './pages/ListaClientesExternos/index';
import ListaAccionistasSocios from './pages/ListaAccionistasSocios/index';
import ListaClientesInternos from './pages/ListaClientesInternos/index';

// Componentes de Reportes
import Reportes from './pages/Reportes/Reportes';
import ReporteClienteExterno from './pages/ReportesClientesExternos/ReportesClientesExternos';
import ReporteAccionistaSocio from './pages/ReportesAccionistasSocios/ReportesAccionistasSocios';
import ReporteClientesInternos from './pages/ReportesClientesInternos/ReporteClientesInternos';
import ReportesSucursales from './pages/ReporteSucursales/ReportesSucursales';
import ReportesProductosServicios from './pages/ReportesProductoServicio/ReportesProductosServicios';
import ReportesLDFT from './pages/ReportesFormularioLDFT/ReportesLDFT';
import ReporteCanalesDistribucion from './pages/ReportesCanalDistribucion/ReporteCanalesDistribucion';
import ReporteAlertas from './pages/ReporteAlertas/ReporteAlertas';

import Backup from './components/AjustesSection/Backup';

// Componentes de graficos
import Graficos from './pages/Graficos/Graficos';
import GraficosAccionistaSocio from './pages/GraficosAccionistasSocios/GraficosAccionistasSocios';
import GraficosClienteExterno from './pages/GraficosClientesExternos/GraficosClientesExternos';
import GraficosClientesInternos from './pages/GraficosClientesInternos/GraficosClientesInternos';
import GraficosProductosServicios from './pages/GraficoProductoServicio/GraficosProductosServicios';
import GraficosSucursales from './pages/GraficoZonaGeografica/GraficosZonaGeografica';
import GraficosLDFT from './pages/GraficosLDFT/GraficosLDFT';
import GraficosCanalesDistribucion from './pages/GraficosCanalesDistribucion/GraficosCanalesDistribucion';
import FactorRiesgoCliente from './pages/GraficosClientes/FactorRiesgoCliente';
import RiesgoTotal from './pages/GraficoRiesgoTotal/RiesgoTotal';

function App() {
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const authStatus = await isAuthenticated();
        setIsAuth(authStatus);
        if (authStatus) {
          const user = getCurrentUser();
          setCurrentUser(user);
          console.log('Usuario autenticado:', user);
        }
      } catch (error) {
        console.error('Error en autenticación:', error);
        setIsAuth(false);
        setCurrentUser(null);
      } finally {
        setAuthChecked(true);
      }
    };
    
    checkAuthentication();
    
    const interval = setInterval(checkAuthentication, 300000);
    return () => clearInterval(interval);
  }, []);

  const handleLoginSuccess = (userData) => {
    setIsAuth(true);
    setCurrentUser(userData);
  };
  
  const handleLogout = () => {
    setIsAuth(false);
    setCurrentUser(null);
  };

  const ProtectedRoute = ({ children, requiredRole }) => {
    if (!isAuth) {
      console.log('ProtectedRoute: No autenticado, redirigiendo a login');
      return <Navigate to="/login" replace />;
    }
    
    const user = getCurrentUser();
    console.log('ProtectedRoute - Verificación de rol:', {
      required: requiredRole,
      actual: user?.role,
      tieneAcceso: !requiredRole || user?.role === requiredRole
    });
    
    if (requiredRole && user?.role !== requiredRole) {
      console.log(`ProtectedRoute: Acceso denegado. Se requiere: ${requiredRole}, usuario tiene: ${user?.role}`);
      return <Navigate to="/home" replace />;
    }
    
    return children;
  };

  if (!authChecked) return <LoadingSpinner />;

  return (
    <ThemeProvider>
      <div className={styles.appContainer}>
        <BrowserRouter>
          <Routes>
            <Route
              path="/login"
              element={
                !isAuth ? (
                  <LoginPage onLoginSuccess={handleLoginSuccess} />
                ) : (
                  <Navigate to="/home" replace />
                )
              }
            />

            <Route
              element={
                isAuth ? (
                  <LayoutPrincipal onLogout={handleLogout} user={currentUser}>
                    <Outlet />
                  </LayoutPrincipal>
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            >
              <Route path="/home" element={<HomePage />} />

              <Route path="/parametros" element={<Parametros />} />
              <Route path="/parametros/formulario-ld-ft" element={<FormularioLDFT />} />
              <Route path="/parametros/lista-producto-servicio" element={<ListaProductoServicio />} />
              <Route path="/parametros/lista-sucursales" element={<ListaSucursales />} />
              <Route path="/parametros/clientes-internos/:id?" element={<ClientesInternos />} />
              <Route path="/parametros/accionistas-directorio/:id?" element={<AccionistasDirectorio />} />
              <Route path="/parametros/clientes-externos" element={<ListaClientesExternos />} />
              <Route path="/parametros/lista-accionistas-socios" element={<ListaAccionistasSocios />} />
              <Route path='/parametros/lista-clientes-internos' element={<ListaClientesInternos />} />

              <Route path="/clientes" element={<BotonClientes />} />
              <Route path="/empresa-publica" element={<FormularioEmpresaPublica />} />
              <Route path="/personaJuridica" element={<FormularioPersonaJuridica />} />
              <Route path="/personaNatural100" element={<FormularioPersonaNatural100 />} />
              <Route path="/personaNatural1000" element={<FormularioPersonaNatural1000 />} />
              <Route path="/personaNatural5000" element={<FormularioPersonaNatural5000 />} />
              <Route path="/formulario-empresa/100" element={<FormularioEmpresaUnipersonal100 />} />
              <Route path="/formulario-empresa/1000" element={<FormularioEmpresaUnipersonal1000 />} />
              <Route path="/formulario-empresa/5000" element={<FormularioEmpresaUnipersonal5000 />} />

              <Route path="/reportes" element={<Reportes />} />
              <Route path="/reportes/clientes-externos" element={<ReporteClienteExterno />} />
              <Route path="/reportes/accionistasSocios" element={<ReporteAccionistaSocio />} />
              <Route path="/reportes/clientes-internos" element={<ReporteClientesInternos />} />
              <Route path="/reportes/zona-geografica" element={<ReportesSucursales />} />
              <Route path="/reportes/ld-ft" element={<ReportesLDFT />} />
              <Route path="/reportes/alertas" element={<ReporteAlertas />} />
              <Route path="/reportes/productos-servicios" element={<ReportesProductosServicios />} />
              <Route path="/reportes/canales-distribucion" element={<ReporteCanalesDistribucion />} />

              <Route path="/graficos" element={<Graficos />} />
              <Route path="/graficos/accionistasSocios" element={<GraficosAccionistaSocio />} />
              <Route path="/graficos/clientesExternos" element={<GraficosClienteExterno />} />
              <Route path="/graficos/clientesInternos" element={<GraficosClientesInternos />} />
              <Route path="/graficos/producto-servicio" element={<GraficosProductosServicios />} />
              <Route path="/graficos/zona-geografica" element={<GraficosSucursales />} />
              <Route path="/graficos/riesgo-ldft" element={<GraficosLDFT />} />
              <Route path="/graficos/canales-distribucion" element={<GraficosCanalesDistribucion />} />
              <Route path="/graficos/riesgo-cliente" element={<FactorRiesgoCliente />} />
              <Route path="/graficos/riesgo-total" element={<RiesgoTotal />} />

              <Route path="/ajustes" element={<Ajustes />}>
                <Route 
                  path="usuarios" 
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <UserConfig />
                    </ProtectedRoute>
                  } 
                />
                <Route path="generales" element={<GeneralConfig />} />
                
                <Route path="backup" element={<Backup />} />
                <Route index element={<Navigate to="generales" replace />} />
              </Route>

              <Route path="/" element={<Navigate to="/home" replace />} />

              <Route
                path="*"
                element={
                  <div className={styles.notFound}>
                    <h1>404 - Página no encontrada</h1>
                  </div>
                }
              />
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
}

export default App;
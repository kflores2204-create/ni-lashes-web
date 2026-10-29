import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AboutBrand from './components/AboutBrand';
import Catalog from './components/Catalog';
import BookingFlow from './components/BookingFlow';
import AdminDashboard from './components/AdminDashboard';
import AdminLoginModal from './components/AdminLoginModal';
import WhatsAppWidget from './components/WhatsAppWidget';
import Footer from './components/Footer';

export default function App() {
  const [currentView, setCurrentView] = useState('client'); // 'client' | 'admin'
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState(null);
  const [adminLoginModalOpen, setAdminLoginModalOpen] = useState(false);

  // Detectar si se ingresa por la URL con #admin (acceso secreto)
  useEffect(() => {
    const checkHash = () => {
      if (window.location.hash === '#admin') {
        const isAuth = sessionStorage.getItem('ni_lashes_admin_auth') === 'true';
        if (isAuth) {
          setCurrentView('admin');
        } else {
          setAdminLoginModalOpen(true);
        }
      }
    };

    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  // Abrir modal de reservas genérico
  const handleOpenBooking = () => {
    setSelectedServiceForBooking(null);
    setBookingModalOpen(true);
  };

  // Abrir modal de reservas con un servicio preseleccionado
  const handleSelectServiceForBooking = (service) => {
    setSelectedServiceForBooking(service);
    setBookingModalOpen(true);
  };

  // Scroll suave al catálogo
  const handleScrollToCatalog = () => {
    const el = document.getElementById('catalogo');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Apertura de login de admin (desde el footer o tecla secreta)
  const handleOpenAdminLogin = () => {
    const isAuth = sessionStorage.getItem('ni_lashes_admin_auth') === 'true';
    if (isAuth) {
      setCurrentView('admin');
      window.location.hash = '#admin';
    } else {
      setAdminLoginModalOpen(true);
    }
  };

  // Éxito de login de admin
  const handleAdminLoginSuccess = () => {
    setCurrentView('admin');
    window.location.hash = '#admin';
  };

  // Cerrar sesión de admin
  const handleAdminLogout = () => {
    sessionStorage.removeItem('ni_lashes_admin_auth');
    setCurrentView('client');
    window.history.pushState(null, '', window.location.pathname);
  };

  return (
    <div className="min-h-screen bg-stone-50/30 text-stone-900 font-sans antialiased selection:bg-rose-100 selection:text-rose-900">
      
      {/* Barra de Navegación (Pública, sin botones de admin) */}
      <Navbar
        onOpenBooking={handleOpenBooking}
      />

      {/* VISTA CLIENTE: ECOMMERCE & ESTUDIO */}
      {currentView === 'client' && (
        <main>
          {/* 1. Hero Editorial */}
          <Hero
            onOpenBooking={handleOpenBooking}
            onScrollToCatalog={handleScrollToCatalog}
          />

          {/* 2. Catálogo de Servicios & Productos (con IGV y Stock) */}
          <Catalog
            onSelectServiceForBooking={handleSelectServiceForBooking}
          />

          {/* 3. Filosofía y Cuidado de la Mirada */}
          <AboutBrand />
        </main>
      )}

      {/* VISTA PRIVADA DE ADMINISTRADOR */}
      {currentView === 'admin' && (
        <main>
          <AdminDashboard
            onLogout={handleAdminLogout}
          />
        </main>
      )}

      {/* Modal Flujo de Reserva */}
      <BookingFlow
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        preselectedService={selectedServiceForBooking}
      />

      {/* Modal de Acceso Seguro de Administrador */}
      <AdminLoginModal
        isOpen={adminLoginModalOpen}
        onClose={() => {
          setAdminLoginModalOpen(false);
          if (window.location.hash === '#admin' && currentView !== 'admin') {
            window.history.pushState(null, '', window.location.pathname);
          }
        }}
        onLoginSuccess={handleAdminLoginSuccess}
      />

      {/* Botón Flotante Persistente de WhatsApp (+51 997 448 945) */}
      <WhatsAppWidget />

      {/* Pie de Página con Enlace Discreto a Admin */}
      <Footer
        onOpenBooking={handleOpenBooking}
        onOpenAdminLogin={handleOpenAdminLogin}
      />

    </div>
  );
}

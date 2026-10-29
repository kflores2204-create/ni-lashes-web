import React, { useState } from 'react';
import { Calendar, ShoppingBag, MessageCircle, Menu, X, Sparkles } from 'lucide-react';
import { BUSINESS_CONFIG, getWhatsAppUrl } from '../services/api';

export default function Navbar({ onOpenBooking }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleWhatsAppContact = () => {
    const msg = `¡Hola ${BUSINESS_CONFIG.brandName}! Me comunico desde su página web para consultar sobre citas y servicios.`;
    window.open(getWhatsAppUrl(msg), '_blank');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-xs">
      
      {/* Barra de anuncio superior estilo boutique */}
      <div className="bg-stone-900 text-stone-200 text-[11px] py-2 px-4 text-center tracking-widest uppercase font-medium flex items-center justify-center space-x-2">
        <span className="w-1.5 h-1.5 rounded-full bg-rose-400 inline-block animate-pulse" />
        <span>Atención exclusiva previa reserva &bull; WhatsApp: {BUSINESS_CONFIG.displayPhone}</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo Editorial: NI LASHES STUDIO */}
          <a href="#" className="flex items-center space-x-3 group">
            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-stone-900 via-stone-800 to-rose-400 p-[1.5px] shadow-sm group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-stone-900 rounded-full flex items-center justify-center text-rose-300 font-serif font-bold text-sm tracking-tighter">
                NI
              </div>
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-serif font-extrabold tracking-wider text-stone-900 block leading-none">
                NI LASHES
              </span>
              <span className="text-[10px] tracking-[0.25em] uppercase text-rose-600 font-semibold block mt-0.5">
                STUDIO & BEAUTY
              </span>
            </div>
          </a>

          {/* Menú Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="#"
              className="text-xs uppercase tracking-widest font-semibold text-stone-800 hover:text-rose-600 transition-colors"
            >
              Inicio
            </a>
            <a
              href="#catalogo"
              className="text-xs uppercase tracking-widest font-semibold text-stone-600 hover:text-rose-600 transition-colors"
            >
              Servicios
            </a>
            <a
              href="#catalogo"
              className="text-xs uppercase tracking-widest font-semibold text-stone-600 hover:text-rose-600 transition-colors"
            >
              Tienda & Cuidados
            </a>
            <a
              href="#sobre-marca"
              className="text-xs uppercase tracking-widest font-semibold text-stone-600 hover:text-rose-600 transition-colors"
            >
              Filosofía
            </a>
          </nav>

          {/* Acciones Extremo Derecho: Botón Cita & WhatsApp (Sin botón de admin a la vista) */}
          <div className="hidden sm:flex items-center space-x-3">
            <button
              onClick={handleWhatsAppContact}
              className="flex items-center space-x-1.5 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 border border-stone-200 px-4 py-2.5 rounded-full transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>WhatsApp</span>
            </button>

            <button
              onClick={onOpenBooking}
              className="flex items-center space-x-2 text-xs uppercase tracking-wider font-bold text-white bg-stone-900 hover:bg-stone-800 px-5 py-2.5 rounded-full shadow-sm hover:shadow-md transition-all"
            >
              <Calendar className="w-3.5 h-3.5 text-rose-400" />
              <span>Agendar Cita</span>
            </button>
          </div>

          {/* Menú Hamburguesa Mobile */}
          <div className="flex sm:hidden items-center space-x-2">
            <button
              onClick={onOpenBooking}
              className="text-xs bg-stone-900 text-white px-3 py-1.5 rounded-full font-bold uppercase tracking-wider"
            >
              Cita
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-stone-700"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Menú Mobile Desplegable */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-stone-200 bg-white px-5 py-6 space-y-4 shadow-lg text-center">
          <a
            href="#"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-xs uppercase tracking-widest font-bold text-stone-800 py-2"
          >
            Inicio
          </a>
          <a
            href="#catalogo"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-xs uppercase tracking-widest font-bold text-stone-800 py-2"
          >
            Servicios
          </a>
          <a
            href="#catalogo"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-xs uppercase tracking-widest font-bold text-stone-800 py-2"
          >
            Tienda & Cuidados
          </a>
          <a
            href="#sobre-marca"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-xs uppercase tracking-widest font-bold text-stone-800 py-2"
          >
            Filosofía
          </a>

          <div className="pt-2 space-y-2">
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenBooking(); }}
              className="w-full py-3 bg-stone-900 text-white rounded-xl text-xs uppercase tracking-wider font-bold"
            >
              Reservar Cita Online
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); handleWhatsAppContact(); }}
              className="w-full py-3 bg-emerald-600 text-white rounded-xl text-xs font-semibold flex items-center justify-center space-x-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chatear al WhatsApp</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

import React from 'react';
import { Sparkles, Clock, Phone, Heart, MessageCircle, Lock } from 'lucide-react';
import { BUSINESS_CONFIG, getWhatsAppUrl } from '../services/api';

export default function Footer({ onOpenBooking, onOpenAdminLogin }) {
  const handleWhatsAppContact = () => {
    const msg = `¡Hola ${BUSINESS_CONFIG.brandName}! Me comunico desde su página web para consultar sobre citas y servicios.`;
    window.open(getWhatsAppUrl(msg), '_blank');
  };

  return (
    <footer className="bg-stone-950 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Marca y Filosofía */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-stone-900 border border-stone-700 flex items-center justify-center text-rose-300 font-serif font-bold text-xs">
                NI
              </div>
              <span className="text-xl font-serif font-bold text-white tracking-wider">
                {BUSINESS_CONFIG.brandName}
              </span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed font-light">
              Centro especializado en la estética y diseño de la mirada. Extensiones de pestañas pelo a pelo, fibras tecnológicas, lifting y diseño personalizado de cejas.
            </p>
            <div className="text-[11px] text-stone-500 font-medium">
              "Que la belleza no sobrepase a la salud"
            </div>
          </div>

          {/* Menú Rápido */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest font-serif">Navegación</h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <a href="#catalogo" className="hover:text-rose-300 transition-colors">Servicios de Pestañas</a>
              </li>
              <li>
                <a href="#catalogo" className="hover:text-rose-300 transition-colors">Productos & Cuidados</a>
              </li>
              <li>
                <a href="#sobre-marca" className="hover:text-rose-300 transition-colors">Nuestra Filosofía</a>
              </li>
              <li>
                <button onClick={onOpenBooking} className="text-rose-300 hover:underline">
                  Agendar Cita en Línea
                </button>
              </li>
            </ul>
          </div>

          {/* Horarios */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest font-serif">Horario de Atención</h4>
            <div className="space-y-2 text-xs text-stone-400 font-light">
              <div className="flex items-start space-x-2">
                <Clock className="w-4 h-4 text-rose-300 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="block font-medium text-stone-200">Lunes a Sábado:</span>
                  <span>09:00 AM - 07:00 PM</span>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-[11px] text-stone-500">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block flex-shrink-0" />
                <span>Domingos: Cerrado</span>
              </div>
            </div>
          </div>

          {/* Contacto Oficial */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest font-serif">Atención Directa</h4>
            <div className="space-y-2 text-xs text-stone-400">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-rose-300 flex-shrink-0" />
                <span className="font-mono font-bold text-stone-200">{BUSINESS_CONFIG.displayPhone}</span>
              </div>
              <p className="text-[11px] text-stone-400">
                {BUSINESS_CONFIG.locationNote}
              </p>
            </div>

            <button
              onClick={handleWhatsAppContact}
              className="mt-3 w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-colors shadow-sm"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Escríbenos por WhatsApp</span>
            </button>
          </div>

        </div>

        {/* Fila Inferior con Acceso Discreto */}
        <div className="mt-12 pt-8 border-t border-stone-800/80 text-xs text-stone-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            &copy; {new Date().getFullYear()} {BUSINESS_CONFIG.brandName}. Todos los derechos reservados.
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1 text-stone-400 text-[11px]">
              <span>Hecho con</span>
              <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
              <span>para el cuidado de tu mirada</span>
            </div>

            {/* Enlace discreto a la gestión de administrador */}
            <button
              onClick={onOpenAdminLogin}
              className="text-stone-600 hover:text-stone-400 transition-colors p-1"
              title="Acceso administrativo"
            >
              <Lock className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}

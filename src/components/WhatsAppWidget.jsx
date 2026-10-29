import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { getWhatsAppUrl, BUSINESS_CONFIG } from '../services/api';

export default function WhatsAppWidget() {
  const [openTooltip, setOpenTooltip] = useState(true);

  const handleClick = () => {
    const msg = `¡Hola ${BUSINESS_CONFIG.brandName}! Me gustaría consultar sobre sus servicios de pestañas y disponibilidad de citas.`;
    window.open(getWhatsAppUrl(msg), '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end space-y-2">
      
      {openTooltip && (
        <div className="bg-white rounded-2xl p-3.5 shadow-xl border border-stone-200 max-w-xs text-xs text-stone-700 animate-in fade-in slide-in-from-bottom-2 duration-300 relative">
          <button
            onClick={(e) => { e.stopPropagation(); setOpenTooltip(false); }}
            className="absolute top-1.5 right-1.5 text-stone-300 hover:text-stone-500 p-0.5 rounded"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          <div className="flex items-center space-x-2 font-bold text-stone-900 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
            <span>¿Consultas o reservas?</span>
          </div>
          <p className="text-stone-500 leading-tight">
            Escríbenos directamente a nuestro WhatsApp oficial: <strong>{BUSINESS_CONFIG.displayPhone}</strong>.
          </p>
        </div>
      )}

      <button
        onClick={handleClick}
        className="w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-2xl flex items-center justify-center transition-all transform hover:scale-105 active:scale-95 relative"
        title="Contactar al WhatsApp (+51 997 448 945)"
      >
        <MessageCircle className="w-7 h-7 fill-white/20" />
      </button>

    </div>
  );
}

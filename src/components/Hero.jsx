import React from 'react';
import { Calendar, ShoppingBag, Sparkles, CheckCircle2, ShieldCheck, Heart } from 'lucide-react';
import { BUSINESS_CONFIG } from '../services/api';

export default function Hero({ onOpenBooking, onScrollToCatalog }) {
  return (
    <section className="relative overflow-hidden bg-stone-50/80 pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-stone-200/60">
      
      {/* Resplandores de luz sutil en tonos arena y marfil */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full bg-rose-100/40 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-96 h-96 rounded-full bg-amber-50/70 blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Columna de Texto Editorial */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-stone-100 border border-stone-200 text-stone-700 text-[11px] font-bold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-rose-500" />
              <span>Centro de Estética & Diseño de la Mirada</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-extrabold text-stone-900 tracking-tight leading-[1.12]">
              Diseño de pestañas que cuida la salud de tus ojos.
            </h1>

            <p className="text-sm sm:text-base text-stone-600 max-w-xl mx-auto lg:mx-0 font-light leading-relaxed">
              En <strong>{BUSINESS_CONFIG.brandName}</strong> creemos que la belleza nunca debe comprometer la salud. Diseños personalizados de extensiones clásicas, fibras tecnológicas, efecto rímel y laminado de cejas.
            </p>

            {/* Botones de acción estilo DLASH */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                onClick={onOpenBooking}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-stone-900 hover:bg-stone-800 text-white text-xs uppercase tracking-widest font-bold px-8 py-4 rounded-full shadow-lg transition-all transform hover:-translate-y-0.5"
              >
                <Calendar className="w-4 h-4 text-rose-400" />
                <span>Agendar mi Cita</span>
              </button>

              <button
                onClick={onScrollToCatalog}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-white hover:bg-stone-100 text-stone-800 text-xs uppercase tracking-widest font-bold px-8 py-4 rounded-full border border-stone-300 shadow-xs transition-colors"
              >
                <ShoppingBag className="w-4 h-4 text-stone-500" />
                <span>Ver Servicios & Precios</span>
              </button>
            </div>

            {/* Sellos de Calidad y Bioseguridad */}
            <div className="pt-8 grid grid-cols-3 gap-4 border-t border-stone-200 text-left">
              <div>
                <span className="text-rose-600 font-serif font-extrabold text-lg block leading-none">Pelo a Pelo</span>
                <span className="text-[11px] text-stone-500 mt-1 block">Aislamiento milimétrico</span>
              </div>
              <div>
                <span className="text-stone-900 font-serif font-extrabold text-lg block leading-none">100% Seguro</span>
                <span className="text-[11px] text-stone-500 mt-1 block">Fibras ultra ligeras</span>
              </div>
              <div>
                <span className="text-stone-900 font-serif font-extrabold text-lg block leading-none">4-6 Semanas</span>
                <span className="text-[11px] text-stone-500 mt-1 block">Retención garantizada</span>
              </div>
            </div>

          </div>

          {/* Columna Visual: Fotografía Estilo DLASH */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-sm sm:max-w-md lg:max-w-none">
              
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-8 border-white bg-stone-200 aspect-[4/5] group">
                <img
                  src="https://images.unsplash.com/photo-1583001931096-959e9a1a6223?auto=format&fit=crop&w=800&q=80"
                  alt="Diseño de Pestañas NI Lashes Studio"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                  <span className="text-[10px] uppercase tracking-widest text-rose-300 font-bold">
                    Estudio Profesional
                  </span>
                  <h3 className="text-lg font-serif font-bold">
                    Extensiones & Laminado
                  </h3>
                  <p className="text-[11px] text-stone-300 mt-0.5">
                    Acabado impecable y natural con productos hipoalergénicos.
                  </p>
                </div>
              </div>

              {/* Insignia Flotante */}
              <div className="absolute -bottom-5 -left-5 bg-white rounded-2xl p-4 shadow-xl border border-stone-200 flex items-center space-x-3 max-w-[240px]">
                <div className="w-10 h-10 rounded-xl bg-stone-900 flex items-center justify-center text-rose-300 flex-shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-900 font-serif">Salud & Estética</h4>
                  <p className="text-[10px] text-stone-500">Cuidado no invasivo de la pestaña natural.</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

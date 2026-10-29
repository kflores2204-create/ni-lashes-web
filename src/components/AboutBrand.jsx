import React from 'react';
import { Eye, Feather, ShieldCheck, Award, Sparkles, Check } from 'lucide-react';
import { BUSINESS_CONFIG } from '../services/api';

export default function AboutBrand() {
  const pillars = [
    {
      icon: Eye,
      title: "Visagismo Personalizado",
      desc: "Diseño único según la forma de tus ojos: efecto almendrado, cat eye, muñeca o ardilla, armonizando tu rostro."
    },
    {
      icon: Feather,
      title: "Aislamiento Pestaña por Pestaña",
      desc: "Garantizamos que cada fibra se coloque exclusivamente sobre una pestaña adulta, preservando el crecimiento natural."
    },
    {
      icon: ShieldCheck,
      title: "Higiene y Esterilización",
      desc: "Protocolos estrictos de bioseguridad, pinzas esterilizadas y cepillos individuales desechables para cada clienta."
    },
    {
      icon: Award,
      title: "Técnicas Tecnológicas",
      desc: "Uso de fibras tecnológicas (W, Y, Hawaiana) y abanicos manuales de peso pluma que no sobrecargan el folículo."
    }
  ];

  return (
    <section id="sobre-marca" className="py-20 bg-stone-100/60 border-t border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Encabezado */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-[10px] tracking-[0.25em] uppercase font-bold text-rose-700 bg-rose-100/70 px-3 py-1 rounded-full border border-rose-200">
            Nuestra Esencia
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-extrabold text-stone-900 tracking-tight">
            "Que la belleza no sobrepase a la salud"
          </h2>
          <p className="text-stone-600 text-sm leading-relaxed font-light">
            En <strong>{BUSINESS_CONFIG.brandName}</strong> fusionamos la estética de alta gama con el respeto absoluto hacia la salud ocular y folicular. Tu mirada destacará de forma sutil, sofisticada y sin molestias.
          </p>
        </div>

        {/* 4 Pilares */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white p-7 rounded-3xl border border-stone-200/90 shadow-xs hover:shadow-md hover:border-stone-400 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-2xl bg-stone-900 flex items-center justify-center text-rose-300 mb-5">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-stone-900 mb-2 font-serif">{item.title}</h3>
                <p className="text-stone-500 text-xs leading-relaxed font-light">{item.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Banner Informativo Post-Cuidado */}
        <div className="mt-16 bg-stone-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-3">
              <span className="text-rose-300 text-[10px] font-bold uppercase tracking-widest">
                Garantía NI Lashes Studio
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold">
                Retención Prolongada & Asesoría Continua
              </h3>
              <p className="text-stone-300 text-xs sm:text-sm leading-relaxed max-w-xl font-light">
                Te brindamos una guía de cuidados post-cita y el cepillo especial para mantenerlas ordenadas. Además, contamos con una línea exclusiva de shampoos y sérums de mantenimiento diario.
              </p>
            </div>
            <div className="lg:col-span-4 flex justify-start lg:justify-end">
              <div className="bg-stone-800/80 backdrop-blur-xs rounded-2xl p-5 border border-stone-700 text-center w-full max-w-xs space-y-2">
                <div className="text-xs font-bold text-rose-300 uppercase tracking-wider">Citas Exclusivas</div>
                <p className="text-[11px] text-stone-300">
                  Espacios de atención dedicados para cada clienta con el tiempo necesario para un acabado impecable.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

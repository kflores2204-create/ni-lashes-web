import React, { useState, useEffect } from 'react';
import { ShoppingBag, Sparkles, Calendar, MessageCircle, AlertCircle, Clock, PackageCheck } from 'lucide-react';
import { fetchItems, formatCurrency, getWhatsAppUrl, BUSINESS_CONFIG } from '../services/api';

export default function Catalog({ onSelectServiceForBooking }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [typeFilter, setTypeFilter] = useState('all'); // 'all', 'service', 'product'
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  const loadCatalog = async () => {
    setLoading(true);
    setError(null);
    try {
      const typeParam = typeFilter === 'all' ? null : typeFilter;
      const data = await fetchItems(typeParam, selectedCategory, true);
      setItems(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCatalog();
  }, [typeFilter, selectedCategory]);

  const categories = ['Todos', 'Extensiones', 'Lifting', 'Cejas', 'Cuidado y Limpieza', 'Accesorios', 'Mantenimiento'];

  const handleItemWhatsAppQuery = (item) => {
    let msg = '';
    if (item.type === 'service') {
      msg = `¡Hola ${BUSINESS_CONFIG.brandName}! Me interesa agendar el servicio *${item.name}* (${formatCurrency(item.total_price)} inc. IGV). ¿Tienen turnos disponibles para esta semana?`;
    } else {
      msg = `¡Hola ${BUSINESS_CONFIG.brandName}! Quisiera solicitar el producto *${item.name}* (${formatCurrency(item.total_price)} inc. IGV). ¿Me brindan detalles de entrega o recojo?`;
    }
    window.open(getWhatsAppUrl(msg), '_blank');
  };

  return (
    <section id="catalogo" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Cabecera */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-[10px] tracking-[0.25em] uppercase font-bold text-stone-500 bg-stone-100 px-3.5 py-1 rounded-full border border-stone-200">
            Menú de Servicios & Tienda
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-extrabold text-stone-900 tracking-tight">
            Tratamientos & Cuidados de Pestañas
          </h2>
          <p className="text-stone-600 text-xs sm:text-sm font-light">
            Tarifas con <strong>IGV ({BUSINESS_CONFIG.igvDefault}%)</strong> incluido. Reserva tu cita en línea o solicita asesoría personalizada por WhatsApp.
          </p>
        </div>

        {/* Filtros de Tipo */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          <button
            onClick={() => setTypeFilter('all')}
            className={`px-5 py-2.5 rounded-full text-xs uppercase tracking-wider font-bold transition-all ${
              typeFilter === 'all'
                ? 'bg-stone-900 text-white shadow-md'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Todos ({items.length})
          </button>
          <button
            onClick={() => setTypeFilter('service')}
            className={`flex items-center space-x-1.5 px-5 py-2.5 rounded-full text-xs uppercase tracking-wider font-bold transition-all ${
              typeFilter === 'service'
                ? 'bg-stone-900 text-white shadow-md'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            <span>Servicios de Pestañas & Cejas</span>
          </button>
          <button
            onClick={() => setTypeFilter('product')}
            className={`flex items-center space-x-1.5 px-5 py-2.5 rounded-full text-xs uppercase tracking-wider font-bold transition-all ${
              typeFilter === 'product'
                ? 'bg-stone-900 text-white shadow-md'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5 text-rose-400" />
            <span>Productos Post-Tratamiento</span>
          </button>
        </div>

        {/* Categorías secundarias */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-stone-200 text-stone-900 font-bold'
                  : 'text-stone-500 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Carga o Error */}
        {loading && (
          <div className="py-20 text-center text-stone-400 space-y-3">
            <div className="w-9 h-9 border-2 border-stone-200 border-t-stone-800 rounded-full animate-spin mx-auto" />
            <p className="text-xs uppercase tracking-wider">Cargando catálogo...</p>
          </div>
        )}

        {error && (
          <div className="my-10 max-w-md mx-auto p-4 bg-red-50 border border-red-200 rounded-2xl text-red-800 text-xs text-center space-y-2">
            <AlertCircle className="w-5 h-5 mx-auto text-red-500" />
            <p className="font-bold">No se pudo cargar el catálogo</p>
            <p className="text-stone-500">{error}</p>
            <button
              onClick={loadCatalog}
              className="bg-stone-900 text-white px-3 py-1 rounded-lg font-bold"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Grid de Productos & Servicios */}
        {!loading && !error && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((item) => {
              const isService = item.type === 'service';
              const isOutOfStock = !isService && (item.stock === 0 || item.stock === null);

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl overflow-hidden border border-stone-200/90 shadow-xs hover:shadow-xl hover:border-stone-400 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* Imagen */}
                    <div className="relative aspect-[16/11] bg-stone-100 overflow-hidden">
                      <img
                        src={item.image_url || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80'}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      
                      <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-xs ${
                          isService
                            ? 'bg-stone-900 text-white'
                            : 'bg-rose-600 text-white'
                        }`}>
                          {isService ? 'Servicio' : 'Producto'}
                        </span>
                        <span className="bg-white/90 backdrop-blur-xs px-2.5 py-0.5 rounded-full text-[10px] font-semibold text-stone-700 shadow-xs">
                          {item.category}
                        </span>
                      </div>

                      <div className="absolute top-3 right-3">
                        {isService ? (
                          <div className="bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full text-[10px] font-medium text-stone-700 flex items-center space-x-1 shadow-xs">
                            <Clock className="w-3 h-3 text-stone-500" />
                            <span>{item.duration_minutes || 90} min</span>
                          </div>
                        ) : (
                          <div className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold shadow-xs flex items-center space-x-1 ${
                            isOutOfStock
                              ? 'bg-red-500 text-white'
                              : 'bg-emerald-600 text-white'
                          }`}>
                            <PackageCheck className="w-3 h-3" />
                            <span>{isOutOfStock ? 'Agotado' : `${item.stock} en stock`}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Contenido */}
                    <div className="p-6 space-y-3">
                      <h3 className="text-base font-bold text-stone-900 font-serif group-hover:text-rose-600 transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-stone-500 text-xs line-clamp-2 leading-relaxed font-light">
                        {item.description || 'Tratamiento profesional con asesoría de visagismo.'}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 pt-0 space-y-4">
                    {/* Desglose de Precio */}
                    <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200/70 space-y-1">
                      <div className="flex justify-between items-center text-[11px] text-stone-500">
                        <span>Precio base:</span>
                        <span>{formatCurrency(item.price)}</span>
                      </div>
                      <div className="flex justify-between items-center text-[11px] text-stone-400">
                        <span>IGV ({item.igv_percent}%):</span>
                        <span>+{formatCurrency(item.igv_amount)}</span>
                      </div>
                      <div className="flex justify-between items-center pt-1 border-t border-stone-200">
                        <span className="text-xs font-bold text-stone-700">Total a pagar:</span>
                        <span className="text-base font-extrabold text-stone-900 font-serif">
                          {formatCurrency(item.total_price)}
                        </span>
                      </div>
                    </div>

                    {/* Botones */}
                    <div className="space-y-2">
                      {isService ? (
                        <button
                          onClick={() => onSelectServiceForBooking(item)}
                          className="w-full flex items-center justify-center space-x-2 bg-stone-900 hover:bg-stone-800 text-white text-xs uppercase tracking-wider font-bold py-3 rounded-xl transition-all shadow-xs"
                        >
                          <Calendar className="w-4 h-4 text-rose-400" />
                          <span>Agendar Cita</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleItemWhatsAppQuery(item)}
                          disabled={isOutOfStock}
                          className="w-full flex items-center justify-center space-x-2 bg-stone-900 hover:bg-stone-800 disabled:bg-stone-300 text-white text-xs uppercase tracking-wider font-bold py-3 rounded-xl transition-all shadow-xs"
                        >
                          <ShoppingBag className="w-4 h-4 text-rose-400" />
                          <span>{isOutOfStock ? 'Agotado' : 'Pedir por WhatsApp'}</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleItemWhatsAppQuery(item)}
                        className="w-full flex items-center justify-center space-x-1.5 text-xs text-stone-600 bg-stone-100 hover:bg-stone-200 py-2.5 rounded-xl transition-colors font-medium border border-stone-200"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Consultar por WhatsApp</span>
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}

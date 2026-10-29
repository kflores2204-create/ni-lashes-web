import React, { useState, useEffect } from 'react';
import { 
  Calendar, ShoppingBag, Plus, Edit, Trash2, CheckCircle2, Clock, 
  XCircle, MessageCircle, AlertCircle, RefreshCw, Filter, Layers 
} from 'lucide-react';
import { 
  fetchAppointments, updateAppointmentStatus, fetchItems, deleteItem, 
  formatCurrency, getWhatsAppUrl, BUSINESS_CONFIG 
} from '../services/api';
import ItemFormModal from './ItemFormModal';

export default function AdminDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState('appointments'); // 'appointments' | 'catalog'
  
  // Estados para Citas
  const [appointments, setAppointments] = useState([]);
  const [loadingApp, setLoadingApp] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');

  // Estados para Catálogo
  const [items, setItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [catalogFilter, setCatalogFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);

  // Cargar Citas
  const loadAppointments = async () => {
    setLoadingApp(true);
    try {
      const data = await fetchAppointments(dateFilter || null, statusFilter);
      setAppointments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingApp(false);
    }
  };

  // Cargar Items
  const loadCatalog = async () => {
    setLoadingItems(true);
    try {
      const typeParam = catalogFilter === 'all' ? null : catalogFilter;
      const data = await fetchItems(typeParam, null, false);
      setItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingItems(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'appointments') {
      loadAppointments();
    } else {
      loadCatalog();
    }
  }, [activeTab, statusFilter, dateFilter, catalogFilter]);

  // Cambiar estado de cita
  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      await updateAppointmentStatus(appointmentId, newStatus);
      loadAppointments();
    } catch (err) {
      alert("Error al actualizar estado: " + err.message);
    }
  };

  // Eliminar ítem del catálogo
  const handleDeleteItem = async (itemId, itemName) => {
    if (confirm(`¿Estás segura de eliminar "${itemName}" del catálogo?`)) {
      try {
        await deleteItem(itemId);
        loadCatalog();
      } catch (err) {
        alert("Error al eliminar: " + err.message);
      }
    }
  };

  // Abrir WhatsApp con el cliente de una cita
  const handleContactClient = (appointment) => {
    const msg = `¡Hola ${appointment.client_name}! Te saludamos de ${BUSINESS_CONFIG.brandName} para coordinar tu cita agendada para el día ${appointment.appointment_date} a las ${appointment.appointment_time} hrs.`;
    window.open(getWhatsAppUrl(msg, appointment.client_phone), '_blank');
  };

  // Métricas rápidas
  const pendingCount = appointments.filter(a => a.status === 'pending').length;
  const confirmedCount = appointments.filter(a => a.status === 'confirmed').length;

  return (
    <div className="min-h-screen bg-slate-100/70 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Cabecera del Panel */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-block px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 rounded-full border border-amber-200 mb-2">
              Panel Administrativo Privado
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-extrabold text-slate-900">
              Gestión de Agenda & Catálogo
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Administra las reservas de tus clientas, precios, % IGV y stock de productos en tiempo real.
            </p>
          </div>

          {/* Métricas rápidas y Salir */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-amber-50 border border-amber-200 px-4 py-2 rounded-2xl text-center">
              <span className="text-lg font-bold text-amber-700 block">{pendingCount}</span>
              <span className="text-[10px] uppercase font-bold text-amber-600">Por Confirmar</span>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-2xl text-center">
              <span className="text-lg font-bold text-emerald-700 block">{confirmedCount}</span>
              <span className="text-[10px] uppercase font-bold text-emerald-600">Confirmadas</span>
            </div>
            <button
              onClick={onLogout}
              className="px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-colors"
            >
              Salir a la Web
            </button>
          </div>
        </div>

        {/* Pestañas de Navegación */}
        <div className="flex border-b border-slate-200 space-x-4">
          <button
            onClick={() => setActiveTab('appointments')}
            className={`flex items-center space-x-2 py-3 px-5 text-sm font-bold border-b-2 transition-all ${
              activeTab === 'appointments'
                ? 'border-rose-500 text-rose-600 bg-white rounded-t-2xl shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Agenda de Citas</span>
          </button>

          <button
            onClick={() => setActiveTab('catalog')}
            className={`flex items-center space-x-2 py-3 px-5 text-sm font-bold border-b-2 transition-all ${
              activeTab === 'catalog'
                ? 'border-rose-500 text-rose-600 bg-white rounded-t-2xl shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Catálogo (Servicios & Stock)</span>
          </button>
        </div>

        {/* ===================== TAB 1: CITAS ===================== */}
        {activeTab === 'appointments' && (
          <div className="space-y-6">
            
            {/* Barra de Filtros */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center space-x-2 text-xs font-semibold text-slate-600">
                  <Filter className="w-4 h-4 text-slate-400" />
                  <span>Estado:</span>
                </div>
                {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(st => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`text-xs px-3 py-1.5 rounded-lg font-bold capitalize transition-all ${
                      statusFilter === st
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {st === 'all' ? 'Todas' : st}
                  </button>
                ))}
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-700 focus:outline-none"
                />
                {dateFilter && (
                  <button
                    onClick={() => setDateFilter('')}
                    className="text-xs text-slate-400 hover:text-slate-700 underline"
                  >
                    Limpiar fecha
                  </button>
                )}
                <button
                  onClick={loadAppointments}
                  className="p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100"
                  title="Recargar"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Lista / Tabla de Citas */}
            {loadingApp ? (
              <div className="py-20 text-center text-slate-400 text-xs">Cargando citas...</div>
            ) : appointments.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center text-slate-400 space-y-2">
                <Calendar className="w-10 h-10 mx-auto text-slate-300" />
                <p className="font-semibold text-sm text-slate-600">No hay citas registradas</p>
                <p className="text-xs">Los turnos reservados por las clientas aparecerán aquí.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {appointments.map((app) => (
                  <div
                    key={app.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-shadow space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      {/* Cabecera de la Cita */}
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] font-mono text-slate-400 block">ID #{app.id}</span>
                          <h4 className="font-bold text-slate-900 text-base">{app.client_name}</h4>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          app.status === 'confirmed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : app.status === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : app.status === 'completed'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {app.status}
                        </span>
                      </div>

                      {/* Detalles de fecha y servicio */}
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs space-y-1.5">
                        <div className="flex items-center space-x-2 text-slate-700 font-semibold">
                          <Calendar className="w-3.5 h-3.5 text-rose-500" />
                          <span>{app.appointment_date} &bull; {app.appointment_time} hrs</span>
                        </div>
                        <div className="text-slate-600 font-medium">
                          {app.item?.name || 'Servicio de Pestañas'}
                        </div>
                        {app.item && (
                          <div className="text-slate-500 text-[11px]">
                            Total: <strong>{formatCurrency(app.item.total_price)}</strong> (inc. IGV)
                          </div>
                        )}
                        {app.notes && (
                          <div className="text-[11px] text-slate-500 italic pt-1 border-t border-slate-200">
                            Nota: "{app.notes}"
                          </div>
                        )}
                      </div>

                      {/* Teléfono y WhatsApp */}
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500">Teléfono:</span>
                        <span className="font-mono font-bold text-slate-800">{app.client_phone}</span>
                      </div>
                    </div>

                    {/* Acciones */}
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <button
                        onClick={() => handleContactClient(app)}
                        className="w-full flex items-center justify-center space-x-1.5 text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 py-2 rounded-xl transition-colors border border-emerald-200"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Abrir Chat de WhatsApp</span>
                      </button>

                      <div className="grid grid-cols-3 gap-1.5 text-[11px]">
                        {app.status !== 'confirmed' && (
                          <button
                            onClick={() => handleStatusChange(app.id, 'confirmed')}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white py-1.5 rounded-lg font-bold transition-colors"
                          >
                            Confirmar
                          </button>
                        )}
                        {app.status !== 'completed' && (
                          <button
                            onClick={() => handleStatusChange(app.id, 'completed')}
                            className="bg-blue-600 hover:bg-blue-700 text-white py-1.5 rounded-lg font-bold transition-colors"
                          >
                            Completada
                          </button>
                        )}
                        {app.status !== 'cancelled' && (
                          <button
                            onClick={() => handleStatusChange(app.id, 'cancelled')}
                            className="bg-slate-200 hover:bg-red-100 hover:text-red-700 text-slate-700 py-1.5 rounded-lg font-semibold transition-colors"
                          >
                            Cancelar
                          </button>
                        )}
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ===================== TAB 2: CATÁLOGO CRUD ===================== */}
        {activeTab === 'catalog' && (
          <div className="space-y-6">
            
            {/* Barra Superior con Botón de Nuevo Ítem */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCatalogFilter('all')}
                  className={`text-xs px-3 py-1.5 rounded-lg font-bold ${
                    catalogFilter === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  Todos ({items.length})
                </button>
                <button
                  onClick={() => setCatalogFilter('service')}
                  className={`text-xs px-3 py-1.5 rounded-lg font-bold ${
                    catalogFilter === 'service' ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  Servicios
                </button>
                <button
                  onClick={() => setCatalogFilter('product')}
                  className={`text-xs px-3 py-1.5 rounded-lg font-bold ${
                    catalogFilter === 'product' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  Productos Físicos
                </button>
              </div>

              <button
                onClick={() => { setItemToEdit(null); setModalOpen(true); }}
                className="flex items-center space-x-1.5 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Agregar Nuevo Servicio / Producto</span>
              </button>
            </div>

            {/* Tabla de Items */}
            {loadingItems ? (
              <div className="py-20 text-center text-slate-400 text-xs">Cargando catálogo...</div>
            ) : (
              <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                      <tr>
                        <th className="py-3 px-4">Ítem</th>
                        <th className="py-3 px-4">Tipo / Categoría</th>
                        <th className="py-3 px-4">Precio Base</th>
                        <th className="py-3 px-4">% IGV</th>
                        <th className="py-3 px-4">Total al Cliente</th>
                        <th className="py-3 px-4">Stock / Duración</th>
                        <th className="py-3 px-4">Estado</th>
                        <th className="py-3 px-4 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {items.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center space-x-3">
                              <img
                                src={item.image_url || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=150&q=80'}
                                alt=""
                                className="w-10 h-10 rounded-lg object-cover bg-slate-100"
                              />
                              <div>
                                <span className="font-bold text-slate-900 block text-xs">{item.name}</span>
                                <span className="text-[10px] text-slate-400 line-clamp-1 max-w-xs">{item.description}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase mr-1.5 ${
                              item.type === 'service' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-800'
                            }`}>
                              {item.type}
                            </span>
                            <span className="text-slate-600">{item.category}</span>
                          </td>
                          <td className="py-3.5 px-4 font-mono font-medium text-slate-700">
                            {formatCurrency(item.price)}
                          </td>
                          <td className="py-3.5 px-4 font-mono text-slate-500">
                            {item.igv_percent}%
                          </td>
                          <td className="py-3.5 px-4 font-mono font-bold text-slate-900 font-serif">
                            {formatCurrency(item.total_price)}
                          </td>
                          <td className="py-3.5 px-4">
                            {item.type === 'service' ? (
                              <span className="text-slate-600">{item.duration_minutes || 90} min</span>
                            ) : (
                              <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                                item.stock > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {item.stock} unid.
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`inline-block w-2.5 h-2.5 rounded-full mr-1.5 ${
                              item.is_active ? 'bg-emerald-500' : 'bg-slate-300'
                            }`} />
                            <span className="text-slate-600">{item.is_active ? 'Activo' : 'Oculto'}</span>
                          </td>
                          <td className="py-3.5 px-4 text-right space-x-2">
                            <button
                              onClick={() => { setItemToEdit(item); setModalOpen(true); }}
                              className="p-1.5 text-slate-500 hover:text-rose-600 rounded hover:bg-slate-100"
                              title="Editar"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteItem(item.id, item.name)}
                              className="p-1.5 text-slate-400 hover:text-red-600 rounded hover:bg-slate-100"
                              title="Eliminar"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        )}

        {/* Modal de Crear / Editar Ítem */}
        <ItemFormModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          itemToEdit={itemToEdit}
          onSaved={loadCatalog}
        />

      </div>
    </div>
  );
}

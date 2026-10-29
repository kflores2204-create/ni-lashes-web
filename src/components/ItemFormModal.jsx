import React, { useState, useEffect } from 'react';
import { X, Sparkles, ShoppingBag, Image, DollarSign, Percent, Layers, Check, AlertCircle } from 'lucide-react';
import { createItem, updateItem, formatCurrency } from '../services/api';

export default function ItemFormModal({ isOpen, onClose, itemToEdit, onSaved }) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'service',
    category: 'Extensiones',
    description: '',
    price: 0,
    igv_percent: 18.0,
    stock: 0,
    duration_minutes: 90,
    image_url: '',
    is_active: true
  });

  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    if (itemToEdit) {
      setFormData({
        name: itemToEdit.name || '',
        type: itemToEdit.type || 'service',
        category: itemToEdit.category || 'Extensiones',
        description: itemToEdit.description || '',
        price: itemToEdit.price || 0,
        igv_percent: itemToEdit.igv_percent !== undefined ? itemToEdit.igv_percent : 18.0,
        stock: itemToEdit.stock !== null && itemToEdit.stock !== undefined ? itemToEdit.stock : 0,
        duration_minutes: itemToEdit.duration_minutes || 90,
        image_url: itemToEdit.image_url || '',
        is_active: itemToEdit.is_active !== undefined ? itemToEdit.is_active : true
      });
    } else {
      setFormData({
        name: '',
        type: 'service',
        category: 'Extensiones',
        description: '',
        price: 0,
        igv_percent: 18.0,
        stock: 0,
        duration_minutes: 90,
        image_url: '',
        is_active: true
      });
    }
    setErrorMsg(null);
  }, [itemToEdit, isOpen]);

  if (!isOpen) return null;

  // Cálculos en vivo de IGV y Total
  const calculatedIgv = Number((formData.price * (formData.igv_percent / 100)).toFixed(2));
  const calculatedTotal = Number((Number(formData.price) + calculatedIgv).toFixed(2));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      setErrorMsg("El nombre es obligatorio");
      return;
    }

    setSaving(true);
    setErrorMsg(null);

    try {
      const payload = {
        name: formData.name,
        type: formData.type,
        category: formData.category,
        description: formData.description,
        price: parseFloat(formData.price) || 0,
        igv_percent: parseFloat(formData.igv_percent) || 0,
        stock: formData.type === 'product' ? parseInt(formData.stock) || 0 : null,
        duration_minutes: formData.type === 'service' ? parseInt(formData.duration_minutes) || 60 : null,
        image_url: formData.image_url || null,
        is_active: formData.is_active
      };

      if (itemToEdit) {
        await updateItem(itemToEdit.id, payload);
      } else {
        await createItem(payload);
      }

      onSaved();
      onClose();
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden transform transition-all">
        
        {/* Cabecera */}
        <div className="bg-slate-900 px-6 py-4 text-white flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-rose-400" />
            <h3 className="font-bold text-lg font-serif">
              {itemToEdit ? 'Editar Ítem del Catálogo' : 'Nuevo Servicio o Producto'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Tipo de Ítem (Servicio o Producto) */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: 'service', category: 'Extensiones' })}
              className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center space-x-1.5 transition-all ${
                formData.type === 'service'
                  ? 'bg-rose-50 border-rose-500 text-rose-700 ring-2 ring-rose-200'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Sparkles className="w-4 h-4 text-rose-500" />
              <span>Servicio (Cita)</span>
            </button>

            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: 'product', category: 'Cuidado y Limpieza' })}
              className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center space-x-1.5 transition-all ${
                formData.type === 'product'
                  ? 'bg-slate-900 border-slate-900 text-white ring-2 ring-slate-300'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <ShoppingBag className="w-4 h-4 text-slate-400" />
              <span>Producto Físico</span>
            </button>
          </div>

          {/* Nombre */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Nombre *</label>
            <input
              type="text"
              required
              placeholder="Ej. Extensiones Mega Volumen / Lash Shampoo 60ml"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          {/* Categoría */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Categoría</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              <option value="Extensiones">Extensiones</option>
              <option value="Lifting">Lifting</option>
              <option value="Cejas">Cejas</option>
              <option value="Mantenimiento">Mantenimiento</option>
              <option value="Cuidado y Limpieza">Cuidado y Limpieza</option>
              <option value="Accesorios">Accesorios</option>
              <option value="General">General</option>
            </select>
          </div>

          {/* Fila: Precio Base y % IGV */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center space-x-1">
                <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                <span>Precio Base (S/) *</span>
              </label>
              <input
                type="number"
                step="0.10"
                min="0"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center space-x-1">
                <Percent className="w-3.5 h-3.5 text-slate-400" />
                <span>% de IGV</span>
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                max="100"
                value={formData.igv_percent}
                onChange={(e) => setFormData({ ...formData, igv_percent: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 font-mono"
              />
            </div>
          </div>

          {/* Vista previa en vivo del cálculo de IGV */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs flex justify-between items-center">
            <span className="text-slate-500">IGV calculado (+{formatCurrency(calculatedIgv)})</span>
            <div>
              <span className="text-slate-400 mr-2">Total al cliente:</span>
              <strong className="text-sm font-bold text-slate-900 font-serif">{formatCurrency(calculatedTotal)}</strong>
            </div>
          </div>

          {/* Stock (si es producto) o Duración (si es servicio) */}
          {formData.type === 'product' ? (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center space-x-1">
                <Layers className="w-3.5 h-3.5 text-slate-400" />
                <span>Stock Disponible (Unidades) *</span>
              </label>
              <input
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 font-mono"
              />
            </div>
          ) : (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Duración estimada del turno (Minutos)</label>
              <input
                type="number"
                step="15"
                min="15"
                value={formData.duration_minutes}
                onChange={(e) => setFormData({ ...formData, duration_minutes: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
          )}

          {/* URL de la Fotografía */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center space-x-1">
              <Image className="w-3.5 h-3.5 text-slate-400" />
              <span>URL de Fotografía (Opcional)</span>
            </label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500 font-mono"
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Descripción</label>
            <textarea
              rows="2"
              placeholder="Detalles sobre la técnica o beneficios..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          {/* Estado Activo */}
          <div className="flex items-center space-x-2 pt-1">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="w-4 h-4 text-rose-500 rounded border-slate-300 focus:ring-rose-500"
            />
            <label htmlFor="is_active" className="text-xs font-semibold text-slate-700">
              Visible y disponible en el catálogo
            </label>
          </div>

          {/* Botones */}
          <div className="pt-3 border-t border-slate-100 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-md disabled:opacity-50 transition-all flex items-center space-x-1.5"
            >
              {saving ? 'Guardando...' : (itemToEdit ? 'Actualizar Ítem' : 'Crear Ítem')}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}

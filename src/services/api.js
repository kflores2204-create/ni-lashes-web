const API_BASE_URL = 'http://localhost:8000/api';

// Configuración de WhatsApp y datos oficiales del negocio
export const BUSINESS_CONFIG = {
  brandName: "NI Lashes Studio",
  phone: "51997448945", // WhatsApp oficial (+51 997 448 945)
  displayPhone: "+51 997 448 945",
  igvDefault: 18,
  currency: "S/",
  locationNote: "Atención personalizada previa cita • Lima, Perú",
  hours: "Lunes a Sábado: 09:00 AM - 07:00 PM"
};

// Generador de enlace de WhatsApp
export function getWhatsAppUrl(message, phone = BUSINESS_CONFIG.phone) {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

// Formateador de moneda
export function formatCurrency(amount) {
  return `${BUSINESS_CONFIG.currency} ${Number(amount || 0).toFixed(2)}`;
}

// --- SERVICIOS Y PRODUCTOS ---
export async function fetchItems(type = null, category = null, onlyActive = false) {
  const params = new URLSearchParams();
  if (type) params.append('type', type);
  if (category && category !== 'Todos') params.append('category', category);
  if (onlyActive) params.append('only_active', 'true');

  const res = await fetch(`${API_BASE_URL}/items?${params.toString()}`);
  if (!res.ok) throw new Error('Error al cargar catálogo');
  return res.json();
}

export async function createItem(itemData) {
  const res = await fetch(`${API_BASE_URL}/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(itemData)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Error al crear item');
  }
  return res.json();
}

export async function updateItem(id, itemData) {
  const res = await fetch(`${API_BASE_URL}/items/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(itemData)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Error al actualizar item');
  }
  return res.json();
}

export async function deleteItem(id) {
  const res = await fetch(`${API_BASE_URL}/items/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Error al eliminar item');
  return true;
}

// --- CITAS Y RESERVAS ---
export async function fetchAppointments(date = null, status = null) {
  const params = new URLSearchParams();
  if (date) params.append('date', date);
  if (status && status !== 'all') params.append('status', status);

  const res = await fetch(`${API_BASE_URL}/appointments?${params.toString()}`);
  if (!res.ok) throw new Error('Error al cargar citas');
  return res.json();
}

export async function createAppointment(appointmentData) {
  const res = await fetch(`${API_BASE_URL}/appointments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(appointmentData)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Error al agendar cita');
  }
  return res.json();
}

export async function updateAppointmentStatus(id, newStatus) {
  const res = await fetch(`${API_BASE_URL}/appointments/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: newStatus })
  });
  if (!res.ok) throw new Error('Error al actualizar estado de la cita');
  return res.json();
}

// --- DISPONIBILIDAD ---
export async function fetchAvailability(date) {
  const res = await fetch(`${API_BASE_URL}/availability?date=${date}`);
  if (!res.ok) throw new Error('Error al consultar disponibilidad');
  return res.json();
}

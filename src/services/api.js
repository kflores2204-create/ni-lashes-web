import { supabase, isSupabaseConfigured } from './supabase';

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

// Helper para calcular IGV y Total
function formatItemData(item) {
  const price = Number(item.price || 0);
  const igvPercent = Number(item.igv_percent !== undefined ? item.igv_percent : BUSINESS_CONFIG.igvDefault);
  const igvAmount = Number((price * (igvPercent / 100)).toFixed(2));
  const totalPrice = Number((price + igvAmount).toFixed(2));

  return {
    ...item,
    price,
    igv_percent: igvPercent,
    igv_amount: igvAmount,
    total_price: totalPrice
  };
}

// Bloques horarios estándar de atención
export const STANDARD_SLOTS = ["09:00", "10:30", "12:00", "14:30", "16:00", "17:30", "19:00"];

// --- 1. SERVICIOS Y PRODUCTOS (CATÁLOGO) ---
export async function fetchItems(type = null, category = null, onlyActive = false) {
  // A. Si Supabase está configurado en la nube
  if (isSupabaseConfigured() && supabase) {
    let query = supabase.from('items').select('*');
    if (type) query = query.eq('type', type);
    if (category && category !== 'Todos') query = query.eq('category', category);
    if (onlyActive) query = query.eq('is_active', true);
    
    query = query.order('type', { ascending: false }).order('id', { ascending: true });
    
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return (data || []).map(formatItemData);
  }

  // B. Fallback a Backend local FastAPI
  try {
    const params = new URLSearchParams();
    if (type) params.append('type', type);
    if (category && category !== 'Todos') params.append('category', category);
    if (onlyActive) params.append('only_active', 'true');

    const res = await fetch(`${API_BASE_URL}/items?${params.toString()}`);
    if (res.ok) {
      const data = await res.json();
      return data.map(formatItemData);
    }
  } catch (e) {
    console.warn("Backend local no disponible, cargando datos predeterminados:", e);
  }

  // C. Fallback a catálogo demo offline si no hay backend ni Supabase conectado
  return getFallbackCatalog(type, category);
}

export async function createItem(itemData) {
  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase.from('items').insert([itemData]).select().single();
    if (error) throw new Error(error.message);
    return formatItemData(data);
  }

  const res = await fetch(`${API_BASE_URL}/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(itemData)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Error al crear item');
  }
  return formatItemData(await res.json());
}

export async function updateItem(id, itemData) {
  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase.from('items').update(itemData).eq('id', id).select().single();
    if (error) throw new Error(error.message);
    return formatItemData(data);
  }

  const res = await fetch(`${API_BASE_URL}/items/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(itemData)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Error al actualizar item');
  }
  return formatItemData(await res.json());
}

export async function deleteItem(id) {
  if (isSupabaseConfigured() && supabase) {
    const { error } = await supabase.from('items').delete().eq('id', id);
    if (error) throw new Error(error.message);
    return true;
  }

  const res = await fetch(`${API_BASE_URL}/items/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Error al eliminar item');
  return true;
}

// --- 2. CITAS Y RESERVAS ---
export async function fetchAppointments(date = null, status = null) {
  if (isSupabaseConfigured() && supabase) {
    let query = supabase.from('appointments').select('*, item:items(*)');
    if (date) query = query.eq('appointment_date', date);
    if (status && status !== 'all') query = query.eq('status', status);

    query = query.order('appointment_date', { ascending: true }).order('appointment_time', { ascending: true });
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return (data || []).map(a => ({
      ...a,
      item: a.item ? formatItemData(a.item) : null
    }));
  }

  const params = new URLSearchParams();
  if (date) params.append('date', date);
  if (status && status !== 'all') params.append('status', status);

  const res = await fetch(`${API_BASE_URL}/appointments?${params.toString()}`);
  if (!res.ok) throw new Error('Error al cargar citas');
  const data = await res.json();
  return data.map(a => ({
    ...a,
    item: a.item ? formatItemData(a.item) : null
  }));
}

export async function createAppointment(appointmentData) {
  if (isSupabaseConfigured() && supabase) {
    const payload = {
      ...appointmentData,
      status: 'pending'
    };
    const { data, error } = await supabase.from('appointments').insert([payload]).select().single();
    if (error) throw new Error(error.message);
    return data;
  }

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
  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase.from('appointments').update({ status: newStatus }).eq('id', id).select().single();
    if (error) throw new Error(error.message);
    return data;
  }

  const res = await fetch(`${API_BASE_URL}/appointments/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: newStatus })
  });
  if (!res.ok) throw new Error('Error al actualizar estado de la cita');
  return res.json();
}

// --- 3. DISPONIBILIDAD EN TIEMPO REAL ---
export async function fetchAvailability(targetDateStr) {
  // A. Supabase en la nube
  if (isSupabaseConfigured() && supabase) {
    const d = new Date(targetDateStr + "T00:00:00");
    // Domingo cerrado (0 = Domingo)
    if (d.getDay() === 0) {
      return { date: targetDateStr, is_working_day: false, slots: [] };
    }

    const { data: booked } = await supabase
      .from('appointments')
      .select('appointment_time')
      .eq('appointment_date', targetDateStr)
      .in('status', ['pending', 'confirmed']);

    const bookedTimes = new Set((booked || []).map(b => b.appointment_time));

    const slots = STANDARD_SLOTS.map(time => ({
      time,
      available: !bookedTimes.has(time),
      reason: bookedTimes.has(time) ? "Horario reservado" : null
    }));

    return {
      date: targetDateStr,
      is_working_day: true,
      slots
    };
  }

  // B. Fallback local
  try {
    const res = await fetch(`${API_BASE_URL}/availability?date=${targetDateStr}`);
    if (res.ok) return res.json();
  } catch (e) {
    // Si no hay red, generar slots básicos
  }

  const d = new Date(targetDateStr + "T00:00:00");
  if (d.getDay() === 0) return { date: targetDateStr, is_working_day: false, slots: [] };

  return {
    date: targetDateStr,
    is_working_day: true,
    slots: STANDARD_SLOTS.map(time => ({ time, available: true }))
  };
}

// --- 4. CATÁLOGO DEMO / OFFLINE ---
function getFallbackCatalog(type, category) {
  const fallback = [
    {
      id: 1,
      type: "service",
      name: "Extensiones Clásicas (Efecto Natural)",
      description: "Técnica pelo a pelo 1x1 que aporta longitud y curvatura manteniendo un aspecto sutil y elegante.",
      price: 110.0,
      igv_percent: 18.0,
      stock: null,
      category: "Extensiones",
      duration_minutes: 90,
      image_url: "https://images.unsplash.com/photo-1583001931096-959e9a1a6223?auto=format&fit=crop&w=600&q=80",
      is_active: true
    },
    {
      id: 2,
      type: "service",
      name: "Extensiones Fibras Tecnológicas (Efecto Hawaiana / W)",
      description: "Fibras pre-armadas ultra livianas que aportan densidad y textura con cero peso.",
      price: 140.0,
      igv_percent: 18.0,
      stock: null,
      category: "Extensiones",
      duration_minutes: 105,
      image_url: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80",
      is_active: true
    },
    {
      id: 3,
      type: "service",
      name: "Extensiones Volumen Ruso (Abanicos a Mano)",
      description: "Abanicos artesanales de seda ultra fina para una mirada densa, profunda y glamurosa.",
      price: 160.0,
      igv_percent: 18.0,
      stock: null,
      category: "Extensiones",
      duration_minutes: 120,
      image_url: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=600&q=80",
      is_active: true
    },
    {
      id: 4,
      type: "service",
      name: "Lifting de Pestañas con Keratina & Bótox",
      description: "Curvatura natural desde la raíz, nutrición intensiva y tinte negro brillante.",
      price: 90.0,
      igv_percent: 18.0,
      stock: null,
      category: "Lifting",
      duration_minutes: 60,
      image_url: "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&w=600&q=80",
      is_active: true
    },
    {
      id: 5,
      type: "service",
      name: "Laminado y Planchado de Cejas",
      description: "Alineación y fijación de vellos rebeldes con diseño personalizado según tu rostro.",
      price: 75.0,
      igv_percent: 18.0,
      stock: null,
      category: "Cejas",
      duration_minutes: 45,
      image_url: "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&w=600&q=80",
      is_active: true
    },
    {
      id: 6,
      type: "service",
      name: "Retiro Profesional de Extensiones",
      description: "Remoción segura con crema removedora especial que cuida y protege tu pestaña natural.",
      price: 35.0,
      igv_percent: 18.0,
      stock: null,
      category: "Mantenimiento",
      duration_minutes: 30,
      image_url: "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&w=600&q=80",
      is_active: true
    },
    {
      id: 7,
      type: "product",
      name: "Lash Shampoo Espuma Oil-Free (60ml)",
      description: "Espuma limpiadora hipoalergénica sin aceites formulada para mantener la higiene y retención.",
      price: 35.0,
      igv_percent: 18.0,
      stock: 25,
      category: "Cuidado y Limpieza",
      duration_minutes: null,
      image_url: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80",
      is_active: true
    },
    {
      id: 8,
      type: "product",
      name: "Sérum Fortalecedor con Biotina y Péptidos",
      description: "Estimula el folículo de la pestaña natural haciéndola crecer más gruesa y fuerte.",
      price: 65.0,
      igv_percent: 18.0,
      stock: 15,
      category: "Cuidado y Limpieza",
      duration_minutes: null,
      image_url: "https://images.unsplash.com/photo-1608248597359-52e185c88b77?auto=format&fit=crop&w=600&q=80",
      is_active: true
    },
    {
      id: 9,
      type: "product",
      name: "Cepillo Glitter en Tubo Protector Higiénico",
      description: "Cepillo para peinar tus extensiones a diario, libre de polvo y suciedad en tu cartera.",
      price: 12.0,
      igv_percent: 18.0,
      stock: 50,
      category: "Accesorios",
      duration_minutes: null,
      image_url: "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=600&q=80",
      is_active: true
    },
    {
      id: 10,
      type: "product",
      name: "Antifaz de Seda Cóncavo 3D para Dormir",
      description: "Diseño especial cóncavo que evita que tus extensiones se aplasten durante la noche.",
      price: 28.0,
      igv_percent: 18.0,
      stock: 20,
      category: "Accesorios",
      duration_minutes: null,
      image_url: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80",
      is_active: true
    }
  ];

  let filtered = fallback;
  if (type) filtered = filtered.filter(i => i.type === type);
  if (category && category !== 'Todos') filtered = filtered.filter(i => i.category === category);
  return filtered.map(formatItemData);
}

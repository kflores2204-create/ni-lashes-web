import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, User, Phone, Mail, FileText, CheckCircle, ArrowRight, ArrowLeft, MessageCircle, AlertCircle } from 'lucide-react';
import { fetchItems, fetchAvailability, createAppointment, formatCurrency, getWhatsAppUrl, BUSINESS_CONFIG } from '../services/api';

export default function BookingFlow({ isOpen, onClose, preselectedService }) {
  const [step, setStep] = useState(1);
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(preselectedService || null);

  const getTomorrowDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  const [selectedDate, setSelectedDate] = useState(getTomorrowDate());
  const [availability, setAvailability] = useState(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedTime, setSelectedTime] = useState(null);

  const [formData, setFormData] = useState({
    client_name: '',
    client_phone: '',
    client_email: '',
    notes: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [bookingResult, setBookingResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchItems('service', null, true)
        .then(data => {
          setServices(data);
          if (preselectedService) {
            setSelectedService(preselectedService);
            setStep(2);
          } else if (data.length > 0 && !selectedService) {
            setSelectedService(data[0]);
          }
        })
        .catch(console.error);
    }
  }, [isOpen, preselectedService]);

  useEffect(() => {
    if (selectedDate && isOpen) {
      setLoadingSlots(true);
      setSelectedTime(null);
      fetchAvailability(selectedDate)
        .then(data => setAvailability(data))
        .catch(err => console.error("Error al cargar disponibilidad:", err))
        .finally(() => setLoadingSlots(false));
    }
  }, [selectedDate, isOpen]);

  if (!isOpen) return null;

  const handleNextStep = () => {
    setErrorMsg(null);
    if (step === 1 && !selectedService) {
      setErrorMsg("Por favor selecciona un servicio");
      return;
    }
    if (step === 2 && !selectedTime) {
      setErrorMsg("Por favor elige un turno disponible");
      return;
    }
    setStep(step + 1);
  };

  const handlePrevStep = () => {
    setErrorMsg(null);
    setStep(step - 1);
  };

  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    if (!formData.client_name || !formData.client_phone) {
      setErrorMsg("Nombre y WhatsApp de contacto son obligatorios");
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);

    try {
      const payload = {
        item_id: selectedService.id,
        client_name: formData.client_name,
        client_phone: formData.client_phone,
        client_email: formData.client_email || null,
        appointment_date: selectedDate,
        appointment_time: selectedTime,
        notes: formData.notes || null
      };

      const result = await createAppointment(payload);
      setBookingResult(result);
      setStep(4);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendToWhatsApp = () => {
    if (!bookingResult) return;
    const msg = `¡Hola ${BUSINESS_CONFIG.brandName}! Acabo de registrar mi cita en la web:\n` +
      `✨ *Tratamiento:* ${selectedService.name}\n` +
      `📅 *Fecha:* ${selectedDate}\n` +
      `⏰ *Hora:* ${selectedTime} hrs\n` +
      `👤 *Nombre:* ${formData.client_name}\n` +
      `💰 *Total:* ${formatCurrency(selectedService.total_price)} (inc. IGV)\n\n` +
      `¿Me confirman mi espacio? ¡Muchas gracias!`;
    window.open(getWhatsAppUrl(msg), '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-stone-200 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200">
        
        {/* Cabecera */}
        <div className="bg-stone-900 px-6 py-5 text-white flex justify-between items-center">
          <div>
            <span className="text-[10px] tracking-widest uppercase text-rose-400 font-bold block">
              {BUSINESS_CONFIG.brandName}
            </span>
            <h3 className="font-serif font-bold text-lg">Agendar Cita en Línea</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Pasos */}
        {step < 4 && (
          <div className="grid grid-cols-3 bg-stone-100 text-center text-xs font-semibold">
            <div className={`py-2 border-b-2 ${step >= 1 ? 'border-stone-900 text-stone-900 bg-white' : 'border-transparent text-stone-400'}`}>
              1. Servicio
            </div>
            <div className={`py-2 border-b-2 ${step >= 2 ? 'border-stone-900 text-stone-900 bg-white' : 'border-transparent text-stone-400'}`}>
              2. Fecha & Turno
            </div>
            <div className={`py-2 border-b-2 ${step >= 3 ? 'border-stone-900 text-stone-900 bg-white' : 'border-transparent text-stone-400'}`}>
              3. Datos
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-2 text-xs text-red-700">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="p-6">
          
          {/* PASO 1 */}
          {step === 1 && (
            <div className="space-y-4">
              <h4 className="font-bold text-stone-800 text-xs uppercase tracking-wider">Elige tu tratamiento de pestañas:</h4>
              <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                {services.map((svc) => (
                  <div
                    key={svc.id}
                    onClick={() => setSelectedService(svc)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                      selectedService?.id === svc.id
                        ? 'border-stone-900 bg-stone-50 ring-2 ring-stone-300 shadow-xs'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="font-bold text-stone-900 text-xs sm:text-sm font-serif">{svc.name}</div>
                      <div className="text-[11px] text-stone-500 flex items-center space-x-2">
                        <span>{svc.category}</span>
                        <span>&bull;</span>
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3 h-3 text-stone-400" />
                          <span>{svc.duration_minutes || 90} min</span>
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-stone-900 text-sm font-serif">
                        {formatCurrency(svc.total_price)}
                      </div>
                      <div className="text-[10px] text-stone-400">inc. IGV</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PASO 2 */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex justify-between items-center text-xs">
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase font-bold">Tratamiento:</span>
                  <span className="font-bold text-stone-800">{selectedService?.name}</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-stone-900 font-serif">{formatCurrency(selectedService?.total_price)}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5 flex items-center space-x-1.5">
                  <Calendar className="w-3.5 h-3.5 text-stone-600" />
                  <span>Día de atención:</span>
                </label>
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-2 flex items-center space-x-1.5">
                  <Clock className="w-3.5 h-3.5 text-stone-600" />
                  <span>Turnos disponibles ({selectedDate}):</span>
                </label>

                {loadingSlots ? (
                  <div className="py-6 text-center text-xs text-stone-400">Consultando disponibilidad...</div>
                ) : availability && !availability.is_working_day ? (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-center text-amber-800 text-xs font-medium">
                    Atención de Lunes a Sábado. Domingos cerrado.
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {availability?.slots.map((slot) => (
                      <button
                        key={slot.time}
                        disabled={!slot.available}
                        onClick={() => setSelectedTime(slot.time)}
                        className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                          selectedTime === slot.time
                            ? 'bg-stone-900 text-white border-stone-900 shadow-md ring-2 ring-stone-300'
                            : slot.available
                            ? 'bg-white text-stone-800 border-stone-200 hover:border-stone-500 hover:bg-stone-50'
                            : 'bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed opacity-50'
                        }`}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* PASO 3 */}
          {step === 3 && (
            <form onSubmit={handleSubmitBooking} className="space-y-4">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-1">
                <div className="font-bold text-stone-900">{selectedService?.name}</div>
                <div className="text-stone-600 flex items-center space-x-3">
                  <span>📅 {selectedDate}</span>
                  <span>⏰ {selectedTime} hrs</span>
                  <span>💰 {formatCurrency(selectedService?.total_price)}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1 flex items-center space-x-1">
                  <User className="w-3.5 h-3.5 text-stone-400" />
                  <span>Nombre completo *</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Camila Morales"
                  value={formData.client_name}
                  onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1 flex items-center space-x-1">
                  <Phone className="w-3.5 h-3.5 text-stone-400" />
                  <span>WhatsApp de contacto *</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Ej. 997448945"
                  value={formData.client_phone}
                  onChange={(e) => setFormData({ ...formData, client_phone: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1 flex items-center space-x-1">
                  <Mail className="w-3.5 h-3.5 text-stone-400" />
                  <span>Correo electrónico (Opcional)</span>
                </label>
                <input
                  type="email"
                  placeholder="camila@gmail.com"
                  value={formData.client_email}
                  onChange={(e) => setFormData({ ...formData, client_email: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1 flex items-center space-x-1">
                  <FileText className="w-3.5 h-3.5 text-stone-400" />
                  <span>Notas especiales (ej. ¿Traes pestañas de otro centro?)</span>
                </label>
                <textarea
                  rows="2"
                  placeholder="Comentarios adicionales..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-stone-900"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-stone-900 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:bg-stone-800 transition-all disabled:opacity-50"
                >
                  {submitting ? 'Registrando Cita...' : 'Confirmar Reserva'}
                </button>
              </div>
            </form>
          )}

          {/* PASO 4: ÉXITO */}
          {step === 4 && (
            <div className="text-center py-4 space-y-5">
              <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                <CheckCircle className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h4 className="text-lg font-bold font-serif text-stone-900">¡Tu cita ha sido pre-agendada!</h4>
                <p className="text-xs text-stone-500">
                  Reserva registrada con código #{bookingResult?.id} en {BUSINESS_CONFIG.brandName}.
                </p>
              </div>

              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-stone-500">Tratamiento:</span>
                  <span className="font-bold text-stone-800">{selectedService?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Fecha y Hora:</span>
                  <span className="font-bold text-stone-800">{selectedDate} a las {selectedTime} hrs</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Clienta:</span>
                  <span className="font-bold text-stone-800">{formData.client_name}</span>
                </div>
                <div className="flex justify-between border-t border-stone-200 pt-2">
                  <span className="font-bold text-stone-700">Total a pagar en sesión:</span>
                  <span className="font-bold text-stone-900 font-serif">{formatCurrency(selectedService?.total_price)}</span>
                </div>
              </div>

              <div className="space-y-2.5 pt-2">
                <button
                  onClick={handleSendToWhatsApp}
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-emerald-200 flex items-center justify-center space-x-2 transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Confirmar vía WhatsApp (+51 997 448 945)</span>
                </button>

                <button
                  onClick={onClose}
                  className="w-full py-2 text-xs text-stone-500 hover:text-stone-800 font-medium"
                >
                  Cerrar
                </button>
              </div>
            </div>
          )}

        </div>

        {step < 4 && (
          <div className="bg-stone-50 px-6 py-4 border-t border-stone-200 flex justify-between items-center">
            {step > 1 ? (
              <button
                type="button"
                onClick={handlePrevStep}
                className="flex items-center space-x-1 text-xs font-semibold text-stone-600 hover:text-stone-900"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Atrás</span>
              </button>
            ) : <div />}

            {step < 3 && (
              <button
                type="button"
                onClick={handleNextStep}
                className="flex items-center space-x-1.5 px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-xl transition-all"
              >
                <span>Continuar</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

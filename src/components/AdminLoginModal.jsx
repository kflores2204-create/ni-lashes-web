import React, { useState } from 'react';
import { Lock, KeyRound, X, AlertCircle } from 'lucide-react';
import { BUSINESS_CONFIG } from '../services/api';

export default function AdminLoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  // PIN por defecto (el usuario puede cambiarlo fácilmente)
  const ADMIN_PIN = "1234";

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pin.trim() === ADMIN_PIN) {
      sessionStorage.setItem('ni_lashes_admin_auth', 'true');
      setError(false);
      setPin('');
      onLoginSuccess();
      onClose();
    } else {
      setError(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-stone-900 px-6 py-5 text-white flex justify-between items-center">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-rose-500/20 border border-rose-400/40 flex items-center justify-center">
              <Lock className="w-4 h-4 text-rose-300" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm tracking-wide">Acceso Administrativo</h3>
              <p className="text-[10px] text-stone-400">{BUSINESS_CONFIG.brandName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-stone-300 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Formulario de PIN */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="text-center space-y-1">
            <p className="text-xs text-stone-600">
              Ingresa el código PIN de seguridad para acceder a la gestión de citas y catálogo.
            </p>
          </div>

          <div>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              <input
                type="password"
                maxLength={8}
                autoFocus
                placeholder="Ingresa tu PIN (Por defecto: 1234)"
                value={pin}
                onChange={(e) => { setPin(e.target.value); setError(false); }}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 text-center text-sm font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-stone-900"
              />
            </div>
            {error && (
              <div className="flex items-center space-x-1.5 text-xs text-red-600 mt-2 justify-center">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>PIN incorrecto. Inténtalo de nuevo.</span>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs rounded-xl shadow-md transition-all uppercase tracking-wider"
          >
            Ingresar al Panel
          </button>

          <p className="text-[10px] text-center text-stone-400">
            Tip: El PIN inicial es <strong className="font-mono text-stone-600">1234</strong>
          </p>
        </form>

      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { X } from 'lucide-react';

export default function LoginModal({ onClose, onSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      await login(email, password);
      onSuccess();
    } catch (err) {
      setError('Credenciales incorrectas o error de red.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md relative shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Acceso Profesionales</h2>
        <p className="text-slate-500 mb-6 text-sm">Introduce tus credenciales para acceder a los expedientes.</p>
        
        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-900"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Contraseña</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-900"
            />
          </div>
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition mt-4">
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}

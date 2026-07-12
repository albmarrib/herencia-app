import React, { useState } from 'react';
import { Shield, Lock, FileText, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import LoginModal from './LoginModal';

export default function LandingPage({ onEnter }) {
  const { currentUser } = useAuth();
  const [showLogin, setShowLogin] = useState(false);

  const handleAction = () => {
    if (currentUser) {
      onEnter();
    } else {
      setShowLogin(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col font-sans text-white relative overflow-hidden">
      {/* Imagen de fondo generada por IA */}
      <div 
        className="absolute inset-0 z-0 opacity-40 bg-cover bg-center"
        style={{ backgroundImage: 'url(/landing-bg.png)' }}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-slate-900/30" />

      {/* Header */}
      <header className="relative z-10 px-8 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-white text-slate-900 p-2 rounded-lg">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Legado<span className="font-light">App</span></h1>
        </div>
        <button 
          onClick={handleAction}
          className="text-sm font-medium hover:text-blue-300 transition"
        >
          Acceso Profesionales
        </button>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center">
        <h2 className="text-5xl md:text-7xl font-black tracking-tight mb-6 max-w-4xl">
          Gestión Sucesoria <br/> <span className="text-blue-400">Transparente y Rigurosa</span>
        </h2>
        <p className="text-lg md:text-xl text-slate-300 max-w-2xl mb-12 font-light leading-relaxed">
          Una plataforma profesional diseñada para documentar, administrar y calcular expedientes de herencia con precisión notarial.
        </p>
        
        <button 
          onClick={handleAction}
          className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-full font-bold text-lg flex items-center gap-3 transition-transform hover:scale-105 shadow-xl shadow-blue-900/50"
        >
          Ir a mis Expedientes
          <ArrowRight className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 text-left max-w-5xl">
          <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-700/50">
            <FileText className="w-8 h-8 text-blue-400 mb-4" />
            <h3 className="font-bold text-lg mb-2">Bóveda Documental</h3>
            <p className="text-slate-400 text-sm">Control exhaustivo de la documentación legal necesaria para cada caso con flujos de validación.</p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-700/50">
            <Shield className="w-8 h-8 text-blue-400 mb-4" />
            <h3 className="font-bold text-lg mb-2">Inventario Preciso</h3>
            <p className="text-slate-400 text-sm">Cálculo en tiempo real de la Masa Hereditaria Neta equilibrando el activo y el pasivo del causante.</p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-700/50">
            <Lock className="w-8 h-8 text-blue-400 mb-4" />
            <h3 className="font-bold text-lg mb-2">Reparto Matemático</h3>
            <p className="text-slate-400 text-sm">Adjudicaciones automáticas basadas en cuotas y derecho de representación debidamente trazado.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-6 text-center text-slate-500 text-xs">
        &copy; {new Date().getFullYear()} LegadoApp. Software para la gestión de patrimonios y sucesiones.
      </footer>

      {showLogin && (
        <LoginModal 
          onClose={() => setShowLogin(false)} 
          onSuccess={() => {
            setShowLogin(false);
            onEnter();
          }} 
        />
      )}
    </div>
  );
}

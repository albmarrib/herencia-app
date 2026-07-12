import React, { useState } from 'react';
import { ExpedienteProvider } from '../context/ExpedienteContext';
import { SuccessionProvider } from '../context/SuccessionContext';
import SuccessionTree from './Succession/SuccessionTree';
import CalculationSummary from './Succession/CalculationSummary';
import InventoryManager from './Inventory/InventoryManager';
import ExpedienteView from './Expediente/ExpedienteView';
import NotarySummary from './Export/NotarySummary';
import { BookOpen, ChevronLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ExpedienteDashboard({ expediente, onBack }) {
  const [activeTab, setActiveTab] = useState('expediente');
  const { currentUser } = useAuth();
  
  const isFerrer = currentUser?.email === 'josep@ferrer-assessoria.com';

  return (
    // Se usa la key con el ID del expediente para asegurar que los contextos se reinician 
    // al cambiar de expediente (aunque estemos usando mock data, es buena práctica)
    <ExpedienteProvider key={`exp-${expediente.id}`} expedienteId={expediente.id}>
      <SuccessionProvider key={`suc-${expediente.id}`} expedienteId={expediente.id}>
        <div className="min-h-screen font-sans text-slate-900 bg-slate-50 relative">
          {/* Fondo Premium - Imagen */}
          <div className="fixed inset-0 pointer-events-none z-0 print:hidden overflow-hidden">
            <div className="absolute inset-0 bg-[url('/app-bg.png')] bg-cover bg-center bg-no-repeat opacity-60"></div>
            <div className="absolute inset-0 bg-slate-50/60 backdrop-blur-[1px]"></div>
          </div>

          {/* Contenido principal con z-10 para estar sobre el fondo */}
          <div className="relative z-10">
          <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-6 py-4 flex items-center justify-between sticky top-0 z-20 print:hidden">
            <div className="flex items-center gap-4">
              <button 
                onClick={onBack}
                className="text-slate-400 hover:text-slate-800 p-2 rounded-lg hover:bg-slate-100 transition mr-2"
                title="Volver a mis expedientes"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              {isFerrer ? (
                <div className="mr-4">
                  <img src="/ferrer-logo.png" alt="Ferrer Assessoria" className="h-28 object-contain" />
                </div>
              ) : (
                <div className="flex items-center gap-2 mr-4">
                  <div className="bg-slate-900 text-white p-2 rounded-lg">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <h1 className="text-xl font-bold tracking-tight text-slate-800">
                    Legado<span className="font-light">App</span>
                  </h1>
                </div>
              )}
              
              <div className="pl-4 border-l border-slate-200">
                <p className="text-xs text-slate-500 font-medium">Exp: {expediente.nombreCausante}</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <button 
                onClick={() => setActiveTab('expediente')}
                className={`text-sm font-medium transition px-3 py-1 rounded-md ${activeTab === 'expediente' ? 'text-blue-700 bg-blue-50' : 'text-slate-500 hover:text-slate-900'}`}
              >
                Expediente
              </button>
              <button 
                onClick={() => setActiveTab('inventario')}
                className={`text-sm font-medium transition px-3 py-1 rounded-md ${activeTab === 'inventario' ? 'text-blue-700 bg-blue-50' : 'text-slate-500 hover:text-slate-900'}`}
              >
                Inventario
              </button>
              <button 
                onClick={() => setActiveTab('sucesion')}
                className={`text-sm font-medium transition px-3 py-1 rounded-md ${activeTab === 'sucesion' ? 'text-blue-700 bg-blue-50' : 'text-slate-500 hover:text-slate-900'}`}
              >
                Sucesión
              </button>
              <button 
                onClick={() => setActiveTab('notario')}
                className={`text-sm font-medium transition px-4 py-1.5 rounded-md shadow-sm ${activeTab === 'notario' ? 'bg-slate-900 text-white shadow-inner' : 'bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white'}`}
              >
                Vista Notaría
              </button>
            </div>
          </nav>

          <main className={`max-w-7xl mx-auto py-8 ${activeTab === 'notario' ? 'px-0' : 'px-6'}`}>
            {activeTab === 'expediente' && (
              <ExpedienteView expediente={expediente} onBack={onBack} />
            )}

            {activeTab === 'inventario' && (
              <>
                <div className="mb-8 print:hidden">
                  <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Inventario (Caudal Relicto)</h2>
                  <p className="text-slate-500 mt-2 text-lg">Añade los bienes y deudas para calcular la Masa Hereditaria Neta a repartir.</p>
                </div>
                <InventoryManager />
              </>
            )}

            {activeTab === 'sucesion' && (
              <>
                <div className="mb-8">
                  <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Módulo de Sucesión</h2>
                  <p className="text-slate-500 mt-2 text-lg">Define el árbol de herederos y calcula el reparto del caudal relicto de forma automática.</p>
                </div>
                <div className="flex flex-col lg:flex-row gap-8 items-start">
                  <SuccessionTree />
                  <CalculationSummary />
                </div>
              </>
            )}

            {activeTab === 'notario' && (
              <NotarySummary expediente={expediente} />
            )}
          </main>
          </div>
        </div>
      </SuccessionProvider>
    </ExpedienteProvider>
  );
}

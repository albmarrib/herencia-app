import React, { useState } from 'react';
import { useSuccession } from '../../context/SuccessionContext';
import { Wallet, Landmark, TrendingDown, Plus, Trash2 } from 'lucide-react';

export default function InventoryManager() {
  const { bienes, deudas, addBien, removeBien, addDeuda, removeDeuda, masaHereditaria } = useSuccession();
  const [nuevoBien, setNuevoBien] = useState({ concepto: '', valor: '' });
  const [nuevaDeuda, setNuevaDeuda] = useState({ concepto: '', valor: '' });

  const formatter = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' });

  const handleAddBien = (e) => {
    e.preventDefault();
    if (nuevoBien.concepto && nuevoBien.valor) {
      addBien({ ...nuevoBien, valor: Number(nuevoBien.valor), id: Date.now().toString() });
      setNuevoBien({ concepto: '', valor: '' });
    }
  };

  const handleAddDeuda = (e) => {
    e.preventDefault();
    if (nuevaDeuda.concepto && nuevaDeuda.valor) {
      addDeuda({ ...nuevaDeuda, valor: Number(nuevaDeuda.valor), id: Date.now().toString() });
      setNuevaDeuda({ concepto: '', valor: '' });
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Columna Izquierda: Listados */}
      <div className="flex-1 space-y-8">
        
        {/* Sección Bienes */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-emerald-100 p-2 rounded-lg">
              <Landmark className="text-emerald-600 w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Inventario de Bienes</h2>
              <p className="text-sm text-slate-500">Inmuebles, cuentas bancarias, vehículos, etc.</p>
            </div>
          </div>

          <form onSubmit={handleAddBien} className="flex gap-3 mb-6">
            <input 
              type="text" 
              placeholder="Concepto (ej. Piso en Madrid)" 
              className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
              value={nuevoBien.concepto}
              onChange={(e) => setNuevoBien({...nuevoBien, concepto: e.target.value})}
            />
            <input 
              type="number" 
              placeholder="Valor €" 
              className="w-32 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
              value={nuevoBien.valor}
              onChange={(e) => setNuevoBien({...nuevoBien, valor: e.target.value})}
            />
            <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-lg transition-colors">
              <Plus className="w-5 h-5" />
            </button>
          </form>

          <div className="space-y-3">
            {bienes.length === 0 ? (
              <p className="text-sm text-slate-400 italic text-center py-4">No hay bienes registrados.</p>
            ) : (
              bienes.map(b => (
                <div key={b.id} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-lg group">
                  <span className="font-medium text-slate-700">{b.concepto}</span>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-emerald-600">{formatter.format(b.valor)}</span>
                    <button onClick={() => removeBien(b.id)} className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Sección Deudas */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-red-100 p-2 rounded-lg">
              <TrendingDown className="text-red-600 w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Cargas y Deudas</h2>
              <p className="text-sm text-slate-500">Hipotecas pendientes, préstamos, gastos deducibles.</p>
            </div>
          </div>

          <form onSubmit={handleAddDeuda} className="flex gap-3 mb-6">
            <input 
              type="text" 
              placeholder="Concepto (ej. Hipoteca pendiente)" 
              className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-red-500 outline-none"
              value={nuevaDeuda.concepto}
              onChange={(e) => setNuevaDeuda({...nuevaDeuda, concepto: e.target.value})}
            />
            <input 
              type="number" 
              placeholder="Valor €" 
              className="w-32 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-red-500 outline-none"
              value={nuevaDeuda.valor}
              onChange={(e) => setNuevaDeuda({...nuevaDeuda, valor: e.target.value})}
            />
            <button type="submit" className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors">
              <Plus className="w-5 h-5" />
            </button>
          </form>

          <div className="space-y-3">
            {deudas.length === 0 ? (
              <p className="text-sm text-slate-400 italic text-center py-4">No hay deudas registradas.</p>
            ) : (
              deudas.map(d => (
                <div key={d.id} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-lg group">
                  <span className="font-medium text-slate-700">{d.concepto}</span>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-red-600">-{formatter.format(d.valor)}</span>
                    <button onClick={() => removeDeuda(d.id)} className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Columna Derecha: Resumen */}
      <div className="w-full lg:w-96">
        <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-lg sticky top-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-500/20 p-2 rounded-lg">
              <Wallet className="text-blue-400 w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold">Caudal Relicto</h2>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-400">Total Bienes (+)</span>
              <span className="font-semibold text-emerald-400">
                {formatter.format(bienes.reduce((acc, b) => acc + b.valor, 0))}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-400">Total Deudas (-)</span>
              <span className="font-semibold text-red-400">
                {formatter.format(deudas.reduce((acc, d) => acc + d.valor, 0))}
              </span>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-700">
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block mb-1">Masa Hereditaria Neta</span>
            <div className="text-3xl font-black text-white">
              {formatter.format(masaHereditaria)}
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
            <p className="text-xs text-blue-300 leading-relaxed">
              Este es el valor total que se distribuirá automáticamente en el módulo de <strong>Sucesión</strong> basándose en las cuotas de los herederos.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

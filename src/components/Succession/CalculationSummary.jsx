import React from 'react';
import { useSuccession } from '../../context/SuccessionContext';
import { Calculator, PieChart, Coins } from 'lucide-react';

export default function CalculationSummary() {
  const { calculos, masaHereditaria } = useSuccession();

  const formatter = new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  });

  return (
    <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-lg w-full lg:w-96 flex flex-col h-fit sticky top-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-blue-500/20 p-2 rounded-lg">
          <Calculator className="text-blue-400 w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold">Resultados del Reparto</h2>
      </div>

      <div className="bg-slate-800 rounded-xl p-4 mb-6 border border-slate-700">
        <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Masa Hereditaria a Distribuir</span>
        <div className="text-3xl font-black text-white mt-1">
          {formatter.format(masaHereditaria)}
        </div>
      </div>

      <div className="flex-1">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <PieChart className="w-4 h-4" />
          Cuotas Finales Adjudicadas
        </h3>

        <div className="space-y-3">
          {calculos.length === 0 ? (
            <p className="text-sm text-slate-500 italic">No hay adjudicaciones activas.</p>
          ) : (
            calculos.map((c) => (
              <div key={c.id} className="bg-slate-800 p-3 rounded-xl border border-slate-700/50 flex flex-col gap-2">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-semibold text-sm text-slate-200 block">{c.nombre}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 inline-block ${c.tipo === 'Principal' ? 'bg-blue-500/20 text-blue-300' : 'bg-amber-500/20 text-amber-300'}`}>
                      {c.tipo} {c.ramaOriginal ? `(de ${c.ramaOriginal})` : ''}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-emerald-400 block">{formatter.format(c.importe)}</span>
                    <span className="text-xs text-slate-400">{c.cuotaPorcentaje.toFixed(2)}%</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      <div className="mt-6 pt-6 border-t border-slate-700 flex justify-between items-center text-sm">
        <span className="text-slate-400">Total Adjudicado</span>
        <span className="font-bold text-white">
          {formatter.format(calculos.reduce((acc, curr) => acc + curr.importe, 0))}
        </span>
      </div>
    </div>
  );
}

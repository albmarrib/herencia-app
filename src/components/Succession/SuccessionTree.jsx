import React from 'react';
import { useSuccession } from '../../context/SuccessionContext';
import { Users, UserMinus, Plus, Trash2, Edit3, CheckCircle2, UserPlus } from 'lucide-react';

export default function SuccessionTree() {
  const { 
    masaHereditaria, 
    herederos, updateHeredero, 
    addHerederoPrincipal, removeHerederoPrincipal,
    addDescendiente, removeDescendiente, updateDescendiente
  } = useSuccession();

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex-1">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Users className="text-primary w-6 h-6" />
            Árbol de Sucesión
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Configura los herederos principales y su descendencia en caso de premoriencia.
          </p>
        </div>
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex flex-col items-end shadow-sm">
          <span className="text-xs text-blue-600 font-bold uppercase tracking-wider mb-1">Masa Hereditaria Neta</span>
          <div className="flex items-center gap-1">
            <span className="text-2xl font-black text-blue-900">
              {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(masaHereditaria)}
            </span>
          </div>
          <span className="text-[10px] text-blue-500 mt-1">Calculada desde el Inventario</span>
        </div>
      </div>

      <div className="space-y-6">
        {herederos.map((h, index) => (
          <div key={h.id} className="border border-slate-200 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-md">
            {/* Header del Heredero */}
            <div className={`p-4 flex items-center justify-between ${h.estado === 'vivo' ? 'bg-slate-50' : 'bg-slate-100 border-b border-slate-200'}`}>
              <div className="flex items-center gap-4">
                <div className="bg-white w-10 h-10 rounded-full flex items-center justify-center shadow-sm text-slate-400 font-bold border border-slate-200 shrink-0">
                  {index + 1}
                </div>
                <div>
                  <button 
                    onClick={() => {
                      const val = window.prompt("Editar nombre:", h.nombre);
                      if (val) updateHeredero(h.id, 'nombre', val);
                    }}
                    className="font-semibold text-slate-800 text-lg hover:text-blue-600 transition text-left"
                  >
                    {h.nombre}
                  </button>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-slate-500 font-medium">Heredero Principal ({index + 1}/{herederos.length}) •</span>
                    <button 
                      onClick={() => {
                        const val = window.prompt("Editar DNI:", h.dni);
                        if (val !== null) updateHeredero(h.id, 'dni', val);
                      }}
                      className="text-xs text-slate-500 font-medium hover:text-blue-600 transition text-left"
                    >
                      DNI: {h.dni || 'Sin especificar'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-2 bg-white rounded-lg p-1 border border-slate-200 shadow-sm">
                  <button
                    onClick={() => updateHeredero(h.id, 'estado', 'vivo')}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5 ${h.estado === 'vivo' ? 'bg-green-100 text-green-700 shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
                  >
                    <CheckCircle2 className="w-4 h-4" /> Vivo
                  </button>
                  <button
                    onClick={() => updateHeredero(h.id, 'estado', 'fallecido_renuncia')}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5 ${h.estado === 'fallecido_renuncia' ? 'bg-amber-100 text-amber-700 shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
                  >
                    <UserMinus className="w-4 h-4" /> Fallecido / Renuncia
                  </button>
                </div>
                <button 
                  onClick={() => removeHerederoPrincipal(h.id)}
                  className="p-2 text-slate-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                  title="Eliminar Heredero"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Descendientes (Hereus Reals) */}
            {h.estado === 'fallecido_renuncia' && (
              <div className="p-5 bg-white border-l-4 border-amber-300 ml-6 mr-6 mb-6 mt-4 rounded-r-xl shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <Users className="w-4 h-4 text-amber-500" />
                    Descendientes por Derecho de Representación
                  </h4>
                  <button 
                    onClick={() => addDescendiente(h.id)}
                    className="text-xs bg-amber-50 hover:bg-amber-100 text-amber-700 px-3 py-1.5 rounded-full font-semibold transition flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Añadir Descendiente
                  </button>
                </div>
                
                {h.descendientes.length === 0 ? (
                  <p className="text-sm text-slate-400 italic">No hay descendientes asignados. La cuota no se distribuirá.</p>
                ) : (
                  <div className="space-y-2">
                    {h.descendientes.map((d, dIndex) => (
                      <div key={d.id} className="flex items-center justify-between bg-slate-50 p-2.5 rounded-lg border border-slate-100 group">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-bold">
                            {String.fromCharCode(97 + dIndex)}
                          </div>
                          <div className="flex flex-col items-start">
                            <button 
                              onClick={() => {
                                const val = window.prompt("Editar nombre:", d.nombre);
                                if (val) updateDescendiente(h.id, d.id, 'nombre', val);
                              }}
                              className="text-sm font-medium text-slate-700 hover:text-blue-600 transition text-left"
                            >
                              {d.nombre}
                            </button>
                            <button 
                              onClick={() => {
                                const val = window.prompt("Editar DNI:", d.dni);
                                if (val !== null) updateDescendiente(h.id, d.id, 'dni', val);
                              }}
                              className="text-xs text-slate-500 hover:text-blue-600 transition mt-0.5 text-left"
                            >
                              DNI: {d.dni || 'Sin especificar'}
                            </button>
                          </div>
                        </div>
                        <button 
                          onClick={() => removeDescendiente(h.id, d.id)}
                          className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
        
        <button 
          onClick={addHerederoPrincipal}
          className="w-full py-4 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 font-semibold hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2"
        >
          <UserPlus className="w-5 h-5" /> Añadir Heredero Principal
        </button>
      </div>
    </div>
  );
}

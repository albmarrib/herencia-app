import React, { useState } from 'react';
import { useExpediente } from '../../context/ExpedienteContext';
import { CheckCircle2, Clock, PlayCircle, Users, Plus, Trash2, Edit3, X } from 'lucide-react';

export default function TaskManager() {
  const { tareas, toggleEstadoTarea, addTarea, deleteTarea, updateTarea } = useExpediente();
  
  const [filter, setFilter] = useState('todas'); 
  const [nuevaTarea, setNuevaTarea] = useState({ titulo: '', responsable: '', fecha_limite: '' });
  const [editingTask, setEditingTask] = useState(null);

  const tareasFiltradas = tareas.filter(t => filter === 'todas' || t.estado === filter);

  const handleAdd = (e) => {
    e.preventDefault();
    if (nuevaTarea.titulo) {
      addTarea({
        titulo: nuevaTarea.titulo,
        responsable: nuevaTarea.responsable || 'Yo',
        fecha_limite: nuevaTarea.fecha_limite
      });
      setNuevaTarea({ titulo: '', responsable: '', fecha_limite: '' });
    }
  };

  const getStatusIcon = (estado) => {
    switch(estado) {
      case 'completada': return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case 'en_progreso': return <PlayCircle className="w-5 h-5 text-blue-500" />;
      default: return <Clock className="w-5 h-5 text-amber-500" />;
    }
  };

  const getStatusText = (estado) => {
    switch(estado) {
      case 'completada': return 'Completada';
      case 'en_progreso': return 'En Progreso';
      default: return 'Pendiente';
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full lg:w-1/2">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="text-primary w-6 h-6" />
          <h2 className="text-xl font-bold text-slate-800">Gestión de Tareas</h2>
        </div>
        
        {/* Filtros */}
        <div className="flex bg-slate-100 p-1 rounded-lg">
          {['todas', 'pendiente', 'en_progreso', 'completada'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-md text-xs font-semibold capitalize transition-colors ${filter === f ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              {f.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
        <form onSubmit={handleAdd} className="flex flex-col gap-3 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
          <input 
            type="text" 
            placeholder="Nueva tarea (ej. Pedir certificado al registro)" 
            className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400"
            value={nuevaTarea.titulo}
            onChange={e => setNuevaTarea({...nuevaTarea, titulo: e.target.value})}
          />
          <div className="flex gap-3">
            <input 
              type="text" 
              placeholder="Asignar a... (ej. Yo, carlos@email.com)" 
              className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400"
              value={nuevaTarea.responsable}
              onChange={e => setNuevaTarea({...nuevaTarea, responsable: e.target.value})}
            />
            <input 
              type="date" 
              className="w-40 bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400"
              value={nuevaTarea.fecha_limite}
              onChange={e => setNuevaTarea({...nuevaTarea, fecha_limite: e.target.value})}
            />
            <button type="submit" className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition">
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </form>

        <div className="space-y-3">
          {tareasFiltradas.length === 0 ? (
            <p className="text-sm text-slate-400 italic text-center py-4">No se encontraron tareas.</p>
          ) : (
            tareasFiltradas.map(t => (
              <div key={t.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-white border border-slate-200 shadow-sm rounded-xl group hover:border-blue-200 transition-colors">
                <div className="flex flex-col mb-2 sm:mb-0 flex-1 mr-4 cursor-pointer" onClick={() => setEditingTask(t)}>
                  <span className={`font-medium ${t.estado === 'completada' ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                    {t.titulo}
                  </span>
                  <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                    <span className="flex items-center gap-1 font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full overflow-hidden">
                      <Users className="w-3 h-3 shrink-0" /> 
                      {t.responsable || 'Sin asignar'}
                    </span>
                    <span className="flex items-center gap-1">
                      Límite: {t.fecha_limite || 'Sin fecha'}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-end gap-2">
                  <button 
                    onClick={() => toggleEstadoTarea(t.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
                  >
                    {getStatusIcon(t.estado)}
                    <span className="text-xs font-semibold text-slate-600">{getStatusText(t.estado)}</span>
                  </button>
                  <button 
                    onClick={() => setEditingTask(t)}
                    className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => deleteTarea(t.id)}
                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal de Edición */}
      {editingTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-slate-800">Editar Tarea</h3>
              <button onClick={() => setEditingTask(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Título de la Tarea</label>
                <input 
                  type="text"
                  value={editingTask.titulo}
                  onChange={e => setEditingTask({...editingTask, titulo: e.target.value})}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Asignada a</label>
                <input 
                  type="text"
                  value={editingTask.responsable}
                  onChange={e => setEditingTask({...editingTask, responsable: e.target.value})}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Fecha Límite</label>
                <input 
                  type="date"
                  value={editingTask.fecha_limite}
                  onChange={e => setEditingTask({...editingTask, fecha_limite: e.target.value})}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <button 
                onClick={() => {
                  updateTarea(editingTask.id, 'titulo', editingTask.titulo);
                  updateTarea(editingTask.id, 'responsable', editingTask.responsable);
                  updateTarea(editingTask.id, 'fecha_limite', editingTask.fecha_limite);
                  setEditingTask(null);
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

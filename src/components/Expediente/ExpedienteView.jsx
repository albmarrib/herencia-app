import React from 'react';
import TaskManager from './TaskManager';
import DocumentManager from './DocumentManager';
import { User, Edit3, Trash2 } from 'lucide-react';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase';

export default function ExpedienteView({ expediente, onBack }) {
  const handleEdit = async (field, label) => {
    const newValue = window.prompt(`Editar ${label}:`, expediente[field] || '');
    if (newValue !== null) {
      try {
        await updateDoc(doc(db, 'expedientes', expediente.id), { [field]: newValue });
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Cabecera del Expediente */}
      <div className="bg-slate-900 p-6 rounded-2xl shadow-md text-white flex items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="bg-slate-800 p-4 rounded-full border border-slate-700">
            <User className="w-10 h-10 text-blue-400" />
          </div>
          <div>
            <span className={`font-bold tracking-wider text-xs uppercase mb-1 block ${expediente?.estado === 'abiertos' ? 'text-blue-400' : 'text-slate-400'}`}>
              Expediente {expediente?.estado === 'abiertos' ? 'Abierto' : 'Cerrado'}
            </span>
            <h2 className="text-2xl font-black flex items-center gap-2">
              {expediente?.nombreCausante}
              <button onClick={() => handleEdit('nombreCausante', 'Nombre del Causante')} className="text-slate-400 hover:text-white transition"><Edit3 className="w-4 h-4" /></button>
            </h2>
            <div className="flex gap-4 mt-2 text-slate-400 text-sm items-center">
              <span>DNI: {expediente?.dni || '---'}</span>
              <button onClick={() => handleEdit('dni', 'DNI')} className="hover:text-white transition"><Edit3 className="w-3 h-3" /></button>
              <span>•</span>
              <span>Fallecimiento: {expediente?.fechaFallecimiento || '---'}</span>
              <button onClick={() => handleEdit('fechaFallecimiento', 'Fecha de Fallecimiento')} className="hover:text-white transition"><Edit3 className="w-3 h-3" /></button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={async () => {
              if (window.confirm('ATENCIÓN: ¿Estás seguro de que quieres eliminar este expediente permanentemente? Toda la información, tareas, documentos y herederos se perderán. Esta acción no se puede deshacer.')) {
                await deleteDoc(doc(db, 'expedientes', expediente.id));
                if (onBack) onBack();
              }
            }}
            className="p-2 rounded-lg transition hover:bg-red-500/10 text-slate-400 hover:text-red-400"
            title="Eliminar Expediente"
          >
            <Trash2 className="w-5 h-5" />
          </button>

          <button 
            onClick={async () => {
              const newEstado = expediente?.estado === 'abiertos' ? 'cerrados' : 'abiertos';
              if (window.confirm(`¿Seguro que quieres ${newEstado === 'cerrados' ? 'cerrar' : 'reabrir'} este expediente?`)) {
                await updateDoc(doc(db, 'expedientes', expediente.id), { estado: newEstado });
                if (newEstado === 'cerrados' && onBack) {
                  onBack();
                }
              }
            }}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition shadow-sm ${expediente?.estado === 'abiertos' ? 'bg-slate-800 hover:bg-slate-700 text-slate-200' : 'bg-blue-600 hover:bg-blue-500 text-white'}`}
          >
            {expediente?.estado === 'abiertos' ? 'Cerrar Expediente' : 'Reabrir Expediente'}
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <TaskManager />
        <DocumentManager />
      </div>
    </div>
  );
}

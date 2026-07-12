import React from 'react';
import TaskManager from './TaskManager';
import DocumentManager from './DocumentManager';
import { User } from 'lucide-react';

export default function ExpedienteView() {
  return (
    <div className="space-y-8">
      {/* Cabecera del Expediente (Datos del causante simulados) */}
      <div className="bg-slate-900 p-6 rounded-2xl shadow-md text-white flex items-center gap-6">
        <div className="bg-slate-800 p-4 rounded-full border border-slate-700">
          <User className="w-10 h-10 text-blue-400" />
        </div>
        <div>
          <span className="text-blue-400 font-bold tracking-wider text-xs uppercase mb-1 block">Expediente Abierto</span>
          <h2 className="text-2xl font-black">Antonio García Martínez</h2>
          <div className="flex gap-4 mt-2 text-slate-400 text-sm">
            <span>DNI: 12345678X</span>
            <span>•</span>
            <span>Fallecimiento: 15/05/2026</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <TaskManager />
        <DocumentManager />
      </div>
    </div>
  );
}

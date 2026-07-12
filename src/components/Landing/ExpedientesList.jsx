import React, { useState } from 'react';
import { Folder, FolderOpen, Plus, Search, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function ExpedientesList({ expedientes, onSelectExpediente, onBackToLanding }) {
  const [filter, setFilter] = useState('todos'); // todos, abiertos, cerrados
  const [search, setSearch] = useState('');
  const { currentUser, logout } = useAuth();

  const isFerrer = currentUser?.email === 'josep@ferrer-assessoria.com';

  const filteredExpedientes = expedientes.filter(exp => {
    const matchesFilter = filter === 'todos' || exp.estado === filter;
    const matchesSearch = exp.nombreCausante.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleLogout = async () => {
    await logout();
    onBackToLanding();
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Navbar simplificado */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          {isFerrer ? (
            <img src="/ferrer-logo.png" alt="Ferrer Assessoria" className="h-10 object-contain" />
          ) : (
            <>
              <div className="bg-slate-900 text-white p-2 rounded-lg">
                <FolderOpen className="w-5 h-5" />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-slate-800">Mis Expedientes</h1>
            </>
          )}
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-slate-500 hidden sm:inline-block">{currentUser?.email}</span>
          <button 
            onClick={handleLogout}
            className="text-slate-500 hover:text-slate-800 flex items-center gap-2 text-sm font-medium transition"
          >
            <LogOut className="w-4 h-4" /> Salir
          </button>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-8">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex bg-slate-200/50 p-1 rounded-lg w-fit">
            <button 
              onClick={() => setFilter('todos')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${filter === 'todos' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Todos
            </button>
            <button 
              onClick={() => setFilter('abiertos')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${filter === 'abiertos' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Abiertos
            </button>
            <button 
              onClick={() => setFilter('cerrados')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${filter === 'cerrados' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Cerrados
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Buscar causante..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-400 w-full md:w-64"
              />
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition shadow-sm whitespace-nowrap">
              <Plus className="w-4 h-4" /> Nuevo Expediente
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExpedientes.map(exp => (
            <div 
              key={exp.id} 
              onClick={() => onSelectExpediente(exp)}
              className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg hover:border-blue-300 transition cursor-pointer group flex flex-col h-full"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${exp.estado === 'abiertos' ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
                  {exp.estado === 'abiertos' ? <FolderOpen className="w-6 h-6" /> : <Folder className="w-6 h-6" />}
                </div>
                <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${exp.estado === 'abiertos' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                  {exp.estado === 'abiertos' ? 'Abierto' : 'Cerrado'}
                </span>
              </div>
              
              <h3 className="text-lg font-bold text-slate-800 mb-1 group-hover:text-blue-600 transition-colors">
                Sucesión de {exp.nombreCausante}
              </h3>
              <p className="text-sm text-slate-500 mb-6">Apertura: {exp.fechaApertura}</p>
              
              <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-600 font-medium">
                <span>Ref: {exp.referencia}</span>
                <span className="text-blue-600 group-hover:translate-x-1 transition-transform">Abrir &rarr;</span>
              </div>
            </div>
          ))}
          
          {filteredExpedientes.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl">
              No se encontraron expedientes con esos criterios.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

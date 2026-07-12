import React, { useState } from 'react';
import { useExpediente } from '../../context/ExpedienteContext';
import { FileText, UploadCloud, Eye, AlertCircle, CheckCircle, Plus, Trash2, Edit3, X, Loader2, Printer, Share2 } from 'lucide-react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase';

export default function DocumentManager() {
  const { expedienteId, documentos, updateEstadoDocumento, addDocumento, deleteDocumento, updateDocumento } = useExpediente();
  
  const [filter, setFilter] = useState('todos'); 
  const [nuevoDoc, setNuevoDoc] = useState({ nombre: '', requiere_archivo: true });
  const [editingDoc, setEditingDoc] = useState(null);
  const [uploading, setUploading] = useState(null);
  const [viewingDoc, setViewingDoc] = useState(null);

  const docsFiltrados = documentos.filter(d => filter === 'todos' || d.estado === filter);

  const handleFileUpload = async (docId, file) => {
    if (!file) return;
    setUploading(docId);
    try {
      const storageRef = ref(storage, `expedientes/${expedienteId}/${docId}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      await updateDocumento(docId, 'url_archivo', url);
      await updateEstadoDocumento(docId, 'subido');
    } catch (error) {
      console.error(error);
      alert('Error al subir el archivo. Es posible que debas activar Firebase Storage en tu consola de Firebase y configurar las reglas de lectura/escritura a true.');
    } finally {
      setUploading(null);
    }
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (nuevoDoc.nombre) {
      addDocumento({
        nombre_documento: nuevoDoc.nombre,
        requiere_archivo: nuevoDoc.requiere_archivo
      });
      setNuevoDoc({ nombre: '', requiere_archivo: true });
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full lg:w-1/2">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <FileText className="text-primary w-6 h-6" />
          <h2 className="text-xl font-bold text-slate-800">Bóveda Documental</h2>
        </div>
        
        {/* Filtros */}
        <div className="flex bg-slate-100 p-1 rounded-lg">
          {['todos', 'pendiente', 'subido', 'validado'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-md text-xs font-semibold capitalize transition-colors ${filter === f ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
        <form onSubmit={handleAdd} className="flex gap-3 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
          <div className="flex-1 flex flex-col gap-2">
            <input 
              type="text" 
              placeholder="Nuevo documento requerido" 
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400"
              value={nuevoDoc.nombre}
              onChange={e => setNuevoDoc({...nuevoDoc, nombre: e.target.value})}
            />
            <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
              <input 
                type="checkbox" 
                checked={nuevoDoc.requiere_archivo}
                onChange={e => setNuevoDoc({...nuevoDoc, requiere_archivo: e.target.checked})}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              ¿Requiere adjuntar un archivo físico?
            </label>
          </div>
          <button type="submit" className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition self-start">
            <Plus className="w-5 h-5" />
          </button>
        </form>
        
        <div className="space-y-4">
          {docsFiltrados.length === 0 ? (
            <p className="text-sm text-slate-400 italic text-center py-4">No se encontraron documentos.</p>
          ) : (
            docsFiltrados.map(doc => {
              let bgColor, borderColor, icon, statusText;
              
              if (doc.estado === 'validado') {
                bgColor = 'bg-emerald-50';
                borderColor = 'border-emerald-200';
                icon = <CheckCircle className="text-emerald-500 w-5 h-5" />;
                statusText = 'Validado';
              } else if (doc.estado === 'subido') {
                bgColor = 'bg-amber-50';
                borderColor = 'border-amber-200';
                icon = <Eye className="text-amber-500 w-5 h-5" />;
                statusText = 'En Revisión';
              } else {
                bgColor = 'bg-red-50';
                borderColor = 'border-red-200';
                icon = <AlertCircle className="text-red-500 w-5 h-5" />;
                statusText = !doc.requiere_archivo ? 'Pendiente de Revisión' : 'Falta Adjuntar';
              }

              return (
                <div key={doc.id} className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border ${bgColor} ${borderColor} transition-all group`}>
                  <div className="flex items-center gap-3 mb-3 sm:mb-0 flex-1 mr-4 cursor-pointer" onClick={() => setEditingDoc(doc)}>
                    <div className="bg-white p-2 rounded-lg shadow-sm shrink-0">
                      {icon}
                    </div>
                    <div className="flex-1 w-full">
                      <h3 className="font-semibold text-slate-800 text-sm">{doc.nombre_documento}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${doc.estado === 'validado' ? 'text-emerald-600' : doc.estado === 'subido' ? 'text-amber-600' : 'text-red-600'}`}>
                          {statusText}
                        </span>
                        {!doc.requiere_archivo && (
                          <span className="bg-slate-200 text-slate-600 text-[10px] px-2 py-0.5 rounded-full">INFORMATIVO</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2">
                    {doc.estado === 'pendiente' && doc.requiere_archivo && (
                      <div className="relative">
                        <input 
                          type="file" 
                          onChange={(e) => handleFileUpload(doc.id, e.target.files[0])}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          disabled={uploading === doc.id}
                        />
                        <button 
                          className="bg-white border border-slate-200 hover:border-blue-400 text-slate-600 hover:text-blue-600 px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5"
                          disabled={uploading === doc.id}
                        >
                          {uploading === doc.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
                          {uploading === doc.id ? 'Subiendo...' : 'Subir'}
                        </button>
                      </div>
                    )}
                    
                    {doc.estado === 'pendiente' && !doc.requiere_archivo && (
                      <button 
                        onClick={() => updateEstadoDocumento(doc.id, 'validado')}
                        className="bg-emerald-100 hover:bg-emerald-200 text-emerald-700 px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5"
                      >
                        <CheckCircle className="w-4 h-4" /> Validar
                      </button>
                    )}

                    {(doc.estado === 'validado' || doc.estado === 'subido') && doc.url_archivo && (
                      <button 
                        onClick={() => setViewingDoc(doc)}
                        className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5"
                      >
                        <Eye className="w-4 h-4" /> {doc.estado === 'subido' ? 'Revisar' : 'Ver'}
                      </button>
                    )}

                    {doc.estado === 'subido' && (
                      <>
                        <button 
                          onClick={() => updateEstadoDocumento(doc.id, 'validado')}
                          className="bg-emerald-100 hover:bg-emerald-200 text-emerald-700 px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5"
                        >
                          <CheckCircle className="w-4 h-4" /> Validar
                        </button>
                        <button 
                          onClick={() => updateEstadoDocumento(doc.id, 'pendiente')}
                          className="text-slate-400 hover:text-red-500 px-2 py-1 transition text-[10px] underline"
                        >
                          Rechazar
                        </button>
                      </>
                    )}
                    
                    {doc.estado === 'validado' && (
                       <button 
                        onClick={() => updateEstadoDocumento(doc.id, 'pendiente')}
                        className="text-slate-400 hover:text-red-500 px-2 py-1 transition text-[10px] underline"
                      >
                        Deshacer Validación
                      </button>
                    )}

                    <button 
                      onClick={() => setEditingDoc(doc)}
                      className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-white rounded-lg transition-colors opacity-0 group-hover:opacity-100 ml-1"
                      title="Editar Documento"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => deleteDocumento(doc.id)}
                      className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-white rounded-lg transition-colors opacity-0 group-hover:opacity-100 ml-1"
                      title="Eliminar Documento"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Modal de Edición */}
      {editingDoc && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-slate-800">Editar Documento</h3>
              <button onClick={() => setEditingDoc(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Nombre del Documento</label>
                <input 
                  type="text"
                  value={editingDoc.nombre_documento}
                  onChange={e => setEditingDoc({...editingDoc, nombre_documento: e.target.value})}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Estado del Documento</label>
                <select 
                  value={editingDoc.estado}
                  onChange={e => setEditingDoc({...editingDoc, estado: e.target.value})}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                >
                  <option value="pendiente">Falta Adjuntar (Pendiente)</option>
                  <option value="subido">En Revisión (Subido)</option>
                  <option value="validado">Validado</option>
                </select>
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer p-2 bg-slate-50 rounded-lg border border-slate-100">
                  <input 
                    type="checkbox"
                    checked={editingDoc.requiere_archivo}
                    onChange={e => setEditingDoc({...editingDoc, requiere_archivo: e.target.checked})}
                    className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                  />
                  <span>Requiere adjuntar un archivo físico</span>
                </label>
              </div>
              <button 
                onClick={() => {
                  updateDocumento(editingDoc.id, 'nombre_documento', editingDoc.nombre_documento);
                  updateDocumento(editingDoc.id, 'estado', editingDoc.estado);
                  updateDocumento(editingDoc.id, 'requiere_archivo', editingDoc.requiere_archivo);
                  setEditingDoc(null);
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition mt-2"
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal Visor de Documentos */}
      {viewingDoc && (
        <div className="fixed inset-0 bg-slate-900/90 flex items-center justify-center z-[100] p-4 sm:p-8 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden shadow-2xl ring-1 ring-white/10 animate-in fade-in zoom-in duration-200">
            {/* Header del Visor */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-lg">{viewingDoc.nombre_documento}</h3>
                  <span className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Visor Documental Integrado</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => {
                    const printWindow = window.open(viewingDoc.url_archivo, '_blank');
                    if(printWindow) printWindow.print();
                  }}
                  className="p-2 text-slate-600 hover:bg-slate-200 hover:text-slate-900 rounded-lg transition"
                  title="Imprimir"
                >
                  <Printer className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(viewingDoc.url_archivo);
                    alert("Enlace copiado al portapapeles. ¡Ya puedes compartirlo!");
                  }}
                  className="p-2 text-slate-600 hover:bg-slate-200 hover:text-slate-900 rounded-lg transition"
                  title="Copiar Enlace"
                >
                  <Share2 className="w-5 h-5" />
                </button>
                <div className="w-px h-6 bg-slate-300 mx-1"></div>
                <button 
                  onClick={() => setViewingDoc(null)} 
                  className="p-2 bg-slate-200 hover:bg-red-100 hover:text-red-600 text-slate-700 rounded-lg transition"
                  title="Cerrar visor"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* Cuerpo del Visor */}
            <div className="flex-1 bg-slate-200 relative">
              <iframe 
                src={viewingDoc.url_archivo} 
                className="w-full h-full border-none"
                title="Visor de documento"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

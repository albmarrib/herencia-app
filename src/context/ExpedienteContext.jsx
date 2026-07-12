import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, doc, onSnapshot, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

const ExpedienteContext = createContext();

export const useExpediente = () => useContext(ExpedienteContext);

export const ExpedienteProvider = ({ children, expedienteId }) => {
  const currentUser = { uid: 'user1', nombre: 'Admin' };

  const [tareas, setTareas] = useState([]);
  const [documentos, setDocumentos] = useState([]);

  useEffect(() => {
    if (!expedienteId) return;
    
    const unsubTareas = onSnapshot(collection(db, `expedientes/${expedienteId}/tareas`), snap => {
      setTareas(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    
    const unsubDocs = onSnapshot(collection(db, `expedientes/${expedienteId}/documentos`), snap => {
      setDocumentos(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    
    return () => {
      unsubTareas();
      unsubDocs();
    };
  }, [expedienteId]);

  const toggleEstadoTarea = async (id) => {
    const tarea = tareas.find(t => t.id === id);
    if (!tarea) return;
    const nextEstado = tarea.estado === 'pendiente' ? 'en_progreso' : tarea.estado === 'en_progreso' ? 'completada' : 'pendiente';
    await updateDoc(doc(db, `expedientes/${expedienteId}/tareas`, id), { estado: nextEstado });
  };

  const addTarea = async (tarea) => {
    const newId = `t-${Date.now()}`;
    await setDoc(doc(db, `expedientes/${expedienteId}/tareas`, newId), { ...tarea, id: newId, estado: 'pendiente' });
  };
  const deleteTarea = async (id) => await deleteDoc(doc(db, `expedientes/${expedienteId}/tareas`, id));
  const updateTarea = async (id, field, value) => await updateDoc(doc(db, `expedientes/${expedienteId}/tareas`, id), { [field]: value });
  
  const updateEstadoDocumento = async (id, nuevoEstado) => await updateDoc(doc(db, `expedientes/${expedienteId}/documentos`, id), { estado: nuevoEstado });

  const addDocumento = async (docData) => {
    const newId = `d-${Date.now()}`;
    await setDoc(doc(db, `expedientes/${expedienteId}/documentos`, newId), { ...docData, id: newId, estado: 'pendiente', url_archivo: null });
  };
  const deleteDocumento = async (id) => await deleteDoc(doc(db, `expedientes/${expedienteId}/documentos`, id));
  const updateDocumento = async (id, field, value) => await updateDoc(doc(db, `expedientes/${expedienteId}/documentos`, id), { [field]: value });

  return (
    <ExpedienteContext.Provider value={{
      currentUser,
      tareas, setTareas, toggleEstadoTarea, addTarea, deleteTarea, updateTarea,
      documentos, setDocumentos, updateEstadoDocumento, addDocumento, deleteDocumento, updateDocumento
    }}>
      {children}
    </ExpedienteContext.Provider>
  );
};

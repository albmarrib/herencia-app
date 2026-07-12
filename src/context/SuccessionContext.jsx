import { createContext, useState, useContext, useMemo, useEffect } from 'react';
import { collection, doc, onSnapshot, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

const SuccessionContext = createContext();

export const useSuccession = () => useContext(SuccessionContext);

export const SuccessionProvider = ({ children, expedienteId }) => {
  const [bienes, setBienes] = useState([]);
  const [deudas, setDeudas] = useState([]);
  const [herederos, setHerederos] = useState([]);

  useEffect(() => {
    if (!expedienteId) return;

    const unsubBienes = onSnapshot(collection(db, `expedientes/${expedienteId}/bienes`), snap => {
      setBienes(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    
    const unsubDeudas = onSnapshot(collection(db, `expedientes/${expedienteId}/deudas`), snap => {
      setDeudas(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    const unsubHerederos = onSnapshot(collection(db, `expedientes/${expedienteId}/herederos`), snap => {
      setHerederos(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => {
      unsubBienes();
      unsubDeudas();
      unsubHerederos();
    };
  }, [expedienteId]);

  const masaHereditaria = useMemo(() => {
    const totalBienes = bienes.reduce((acc, b) => acc + b.valor, 0);
    const totalDeudas = deudas.reduce((acc, d) => acc + d.valor, 0);
    return Math.max(0, totalBienes - totalDeudas);
  }, [bienes, deudas]);

  const addBien = async (bien) => await setDoc(doc(db, `expedientes/${expedienteId}/bienes`, bien.id), bien);
  const removeBien = async (id) => await deleteDoc(doc(db, `expedientes/${expedienteId}/bienes`, id));
  
  const addDeuda = async (deuda) => await setDoc(doc(db, `expedientes/${expedienteId}/deudas`, deuda.id), deuda);
  const removeDeuda = async (id) => await deleteDoc(doc(db, `expedientes/${expedienteId}/deudas`, id));

  const updateHeredero = async (id, field, value) => {
    await updateDoc(doc(db, `expedientes/${expedienteId}/herederos`, id), { [field]: value });
  };

  const addHerederoPrincipal = async () => {
    const nombre = window.prompt("Nombre del Heredero Principal:");
    if (!nombre) return;
    const dni = window.prompt("DNI del Heredero Principal (opcional):") || '';
    const nuevoId = `hp-${Date.now()}`;
    await setDoc(doc(db, `expedientes/${expedienteId}/herederos`, nuevoId), { 
      id: nuevoId, nombre: nombre, dni: dni, estado: 'vivo', descendientes: [] 
    });
  };

  const removeHerederoPrincipal = async (id) => await deleteDoc(doc(db, `expedientes/${expedienteId}/herederos`, id));

  const addDescendiente = async (idHerederoPrincipal) => {
    const nombre = window.prompt("Nombre del Descendiente:");
    if (!nombre) return;
    const dni = window.prompt("DNI del Descendiente (opcional):") || '';
    const h = herederos.find(x => x.id === idHerederoPrincipal);
    if (!h) return;
    const nuevosDescendientes = [...h.descendientes, { id: `${h.id}-${Date.now()}`, nombre: nombre, dni: dni }];
    await updateDoc(doc(db, `expedientes/${expedienteId}/herederos`, idHerederoPrincipal), { descendientes: nuevosDescendientes });
  };

  const updateDescendiente = async (idHerederoPrincipal, idDescendiente, field, value) => {
    const h = herederos.find(x => x.id === idHerederoPrincipal);
    if (!h) return;
    const nuevosDescendientes = h.descendientes.map(d => 
      d.id === idDescendiente ? { ...d, [field]: value } : d
    );
    await updateDoc(doc(db, `expedientes/${expedienteId}/herederos`, idHerederoPrincipal), { descendientes: nuevosDescendientes });
  };

  const removeDescendiente = async (idHerederoPrincipal, idDescendiente) => {
    const h = herederos.find(x => x.id === idHerederoPrincipal);
    if (!h) return;
    const nuevosDescendientes = h.descendientes.filter(d => d.id !== idDescendiente);
    await updateDoc(doc(db, `expedientes/${expedienteId}/herederos`, idHerederoPrincipal), { descendientes: nuevosDescendientes });
  };

  const calculos = useMemo(() => {
    const ramasActivas = herederos.length;
    let cuotaInicialPorRama = ramasActivas > 0 ? 100 / ramasActivas : 0;
    let adjudicaciones = [];

    herederos.forEach(h => {
      if (h.estado === 'vivo') {
        adjudicaciones.push({
          id: h.id,
          nombre: h.nombre,
          cuotaPorcentaje: cuotaInicialPorRama,
          importe: (masaHereditaria * cuotaInicialPorRama) / 100,
          tipo: 'Principal'
        });
      } else {
        // Por derecho de representación
        const numDescendientes = h.descendientes.length;
        if (numDescendientes > 0) {
          const cuotaPorDescendiente = cuotaInicialPorRama / numDescendientes;
          h.descendientes.forEach(d => {
            adjudicaciones.push({
              id: d.id,
              nombre: d.nombre,
              cuotaPorcentaje: cuotaPorDescendiente,
              importe: (masaHereditaria * cuotaPorDescendiente) / 100,
              tipo: 'Representación',
              ramaOriginal: h.nombre
            });
          });
        }
      }
    });

    return adjudicaciones;
  }, [masaHereditaria, herederos]);

  return (
    <SuccessionContext.Provider value={{
      masaHereditaria,
      bienes, addBien, removeBien,
      deudas, addDeuda, removeDeuda,
      herederos, setHerederos,
      updateHeredero, addHerederoPrincipal, removeHerederoPrincipal, 
      addDescendiente, updateDescendiente, removeDescendiente,
      calculos
    }}>
      {children}
    </SuccessionContext.Provider>
  );
};

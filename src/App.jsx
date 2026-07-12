import React, { useState, useEffect } from 'react';
import LandingPage from './components/Landing/LandingPage';
import ExpedientesList from './components/Landing/ExpedientesList';
import ExpedienteDashboard from './components/ExpedienteDashboard';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState('landing'); // 'landing', 'list', 'dashboard'
  const [selectedExpediente, setSelectedExpediente] = useState(null);
  const [expedientes, setExpedientes] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'expedientes'), (snapshot) => {
      setExpedientes(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

  const handleEnterApp = () => {
    setCurrentRoute('list');
  };

  const handleSelectExpediente = (expediente) => {
    setSelectedExpediente(expediente);
    setCurrentRoute('dashboard');
  };

  const handleBackToLanding = () => {
    setCurrentRoute('landing');
    setSelectedExpediente(null);
  };

  const handleBackToList = () => {
    setCurrentRoute('list');
    setSelectedExpediente(null);
  };

  return (
    <>
      {currentRoute === 'landing' && (
        <LandingPage onEnter={handleEnterApp} />
      )}

      {currentRoute === 'list' && (
        <ExpedientesList 
          expedientes={expedientes} 
          onSelectExpediente={handleSelectExpediente}
          onBackToLanding={handleBackToLanding}
        />
      )}

      {currentRoute === 'dashboard' && selectedExpediente && (
        <ExpedienteDashboard 
          expediente={selectedExpediente} 
          onBack={handleBackToList}
        />
      )}
    </>
  );
}

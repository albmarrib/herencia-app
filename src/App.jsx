import React, { useState, useEffect } from 'react';
import LandingPage from './components/Landing/LandingPage';
import ExpedientesList from './components/Landing/ExpedientesList';
import ExpedienteDashboard from './components/ExpedienteDashboard';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';
import { AuthProvider, useAuth } from './context/AuthContext';

function AppContent() {
  const [currentRoute, setCurrentRoute] = useState('landing'); // 'landing', 'list', 'dashboard'
  const [selectedExpediente, setSelectedExpediente] = useState(null);
  const [expedientes, setExpedientes] = useState([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    // Si no está logueado, forzar a la landing
    if (!currentUser && currentRoute !== 'landing') {
      setCurrentRoute('landing');
      setSelectedExpediente(null);
    }
  }, [currentUser, currentRoute]);

  useEffect(() => {
    if (!currentUser) {
      setExpedientes([]);
      return;
    }
    const unsub = onSnapshot(collection(db, 'expedientes'), (snapshot) => {
      setExpedientes(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, [currentUser]);

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

      {currentRoute === 'list' && currentUser && (
        <ExpedientesList 
          expedientes={expedientes} 
          onSelectExpediente={handleSelectExpediente}
          onBackToLanding={handleBackToLanding}
        />
      )}

      {currentRoute === 'dashboard' && selectedExpediente && currentUser && (
        <ExpedienteDashboard 
          expediente={selectedExpediente} 
          onBack={handleBackToList}
        />
      )}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

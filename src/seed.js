import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDt7u7WDkRuzdJo1BTFVSmE_JqH-okiZsg",
  authDomain: "legado-app-4c8ad.firebaseapp.com",
  projectId: "legado-app-4c8ad",
  storageBucket: "legado-app-4c8ad.firebasestorage.app",
  messagingSenderId: "295064250475",
  appId: "1:295064250475:web:36c669deb785130bda692e"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const seedData = async () => {
  console.log("Seeding database...");
  
  const expedientes = [
    {
      id: 'exp-001',
      nombreCausante: 'Antonio García Martínez',
      fechaApertura: '15/05/2026',
      estado: 'abiertos',
      referencia: 'SUC-2026-001'
    },
    {
      id: 'exp-002',
      nombreCausante: 'María López Fernández',
      fechaApertura: '02/02/2026',
      estado: 'cerrados',
      referencia: 'SUC-2026-002'
    }
  ];

  for (const exp of expedientes) {
    await setDoc(doc(db, "expedientes", exp.id), exp);
    
    // Tareas
    await setDoc(doc(db, `expedientes/${exp.id}/tareas`, "t1"), { titulo: 'Contactar con notaría', responsable: 'Yo', estado: 'pendiente', fecha_limite: '2026-07-20' });
    await setDoc(doc(db, `expedientes/${exp.id}/tareas`, "t2"), { titulo: 'Revisar cuentas bancarias', responsable: 'hermano@email.com', estado: 'en_progreso', fecha_limite: '2026-07-15' });

    // Documentos
    await setDoc(doc(db, `expedientes/${exp.id}/documentos`, "d1"), { nombre_documento: 'Certificado de Defunción', estado: 'validado', url_archivo: 'https://example.com/doc.pdf', requiere_archivo: true });
    await setDoc(doc(db, `expedientes/${exp.id}/documentos`, "d2"), { nombre_documento: 'Últimas Voluntades', estado: 'subido', url_archivo: 'https://example.com/doc2.pdf', requiere_archivo: true });

    // Bienes y Deudas
    await setDoc(doc(db, `expedientes/${exp.id}/bienes`, "b1"), { concepto: 'Vivienda Habitual', valor: 250000 });
    await setDoc(doc(db, `expedientes/${exp.id}/deudas`, "de1"), { concepto: 'Hipoteca pendiente', valor: 45000 });

    // Herederos
    await setDoc(doc(db, `expedientes/${exp.id}/herederos`, "h1"), { nombre: 'Heredero Principal', estado: 'vivo', descendientes: [] });
  }

  console.log("Database seeded successfully!");
  process.exit(0);
};

seedData().catch(console.error);

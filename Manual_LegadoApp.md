# Manual de Usuario y Guía Técnica: LegadoApp

> [!NOTE]
> **LegadoApp** es una aplicación profesional de gestión sucesoria diseñada para documentar, administrar y calcular expedientes de herencia con precisión notarial.

---

## 1. Introducción y Arquitectura General

LegadoApp está construida sobre una arquitectura web moderna y escalable:
*   **Frontend**: React (creado con Vite) para una interfaz de usuario ultrarrápida y reactiva.
*   **Estilos**: Tailwind CSS v4 para un diseño limpio, moderno, elegante y totalmente responsivo (adaptable a móviles y escritorio).
*   **Backend**: Firebase (Firestore) como base de datos en la nube en tiempo real (NoSQL) para almacenar toda la información.

El diseño sigue una estructura de **Aplicación de Página Única (SPA)** dividida en dos niveles principales:
1.  **Nivel de Acceso (Landing & Panel de Control):** Pantalla de presentación y selección de expedientes.
2.  **Nivel de Trabajo (Dashboard):** El área operativa donde se gestiona un expediente concreto a lo largo de 4 módulos o pestañas.

---

## 2. Flujo de Navegación y Lógica de Uso

### 2.1. Portada y Mis Expedientes
Al entrar, el sistema te recibe con una portada serena y profesional. Al pulsar en **"Ir a mis Expedientes"**, accedes a la lista de casos.
*   **Lógica:** Aquí el sistema se conecta a la colección `expedientes` de Firebase. Te permite buscar por el nombre del causante y filtrar por estado (Abiertos/Cerrados).
*   **Acción:** Al hacer clic en un expediente, la aplicación monta el entorno de trabajo (Dashboard) inyectando el ID de ese expediente en todos los contextos (memoria global de la app), asegurando que solo veas los datos de ese caso.

### 2.2. Módulo A: Expediente (Gestión y Documentación)
Esta es la vista principal de trabajo, dividida en dos grandes bloques:

**Gestión de Tareas:**
*   Sirve para llevar el control de todo lo que hay que hacer (ir al banco, pedir cita en notaría, etc.).
*   **Lógica:** Cada tarea tiene un estado cíclico (`Pendiente` -> `En Progreso` -> `Completada`). Al hacer clic en el botón de estado, cambia automáticamente y se guarda en Firebase. Puedes editarlas usando el botón del lápiz, que abre un Modal.

**Bóveda Documental:**
*   El corazón legal del expediente. Sirve para trazar qué documentos (Certificados, Testamentos, DNI) se han recopilado y cuáles faltan.
*   **Lógica de Estados:**
    1.  `Pendiente`: Falta adjuntar o conseguir el documento.
    2.  `Subido`: El usuario ha aportado el documento pero alguien debe revisarlo.
    3.  `Validado`: El documento es correcto y legalmente válido.
*   Los documentos validados disponen de un botón "Ver" para acceder a ellos, mientras que los subidos tienen un botón "Revisar" para proceder a su validación.

### 2.3. Módulo B: Inventario (Cálculo del Caudal Relicto)
Aquí se calcula el valor económico real de la herencia.
*   **Activos (Bienes):** Inmuebles, cuentas bancarias, vehículos, etc.
*   **Pasivos (Deudas):** Hipotecas, préstamos, gastos de sepelio, etc.
*   **Lógica Matemática:** La aplicación suma todos los Bienes, le resta todas las Deudas, y obtiene como resultado la **Masa Hereditaria Neta**. Si las deudas superan a los bienes, la masa hereditaria es 0€ (ya que el programa asume aceptación a beneficio de inventario a efectos de cálculo de adjudicación).

### 2.4. Módulo C: Sucesión (Reparto Matemático)
Es el módulo más complejo e inteligente del sistema. Se encarga de definir quién hereda y cuánto hereda.

*   **Herederos Principales:** Son las cabezas de las ramas familiares (hijos, cónyuge, etc.). Si hay 3 herederos principales vivos, el sistema divide la Masa Hereditaria Neta en 3 partes iguales (33.33% cada uno).
*   **Derecho de Representación:** Si un heredero principal está marcado como `Fallecido / Renuncia`, su cuota (el dinero que le tocaba) no desaparece, sino que el sistema habilita la opción de añadir **Descendientes**.
*   **Lógica Matemática:** Si el Heredero Principal 2 fallece y deja 3 hijos (nietos del causante), el sistema coge el 33.33% que le tocaba al Heredero 2, y lo divide entre 3 (11.11% para cada nieto). Todo el cálculo se hace en tiempo real en la subpantalla derecha "Resumen de Cálculo".

### 2.5. Módulo D: Vista Notaría (Exportación)
Diseñado para la formalidad final.
*   **Objetivo:** Recopilar toda la información (documentos validados, inventario final y cuadro de adjudicaciones de herederos) en un documento limpio, sin botones ni menús de navegación.
*   **Lógica de Impresión:** Utiliza CSS avanzado (`print:hidden`) para ocultar las barras laterales y los botones de la interfaz cuando usas la función de "Imprimir" (o "Guardar como PDF") de tu navegador. Está estructurado como el Anexo de un Acta Notarial.

---

## 3. Guía de Base de Datos (Estructura de Firebase Firestore)

La base de datos sigue una estructura jerárquica orientada a documentos (NoSQL):

```text
/expedientes (Colección principal)
    ├── /exp-001 (Documento: contiene nombreCausante, fecha, estado)
    │     ├── /tareas (Subcolección)
    │     │     └── /t1 (Documento: titulo, estado, responsable)
    │     ├── /documentos (Subcolección)
    │     │     └── /d1 (Documento: nombre, estado, url_archivo)
    │     ├── /bienes (Subcolección)
    │     ├── /deudas (Subcolección)
    │     └── /herederos (Subcolección)
    │           └── /h1 (Documento: nombre, estado, array_descendientes[])
```

---

## 4. Notas Técnicas y Extensiones Futuras
1.  **Archivos Adjuntos:** Actualmente, el campo `url_archivo` en los documentos está preparado para recibir URLs reales. En el futuro, se puede conectar Firebase Storage para permitir arrastrar y soltar PDFs directamente en la Bóveda Documental.
2.  **Seguridad:** Se recomienda configurar las "Firebase Security Rules" en la consola de Firebase para que solo usuarios autenticados puedan leer y escribir datos.
3.  **Generación Dinámica:** Gracias al enfoque de Contextos en React (`ExpedienteContext` y `SuccessionContext`), cualquier cambio que se realice en la base de datos desde un dispositivo se reflejará instantáneamente en todos los dispositivos conectados sin necesidad de recargar la página.

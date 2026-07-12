import React from 'react';
import { useExpediente } from '../../context/ExpedienteContext';
import { useSuccession } from '../../context/SuccessionContext';
import { Printer } from 'lucide-react';

export default function NotarySummary() {
  const { documentos } = useExpediente();
  const { masaHereditaria, bienes, deudas, calculos, herederos } = useSuccession();

  // Causante Mock Data
  const causante = {
    nombre: 'Antonio García Martínez',
    dni: '12345678X',
    fechaFallecimiento: '15/05/2026',
    estadoCivil: 'Viudo',
    ultimoDomicilio: 'Calle Mayor 12, Madrid'
  };

  const documentosValidados = documentos.filter(d => d.estado === 'validado');
  
  const formatter = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-xl sm:p-10 p-6 min-h-[1056px] print:shadow-none print:p-0 print:m-0">
      
      {/* Botón Imprimir Oculto en impresión */}
      <div className="flex justify-end mb-8 print:hidden">
        <button 
          onClick={handlePrint}
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-5 py-2.5 rounded-lg shadow-sm transition"
        >
          <Printer className="w-5 h-5" /> Imprimir Expediente
        </button>
      </div>

      {/* Encabezado Ficha */}
      <div className="border-b-4 border-slate-900 pb-6 mb-8 text-center print:border-b-2 print:border-black">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Resumen de Expediente Sucesorio</h1>
        <p className="text-slate-500 mt-2 font-medium">Documento generado para uso notarial</p>
      </div>

      {/* 1. Datos del Causante */}
      <section className="mb-10">
        <h2 className="text-lg font-bold text-slate-800 bg-slate-100 p-2 rounded mb-4 print:bg-transparent print:border-b print:border-black print:p-0">1. Datos del Causante</h2>
        <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm px-2">
          <div><span className="text-slate-500 font-semibold block">Nombre Completo:</span> <span className="font-bold text-slate-900 text-base">{causante.nombre}</span></div>
          <div><span className="text-slate-500 font-semibold block">DNI/NIF:</span> <span className="text-slate-900">{causante.dni}</span></div>
          <div><span className="text-slate-500 font-semibold block">Fecha de Fallecimiento:</span> <span className="text-slate-900">{causante.fechaFallecimiento}</span></div>
          <div><span className="text-slate-500 font-semibold block">Estado Civil:</span> <span className="text-slate-900">{causante.estadoCivil}</span></div>
          <div className="col-span-2"><span className="text-slate-500 font-semibold block">Último Domicilio:</span> <span className="text-slate-900">{causante.ultimoDomicilio}</span></div>
        </div>
      </section>

      {/* 2. Documentación Aportada */}
      <section className="mb-10">
        <h2 className="text-lg font-bold text-slate-800 bg-slate-100 p-2 rounded mb-4 print:bg-transparent print:border-b print:border-black print:p-0">2. Documentación Verificada</h2>
        <ul className="list-disc list-inside space-y-2 text-sm px-2">
          {documentosValidados.length === 0 ? (
            <li className="text-slate-500 italic list-none">No hay documentos validados en el expediente.</li>
          ) : (
            documentosValidados.map(doc => (
              <li key={doc.id} className="text-slate-800">
                <span className="font-semibold">{doc.nombre_documento}</span>
                {!doc.requiere_archivo && <span className="text-xs text-slate-400 ml-2">(Presencial)</span>}
              </li>
            ))
          )}
        </ul>
      </section>

      {/* 3. Inventario y Caudal Relicto */}
      <section className="mb-10">
        <h2 className="text-lg font-bold text-slate-800 bg-slate-100 p-2 rounded mb-4 print:bg-transparent print:border-b print:border-black print:p-0">3. Inventario y Caudal Relicto</h2>
        
        <div className="mb-6 px-2">
          <h3 className="font-bold text-slate-700 text-sm mb-2 border-b pb-1">Activo (Bienes)</h3>
          {bienes.length === 0 ? <p className="text-xs text-slate-500 italic">Sin bienes</p> : (
            <table className="w-full text-sm">
              <tbody>
                {bienes.map(b => (
                  <tr key={b.id} className="border-b border-slate-50">
                    <td className="py-1 text-slate-700">{b.concepto}</td>
                    <td className="py-1 text-right text-slate-900">{formatter.format(b.valor)}</td>
                  </tr>
                ))}
                <tr className="font-bold">
                  <td className="py-2 text-slate-700">Total Activo</td>
                  <td className="py-2 text-right text-slate-900">{formatter.format(bienes.reduce((acc,b) => acc + b.valor, 0))}</td>
                </tr>
              </tbody>
            </table>
          )}
        </div>

        <div className="mb-6 px-2">
          <h3 className="font-bold text-slate-700 text-sm mb-2 border-b pb-1">Pasivo (Deudas y Cargas)</h3>
          {deudas.length === 0 ? <p className="text-xs text-slate-500 italic">Sin deudas</p> : (
            <table className="w-full text-sm">
              <tbody>
                {deudas.map(d => (
                  <tr key={d.id} className="border-b border-slate-50">
                    <td className="py-1 text-slate-700">{d.concepto}</td>
                    <td className="py-1 text-right text-slate-900">-{formatter.format(d.valor)}</td>
                  </tr>
                ))}
                <tr className="font-bold">
                  <td className="py-2 text-slate-700">Total Pasivo</td>
                  <td className="py-2 text-right text-slate-900">-{formatter.format(deudas.reduce((acc,d) => acc + d.valor, 0))}</td>
                </tr>
              </tbody>
            </table>
          )}
        </div>

        <div className="bg-slate-800 text-white p-4 rounded-lg flex justify-between items-center print:bg-transparent print:text-black print:border-2 print:border-black print:rounded-none">
          <span className="font-bold tracking-wider uppercase text-sm">Masa Hereditaria Neta</span>
          <span className="text-2xl font-black">{formatter.format(masaHereditaria)}</span>
        </div>
      </section>

      {/* 4. Adjudicaciones Finales */}
      <section>
        <h2 className="text-lg font-bold text-slate-800 bg-slate-100 p-2 rounded mb-4 print:bg-transparent print:border-b print:border-black print:p-0">4. Adjudicaciones y Cuotas</h2>
        <div className="px-2">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-300 text-left print:border-black">
                <th className="py-2 font-bold text-slate-700">Beneficiario / Heredero</th>
                <th className="py-2 font-bold text-slate-700 text-right">% Participación</th>
                <th className="py-2 font-bold text-slate-700 text-right">Importe (€)</th>
              </tr>
            </thead>
            <tbody>
              {herederos.length === 0 ? (
                <tr><td colSpan="3" className="py-4 text-center text-slate-500 italic">Sin configuración de herederos</td></tr>
              ) : (
                herederos.map((h, idx) => {
                  if (h.estado === 'vivo') {
                    const calc = calculos.find(c => c.id === h.id);
                    if (!calc) return null;
                    return (
                      <tr key={h.id} className="border-b border-slate-100 print:border-slate-300">
                        <td className="py-3">
                          <span className="font-bold text-slate-900">{h.nombre}</span>
                          <span className="text-xs text-slate-500 block">Heredero Principal ({idx + 1}/{herederos.length})</span>
                        </td>
                        <td className="py-3 text-right text-slate-700">{calc.cuotaPorcentaje.toFixed(2)}%</td>
                        <td className="py-3 text-right font-bold text-emerald-700 print:text-black">{formatter.format(calc.importe)}</td>
                      </tr>
                    );
                  } else {
                    return (
                      <React.Fragment key={h.id}>
                        {/* Fila del Heredero Principal Fallecido */}
                        <tr className="bg-slate-50 border-t border-slate-100 print:bg-transparent print:border-t-0">
                          <td className="py-3" colSpan="3">
                            <span className="font-bold text-slate-500 line-through mr-2">{h.nombre}</span>
                            <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded print:border print:border-black print:text-black print:bg-transparent mr-2">
                              DERECHO DE REPRESENTACIÓN (Fallecimiento/Renuncia)
                            </span>
                            <span className="text-xs text-slate-400 block mt-1">Heredero Principal ({idx + 1}/{herederos.length})</span>
                          </td>
                        </tr>
                        {/* Sub-filas de los Descendientes */}
                        {h.descendientes.length === 0 ? (
                          <tr>
                            <td colSpan="3" className="py-2 pl-8 text-xs text-slate-400 italic">Sin descendientes registrados. Su cuota se pierde.</td>
                          </tr>
                        ) : (
                          h.descendientes.map((d, idx) => {
                            const calc = calculos.find(c => c.id === d.id);
                            if (!calc) return null;
                            const isLast = idx === h.descendientes.length - 1;
                            return (
                              <tr key={d.id} className={isLast ? "border-b border-slate-200 print:border-black" : "border-b border-slate-100 border-dashed"}>
                                <td className="py-2 pl-8 relative">
                                  {/* Línea visual de anidación */}
                                  <div className="absolute left-3 top-0 bottom-0 w-px bg-slate-300 print:bg-black"></div>
                                  <div className="absolute left-3 top-1/2 w-4 h-px bg-slate-300 print:bg-black"></div>
                                  <span className="font-semibold text-slate-800">{d.nombre}</span>
                                  <span className="text-xs text-slate-500 block">Descendiente de {h.nombre}</span>
                                </td>
                                <td className="py-2 text-right text-slate-600">{calc.cuotaPorcentaje.toFixed(2)}%</td>
                                <td className="py-2 text-right font-bold text-emerald-600 print:text-black">{formatter.format(calc.importe)}</td>
                              </tr>
                            );
                          })
                        )}
                      </React.Fragment>
                    );
                  }
                })
              )}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-slate-800 print:border-black">
                <td className="py-4 font-black text-slate-900 uppercase">Total Distribuido</td>
                <td className="py-4 text-right font-bold text-slate-900">100%</td>
                <td className="py-4 text-right font-black text-slate-900">{formatter.format(calculos.reduce((acc, c) => acc + c.importe, 0))}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>
      
      <div className="mt-16 text-center text-xs text-slate-400 hidden print:block">
        Documento generado automáticamente por HerenciaApp el {new Date().toLocaleDateString('es-ES')}
      </div>
    </div>
  );
}

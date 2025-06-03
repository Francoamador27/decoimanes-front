import React, { useState } from 'react';
import { Trash2, Plus } from 'lucide-react';

const Configuraciones = () => {
    const [reglasCantidad, setReglasCantidad] = useState([]);
    const [metodosEnvio, setMetodosEnvio] = useState([]);
    const [nuevaRegla, setNuevaRegla] = useState({ cantidad: '', descuento: '' });
    const [nuevoEnvio, setNuevoEnvio] = useState({ nombre: '', costo: '' });

    const agregarReglaCantidad = () => {
        if (nuevaRegla.cantidad && nuevaRegla.descuento) {
            setReglasCantidad([...reglasCantidad, nuevaRegla]);
            setNuevaRegla({ cantidad: '', descuento: '' });
        }
    };

    const eliminarReglaCantidad = (idx) => {
        setReglasCantidad(reglasCantidad.filter((_, i) => i !== idx));
    };

    const agregarMetodoEnvio = () => {
        if (nuevoEnvio.nombre && nuevoEnvio.costo) {
            setMetodosEnvio([...metodosEnvio, { ...nuevoEnvio, reglas: [] }]);
            setNuevoEnvio({ nombre: '', costo: '' });
        }
    };

    const eliminarMetodoEnvio = (idx) => {
        setMetodosEnvio(metodosEnvio.filter((_, i) => i !== idx));
    };

    const agregarReglaEnvio = (idx, tipo, valor) => {
        const nuevos = [...metodosEnvio];
        nuevos[idx].reglas.push({ tipo, valor });
        setMetodosEnvio(nuevos);
    };

    const eliminarReglaEnvio = (metodoIdx, reglaIdx) => {
        const nuevos = [...metodosEnvio];
        nuevos[metodoIdx].reglas.splice(reglaIdx, 1);
        setMetodosEnvio(nuevos);
    };

    return (
        <div className="space-y-10">
            <h2 className="text-2xl font-bold">Configuraciones de Descuentos y Envíos</h2>

            {/* Reglas por cantidad */}
            <div className="bg-white p-6 rounded shadow">
                <h3 className="text-xl font-semibold mb-4">Reglas de descuento por cantidad</h3>
                <div className="flex gap-4 mb-4">
                    <input type="number" placeholder="Cantidad mínima" className="border px-3 py-2 rounded w-1/3" value={nuevaRegla.cantidad} onChange={(e) => setNuevaRegla({ ...nuevaRegla, cantidad: e.target.value })} />
                    <input type="number" placeholder="% Descuento" className="border px-3 py-2 rounded w-1/3" value={nuevaRegla.descuento} onChange={(e) => setNuevaRegla({ ...nuevaRegla, descuento: e.target.value })} />
                    <button onClick={agregarReglaCantidad} className="bg-blue-600 text-white px-4 py-2 rounded"><Plus size={16} /> Agregar</button>
                </div>
                <ul className="divide-y">
                    {reglasCantidad.map((r, idx) => (
                        <li key={idx} className="flex justify-between items-center py-2">
                            <span>Si cantidad &gt; {r.cantidad}, aplicar {r.descuento}%</span>
                            <button onClick={() => eliminarReglaCantidad(idx)} className="text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Métodos de envío */}
            <div className="bg-white p-6 rounded shadow">
                <h3 className="text-xl font-semibold mb-4">Métodos de Envío</h3>
                <div className="flex gap-4 mb-4">
                    <input type="text" placeholder="Nombre del envío" className="border px-3 py-2 rounded w-1/3" value={nuevoEnvio.nombre} onChange={(e) => setNuevoEnvio({ ...nuevoEnvio, nombre: e.target.value })} />
                    <input type="number" placeholder="Costo" className="border px-3 py-2 rounded w-1/3" value={nuevoEnvio.costo} onChange={(e) => setNuevoEnvio({ ...nuevoEnvio, costo: e.target.value })} />
                    <button onClick={agregarMetodoEnvio} className="bg-blue-600 text-white px-4 py-2 rounded"><Plus size={16} /> Agregar</button>
                </div>
                <ul className="divide-y">
                    {metodosEnvio.map((m, idx) => (
                        <li key={idx} className="py-4">
                            <div className="flex justify-between items-center">
                                <span>{m.nombre} - ${m.costo}</span>
                                <button onClick={() => eliminarMetodoEnvio(idx)} className="text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
                            </div>
                            <div className="ml-4 mt-2 space-y-2">
                                <p className="text-sm font-medium">Reglas de este método:</p>
                                <ul className="list-disc pl-5 text-sm">
                                    {m.reglas?.map((regla, i) => (
                                        <li key={i} className="flex justify-between items-center">
                                            <span>{regla.tipo === 'total' ? `Si total > $${regla.valor}` : `Si cantidad > ${regla.valor}`} → Envío gratis</span>
                                            <button onClick={() => eliminarReglaEnvio(idx, i)} className="ml-2 text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
                                        </li>
                                    ))}
                                </ul>
                                <div className="flex gap-2 items-center">
                                    <select onChange={(e) => agregarReglaEnvio(idx, e.target.value, '')} className="border px-2 py-1 rounded">
                                        <option value="">Agregar regla</option>
                                        <option value="total">Gratis si total </option>
                                        <option value="cantidad">Gratis si cantidad </option>
                                    </select>
                                    <input type="number" onBlur={(e) => {
                                        const tipo = e.target.previousSibling.value;
                                        if (tipo) agregarReglaEnvio(idx, tipo, e.target.value);
                                        e.target.value = '';
                                    }} className="border px-2 py-1 rounded w-28" placeholder="Valor" />
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Configuraciones;

import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import clienteAxios from '../config/axios';
import TablaDescuentos from './Descuentos/TablaDescuentos';
import FormularioCrearDescuento from '../components/Descuentos/FormularioCrearDescuentos';
import FormularioCupon from '../components/Descuentos/FormularioCupon';
import TableCupones from '../components/Descuentos/TableCoupons';

const ReglasDescuento = () => {
    const token = localStorage.getItem('AUTH_TOKEN');
    const [tab, setTab] = useState('descuentos'); // pestaña activa
    const [usarFechas, setUsarFechas] = useState(false);
    const [mensaje, setMensaje] = useState(null);
    const [error, setError] = useState(null);

    const [form, setForm] = useState({
        name: '',
        type: 'percentage',
        condition_type: 'quantity',
        discount_value: '',
        min_value: '',
        is_active: true,
        start_date: '',
        end_date: '',
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({
            ...form,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensaje(null);
        setError(null);

        if (!form.name || !form.discount_value || !form.type || !form.condition_type) {
            setError('Faltan campos obligatorios');
            return;
        }

        const payload = {
            ...form,
            start_date: usarFechas && form.start_date !== '' ? form.start_date : null,
            end_date: usarFechas && form.end_date !== '' ? form.end_date : null,
        };

        try {
            await clienteAxios.post('/api/cart-discounts', payload, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setMensaje('Regla creada correctamente');
            setForm({
                name: '',
                type: 'percentage',
                condition_type: 'quantity',
                discount_value: '',
                min_value: '',
                is_active: true,
                start_date: '',
                end_date: '',
            });
            setUsarFechas(false);
        } catch (err) {
            setError('Error al guardar la regla');
            console.error(err);
        }
    };

    return (
        <div className="bg-white p-6 rounded shadow">
            <div className="flex space-x-4 border-b mb-6 pb-2">
                {['descuentos', 'crear-descuento', 'cupones', 'crear-cupon'].map((t) => (
                    <button
                        key={t}
                        onClick={() => setTab(t)}
                        className={`text-sm font-semibold px-4 py-2 rounded-t ${tab === t ? 'bg-[#008DD2] text-white' : 'text-gray-600 hover:text-black'
                            }`}
                    >
                        {t === 'descuentos' && 'Descuentos'}
                        {t === 'crear-descuento' && 'Crear Descuento'}
                        {t === 'cupones' && 'Cupones'}
                        {t === 'crear-cupon' && 'Crear Cupón'}
                    </button>
                ))}
            </div>

            {tab === 'descuentos' && <TablaDescuentos />}

            {tab === 'crear-descuento' && (
                <>
                    <FormularioCrearDescuento

                    />
                </>
            )}

            {tab === 'cupones' && (
                <div className="text-gray-600 text-sm">
                    <TableCupones /> 
                        
                                       </div>
            )}

            {tab === 'crear-cupon' && (
                <div className="text-gray-600 text-sm">
                    <FormularioCupon />
                </div>
            )}
        </div>
    );
};

export default ReglasDescuento;

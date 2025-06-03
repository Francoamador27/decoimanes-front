import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DatosForm from '../components/MyAccount/DatosForm';
import PedidosTabla from '../components/MyAccount/PedidosTabla';
import Privacidad from '../components/MyAccount/Privacidad';
import useAuthBase from '../hooks/useBaseAuth';

const MyAccount = () => {
    const { user, mutate } = useAuthBase();
    const [tab, setTab] = useState('datos');

    return (
        <div className="max-w-4xl mx-auto p-6 bg-[#fefbf5] min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-[#008DD2]">Mi Cuenta</h1>
                {user?.admin && (
                    <Link
                        to="/admin-dash"
                        className="bg-[#008DD2] text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-[#0072ad] transition"
                    >
                        Ir al panel admin
                    </Link>
                )}
            </div>

            <div className="flex space-x-4 mb-6">
                <button
                    onClick={() => setTab('datos')}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition ${tab === 'datos' ? 'bg-[#008DD2] text-white' : 'bg-white border border-[#008DD2] text-[#008DD2]'}`}
                >
                    Datos
                </button>
                <button
                    onClick={() => setTab('pedidos')}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition ${tab === 'pedidos' ? 'bg-[#008DD2] text-white' : 'bg-white border border-[#008DD2] text-[#008DD2]'}`}
                >
                    Pedidos
                </button>
                <button
                    onClick={() => setTab('privacidad')}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition ${tab === 'privacidad' ? 'bg-[#008DD2] text-white' : 'bg-white border border-[#008DD2] text-[#008DD2]'}`}
                >
                    Privacidad
                </button>
            </div>

            <div className="bg-white shadow rounded-xl p-6">
                {tab === 'datos' && <DatosForm user={user} mutate={mutate} />}
                {tab === 'pedidos' && <PedidosTabla user={user} />}
                {tab === 'privacidad' && <Privacidad user={user} />}
            </div>
        </div>
    );
};

export default MyAccount;

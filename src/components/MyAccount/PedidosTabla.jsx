import React from 'react';
import useSWR from 'swr';
import clienteAxios from '../../config/axios';

const PedidosTabla = ({ user }) => {
    const token = localStorage.getItem('AUTH_TOKEN');

    const fetcher = () =>
        clienteAxios(`/api/mis-pedidos?user_id=${user?.id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then(res => res.data);

    const { data, error, isLoading } = useSWR(user ? `/api/pedidos?user_id=${user.id}` : null, fetcher);

    if (isLoading) return <p className="text-sm text-gray-500">Cargando pedidos...</p>;
    if (error) return <p className="text-sm text-red-500">Error al cargar pedidos.</p>;

    const pedidos = data?.data || [];

    if (pedidos.length === 0) {
        return <p className="text-gray-600 text-sm">No tenés pedidos registrados aún.</p>;
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-gray-800">
                <thead className="bg-gray-100 text-xs text-gray-600 uppercase">
                    <tr>
                        <th className="px-4 py-2 text-left">ID</th>
                        <th className="px-4 py-2 text-left">Total</th>
                        <th className="px-4 py-2 text-left">Cantidad</th>
                        <th className="px-4 py-2 text-left">Estado</th>
                        <th className="px-4 py-2 text-left">Fecha</th>
                    </tr>
                </thead>
                <tbody>
                    {pedidos.map(pedido => (
                        <tr key={pedido.id} className="border-b hover:bg-gray-50">
                            <td className="px-4 py-2">#{pedido.id}</td>
                            <td className="px-4 py-2">${pedido.total}</td>
                            <td className="px-4 py-2">
                                {pedido.carritos?.reduce((acc, c) => acc + c.cantidad, 0)}
                            </td>
                            <td className="px-4 py-2 capitalize">{pedido.estado}</td>
                            <td className="px-4 py-2">
                                {new Date(pedido.created_at).toLocaleDateString()}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PedidosTabla;

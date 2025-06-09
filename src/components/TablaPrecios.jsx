import React from 'react';

const TablaPrecios = () => {
    return (
        <div>
            <table className="w-full text-left border border-gray-200 rounded-xl overflow-hidden bg-white shadow">
                <thead className="bg-gray-100 text-gray-600 text-sm">
                    <tr>
                        <th className="px-6 py-3 font-semibold">Cantidad</th>
                        <th className="px-6 py-3 font-semibold">Precio Unitario</th>
                        <th className="px-6 py-3 font-semibold">Total</th>
                    </tr>
                </thead>
                <tbody className="text-gray-700 text-sm">
                    <tr className="border-t">
                        <td className="px-6 py-4">1 imán</td>
                        <td className="px-6 py-4">$4.000</td>
                        <td className="px-6 py-4">$4.000</td>
                    </tr>
                    <tr className="border-t">
                        <td className="px-6 py-4">3 imanes</td>
                        <td className="px-6 py-4">$3.600</td>
                        <td className="px-6 py-4">$10.800</td>
                    </tr>
                    <tr className="border-t">
                        <td className="px-6 py-4">6 imanes</td>
                        <td className="px-6 py-4">$3.200</td>
                        <td className="px-6 py-4">$19.200</td>
                    </tr>
                </tbody>

            </table>
        </div>
    );
}

export default TablaPrecios;

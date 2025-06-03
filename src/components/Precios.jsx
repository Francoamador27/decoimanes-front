import { FaWhatsapp } from 'react-icons/fa';

export default function Precios() {
  return (
    <section id="portafolio" className="bg-[#fefbf5] py-16 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-10">Precios</h2>

        {/* Tabla de precios */}
        <div className="overflow-x-auto">
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
                <td className="px-6 py-4">$5.000</td>
                <td className="px-6 py-4">$5.000</td>
              </tr>
              <tr className="border-t">
                <td className="px-6 py-4">3 imanes</td>
                <td className="px-6 py-4">$4.500</td>
                <td className="px-6 py-4">$13.500</td>
              </tr>
              <tr className="border-t">
                <td className="px-6 py-4">6 imanes</td>
                <td className="px-6 py-4">$4.000</td>
                <td className="px-6 py-4">$24.000</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Info de mayorista */}
        <div className="mt-10 text-gray-700 text-sm">
          <p>
            Si necesitás <strong>precios al por mayor</strong>, podés comunicarte directamente con nosotros por WhatsApp.
          </p>
          <div className="mt-4 flex justify-center items-center gap-2 text-green-600 font-semibold">
            <FaWhatsapp className="text-xl" />
            <span>Presioná el botón flotante para hablar con nosotros</span>
          </div>
        </div>
      </div>
    </section>
  );
}

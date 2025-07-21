import { GiftIcon, SparklesIcon, HeartIcon, StarIcon } from '@heroicons/react/24/outline'
import unboxing from '../assets/img/unboxing.png';
import hunboxing from '../assets/img/horizontalunboxin.png';
import GaleriaSwiper from './GaleriaSwiper';
const pasos = [
  {
    titulo: "1. Elegí tus fotos favoritas",
    descripcion: "Subí las imágenes que quieras convertir en imanes.",
    icono: "📷",
  },
  {
    titulo: "2. Confirmá cantidad y datos",
    descripcion: "Te pedimos tus datos de envío y cuántos imanes querés.",
    icono: "📝",
  },
  {
    titulo: "3. ¡Listo! Los preparamos para vos",
    descripcion: "En pocos días te llegan a tu casa. Hechos con mucho amor 💖",
    icono: "📦",
  },
];
const colores = [
  'bg-cyan-200 text-cyan-900',   // celeste
  'bg-green-200 text-green-900', // verde
  'bg-cyan-200 text-cyan-900',   // celeste
  'bg-yellow-200 text-yellow-900', // amarillo
  'bg-blue-200 text-blue-900',   // azul
  'bg-red-200 text-red-900'      // rojo
];
export default function ComoComprar() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-10" id='como-comprar'>
            <h2 className="text-2xl font-bold text-[#EF2B2D] py-6 text-center">Galeria de ejemplos</h2>
      <div className="mx-auto px-6 lg:px-8 w-full">
        <GaleriaSwiper />

        <div className=" px-6">
          {/* First Column */}
          <div>
            <h2 className="text-2xl font-bold text-[#EF2B2D] py-6 text-center">Cómo Comprar</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {pasos.map((paso, index) => (
                <div
                  key={index}
                  className="bg-gray-50 p-6 rounded-xl shadow-md transform transition duration-300 hover:scale-105 hover:shadow-[0_8px_30px_rgba(239,43,45,0.4),0_0_0_2px_rgba(52,198,243,0.3)]"

                >
                  <div className="text-4xl mb-4">{paso.icono}</div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">{paso.titulo}</h3>
                  <p className="text-gray-600">{paso.descripcion}</p>
                </div>
              ))}
            </div>
          </div>


        </div>
      </div>

    </div>
  );
}
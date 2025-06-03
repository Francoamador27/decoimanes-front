import React from 'react';
import img1 from '../assets/img/carrusel/img1.png';
import img2 from '../assets/img/carrusel/img2.png';
import img3 from '../assets/img/carrusel/img3.png';
import img4 from '../assets/img/carrusel/img4.png';
import { Link } from 'react-router-dom';

export default function Gallery() {
  return (
    <section className="bg-[#fefbf5] py-16 px-6 lg:px-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-start">

        {/* Lado Izquierdo - Ideas */}
        <div>
          <ul className="grid grid-cols-2 gap-6">
            {[
              {
                icon: '🎂',
                text: 'Cumpleaños',
                description: 'Recordá ese día especial con una imagen que dure para siempre.',
              },
              {
                icon: '🐶',
                text: 'Mascotas',
                description: 'Un homenaje adorable para tu mejor amigo peludo.',
              },
              {
                icon: '💑',
                text: 'Fotos de pareja',
                description: 'Inmortalizá un momento romántico con tu persona favorita.',
              },
              {
                icon: '🏢',
                text: 'Empresariales',
                description: 'Ideal para branding, regalos corporativos o eventos de empresa.',
              },
              {
                icon: '🎉',
                text: 'Eventos',
                description: 'Bautismos, baby showers, casamientos o aniversarios inolvidables.',
              },
              {
                icon: '⚽',
                text: 'Ídolos del fútbol',
                description: 'Imanes de tus jugadores favoritos o equipos que llevás en el corazón.',
              },
            ].map((item, idx) => (
              <li key={idx} className="bg-white shadow-md rounded-xl p-5 flex flex-col h-full">
                <div className="flex flex-col sm:flex-row sm:items-center mb-3 text-center sm:text-left">
                  <span className="text-3xl mb-2 sm:mb-0 sm:mr-3">{item.icon}</span>
                  <h3 className="text-xl font-semibold text-gray-800">{item.text}</h3>
                </div>
                <p className="text-sm text-gray-600">{item.description}</p>
              </li>

            ))}
          </ul>
          <div className="mt-8">
            <Link
              to="/ejemplos"
              className="inline-block bg-[#008DD2] text-white font-medium py-3 px-6 rounded-lg shadow-md hover:bg-[#0073b1] transition-all duration-200"
            >
              Ver ejemplos reales
            </Link>
          </div>
        </div>

        {/* Lado Derecho - Ejemplos */}
        <div className="grid grid-cols-2 gap-6">
          {[img1, img2, img3, img4].map((img, idx) => (
            <div key={idx} className="rounded-xl overflow-hidden shadow-lg">
              <img src={img} alt={`Imán ejemplo ${idx + 1}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

import React from 'react';

const QuienesSomos = () => {
  return (
    <section className="px-4 py-12 max-w-5xl mx-auto text-gray-700">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-[#008DD2] mb-4">Bienvenidos a Deco Imanes</h1>
        <p className="text-lg leading-relaxed">
          En Deco Imanes, nos dedicamos a la fabricación artesanal de imanes de alta calidad para heladeras,
          creando productos únicos que no solo cumplen una función práctica, sino que también aportan un
          toque especial a tu hogar.
        </p>
      </div>

      <div className="mb-10">
        <h2 className="text-2xl font-semibold text-[#008DD2] mb-3">¿Quiénes somos?</h2>
        <p>
          Somos una empresa nueva, con un fuerte compromiso hacia la calidad y la creatividad. En Deco Imanes,
          creemos que los pequeños detalles marcan la diferencia. Cada pieza es elaborada a mano en nuestra sede
          en <strong>Córdoba Capital</strong>, asegurando un producto final único, diseñado para durar y destacar.
        </p>
      </div>

      <div className="mb-10">
        <h2 className="text-2xl font-semibold text-[#008DD2] mb-3">Nuestros Productos</h2>
        <p className="mb-2">
          Cada imán que fabricamos es un reflejo de nuestra dedicación por ofrecer un producto que combine estilo
          y funcionalidad.
        </p>
        <ul className="list-disc list-inside ml-4">
          <li><strong>Imanes Decorativos:</strong> Diseños exclusivos pensados para darle un toque personal a tu heladera.</li>
          <li><strong>Imanes Funcionales:</strong> Además de decorar, están diseñados para sujetar notas, recetas o recordatorios sin perder su estilo.</li>
        </ul>
      </div>

      <div className="mb-10">
        <h2 className="text-2xl font-semibold text-[#008DD2] mb-3">Calidad Premium</h2>
        <p>
          Lo que distingue a Deco Imanes es nuestro compromiso con la calidad. Trabajamos solo con los mejores materiales,
          asegurando que cada imán sea duradero, resistente y visualmente atractivo. Nuestro proceso artesanal garantiza
          que cada pieza sea única y perfectamente terminada.
        </p>
      </div>

      <div className="mb-10">
        <h2 className="text-2xl font-semibold text-[#008DD2] mb-3">¿Por qué elegir Deco Imanes?</h2>
        <ul className="list-disc list-inside ml-4">
          <li><strong>Hechos a mano en Córdoba Capital:</strong> Nos permite personalizar y mantener altos estándares de calidad.</li>
          <li><strong>Diseños exclusivos:</strong> Siempre creamos nuevas ideas para ofrecer opciones frescas y originales.</li>
          <li><strong>Envíos a todo el país:</strong> Llegamos a toda Argentina (excepto Tierra del Fuego).</li>
          <li><strong>Compromiso con la satisfacción:</strong> Nos esforzamos por superar tus expectativas con un gran servicio al cliente.</li>
        </ul>
      </div>

      <div className="text-center mt-12">
        <p className="text-lg font-medium">
          Deco Imanes es más que una marca de imanes, <br />
          <span className="text-[#008DD2] font-bold">¡es una invitación a darle vida a tus espacios con un toque único y personal!</span>
        </p>
      </div>
    </section>
  );
};

export default QuienesSomos;

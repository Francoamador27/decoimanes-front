import { useEffect, useState } from 'react';
import { Search } from "lucide-react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Navigation } from 'swiper/modules';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import clienteAxios from '../config/axios';

const GaleriaSwiper = ({ size }) => {
  const [index, setIndex] = useState(-1);
  const [imagenesSubidas, setImagenesSubidas] = useState([]);
  const isMobile = size === 'small' || window.innerWidth < 640;

  // Obtener imágenes al montar
  useEffect(() => {
    const obtenerImagenes = async () => {
      try {
        const { data } = await clienteAxios.get('/api/ejemplos');
        setImagenesSubidas(data.data || []);
      } catch (err) {
        console.error('Error al cargar imágenes:', err);
      }
    };

    obtenerImagenes();
  }, []);

  // Para el Lightbox
  const galleryImages = imagenesSubidas.map(img => ({
    src: `${import.meta.env.VITE_API_URL}storage/uploads${img.imagen}`
  }));

  return (
    <section className="">
      <Swiper
        loop={true}
        effect="coverflow"
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={'auto'}
        coverflowEffect={{
          rotate: 50,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true,
        }}
        navigation={true}
        pagination={{ clickable: true }}
        modules={[EffectCoverflow, Pagination, Navigation]}
        className="w-full max-w-5xl"
      >
        {imagenesSubidas.map((img, i) => (
          <SwiperSlide
            key={img.id}
            style={{
              width: isMobile ? '300px' : '600px',
              height: isMobile ? '200px' : '400px',
              borderRadius: '12px',
              overflow: 'hidden',
              position: 'relative'
            }}
          >
            <div
              className="absolute top-2 right-5 bg-black/60 hover:bg-black/80 p-2 rounded-full cursor-pointer z-10"
              onClick={() => setIndex(i)}
              title="Ver en grande"
            >
              <Search className="w-4 h-4" />
            </div>
            <img
              src={`${import.meta.env.VITE_API_URL}storage/uploads${img.imagen}`}
              alt={`galeria-${i}`}
              className="w-full h-full object-cover rounded-xl shadow-md"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <Lightbox
        open={index >= 0}
        close={() => setIndex(-1)}
        slides={galleryImages}
        index={index}
      />
    </section>
  );
};

export default GaleriaSwiper;

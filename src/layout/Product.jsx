import React, { useState } from 'react';
import Cropper from 'react-easy-crop';
import { TrashIcon } from '@heroicons/react/24/outline';
import getCroppedImg from '../utils/cropImage';
import Resumen from '../components/Resumen';
import useCont from '../hooks/useCont';
import { v4 as uuidv4 } from 'uuid';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useSWR from 'swr';
import clienteAxios from '../config/axios';
import { mostrarError } from '../utils/Alertas';

const Product = () => {
  const { handleAgregarPedido, handleAddCart, producto, pedido } = useCont();

  const [mostrarResumen, setMostrarResumen] = useState(false);

  const [quantity, setQuantity] = useState(1);
  const [sameImage, setSameImage] = useState(false);
  const [images, setImages] = useState(Array(1).fill(null));
  const [croppedImages, setCroppedImages] = useState(Array(1).fill(null));
  const [cropData, setCropData] = useState(
    Array(1).fill({ crop: { x: 0, y: 0 }, zoom: 1, croppedAreaPixels: null })
  );

  const effectiveQuantity = sameImage ? 1 : quantity;

  const handleQuantityChange = (e) => {
    const val = Math.max(1, parseInt(e.target.value) || 1);
    setQuantity(val);
    const targetLength = sameImage ? 1 : val;

    setImages((prev) => {
      const newArray = [...prev];
      while (newArray.length < targetLength) newArray.push(null);
      return newArray.slice(0, targetLength);
    });

    setCroppedImages((prev) => {
      const newArray = [...prev];
      while (newArray.length < targetLength) newArray.push(null);
      return newArray.slice(0, targetLength);
    });

    setCropData((prev) => {
      const newArray = [...prev];
      while (newArray.length < targetLength) {
        newArray.push({ crop: { x: 0, y: 0 }, zoom: 1, croppedAreaPixels: null });
      }
      return newArray.slice(0, targetLength);
    });
  };

  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const newImages = [...images];
      newImages[index] = URL.createObjectURL(file);
      setImages(newImages);
    }
  };
  const calcularSubtotal = () => {
    const baseSubtotal = quantity * producto.precio;
    let descuento = 0;

    if (quantity >= 6) {
      descuento = 0.2;
    } else if (quantity >= 3) {
      descuento = 0.1;
    }

    const totalConDescuento = baseSubtotal * (1 - descuento);
    return {
      base: baseSubtotal,
      descuento: descuento,
      total: totalConDescuento
    };
  };
  const handleRemoveImage = (index) => {
    setImages((prev) => {
      const newArr = [...prev];
      newArr[index] = null;
      return newArr;
    });

    setCroppedImages((prev) => {
      const newArr = [...prev];
      newArr[index] = null;
      return newArr;
    });

    setCropData((prev) => {
      const newArr = [...prev];
      newArr[index] = { crop: { x: 0, y: 0 }, zoom: 1, croppedAreaPixels: null };
      return newArr;
    });
  };

  const handleCropChange = (crop, index) => {
    setCropData((prev) => {
      const newData = [...prev];
      newData[index] = { ...newData[index], crop };
      return newData;
    });
  };

  const handleZoomChange = (zoom, index) => {
    setCropData((prev) => {
      const newData = [...prev];
      newData[index] = { ...newData[index], zoom };
      return newData;
    });
  };

  const handleCropComplete = (croppedAreaPixels, index) => {
    setCropData((prev) => {
      const newData = [...prev];
      newData[index] = { ...newData[index], croppedAreaPixels };
      return newData;
    });
  };

  const handleSaveCrop = async (index) => {
    try {
      const imageSrc = images[index];
      const croppedAreaPixels = cropData[index].croppedAreaPixels;
      const cropped = await getCroppedImg(imageSrc, croppedAreaPixels);

      const newCroppedImages = [...croppedImages];
      newCroppedImages[index] = cropped;
      setCroppedImages(newCroppedImages);

    } catch (error) {
    }
  };

  const blobUrlToFile = async (blobUrl, fileName) => {
    const res = await fetch(blobUrl);
    const blob = await res.blob();
    return new File([blob], fileName, { type: blob.type });
  };

  const handleAgregarCarrito = async () => {
    const missing = croppedImages.some(img => !img);
    if (missing) {
      mostrarError('Te faltan recortar alguna imagen')
      return;
    }

    const formData = new FormData();
    const archivos = [];

    if (sameImage) {
      const file = await blobUrlToFile(croppedImages[0], `iman_1.jpg`);
      formData.append('imagen_unica', file);
      formData.append('cantidad', quantity);
      archivos.push(file); // guardamos para el carrito
    } else {
      for (let i = 0; i < croppedImages.length; i++) {
        const file = await blobUrlToFile(croppedImages[i], `iman_${i + 1}.jpg`);
        formData.append('imagenes[]', file);
        archivos.push(file); // guardamos cada uno
      }
    }

    let carrito = {
      quantity: quantity,
      precioUnidad: producto.precio,
      images: archivos,
      id: producto.id
    };
    handleAddCart(carrito);
    setMostrarResumen(true);

  };



  return (
    <div className="flex">
      {/* CONTENIDO PRINCIPAL */}
      <section className="flex-1 flex flex-col items-center py-10 px-4 text-center">

        <div className="mb-6 w-full max-w-screen-lg">
          <label className="text-lg font-semibold block mb-2 text-gray-700">Tipo de pedido</label>
          <div className="flex justify-center gap-6 items-center">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={sameImage}
                onChange={() => {
                  setSameImage(true);
                  handleQuantityChange({ target: { value: quantity } });
                }}
                className="h-4 w-4 text-blue-600 bg-white border-gray-300 focus:ring-blue-500 focus:ring-2 rounded-full"
              />
              <span className="text-sm text-gray-700">Una sola imagen para todos los imanes</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={!sameImage}
                onChange={() => {
                  setSameImage(false);
                  handleQuantityChange({ target: { value: quantity } });
                }}
                className="h-4 w-4 text-blue-600 bg-white border-gray-300 focus:ring-blue-500 focus:ring-2 rounded-full block"
              />
              <span className="text-sm text-gray-700">Diferentes imágenes por imán</span>
            </label>
          </div>
        </div>

        {/* Cantidad de imanes */}
        <div className="flex">
          <div>
            <label className="block text-2xl font-semibold mb-4 text-gray-700">
              Cantidad de imanes
            </label>
            <div className="flex items-center mb-8 gap-2">
              <button
                onClick={() => {
                  const newQty = Math.max(1, quantity - 1);
                  handleQuantityChange({ target: { value: newQty } });
                }}
                className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-lg font-bold"
              >
                −
              </button>

              <input
                type="number"
                min="1"
                value={quantity}
                onChange={handleQuantityChange}
                className="w-16 text-center border border-gray-300 rounded py-1 shadow-sm"
              />

              <button
                onClick={() => {
                  const newQty = quantity + 1;
                  handleQuantityChange({ target: { value: newQty } });
                }}
                className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-lg font-bold"
              >
                +
              </button>

              <button
                onClick={handleAgregarCarrito}
                className="bg-[#34C6F3] text-white px-4 py-2 ml-4 rounded hover:bg-[#28b0dc] text-sm transition"
              >
                Añadir al carrito
              </button>
            </div>

          </div>
        </div>
        {producto && (
          <div className="text-left">
            <p className="text-lg text-gray-800 font-semibold">Precio por imán: ${producto.precio}</p>

            <div className="mt-2 text-sm text-gray-700">
              <p>Subtotal: ${calcularSubtotal().base.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>

              {calcularSubtotal().descuento > 0 && (
                <p>Descuento aplicado: {calcularSubtotal().descuento * 100}%</p>
              )}

              <p className="font-bold text-lg">
                Total: ${calcularSubtotal().total.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>

            </div>
          </div>
        )}

        {/* Cuadrantes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-screen-lg">
          {Array.from({ length: effectiveQuantity }).map((_, index) => (
            <div
              key={index}
              className="bg-white border border-gray-300 rounded-lg shadow p-4 flex flex-col items-center"
            >
              {images[index] ? (
                <>
                  <div className="relative w-full aspect-square mb-2 overflow-hidden rounded">
                    <Cropper
                      image={images[index]}
                      crop={cropData[index].crop}
                      zoom={cropData[index].zoom}
                      aspect={1}
                      onCropChange={(crop) => handleCropChange(crop, index)}
                      onZoomChange={(zoom) => handleZoomChange(zoom, index)}
                      onCropComplete={(_, croppedAreaPixels) =>
                        handleCropComplete(croppedAreaPixels, index)
                      }
                    />
                    <button
                      onClick={() => handleRemoveImage(index)}
                      title="Eliminar imagen"
                      className="absolute top-2 right-2 bg-white border border-gray-300 rounded-full p-1 shadow hover:bg-red-100 transition"
                    >
                      <TrashIcon className="w-5 h-5 text-red-500" />
                    </button>
                  </div>

                  <label className="w-full text-sm text-gray-600 mb-1">Zoom</label>
                  <input
                    type="range"
                    min={1}
                    max={3}
                    step={0.1}
                    value={cropData[index].zoom}
                    onChange={(e) => handleZoomChange(parseFloat(e.target.value), index)}
                    className="w-full mb-2"
                  />

                  <button
                    onClick={() => handleSaveCrop(index)}
                    className="bg-[#34C6F3] text-white px-4 py-1 rounded hover:bg-[#28b0dc] text-sm transition"
                  >
                    Guardar corte
                  </button>
                </>
              ) : (
                <label className="cursor-pointer flex flex-col items-center text-sm text-gray-600 hover:text-[#34C6F3] transition">
                  <span className="mb-1 font-medium">Subí tu imagen</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageChange(e, index)}
                  />
                  <div className="bg-[#34C6F3] text-white px-3 py-1 rounded mt-1 text-xs shadow">
                    Seleccionar archivo
                  </div>
                </label>
              )}

              {croppedImages[index] && (
                <img
                  src={croppedImages[index]}
                  alt={`Preview ${index}`}
                  className="mt-4 w-full h-auto border rounded"
                />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* SIDEBAR */}
      <aside
        className={`fixed top-0 right-0 h-full w-72 bg-gray-100 shadow-lg p-6 transform transition-transform duration-300 z-50
    ${mostrarResumen ? 'translate-x-0' : 'translate-x-full'}
  `}
      >
        {/* Botón cerrar */}
        <button
          onClick={() => setMostrarResumen(false)}
          className="absolute top-4 right-4 text-gray-600 hover:text-red-500 transition"
          title="Cerrar resumen"
        >
          ✕
        </button>

        <Resumen />
      </aside>

      <ToastContainer />
    </div>

  );
};

export default Product;

import ResumenProducto from "../components/ResumenProducto";
import useCont from "../hooks/useCont";
import { createRef, useEffect, useState } from 'react';
import Alerta from '../components/Alerta';
import { Link } from "react-router-dom";
import { SiMercadopago } from "react-icons/si";
import TurnstileCaptcha from '../components/TurnstileCaptcha';
import useAuthBase from "../hooks/useBaseAuth";
import clienteAxios from '../config/axios';
import { toast } from 'react-toastify';

const CheckOut = () => {
    const entorno = import.meta.env.VITE_ENTORNO;
    const { pedido, handleSubmitNuevaOrden, total } = useCont();
    const { user } = useAuthBase();

    const reglasCantidad = [
        { cantidad: 3, descuento: 10 },
        { cantidad: 6, descuento: 20 },
    ];

    const [metodoEnvio, setMetodoEnvio] = useState('');
    const [mensajeEnvio, setMensajeEnvio] = useState('');
    const [codigoPostal, setCodigoPostal] = useState('');
    const [captchaCheckout, setCaptchaCheckout] = useState('');
    const [codigoCupon, setCodigoCupon] = useState('');
    const [cuponValidado, setCuponValidado] = useState(null);
    const [montoDescuentoCupon, setMontoDescuentoCupon] = useState(0);
    const [cuponError, setCuponError] = useState(null);
    const [cuponProcesado, setCuponProcesado] = useState(false); // control para desactivar botón luego del intento


    const totalUnidades = pedido.reduce((acc, producto) => acc + parseInt(producto.cantidad), 0);
    const reglaAplicada = reglasCantidad
        .filter(regla => totalUnidades >= regla.cantidad)
        .sort((a, b) => b.descuento - a.descuento)[0];

    const descuento = reglaAplicada ? reglaAplicada.descuento : 0;
    const totalConDescuento = total - (total * (descuento / 100));

    // Usar el monto de descuento que viene de la API
    const costoEnvio = metodoEnvio === 'andreani' ? 14000 : 0;
    const totalFinal = totalConDescuento - montoDescuentoCupon + costoEnvio;

    const nameRef = createRef();
    const emailRef = createRef();
    const telefonoRef = createRef();
    const dniRef = createRef();
    const direccionRef = createRef();
    const localidadRef = createRef();
    const provinciaRef = createRef();

    const [loading, setLoading] = useState(false);
    const [errores, setErrores] = useState([]);
    const [loadingCupon, setLoadingCupon] = useState(false);

    useEffect(() => {
        if (user) {
            if (nameRef.current) nameRef.current.value = user.name || '';
            if (emailRef.current) emailRef.current.value = user.email || '';
            if (telefonoRef.current) telefonoRef.current.value = user.telefono || '';
            if (dniRef.current) dniRef.current.value = user.dni || '';
            if (direccionRef.current) direccionRef.current.value = user.direccion || '';
            if (localidadRef.current) localidadRef.current.value = user.localidad || '';
            if (provinciaRef.current) provinciaRef.current.value = user.provincia || '';
            if (user.codigo_postal) setCodigoPostal(user.codigo_postal);
        }
        // Validar cupón automáticamente si hay en localStorage
        if (codigoCupon) {
            validarCupon(codigoCupon);
        }
    }, [user]);

    const determinarMetodoEnvio = (cp) => {
        if (!cp || cp.length < 4) {
            setMetodoEnvio('');
            setMensajeEnvio('');
            return;
        }
        const codigo = parseInt(cp);
        if (codigo >= 5000 && codigo <= 5019) {
            setMetodoEnvio("cordoba");
            setMensajeEnvio("Tu código postal es de la ciudad de Córdoba. El envío se coordina con el vendedor luego de la compra.");
        } else {
            setMetodoEnvio("andreani");
            setMensajeEnvio("Envíos por Andreani. Costo adicional: $14.000");
        }
    };

    const validarCupon = async (codigoManual) => {
        const cuponCodigo = codigoManual || codigoCupon;
        if (!cuponCodigo.trim()) return;

        setLoadingCupon(true);
        setCuponProcesado(true);
        setCuponError(null);

        try {
            const { data } = await clienteAxios.get(`/api/coupons/validate`, {
                params: {
                    code: cuponCodigo.trim(),
                    total: totalConDescuento,
                }
            });

            if (data.valid) {
                setCuponValidado(data.data);
                setMontoDescuentoCupon(Number(data.discount));
                toast.success(`Cupón aplicado: ${data.data.code} - Descuento: $${data.discount}`);
            } else {
                setCuponValidado(null);
                setMontoDescuentoCupon(0);
                setCuponError(data.message || "Cupón inválido o inactivo");
            }
        } catch (error) {
            console.error("Error al validar cupón", error);
            setCuponValidado(null);
            setMontoDescuentoCupon(0);
            setCuponError("Error al validar el cupón");
        } finally {
            setLoadingCupon(false);
        }
    };


    const limpiarCupon = () => {
        setCuponValidado(null);
        setMontoDescuentoCupon(0);
        setCodigoCupon('');
        localStorage.removeItem("codigoCupon");
        toast.info("Cupón removido");
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        if (!captchaCheckout && entorno !== 'local') {
            setErrores(["Validá el CAPTCHA antes de continuar."]);
            setLoading(false);
            return;
        }

        const datos = {
            name: nameRef.current.value.trim(),
            email: emailRef.current.value.trim(),
            telefono: telefonoRef.current.value.trim(),
            dni: dniRef.current.value.trim(),
            codigo_postal: codigoPostal.trim(),
            direccion: direccionRef.current.value.trim(),
            localidad: localidadRef.current.value.trim(),
            provincia: provinciaRef.current.value.trim(),
            metodo_envio: metodoEnvio,
        };

        const erroresTemp = [];
        if (!datos.name || /[<>{}]/.test(datos.name)) erroresTemp.push("Nombre inválido o vacío.");
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(datos.email)) erroresTemp.push("Email inválido.");
        if (!/^\d{6,15}$/.test(datos.telefono)) erroresTemp.push("Teléfono inválido.");
        if (datos.dni && !/^\d{6,15}$/.test(datos.dni)) erroresTemp.push("DNI inválido.");
        if (!/^\d{4,10}$/.test(datos.codigo_postal)) erroresTemp.push("Código postal inválido.");
        if (!datos.direccion || /[<>{}]/.test(datos.direccion)) erroresTemp.push("Dirección inválida o vacía.");
        if (datos.localidad && /[<>{}]/.test(datos.localidad)) erroresTemp.push("Localidad inválida.");
        if (datos.provincia && /[<>{}]/.test(datos.provincia)) erroresTemp.push("Provincia inválida.");

        if (erroresTemp.length > 0) {
            setErrores(erroresTemp);
            setLoading(false);
            return;
        }

        let order = {
            datos,
            carrtios: pedido,
            turnstile_token: captchaCheckout,
            cupon: cuponValidado ? cuponValidado.code : null
        };

        console.log("Datos del pedido:", order);

        // Aquí continúa con el envío del pedido
        handleSubmitNuevaOrden(order);
    };

    return (
        <div className="max-w-7xl mx-auto p-6 checkout">
            <h1 className="text-3xl font-bold mb-8 text-center">Finalizar Compra</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Formulario Cliente */}
                <form className="space-y-6 bg-white p-6 rounded-2xl shadow-md" onSubmit={handleSubmit}>
                    {errores.map((error, index) => <Alerta key={index}>{error}</Alerta>)}
                    <h2 className="text-2xl font-semibold mb-4">Datos del Cliente</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" placeholder="Nombre y Apellido" className="w-full border rounded-xl p-3" ref={nameRef} required />
                        <input type="email" placeholder="Email" className="w-full border rounded-xl p-3" ref={emailRef} required />
                        <input type="number" placeholder="Teléfono" className="w-full border rounded-xl p-3" ref={telefonoRef} required />
                        <input type="text" placeholder="Código postal" className="w-full border rounded-xl p-3" value={codigoPostal} onChange={(e) => {
                            const cp = e.target.value.replace(/\D/g, '');
                            setCodigoPostal(cp);
                            if (cp.length >= 4) determinarMetodoEnvio(cp);
                        }} required />
                    </div>
                    <input type="number" placeholder="DNI" className="w-full border rounded-xl p-3" ref={dniRef} required />
                    <input type="text" placeholder="Dirección" className="w-full border rounded-xl p-3" ref={direccionRef} required />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" placeholder="Localidad" className="w-full border rounded-xl p-3" ref={localidadRef} />
                        <input type="text" placeholder="Provincia" className="w-full border rounded-xl p-3" ref={provinciaRef} />
                    </div>
                    {mensajeEnvio && (
                        <div className="text-sm p-4 my-4 bg-blue-50 border-l-4 border-blue-400 text-blue-800 rounded">
                            {mensajeEnvio}
                        </div>
                    )}
                    {entorno !== 'local' && <TurnstileCaptcha onVerify={setCaptchaCheckout} />}
                </form>

                {/* Carrito */}
                <div className="bg-gray-50 p-6 rounded-2xl shadow-md h-fit">
                    <h2 className="text-2xl font-semibold mb-4">Tu Carrito</h2>
                    <div className="space-y-4">
                        {pedido.map((producto, index) => (
                            <div key={producto.id} className="flex justify-between items-center border-b py-3">
                                <ResumenProducto producto={producto} index={index} />
                            </div>
                        ))}
                    </div>

                    {/* Sección de Cupón */}
                    <div className="my-4">
                        <label className="block text-sm font-medium mb-1">Código de Cupón</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                className="w-full border rounded-xl p-2"
                                value={codigoCupon}
                                onChange={(e) => {
                                    setCodigoCupon(e.target.value);
                                    setCuponError(null);
                                    setCuponProcesado(false);
                                }}
                                disabled={cuponValidado !== null}
                            />
                            {cuponValidado || cuponProcesado ? (
                                <button
                                    type="button"
                                    className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600"
                                    onClick={limpiarCupon}
                                >
                                    Quitar
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    className="bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600 disabled:opacity-50"
                                    onClick={() => validarCupon()}
                                    disabled={loadingCupon || cuponProcesado}
                                >
                                    {loadingCupon ? "Aplicando..." : "Aplicar"}
                                </button>
                            )}
                        </div>

                        {cuponError && (
                            <div className="mt-2 p-2 bg-red-50 border border-red-300 text-red-700 rounded">
                                ✗ {cuponError}
                            </div>
                        )}

                        {cuponValidado && (
                            <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded">
                                <p className="text-sm text-green-700">
                                    ✓ Cupón aplicado: <strong>{cuponValidado.code}</strong>
                                </p>
                                <p className="text-sm text-green-600">
                                    Descuento: {cuponValidado.discount_value}% (${montoDescuentoCupon.toLocaleString('es-AR', { minimumFractionDigits: 2 })})
                                </p>
                            </div>
                        )}
                    </div>


                    {/* Resumen de Precios */}
                    <div className="mt-6 text-xl font-bold border-t pt-4 space-y-1">
                        {descuento > 0 && (
                            <p className="text-green-600 text-sm">
                                Descuento aplicado: {descuento}% por comprar más de {reglaAplicada.cantidad} unidades
                            </p>
                        )}
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>${totalConDescuento.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span>
                        </div>
                        {cuponValidado && montoDescuentoCupon > 0 && (
                            <div className="flex justify-between text-sm text-green-600">
                                <span>Descuento Cupón ({cuponValidado.code})</span>
                                <span>-${montoDescuentoCupon.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span>
                            </div>
                        )}
                        {metodoEnvio === "andreani" && (
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Envío Andreani</span>
                                <span>${costoEnvio.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span>
                            </div>
                        )}
                        <hr className="my-2" />
                        <div className="flex justify-between font-bold text-lg">
                            <span>Total Final</span>
                            <span>${totalFinal.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span>
                        </div>
                        <button
                            onClick={handleSubmit}
                            type="button"
                            disabled={
                                loading ||
                                (!captchaCheckout && entorno !== 'local') ||
                                totalFinal <= 0
                            }
                            className={`w-full mt-4 flex justify-center items-center gap-2 py-3 rounded-xl font-semibold transition
        ${loading || (!captchaCheckout && entorno !== 'local') || totalFinal <= 0
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-[#009EE3] text-white hover:bg-[#007bbd]'
                                }
    `}
                        >
                            {loading ? (
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                </svg>
                            ) : (
                                <>
                                    <SiMercadopago className="text-xl" />
                                    <span>Pagar con Mercado Pago</span>
                                </>
                            )}
                        </button>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckOut;
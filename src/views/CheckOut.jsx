import ResumenProducto from "../components/ResumenProducto";
import useCont from "../hooks/useCont";
import { createRef, useState } from 'react';
import Alerta from '../components/Alerta';
import { Link } from "react-router-dom";
import { SiMercadopago } from "react-icons/si";
import TurnstileCaptcha from '../components/TurnstileCaptcha';

const CheckOut = () => {
    const { pedido, handleSubmitNuevaOrden, total } = useCont();
    const reglasCantidad = [
        { cantidad: 3, descuento: 10 },
        { cantidad: 6, descuento: 20 },
    ];

    const [metodoEnvio, setMetodoEnvio] = useState('');
    const [mensajeEnvio, setMensajeEnvio] = useState('');
    const [codigoPostal, setCodigoPostal] = useState('');
    const totalUnidades = pedido.reduce((acc, producto) => acc + parseInt(producto.cantidad), 0);
    const [captchaCheckout, setCaptchaCheckout] = useState('');

    const reglaAplicada = reglasCantidad
        .filter(regla => totalUnidades >= regla.cantidad)
        .sort((a, b) => b.descuento - a.descuento)[0];

    const descuento = reglaAplicada ? reglaAplicada.descuento : 0;
    const totalConDescuento = total - (total * (descuento / 100));
    const costoEnvio = metodoEnvio === 'andreani' ? 14000 : 0;
    const totalFinal = totalConDescuento + costoEnvio;

    const nameRef = createRef();
    const emailRef = createRef();
    const telefonoRef = createRef();
    const dniRef = createRef();
    const direccionRef = createRef();
    const localidadRef = createRef();
    const provinciaRef = createRef();
    const [loading, setLoading] = useState(false);
    const [errores, setErrores] = useState([]);

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

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        if (!captchaCheckout) {
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
        if (!/^\d{6,15}$/.test(datos.telefono)) erroresTemp.push("Teléfono inválido. Solo números, entre 6 y 15 dígitos.");
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

        let order = { datos, carrtios: pedido ,turnstile_token:captchaCheckout};
        handleSubmitNuevaOrden(order);
    };

    if (!pedido || pedido.length === 0) {
        return (
            <div className="max-w-2xl mx-auto p-10 text-center">
                <h1 className="text-3xl font-bold mb-4">Tu carrito está vacío</h1>
                <p className="text-lg text-gray-600 py-1">No tienes productos agregados en el carrito.</p>
                <Link to='/product' className="bg-red-500 text-white px-4 py-2 rounded-md text-sm font-semibold shadow hover:bg-red-600 transition">Ir a comprar</Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-6 checkout">
            <h1 className="text-3xl font-bold mb-8 text-center">Finalizar Compra</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <form className="space-y-6 bg-white p-6 rounded-2xl shadow-md">
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
                </form>

                <div className="bg-gray-50 p-6 rounded-2xl shadow-md h-fit">
                    <h2 className="text-2xl font-semibold mb-4">Tu Carrito</h2>
                    <div className="space-y-4">
                        {pedido.map((producto, index) => (
                            <div key={producto.id} className="flex justify-between items-center border-b py-3">
                                <ResumenProducto producto={producto} index={index} />
                            </div>
                        ))}
                    </div>
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
                    </div>
                    {mensajeEnvio && (
                        <div className="text-sm p-4 my-4 bg-blue-50 border-l-4 border-blue-400 text-blue-800 rounded">
                            {mensajeEnvio}
                        </div>
                    )}
                    <TurnstileCaptcha onVerify={setCaptchaCheckout} />

                    <button
                        onClick={handleSubmit}
                        type="button"
                        disabled={loading || !captchaCheckout}
                        className={`cursor-pointer w-full mt-6 flex justify-center items-center gap-2 py-3 rounded-xl font-semibold transition ${loading || !captchaCheckout
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-[#009EE3] text-white hover:bg-[#007bbd]'
                            }`}
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
    );
};

export default CheckOut;

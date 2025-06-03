import { useState, createRef } from "react";
import TurnstileCaptcha from "../components/TurnstileCaptcha";
import clienteAxios from "../config/axios";
import Alerta from "../components/Alerta";
import imagen from '../assets/img/contacto.png';

const Contacto = () => {
    const nombreRef = createRef();
    const emailRef = createRef();
    const telefonoRef = createRef();
    const mensajeRef = createRef();

    const [captchaToken, setCaptchaToken] = useState('');
    const [estadoMensaje, setEstadoMensaje] = useState({ tipo: '', texto: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setEstadoMensaje({ tipo: '', texto: '' });

        try {
            const datos = {
                nombre: nombreRef.current.value,
                email: emailRef.current.value,
                telefono: telefonoRef.current.value,
                mensaje: mensajeRef.current.value,
                turnstile_token: captchaToken,
            };

            await clienteAxios.post('/api/contacto', datos);

            setEstadoMensaje({ tipo: 'exito', texto: 'Mensaje enviado correctamente. Te contactaremos pronto.' });

            nombreRef.current.value = '';
            emailRef.current.value = '';
            telefonoRef.current.value = '';
            mensajeRef.current.value = '';
        } catch (error) {
            setEstadoMensaje({
                tipo: 'error',
                texto: error.response?.data?.message || 'Hubo un error al enviar el mensaje',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="py-16 bg-[#FEFBF5] font-['Comic_Neue',sans-serif]">
            <div className="max-w-3xl mx-auto px-4 bg-white shadow-xl rounded-xl overflow-hidden">
                
                {/* Imagen */}
                <div>
                    <img 
                        src={imagen}
                        alt="Contacto Deco Imanes" 
                        className="w-full h-auto object-cover"
                    />
                </div>

                {/* Formulario */}
                <div className="p-6 md:p-10">
                    <h2 className="text-3xl font-bold text-[#5C3A2E] mb-2 text-center">¿Querés hacer tu pedido?</h2>
                    <p className="mb-6 text-[#5C3A2E] text-lg text-center">
    También podés escribirnos por <a href="https://api.whatsapp.com/send/?phone=5493513222522" target="_blank" rel="noopener noreferrer" className="text-green-600 underline">WhatsApp</a>.
                    </p>

                    {estadoMensaje.texto && (
                        <div className="mb-4">
                            <Alerta tipo={estadoMensaje.tipo}>{estadoMensaje.texto}</Alerta>
                        </div>
                    )}

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-[#5C3A2E] font-medium">Nombre</label>
                            <input
                                type="text"
                                ref={nombreRef}
                                required
                                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-[#D46A33]"
                            />
                        </div>
                        <div>
                            <label className="block text-[#5C3A2E] font-medium">Email</label>
                            <input
                                type="email"
                                ref={emailRef}
                                required
                                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-[#D46A33]"
                            />
                        </div>
                        <div>
                            <label className="block text-[#5C3A2E] font-medium">Teléfono</label>
                            <input
                                type="tel"
                                ref={telefonoRef}
                                required
                                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-[#D46A33]"
                            />
                        </div>
                        <div>
                            <label className="block text-[#5C3A2E] font-medium">Consulta</label>
                            <textarea
                                rows="4"
                                ref={mensajeRef}
                                required
                                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-[#D46A33]"
                            ></textarea>
                        </div>

                        {/* Turnstile */}
                        <div>
                            <TurnstileCaptcha onVerify={setCaptchaToken} />
                        </div>

                        <button
                            type="submit"
                            className="bg-[#D46A33] text-white font-semibold px-6 py-2 rounded hover:bg-[#b55829] transition disabled:opacity-50"
                            disabled={loading || !captchaToken}
                        >
                            {loading ? 'Enviando...' : 'Enviar consulta'}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default Contacto;

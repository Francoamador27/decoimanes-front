import logo from '../../assets/img/logo.png';
import logoWhatsapp from '../../assets/img/logo-whatsapp.png';
import { FaFacebook, FaInstagram } from 'react-icons/fa';
import ReactWhatsapp, { FloatingWhatsApp } from 'react-floating-whatsapp';

export default function Footer() {
    return (
        <footer className="bg-[#fefbf5] border-t border-neutral-200 py-12 mt-20 text-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-10 items-start text-center md:text-left">

                {/* Logo y derechos */}
                <div className="flex flex-col items-center md:items-start space-y-3">
                    <img src={logo} alt="Logo DecoImanes" className="h-10 w-auto" />
                    <p className="text-xs text-gray-500">
                        © 2024 DecoImanes. Todos los derechos reservados.
                    </p>
                </div>

                {/* Espacio vacío para equilibrio visual */}
                <div className="hidden md:block"></div>

                {/* Redes sociales y contacto */}
                <div className="flex flex-col items-center md:items-end space-y-3">
                    <div className="flex space-x-4">
                        <a
                            href="https://www.facebook.com/share/1GsH7qF1eN/"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Facebook"
                            className="text-gray-600 hover:text-blue-600 transition"
                        >
                            <FaFacebook className="text-2xl" />
                        </a>
                        <a
                            href="https://www.instagram.com/decoimanes.ok?utm_source=qr&igsh=bjB3ZGJoeXpwam9v"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Instagram"
                            className="text-gray-600 hover:text-pink-500 transition"
                        >
                            <FaInstagram className="text-2xl" />
                        </a>
                    </div>
                    <p className="text-sm">info@decoimanes.com</p>
                </div>

            </div>
            <FloatingWhatsApp
                phoneNumber="5493513222522"
                accountName="DecoImanes"
                avatar={logoWhatsapp}
                chatMessage="¡Hola! 👋 Somos DecoImanes. ¿En qué podemos ayudarte hoy?"
                placeholder="Escribí tu consulta acá..."
                statusMessage="Imanes únicos para momentos inolvidables"
                darkMode={false}
                allowClickAway={true}
                allowEsc={true}
                notification={true}
                notificationSound={false}
                notificationLoop={3}
                messageDelay={1}
                notificationDelay={10}
                chatboxHeight={380}
                className="floating-wsp"
                chatboxClassName="floating-wsp-chat"
                buttonStyle={{
                    backgroundColor: '#25D366',
                    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
                    borderRadius: '50%',
                }}
                chatboxStyle={{
                    backgroundColor: '#ffffff',
                    color: '#333333',
                    fontFamily: 'Inter, sans-serif',
                    borderRadius: '12px',
                    boxShadow: '0 6px 18px rgba(0,0,0,0.1)',
                }}
            />


        </footer>
    );
}

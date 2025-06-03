import { useState } from 'react';
import logo from '../../assets/img/logo.png';
import { Link } from 'react-router-dom';
import UseAuth from '../../hooks/useAuth';
import { Menu, X, ChevronDown } from "lucide-react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [MobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const { user, logout } = UseAuth({ middleware: 'guest' });

  const toggleNavbar = () => {
    setMobileDrawerOpen(!MobileDrawerOpen);
  };

  const navItems = [
    { label: "Cómo Comprar", href: "como-comprar" },
    { label: "Ejemplos", href: "ejemplos" },
    { label: "Precios", href: "precios" },
    { label: "Contacto", href: "contacto" },
    { label: "Quienes Somos", href: "quienes-somos" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#fefbf5] border-b border-neutral-200 shadow-sm backdrop-blur-md">
      <nav>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <img src={logo} alt="Logo" className="h-10 w-auto" />
            </Link>

            {/* Nav links */}
            <ul className="hidden lg:flex items-center space-x-8 text-sm font-medium text-gray-700">
              {navItems.map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.href}
                    className="hover:text-red-500 transition-colors duration-200"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Login / User */}
            <div className="hidden lg:flex items-center space-x-4 relative">
              {!user ? (
                <Link
                  to="/auth/login"
                  className="inline-block bg-red-500 text-white px-5 py-2 rounded-md font-semibold hover:bg-red-600 transition"
                >
                  Iniciar sesión
                </Link>
              ) : (
                <div className="relative inline-block text-left">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="bg-red-500 text-white px-5 py-2 rounded-md font-semibold hover:bg-red-600 transition flex items-center gap-2"
                  >
                    Mi cuenta <ChevronDown className="w-4 h-4" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                      <Link
                        to="/mi-cuenta"
                        className="block w-full text-left px-5 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-[#008DD2] transition"
                      >
                        Ir a mi cuenta
                      </Link>
                      <button
                        onClick={logout}
                        className="block w-full text-left px-5 py-3 text-sm text-red-600 hover:bg-red-50 transition"
                      >
                        Cerrar sesión
                      </button>
                    </div>
                  )}
                </div>
              )}

            </div>

            {/* Mobile button */}
            <div className="lg:hidden">
              <button onClick={toggleNavbar}>
                {MobileDrawerOpen ? (
                  <X className="w-6 h-6 text-gray-800" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-800" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {MobileDrawerOpen && (
          <div className="lg:hidden  text-black px-6 py-8 space-y-6">
            <ul className="space-y-4 text-base font-medium">
              {navItems.map((item, index) => (
                <li key={index}>
                  <a href={item.href} className="hover:text-red-400 transition">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>

            {!user ? (
              <Link
                to="/auth/login"
                className="inline-block bg-red-500 text-white px-5 py-2 rounded-md font-semibold hover:bg-red-600 transition"
              >
                Iniciar sesión
              </Link>
            ) : (
              <div className="relative inline-block text-left">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="bg-red-500 text-white px-5 py-2 rounded-md font-semibold hover:bg-red-600 transition flex items-center gap-2"
                >
                  Mi cuenta <ChevronDown className="w-4 h-4" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute top-full  left-auto mt-2 sm:mt-2 min-w-[12rem] max-w-[90vw] bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                    <Link
                      to="/mi-cuenta"
                      className="block w-full text-left px-5 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-[#008DD2] transition"
                    >
                      Ir a mi cuenta
                    </Link>
                    <button
                      onClick={logout}
                      className="block w-full text-left px-5 py-3 text-sm text-red-600 hover:bg-red-50 transition"
                    >
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            )}


          </div>
        )}
      </nav>
    </header>
  );
}
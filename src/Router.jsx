import { createBrowserRouter } from "react-router-dom";
import Layout from "./layout/Layout";
import Inicio from "./views/Inicio";
import Login from "./views/Login";
import Register from "./views/Register";
import Product from "./layout/Product";
import AuthLayout from "./layout/AuthLayout";
import MyAccount from "./views/MyAccount";
import CheckOut from "./views/CheckOut";
import AdminLayout from "./layout/AdminLayout";
import Ordenes from "./views/Ordenes";
import ProductosAdmin from "./views/ProductosAdmin";
import Users from "./views/Users";
import CartAbandoment from "./views/CartAbandoment";
import DetalleOrden from "./views/DetalleOrden";
import DetalleProducto from "./views/DetalleProducto";
import DetalleCliente from "./views/DetalleCliente";
import ComoComprar from "./components/ComoComprar";
import Precios from "./components/Precios";
import Ejemplos from "./components/Ejemplos";
import PagoResultado from "./views/PagoResultado";
import NotFound from "./components/NotFound";
import ResetPassword from "./views/ResetPassword";
import Contacto from "./components/Contacto";
import Configuraciones from "./views/Configuraciones";
import QuienesSomos from "./components/QuienesSomos";
import EditarCupon from "./components/EditarCupon";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Inicio /> },
      { path: "/product", element: <Product /> },
      { path: "/como-comprar", element: <ComoComprar /> },
      { path: "/contacto", element: <Contacto /> },
      { path: "/quienes-somos", element: <QuienesSomos /> },
      { path: "/precios", element: <Precios /> },
      { path: "/ejemplos", element: <Ejemplos /> },
      { path: "/finalizar-compra", element: <CheckOut /> },
      { path: "auth/login", element: <Login /> },
      { path: "auth/reset-password", element: <ResetPassword /> },
      { path: "auth/register", element: <Register /> },
      { path: "/pagos/:estado", element: <PagoResultado /> },

    ],
  },
  {
    path: "/mi-cuenta",
    element: <AuthLayout />,
    children: [
      { index: true, element: <MyAccount /> },

    ],
  },
  {
    path: "/admin-dash",
    element: <AdminLayout />,
    children: [
      { index: true, element: <Ordenes /> },
      { path: "ordenes/:id", element: <DetalleOrden /> }, // /admin-dash/ordenes/15
      { path: '/admin-dash/productos', element: <ProductosAdmin /> },
      { path: "/admin-dash/productos/editar/:id", element: <DetalleProducto /> }, // /admin-dash/ordenes/15
      { path: "/admin-dash/clientes/:id", element: <DetalleCliente /> }, // /admin-dash/ordenes/15
      { path: '/admin-dash/usuarios', element: <Users /> },
      { path: '/admin-dash/carritos-abandonados', element: <CartAbandoment /> },
      {
        path: "/admin-dash/configuraciones",
        element: <Configuraciones />
      },
      {
        path: "/admin-dash/descuentos/:id",
        element: <EditarCupon />
      }

    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;

import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import clienteAxios from "../config/axios";
import { v4 as uuidv4 } from 'uuid';
import useAuthBase from "../hooks/useBaseAuth";

const ProviderContext = createContext();

const Provider = ({ children }) => {
    const { mutate } = useAuthBase(); // ✅ ya no requiere <Router>

    const auth = {
        isAuthenticated: false,
        user: null,
        token: null,
    };

    const [producto, setProducto] = useState();
    const [total, setTotal] = useState(0);
    const [sessionToken, setSessionToken] = useState(null);
    const [pedido, setPedido] = useState([]);
    const [carrito, setCarrito] = useState([]);

    const getProducto = async () => {
        try {
            const { data } = await clienteAxios('/api/productos');
            let producto = data.data[0];
            setProducto(producto);
        } catch (error) {
        }
    };

    const handleAgregarPedido = carrito => {
        setPedido(prev => [...prev, carrito]);
        toast.success("Producto agregado al carrito", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    };

    const handleAddCart = async (carrito) => {
        try {
            const formData = new FormData();
            formData.append('producto_id', carrito.id);
            formData.append('cantidad', carrito.quantity);
            formData.append('session_token', sessionToken);

            carrito.images.forEach((img, index) => {
                formData.append(`imagenes[${index}]`, img);
            });

            const { data } = await clienteAxios.post('/api/carritos', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            setPedido(prev => [...prev, data.carrito]);
            const nuevoPedido = [...pedido, data.carrito];

            localStorage.setItem("pedido", JSON.stringify(nuevoPedido)); // ✅ guardar el nuevo array

            toast.success('Producto agregado al carrito');
            return true;

        } catch (error) {
            if (error.response && error.response.data) {
                const mensaje = error.response.data.message || 'Error al agregar producto al carrito';
                toast.error(mensaje);
            } else {
                toast.error('Error al conectar con el servidor');
            }
        }
    };

    const handleSubmitNuevaOrden = async (order) => {
        try {

            const url = `/api/pedidos`;
            const respuesta = await clienteAxios.post(url, order, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const { init_point, token, user } = respuesta.data;

            // ✅ Guardar token si se generó y actualizar el usuario
            if (token) {
                localStorage.setItem('AUTH_TOKEN', token);
                await mutate(); // ✅ actualiza el usuario global
            }


            if (init_point) {
                localStorage.removeItem("pedido"); // ✅ limpiar el carrito solo si se creó la preferencia de pago
                setPedido([]); // 🧼 limpiar el estado del pedido
                window.location.href = init_point;
            } else {
                toast.error("No se recibió un link de pago.", {
                    position: "top-right",
                    autoClose: 3000,
                });
            }

        } catch (error) {
            toast.error("Hubo un error al realizar el pedido", {
                position: "top-right",
                autoClose: 3000,
            });
        }
    };
    const handleEliminarPedido = async (id) => {
        const nuevoPedido = pedido.filter(producto => producto.id !== id);
        setPedido(nuevoPedido);
        localStorage.setItem("pedido", JSON.stringify(nuevoPedido)); // 🧼 limpiás antes del DELETE

        try {
            await clienteAxios.delete(`/api/carritos/${id}`);

            toast.error("Producto eliminado del carrito", {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } catch (error) {
            toast.error("Producto eliminado del carrito", {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    };


    useEffect(() => {
        obtenerCategorias();
        getProducto();
        const storedPedido = localStorage.getItem("pedido");
        if (storedPedido) {
            try {
                setPedido(JSON.parse(storedPedido));
            } catch (e) {
            }
        }
        const existingToken = localStorage.getItem("session_token");
        if (!existingToken) {
            const newToken = uuidv4();
            localStorage.setItem("session_token", newToken);
            setSessionToken(newToken);
        } else {
            setSessionToken(existingToken);
        }



    }, []);


    // Recalcular total cuando cambia el carrito
    useEffect(() => {
        const nuevoTotal = pedido.reduce((sum, producto) => {
            return sum + producto.cantidad * producto.precio_unidad;
        }, 0);
        setTotal(nuevoTotal);

    }, [pedido]);

    const obtenerCategorias = async () => {
        try {
            const url = `/api/categorias`;
            const respuesta = await clienteAxios.get(url);
            const categorias = respuesta.data;
            return categorias;
        } catch (error) {
        }
    };

    return (
        <ProviderContext.Provider value={{
            auth,
            pedido,
            total,
            producto,
            handleAgregarPedido,
            handleAddCart,
            handleEliminarPedido,
            handleSubmitNuevaOrden,
        }}>
            {children}
        </ProviderContext.Provider>
    );
};

export default ProviderContext;
export { Provider };

import { Link } from "react-router-dom";
import useCont from "../hooks/useCont";
import ResumenProducto from "./ResumenProducto";

// Simulamos reglas dinámicas (podés traerlas del contexto o backend)
const reglasCantidad = [
    { cantidad: 3, descuento: 10 },
    { cantidad: 6, descuento: 20 },
];

const Resumen = () => {
    const { pedido, handleSubmitNuevaOrden, total } = useCont();

    // Total de unidades del carrito
    const totalUnidades = pedido.reduce((acc, producto) => acc + parseInt(producto.cantidad), 0);

    // Buscar la regla de descuento más alta que se cumpla
    const reglaAplicada = reglasCantidad
        .filter(regla => totalUnidades >= regla.cantidad)
        .sort((a, b) => b.descuento - a.descuento)[0];

    const descuento = reglaAplicada ? reglaAplicada.descuento : 0;
    const totalConDescuento = total - (total * (descuento / 100));

    const handleSubmit = e => {
        e.preventDefault();
        handleSubmitNuevaOrden(pedido);
    };

    return (
        <aside>
            <h3 className="text-xl font-bold mb-4">Resumen del pedido</h3>
            <div className="py-10">
                {pedido.length === 0 ? (
                    <p className="text-center text-2xl">No hay productos en el pedido</p>
                ) : (
                    <>
                        {pedido.map((producto, index) => (
                            <div key={producto.id} className="flex justify-between items-center border-b py-3">
                                <ResumenProducto producto={producto} index={index} />
                            </div>
                        ))}

                        <div className="text-center mt-4 space-y-2">
                            {descuento > 0 && (
                                <p className="text-green-600 text-sm">
                                    Descuento aplicado: {descuento}% por comprar más de {reglaAplicada.cantidad} unidades
                                </p>
                            )}
                            <p className="text-2xl font-semibold">Total: ${totalConDescuento.toFixed(2)}</p>
                        </div>

                        <Link
                            to="/finalizar-compra"
                            className="bg-blue-600 text-white py-2 px-4 rounded-md mt-4 block text-center"
                        >
                            Finalizar compra
                        </Link>
                    </>
                )}
            </div>
        </aside>
    );
};

export default Resumen;

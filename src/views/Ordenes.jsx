import { useState } from "react";
import useSWR, { mutate } from "swr";
import clienteAxios from "../config/axios";
import { Link } from "react-router-dom";
import { mostrarConfirmacion, mostrarError, mostrarExito } from "../utils/Alertas";

const Ordenes = () => {
  const token = localStorage.getItem("AUTH_TOKEN");

  const [estado, setEstado] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [direccion, setDireccion] = useState("desc");
  const [perPage, setPerPage] = useState(10);
  const [pagina, setPagina] = useState(1);

  // Construcción dinámica del query
  const params = new URLSearchParams();
  if (estado !== "") params.append("estado", estado);
  if (busqueda.length >= 4) params.append("busqueda", busqueda);
  if (direccion) params.append("direccion", direccion);
  if (perPage) params.append("per_page", perPage);
  if (pagina) params.append("page", pagina);

  const query = params.toString();

  const fetcher = () =>
    clienteAxios(`/api/pedidos?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => res.data);

  const { data, error, isLoading } = useSWR(`/api/pedidos?${query}`, fetcher);

  if (isLoading) return <p>Cargando órdenes...</p>;
  if (error) return <p>Error al cargar las órdenes.</p>;

  const pedidos = data?.data || [];
  const meta = data?.meta || {};
  const handleEliminarPedido = async (id) => {
    const confirmar = await mostrarConfirmacion(
      '¿Desea eliminar este pedido?',
      'Esta acción eliminará el estado del pedido.'
    );
    if (!confirmar) return;

    try {
      const respuesta = await clienteAxios.delete(`/api/pedidos/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      mostrarExito(respuesta.data.message)
      mutate(`/api/pedidos?${query}`);
    } catch (error) {
      mostrarError('Error al eliminar el pedido')
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-6">Administrar Órdenes</h2>

      <div className="flex flex-wrap gap-4 mb-4 items-center">
        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={busqueda}
            onChange={(e) => {
              setBusqueda(e.target.value);
              setPagina(1);
            }}
            placeholder="Buscar por cliente"
            className="border px-3 py-1 rounded w-52"
          />
          {busqueda && (
            <button
              onClick={() => {
                setBusqueda("");
                setPagina(1);
              }}
              className="text-sm text-red-500 underline"
            >
              Limpiar
            </button>
          )}
        </div>

        {busqueda.length > 0 && busqueda.length < 4 && (
          <p className="text-sm text-yellow-600">
            Escribí al menos 4 letras para buscar.
          </p>
        )}

        <select
          onChange={(e) => {
            setEstado(e.target.value);
            setPagina(1);
          }}
          className="border px-2 py-1 rounded"
          value={estado}
        >
          <option value="">Todos los estados</option>
          <option value="0">Pendiente</option>
          <option value="1">Completado</option>
        </select>

        <select
          onChange={(e) => {
            setDireccion(e.target.value);
            setPagina(1);
          }}
          className="border px-2 py-1 rounded"
          value={direccion}
        >
          <option value="desc">Fecha ↓ Recientes</option>
          <option value="asc">Fecha ↑ Antiguos</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-200">
        <table className="min-w-full text-sm text-gray-800 bg-white">
          <thead className="bg-gray-100 text-xs text-gray-600 uppercase">
            <tr>
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-left">Cliente</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Total</th>
              <th className="px-4 py-3 text-left">Cantidad</th>
              <th className="px-4 py-3 text-left">Estado</th>
              <th className="px-4 py-3 text-left">Fecha</th>
              <th className="px-4 py-3 text-left">Acción</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map((pedido) => (
              <tr
                key={pedido.id}
                className="hover:bg-gray-50 border-t border-gray-200 transition"
              >
                <td className="px-4 py-3">{pedido.id}</td>
                <td className="px-4 py-3">{pedido.usuario?.name}</td>
                <td className="px-4 py-3">{pedido.usuario?.email}</td>
                <td className="px-4 py-3 font-medium">${pedido.total}</td>
                <td className="px-4 py-3">
                  {pedido.carritos.reduce((total, carrito) => total + carrito.cantidad, 0)}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${pedido.estado === 0
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800"
                      }`}
                  >
                    {pedido.estado }
                  </span>
                </td>
                <td className="px-4 py-3">
                  {new Date(pedido.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 flex gap-2">
                  <Link
                    to={`/admin-dash/ordenes/${pedido.id}`}
                    className="px-3 py-1 text-sm font-semibold bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  >
                    Ver
                  </Link>
                  <button
                    onClick={() => handleEliminarPedido(pedido.id)}
                    className="px-3 py-1 text-sm font-semibold bg-red-600 text-white rounded hover:bg-red-700 transition"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex gap-4 items-center">
        <button
          onClick={() => setPagina((prev) => Math.max(1, prev - 1))}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          disabled={pagina <= 1}
        >
          Anterior
        </button>
        <span className="text-sm">
          Página {meta.current_page || pagina} de {meta.last_page || "?"}
        </span>
        <button
          onClick={() =>
            setPagina((prev) =>
              meta.last_page ? Math.min(meta.last_page, prev + 1) : prev + 1
            )
          }
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          disabled={meta.last_page && pagina >= meta.last_page}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default Ordenes;

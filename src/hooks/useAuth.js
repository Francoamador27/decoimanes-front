import clienteAxios from "../config/axios";
import useSWR from "swr";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';

const UseAuth = ({ middleware, url }) => {
    const token = localStorage.getItem('AUTH_TOKEN');
    const navigate = useNavigate();
    const [loggingOut, setLoggingOut] = useState(false);

    const { data: user, error, mutate } = useSWR('/api/user', () =>
        clienteAxios('/api/user', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => res.data)
            .catch((error) => {
                throw new Error(error?.response?.data?.errors || 'Error desconocido');
            })
    );

    const isLoading = !user && !error; // <<< Detecta si está cargando
    const login = async (datos, setErrores, setLoading) => {
        try {
            setLoading(true); // ✅ Activar
            const { data } = await clienteAxios.post('/api/login', datos);
            localStorage.setItem('AUTH_TOKEN', data.token);
            setErrores(null);
            await mutate();
        } catch (error) {
            setErrores(error.response?.data?.errors || 'Error al iniciar sesión');
            setLoading(false); // ✅ Desactivar
        }
    };

    const register = async (datos, setErrores) => {
        // Implementar si lo necesitás
        try {
            const { data } = await clienteAxios.post('/api/register', datos);
            localStorage.setItem('AUTH_TOKEN', data.token);
            setErrores(null);
            await mutate();

        }
        catch (error) {
            setErrores(Object.values(error.response.data.errors));
        }
    }

    const logout = async () => {
        try {
            setLoggingOut(true);
            await clienteAxios.post('/api/logout', {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            localStorage.removeItem('AUTH_TOKEN');
            await mutate(undefined);
        } catch {
            throw new Error('Error al cerrar sesión');
        } finally {
            setLoggingOut(false);
        }
    }

useEffect(() => {
    if (loggingOut || isLoading) return;

    // Redirigir admins al dashboard solo si están en el login
    if (middleware === 'guest' && user && user.admin && location.pathname === '/auth/login') {
        navigate('/admin-dash');
        return;
    }

    // Redirigir usuarios comunes solo si NO son admin
    if (middleware === 'guest' && url && user && !user.admin) {
        navigate(url);
    }

    if (middleware === 'auth' && error) {
        navigate('/auth/login');
    }
}, [user, error, loggingOut, isLoading]);

 // <<< Agregado isLoading en dependencias


    return {
        login,
        register,
        logout,
        user,
        error,
    }
}

export default UseAuth;

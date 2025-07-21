import React, { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { LogOut } from 'lucide-react';


import {
    Drawer,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    IconButton,
    Toolbar,
    Typography,
    Box,
    CssBaseline,
    Divider,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import {
    ShoppingCart,
    Package,
    Users,
    ShoppingBasket,
    GalleryThumbnails,
    FilePlus2,
    MessageSquareQuote
} from 'lucide-react';
import UseAuth from '../hooks/useAuth';

const drawerWidth = 240;
const collapsedWidth = 72;

const AdminSidebar = () => {
    const [open, setOpen] = useState(true);
    const location = useLocation(); // ✅ Obtenemos la ruta actual
    const { logout } = UseAuth({ middleware: 'auth' })
    const handleDrawerToggle = () => {
        setOpen(!open);
    };

    const menuItems = [
        { text: 'Pedidos', icon: <ShoppingCart size={20} />, path: '/admin-dash' },
        { text: 'Productos', icon: <Package size={20} />, path: '/admin-dash/productos' },
        { text: 'Usuarios', icon: <Users size={20} />, path: '/admin-dash/usuarios' },
        { text: 'Carritos Abandonados', icon: <ShoppingBasket size={20} />, path: '/admin-dash/carritos-abandonados' },
        { text: 'Configuraciones', icon: <MenuIcon />, path: '/admin-dash/configuraciones' }, // 👈 nuevo ítem
        { text: 'Testimonios', icon: <MessageSquareQuote />, path: '/admin-dash/testimonios' },
        { text: 'Ejemplos', icon: <GalleryThumbnails />, path: '/admin-dash/ejemplos' },
        { text: 'Crear un pedido', icon: <FilePlus2 />, path: '/product' },

    ];

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />

            <Drawer
                variant="permanent"
                open={open}
                sx={{
                    width: open ? drawerWidth : collapsedWidth,
                    flexShrink: 0,
                    whiteSpace: 'nowrap',
                    '& .MuiDrawer-paper': {
                        width: open ? drawerWidth : collapsedWidth,
                        transition: 'width 0.3s ease',
                        overflowX: 'hidden',
                    },
                }}
            >
                <Toolbar
                    sx={{
                        display: 'flex',
                        justifyContent: open ? 'flex-end' : 'center',
                        px: 1,
                    }}
                >
                    <IconButton onClick={handleDrawerToggle}>
                        <MenuIcon />
                    </IconButton>
                </Toolbar>

                <Divider />
                <List>
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;

                        return (
                            <NavLink
                                to={item.path}
                                key={item.text}
                                style={{ textDecoration: 'none', color: 'inherit' }}
                            >
                                <ListItemButton
                                    selected={isActive}
                                    sx={{
                                        justifyContent: open ? 'initial' : 'center',
                                        px: 2.5,
                                        backgroundColor: isActive ? '#e3f2fd' : 'inherit', // ← color suave
                                        '&.Mui-selected': {
                                            backgroundColor: '#e3f2fd', // ← también acá
                                            '&:hover': {
                                                backgroundColor: '#bbdefb', // ← un poco más oscuro al hacer hover
                                                color: 'black',
                                            },
                                        },
                                    }}
                                >

                                    <ListItemIcon
                                        sx={{
                                            minWidth: 0,
                                            mr: open ? 2 : 'auto',
                                            justifyContent: 'center',
                                            color: isActive ? 'primary.main' : 'inherit',
                                        }}
                                    >
                                        {item.icon}
                                    </ListItemIcon>
                                    {open && (
                                        <ListItemText
                                            primary={item.text}
                                            primaryTypographyProps={{
                                                fontSize: '0.875rem',
                                                fontWeight: 500,
                                            }}
                                        />
                                    )}
                                </ListItemButton>
                            </NavLink>
                        );
                    })}
                </List>
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: 0,
                        width: '100%',
                    }}
                    className='bg-red-500 text-white'

                >
                    <ListItemButton
                        onClick={() => {
                            // Acá poné tu lógica de logout
                            logout();
                        }}
                        sx={{
                            justifyContent: open ? 'initial' : 'center',
                            px: 2.5,
                        }}
                    >
                        <ListItemIcon
                            sx={{
                                minWidth: 0,
                                mr: open ? 2 : 'auto',
                                justifyContent: 'center',
                            }}
                        >
                            <LogOut size={20} />
                        </ListItemIcon>
                        {open && (
                            <ListItemText
                                primary="Cerrar sesión"
                                primaryTypographyProps={{
                                    fontSize: '0.875rem',
                                    fontWeight: 500,
                                }}
                            />
                        )}
                    </ListItemButton>
                </Box>

            </Drawer>

            <Box
                component="main"
                className="bg-gray-50 min-h-screen"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    transition: 'margin 0.3s ease',
                }}
            >
                <Toolbar />
                <Outlet />
            </Box>
        </Box>
    );
};

export default AdminSidebar;

import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/header/Header';
import UseAuth from '../hooks/useAuth';
import Footer from '../components/footer/Footer';

const Layout = () => {
  const { user, error } = UseAuth({ middleware: 'guest' });

  return (
    <>

      <Header />
      <Outlet />
      <Footer />
    </>
  );
};

export default Layout;

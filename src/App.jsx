import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { Home } from './pages/Home/Home';
import { Product } from './pages/Product/Product';
import { Products } from './pages/Products/Products';

import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import './App.scss';
import ScrollToTop from 'react-scroll-to-top';
import Checkout from './pages/Checkout/Checkout';
import Login from './components/Login/Login';
import { UserCenter } from './pages/UserCenter/UserCenter';

const Layout = () => {
  return (
    <div className="app">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
};
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/product/:id',
        element: <Product />,
      },
      {
        path: '/products/all',
        element: <Products />,
      },
      {
        path: '/products/search',
        element: <Products />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/checkout',
        element: <Checkout />,
      },
      {
        path: '/user/account/:id',
        element: <UserCenter />,
      },
    ],
  },
]);

function App() {
  return (
    <div className="app">
      <RouterProvider router={router} />
      <ScrollToTop smooth />
    </div>
  );
}

export default App;

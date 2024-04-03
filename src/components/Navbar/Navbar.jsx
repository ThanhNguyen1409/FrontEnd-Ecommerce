import React, { useEffect, useState } from 'react';

import SearchIcon from '@mui/icons-material/Search';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import { Link } from 'react-router-dom';
import './Navbar.scss';
import Cart from '../Cart/Cart';
import { useSelector } from 'react-redux';
import Modal from 'react-bootstrap/Modal';
import Login from '../Login/Login';

import SearchBar from '../SearchBar/SearchBar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ConfigProvider, Drawer, Menu } from 'antd';
import SubMenu from 'antd/es/menu/SubMenu';
import { useMediaQuery } from 'react-responsive';
import { MenuOutlined } from '@mui/icons-material';

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const products = useSelector((state) => state.cart.products);
  const [searchOpen, setSearchOpen] = useState(false);
  const [show, setShow] = useState(false);
  const [openNavbar, setOpenNavbar] = useState(false);
  const user = useSelector((state) => state.login.user);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [scrolling, setScrolling] = useState(false);
  const [key, setKey] = useState('Home');
  const isSmallScreen = useMediaQuery({ maxWidth: 768 });

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolling(true);
      } else {
        setScrolling(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  const handleChange = (value, setSelected) => {
    setSelected(!value);
  };
  const totalProducts = () => {
    let total = 0;
    if (products) {
      products.forEach((item) => {
        total += item.quantity;
      });
      return total;
    }
  };

  const items = [
    {
      label: (
        <Link className="link" to="/">
          TRANG CHỦ
        </Link>
      ),
      key: 'Home',
    },
    {
      label: (
        <Link className="link" to="/products/all">
          SẢN PHẨM
        </Link>
      ),
      key: 'Products',
    },
    {
      label: (
        <Link className="link" to="/">
          LIÊN HỆ
        </Link>
      ),
      key: 'Contact',
    },
  ];
  return (
    <ConfigProvider
      theme={{
        components: {
          Menu: {
            horizontalItemHoverColor: '#000000',
            horizontalItemSelectedColor: '#000000',
            algorithm: true,
          },
        },
      }}
    >
      <div className={scrolling ? 'nav-bar scrolled' : 'nav-bar'}>
        <div className="wrapper">
          <div className="center">
            <Link
              className="link"
              to="/"
              onClick={() => {
                setKey('Home');
              }}
            >
              STORE
            </Link>
          </div>

          <div className="right">
            {!isSmallScreen && (
              <div className="item">
                <Menu
                  onClick={(e) => {
                    setKey(e.key);
                  }}
                  selectedKeys={[key]}
                  mode="horizontal"
                  items={items}
                  style={{ backgroundColor: 'transparent' }}
                  defaultSelectedKeys={[key]}
                ></Menu>
              </div>
            )}

            <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton></Modal.Header>
              <Login onClick={handleClose} />
            </Modal>
            <ToastContainer />
            <div className="icon">
              <div className="searchIcon">
                <div
                  onClick={() => {
                    handleChange(searchOpen, setSearchOpen);
                  }}
                >
                  <SearchIcon />
                </div>

                <SearchBar
                  searchOpen={searchOpen}
                  setSearchOpen={setSearchOpen}
                  handleChange={handleChange}
                />
              </div>
              {user.id == null ? (
                <div className="item" onClick={handleShow}>
                  <PersonOutlineOutlinedIcon />
                </div>
              ) : (
                <Link className="link" to={`/user/account/${user.id}`}>
                  <PersonOutlineOutlinedIcon />
                </Link>
              )}
              <FavoriteBorderOutlinedIcon />
              <div
                className="cartIcon"
                onClick={() => {
                  handleChange(open, setOpen);
                }}
              >
                <ShoppingCartOutlinedIcon />
                <span>{totalProducts()}</span>
              </div>
              {isSmallScreen && (
                <div
                  className="item"
                  onClick={() => {
                    setOpenNavbar(true);
                  }}
                >
                  <MenuOutlined />
                </div>
              )}
              <Drawer
                onClose={() => {
                  handleChange(openNavbar, setOpenNavbar);
                }}
                open={openNavbar}
              >
                <Menu
                  onClick={(e) => {
                    setKey(e.key);
                    setOpenNavbar(false);
                  }}
                  selectedKeys={[key]}
                  mode="inline"
                  items={items}
                  style={{ backgroundColor: 'transparent' }}
                  defaultSelectedKeys={[key]}
                ></Menu>
              </Drawer>
            </div>
          </div>
        </div>

        {<Cart open={open} setOpen={setOpen} />}
      </div>
    </ConfigProvider>
  );
};

export default Navbar;

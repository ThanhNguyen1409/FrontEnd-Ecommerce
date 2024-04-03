import React, { useEffect, useState } from 'react';
import './UserCenter.scss';
import UserInformation from './UserInformation/UserInformation';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { Menu } from 'antd';
import { UserOutlined, BookOutlined } from '@ant-design/icons';
import Order from './Order/Order';
import { GoTop } from '../../Function/ScrollToTop';
import { useDispatch } from 'react-redux';
import { logOut } from '../../redux/userReducer';
const { SubMenu } = Menu;

export const UserCenter = () => {
  const [selectedTab, setSelectedTab] = useState('userInfo');
  const dispatch = useDispatch();

  GoTop();
  const handleClick = (value) => {
    setSelectedTab(value);
  };

  const renderSelectedComponent = () => {
    switch (selectedTab) {
      case 'userInfo':
        return <UserInformation />;
      case 'addressInfo':
        return null; // Add the corresponding component for addressInfo and favoriteProducts
      case 'favoriteProducts':
        return null; // Add the corresponding component for favoriteProducts
      case 'allOrders':
        return <Order status="all" />;
      case 'processingOrders':
        return <Order status="Đang xử lý" />;
      case 'deliveringOrders':
        return <Order status="Đang giao" />;
      case 'deliveredOrders':
        return <Order status="Đã giao" />;
      case 'cancelledOrders':
        return <Order status="Đã hủy" />;
      default:
        return null;
    }
  };

  return (
    <div className="user-bar">
      <div className="left">
        <Menu
          mode="inline"
          defaultSelectedKeys={['userInfo']}
          selectedKeys={[selectedTab]}
          onClick={({ key }) => handleClick(key)}
          // inlineCollapsed={true}
        >
          <SubMenu
            key="account"
            icon={<UserOutlined />}
            title="Tài khoản của tôi"
          >
            <Menu.Item key="userInfo">Thông tin của tôi</Menu.Item>
            <Menu.Item key="addressInfo">Sổ địa chỉ</Menu.Item>
            <Menu.Item key="favoriteProducts">Sản phẩm yêu thích</Menu.Item>
            <Menu.Item
              key="logOut"
              onClick={() => {
                dispatch(logOut());
              }}
            >
              <Link to="/">Logout</Link>
            </Menu.Item>
          </SubMenu>
          <SubMenu
            key="orders"
            icon={<BookOutlined />}
            title="Đơn hàng của tôi"
          >
            <Menu.Item key="allOrders">Tất cả đơn hàng</Menu.Item>
            <Menu.Item key="processingOrders">Đơn hàng đang xử lý</Menu.Item>
            <Menu.Item key="deliveringOrders">Đơn hàng đang giao</Menu.Item>
            <Menu.Item key="deliveredOrders">Đơn hàng đã giao</Menu.Item>
            <Menu.Item key="cancelledOrders">Đơn hàng đã hủy</Menu.Item>
          </SubMenu>
        </Menu>
      </div>

      <div className="right">{renderSelectedComponent()}</div>
    </div>
  );
};

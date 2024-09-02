import { Menu } from "antd";
import React, { useState } from "react";
import { AppstoreOutlined, ShoppingCartOutlined, UserOutlined} from '@ant-design/icons';
import { getItem } from "../../utils";
import HeaderComponent from "../../components/HeaderComponent/HeaderComponent";
import AdminUser from '../../components/AdminUser/AdminUser';
import AdminProduct from '../../components/AdminProduct/AdminProduct';

const AdminPage = () => {
  
  const items = [
    getItem('Người dùng', 'users', <UserOutlined />),
    getItem('Sản phẩm', 'products', <AppstoreOutlined />),
    getItem('Đơn hàng', 'orders', <ShoppingCartOutlined />),
    
  ];
  const [keySelected, setKeySelected] = useState('');

  const renderPage = (key) => {
    switch (key) {
      case 'users':
        return (
          <AdminUser />
        )
      case 'products':
        return (
          <AdminProduct />
        )
      default:
        return <></>
    }
  }

  const handleOnClick = ({key}) => {
    setKeySelected(key)
  }

  return (
    <>
    <HeaderComponent isHiddenSearch isHiddenCart/>
    <div style={{display:'flex',overflowX: 'hidden' }}>
    <Menu
      mode="inline"
      defaultSelectedKeys={["231"]}
      style={{
        width: 256,
        boxShadow: '1px 1px 2px #ccc',
        height:'100vh',
      }}
      items={items}
      onClick={handleOnClick}
    />
      <div style={{ flex: 1, padding: '15px 0 15px 15px' }}>
       {renderPage(keySelected)}
      </div>
    </div>
    </>
  );
};

export default AdminPage;

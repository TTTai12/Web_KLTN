import { getItem } from "../../utils";
import React, { useState } from "react";

const AdminSidebar = ({ keySelected, onClick }) => {
  const items = [
    getItem("Dashboard", "dashboard", <i className="fas fa-home"></i>),
    getItem("Người dùng", "users", <i className="fas fa-users"></i>),
    getItem(
      "Sản phẩm",
      "products",
      <i
        className="
fas fa-box-open"
      ></i>
    ),
    getItem("Đơn hàng", "orders", <i className="fas fa-shopping-cart"></i>),
    getItem("Đánh giá", "review", <i className="fas fa-bell"></i>),
    getItem("Settings", "settings", <i className="fas fa-cog"></i>),
  ];

  return (
    <div style={{ display: "flex", overflowX: "hidden" }}>
      <div className="sidebar" data-background-color="dark">
        <div className="sidebar-logo">
          {/* Logo Header */}
          <div className="logo-header" data-background-color="dark">
            <a href="/" className="logo">
              <img
                src="../../assets/img/kaiadmin/logo_light.svg"
                alt="navbar brand"
                className="navbar-brand"
                height="20"
              />
            </a>
            <div className="nav-toggle">
              <button className="btn btn-toggle toggle-sidebar">
                <i className="gg-menu-right"></i>
              </button>
              <button className="btn btn-toggle sidenav-toggler">
                <i className="gg-menu-left"></i>
              </button>
            </div>
            <button className="topbar-toggler more">
              <i className="gg-more-vertical-alt"></i>
            </button>
          </div>
          {/* End Logo Header */}
        </div>
        <div className="sidebar-wrapper scrollbar scrollbar-inner">
          <div className="sidebar-content">
            <ul className="nav nav-secondary">
             
              <li className="nav-section">
                <span className="sidebar-mini-icon">
                  <i className="fa fa-ellipsis-h"></i>
                </span>
                <h4 className="text-section">Components</h4>
              </li>
              {/* Thêm các mục khác từ items */}
              {items.map((item) => (
                <li
                  className={`nav-item ${
                    keySelected === item.key ? "active" : ""
                  }`}
                  key={item.key}
                >
                  <a onClick={() => onClick(item)}>
                    {" "}
                    {/* Sử dụng onClick được truyền vào */}
                    {item.icon}
                    <p>{item.label}</p>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AdminSidebar;

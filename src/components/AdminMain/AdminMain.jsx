import React, { useState, useEffect } from 'react';
import { Card } from 'antd';
import { filterDataByDate1 } from '../../utils'; // Đảm bảo hàm này được export từ utils

const AdminMain = ({ orders }) => {
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const currentDate = new Date().toLocaleDateString();

  useEffect(() => {
    if (orders) {
      const result = filterDataByDate1(orders, currentDate);
      setTotalOrders(result.totalOrders);
      setTotalRevenue(result.totalRevenue);
    }
  }, [orders, currentDate]);

  return (
    <div className="row">
      <div className="col-sm-6 col-md-3">
        <div className="card card-stats card-round">
          <div className="card-body">
            <div className="row align-items-center">
              <div className="col-icon">
                <div className="icon-big text-center icon-primary bubble-shadow-small">
                  <i className="fas fa-users"></i>
                </div>
              </div>
              <div className="col col-stats ms-3 ms-sm-0">
                <div className="numbers">
                  <p className="card-category">Người dùng</p>
                  <h4 className="card-title">0</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-sm-6 col-md-3">
        <div className="card card-stats card-round">
          <div className="card-body">
            <div className="row align-items-center">
              <div className="col-icon">
                <div className="icon-big text-center icon-success bubble-shadow-small">
                  <i className="fas fa-luggage-cart"></i>
                </div>
              </div>
              <div className="col col-stats ms-3 ms-sm-0">
                <div className="numbers">
                  <p className="card-category">Doanh thu</p>
                  <h4 className="card-title">{totalRevenue}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-sm-6 col-md-3">
        <div className="card card-stats card-round">
          <div className="card-body">
            <div className="row align-items-center">
              <div className="col-icon">
                <div className="icon-big text-center icon-secondary bubble-shadow-small">
                  <i className="far fa-check-circle"></i>
                </div>
              </div>
              <div className="col col-stats ms-3 ms-sm-0">
                <div className="numbers">
                  <p className="card-category">Đơn hàng</p>
                  <h4 className="card-title">{totalOrders}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMain;

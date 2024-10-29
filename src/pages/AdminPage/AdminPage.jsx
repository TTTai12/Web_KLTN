import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import AdminSidebar from "../../components/AdminSidebar/AdminSidebar";
import AdminHeader from "../../components/AdminHeader/AdminHeader";
import AdminUser from "../../components/AdminUser/AdminUser";
import AdminProduct from "../../components/AdminProduct/AdminProduct";
import OrderAdmin from "../../components/OrderAdmin/OrderAdmin";
import AdminMain from "../../components/AdminMain/AdminMain";
import WebFont from "webfontloader";
import $ from "jquery"; // Import jQuery
import "jquery-sparkline"; // Import Sparkline

const AdminPage = () => {
  const [keySelected, setKeySelected] = useState("");

  const renderPage = (key) => {
    switch (key) {
      case "users":
        return <AdminUser />;
      case "products":
        return <AdminProduct />;
      case "orders":
        return <OrderAdmin />;
      case "dashboard":
        return <AdminMain />;
      default:
        return null;
    }
  };

  const handleOnClick = ({ key }) => {
    setKeySelected(key);
  };

  useEffect(() => {
    // Tải font
    WebFont.load({
      google: { families: ["Public Sans:300,400,500,600,700"] },
      custom: {
        families: [
          "Font Awesome 5 Solid",
          "Font Awesome 5 Regular",
          "Font Awesome 5 Brands",
          "simple-line-icons",
        ],
        urls: ["assets/css/fonts.min.css"],
      },
      active: function () {
        sessionStorage.fonts = true;
      },
    });

    // Khởi tạo biểu đồ sparkline
    const initSparkline = () => {
      $("#lineChart").sparkline([102, 109, 120, 99, 110, 105, 115], {
        type: "line",
        height: "70",
        width: "100%",
        lineWidth: "2",
        lineColor: "#177dff",
        fillColor: "rgba(23, 125, 255, 0.14)",
      });
      $("#lineChart2").sparkline([99, 125, 122, 105, 110, 124, 115], {
        type: "line",
        height: "70",
        width: "100%",
        lineWidth: "2",
        lineColor: "#f3545d",
        fillColor: "rgba(243, 84, 93, .14)",
      });
      $("#lineChart3").sparkline([105, 103, 123, 100, 95, 105, 115], {
        type: "line",
        height: "70",
        width: "100%",
        lineWidth: "2",
        lineColor: "#ffa534",
        fillColor: "rgba(255, 165, 52, .14)",
      });
    };

    // Khởi tạo bản đồ
    const initMap = () => {
      const mapElement = document.querySelector("#map");
      if (mapElement) {
        new JsVectorMap({
          selector: "#map",
          map: "world",
        });
      }
    };

    // Khởi tạo các hiệu ứng sau khi DOM đã sẵn sàng
    initSparkline();
    initMap();
  }, []);

  return (
    <div>
      <Helmet>
        <link
          rel="icon"
          href="../../assets/img/kaiadmin/favicon.ico"
          type="image/x-icon"
        />
        <link rel="stylesheet" href="../../assets/css/bootstrap.min.css" />
        <link rel="stylesheet" href="../../assets/css/plugins.min.css" />
        <link rel="stylesheet" href="../../assets/css/kaiadmin.min.css" />
        <script src="../../assets/js/plugin/webfont/webfont.min.js"></script>
        <script src="../../assets/js/core/jquery-3.7.1.min.js"></script>
        <script src="../../assets/js/core/popper.min.js"></script>
        <script src="../../assets/js/core/bootstrap.min.js"></script>
        <script src="../../assets/js/plugin/jquery-scrollbar/jquery.scrollbar.min.js"></script>
        <script src="../../assets/js/plugin/chart.js/chart.min.js"></script>
        <script src="../../assets/js/plugin/jquery.sparkline/jquery.sparkline.min.js"></script>
        <script src="../../assets/js/plugin/chart-circle/circles.min.js"></script>
        <script src="../../assets/js/plugin/datatables/datatables.min.js"></script>
        <script src="../../assets/js/plugin/bootstrap-notify/bootstrap-notify.min.js"></script>
        <script src="../../assets/js/plugin/jsvectormap/jsvectormap.min.js"></script>
        <script src="../../assets/js/plugin/jsvectormap/world.js"></script>
        <script src="../../assets/js/plugin/sweetalert/sweetalert.min.js"></script>
        <script src="../../assets/js/kaiadmin.min.js"></script>
        <script src="../../assets/js/setting-demo.js"></script>
      </Helmet>
      <div className="wrapper">
        <AdminSidebar keySelected={keySelected} onClick={handleOnClick} />
        <div className="main-panel">
          <AdminHeader isHiddenSearch isHiddenCart />
          <div className="container">
            <div className="page-inner">{renderPage(keySelected)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;

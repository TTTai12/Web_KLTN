import React, { useState,  useEffect } from 'react';
import ProductDetailsComponent from "../../components/ProductDetailsComponent/ProductDetailsComponent";
import { Navigate, useNavigate, useParams } from "react-router-dom"
import TypeProduct from "../../components/TypeProduct/TypeProduct";
import * as ProductService from "../../services/ProductService";
import FooterComponent from '../../components/FooterComponent/FooterComponent';

const ProductDetailsPage = () => {
  const {id} = useParams()
  const navigate = useNavigate()
  const [typeProducts, setTypeProducts] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [products, setProducts] = useState([]);
  const [limit, setLimit] = useState(6);
  const fetchAllTypeProduct = async () => {
    const res = await ProductService.getAllTypeProduct();
    if (res?.status === "OK") {
      setTypeProducts(res?.data);
    }
  };
  useEffect(() => {
    fetchAllTypeProduct();
  }, []);
  const handleFilterByType = (type) => {
    setSelectedType(type);
    setLimit(6);
  };
  return (
    <>
    {/* <!-- NavbarTop Start --> */}
    <div className="container-fluid">
      <div className="row border-top px-xl-5">
        <div className="col-lg-3 d-none d-lg-block">
          <button
            className="btn shadow-none d-flex align-items-center justify-content-between bg-primary text-white w-100"
            data-toggle="collapse"
            data-target="#navbar-vertical"
            style={{ height: "65px", marginTop: "-1px", padding: "0 30px" }}
          >
            <h6 className="m-0">Danh mục</h6>
            <i className="fa fa-angle-down text-dark"></i>
          </button>
          <nav
            className="collapse position-absolute navbar navbar-vertical navbar-light align-items-start p-0 border border-top-0 border-bottom-0 bg-light"
            id="navbar-vertical"
            style={{ width: "calc(100% - 30px)", zIndex: 1 }}
          >
            <div className="navbar-nav w-100 overflow-hidden" style={{ height: "410px" }}>
              {typeProducts.map((item) => (
                <TypeProduct
                  key={item} // Sử dụng item làm key
                  name={item} // Truyền tên loại sản phẩm vào TypeProduct
                  onClick={() => handleFilterByType(item)} // Gọi hàm lọc khi loại sản phẩm được chọn
                />
              ))}
            </div>
          </nav>
        </div>
        <div className="col-lg-9">
          <nav className="navbar navbar-expand-lg bg-light navbar-light py-3 py-lg-0 px-0">
            <a href="/" className="text-decoration-none d-block d-lg-none">
              <h1 className="m-0 display-5 font-weight-semi-bold">
                <span className="text-primary font-weight-bold border px-3 mr-1">Fashion</span>
                Shop
              </h1>
            </a>
            <button
              type="button"
              className="navbar-toggler"
              data-toggle="collapse"
              data-target="#navbarCollapse"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse justify-content-between" id="navbarCollapse">
              <div className="navbar-nav mr-auto py-0">
                <a href="/" className="nav-item nav-link">Trang chủ</a>
                <a href="/products" className="nav-item nav-link active">Sản phẩm</a>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </div>
    {/* <!-- NavbarTop End --> */}
  
    {/* Page Header Start */}
    <div className="container-fluid bg-secondary mb-5">
      <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "300px" }}>
        <h1 className="font-weight-semi-bold text-uppercase mb-3">Fashion Shop</h1>
        <div className="d-inline-flex">
          <p className="m-0"><a href="/">Trang chủ</a></p>
          <p className="m-0 px-2">-</p>
          <p className="m-0">Chi tiết sản phẩm</p>
        </div>
      </div>
    </div>
    {/* Page Header End */}
  
    <ProductDetailsComponent idProduct={id} />
    <FooterComponent/>
  </>
  );
};

export default ProductDetailsPage;

import React, { useState, useEffect } from "react";
import NavBarComponent from "../../components/NavBarComponent/NavBarComponent";
import CardComponent from "../../components/CardComponent/CardComponent";
import { Col, Pagination, Row } from "antd";
import { WrapperNavbar, WrapperProducts } from "./style";
import { useLocation } from "react-router-dom";
import * as ProductService from "../../services/ProductService";
import Loading from "../../components/LoadingComponent/Loading";
import { useDebounce } from "../../hooks/useDebounce";
import TypeProduct from "../../components/TypeProduct/TypeProduct";
import FooterComponent from "../../components/FooterComponent/FooterComponent";
import { searchProduct as searchProductAction } from "../../redux/slides/productSlide";
import { useDispatch, useSelector } from "react-redux";
import ButttonInputSearchNavbar from "../../components/ButtonInputSearchNavbar/ButtonInputSearchNavbar";
const TypeProductPage = ({ isHiddenSearch = false }) => {
  const searchProduct = useSelector((state) => state?.product?.search);
  const searchDebounce = useDebounce(searchProduct, 500);
  const { state } = useLocation();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedGender, setSelectedGender] = useState(state?.gender || null);
  const [typeProducts, setTypeProducts] = useState([]);
  const [limit, setLimit] = useState(6);
  const [panigate, setPanigate] = useState({ page: 1, limit: 10, total: 1 });
  const handleFilterByType = (type, gender) => {
    setSelectedType(type);
    setSelectedGender(gender);
    setLimit(6);
  };
  const fetchProductType = async (type, gender, page, limit) => {
    setLoading(true);
    const res = await ProductService.getProductType(type, gender, page, limit);
    if (res?.status === "OK") {
      setLoading(false);
      setProducts(res?.data);
      setPanigate({ ...panigate, total: res?.totalPage });
    } else {
      setLoading(false);
      console.error(res?.message || "Error fetching products");
    }
  };
  useEffect(() => {
    console.log("State Type:", state?.type);
    console.log("State Gender:", state?.gender);
    if (state?.type && state?.gender) {
      fetchProductType(
        state.type,
        state.gender,
        panigate.page - 1,
        panigate.limit
      );
    } else {
      setProducts([]);
    }
  }, [state, panigate.page, panigate.limit]);
  const onChange = (page, pageSize) => {
    setPanigate({ ...panigate, page, limit: pageSize });
  };
  const fetchAllTypeProduct = async () => {
    const res = await ProductService.getAllTypeProduct();
    if (res?.status === "OK") {
      setTypeProducts(res?.data);
    }
  };
  useEffect(() => {
    fetchAllTypeProduct();
  }, []);
  const onSearch = (e) => {
    setSearch(e.target.value);
    dispatch(searchProductAction(e.target.value));
  };
  return (
    <Loading isPending={loading}>
      {" "}
      <div className="container-fluid">
        {" "}
        <div className="row border-top px-xl-5">
          {" "}
          <div className="col-lg-3 d-none d-lg-block">
            {" "}
            <button
              className="btn shadow-none d-flex align-items-center justify-content-between bg-primary text-white w-100"
              data-toggle="collapse"
              data-target="#navbar-vertical"
              style={{ height: "65px", marginTop: "-1px", padding: "0 30px" }}
            >
              {" "}
              <h6 className="m-0">Danh mục</h6>{" "}
              <i className="fa fa-angle-down text-dark"></i>{" "}
            </button>{" "}
            <nav
              className="collapse position-absolute navbar navbar-vertical navbar-light align-items-start p-0 border border-top-0 border-bottom-0 bg-light"
              id="navbar-vertical"
              style={{ width: "calc(100% - 30px)", zIndex: 1 }}
            >
              {" "}
              <div
                className="navbar-nav w-100 overflow-hidden"
                style={{ height: "410px" }}
              >
                {" "}
                {typeProducts.map((item) => (
                  <TypeProduct
                    key={item}
                    name={item}
                    gender={selectedGender}
                    onClick={() => handleFilterByType(item, selectedGender)}
                  />
                ))}
              </div>
            </nav>
          </div>
          <div className="col-lg-9">
            <nav className="navbar navbar-expand-lg bg-light navbar-light py-3 py-lg-0 px-0">
              <a href="" className="text-decoration-none d-block d-lg-none">
                <h1 className="m-0 display-5 font-weight-semi-bold">
                  <span className="text-primary font-weight-bold border px-3 mr-1">
                    E
                  </span>
                  Shopper
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
              <div
                className="collapse navbar-collapse justify-content-between"
                id="navbarCollapse"
              >
                <div className="navbar-nav mr-auto py-0">
                  <a href="/" className="nav-item nav-link">
                    Home
                  </a>
                  <a href="/products" className="nav-item nav-link active">
                    Shop
                  </a>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </div>
      {/* <!-- NavbarTop End --> */}
      {/* Page Header Start */}
      <div className="container-fluid bg-secondary mb-5">
        <div
          className="d-flex flex-column align-items-center justify-content-center"
          style={{ minHeight: "300px" }}
        >
          <h1 className="font-weight-semi-bold text-uppercase mb-3">
            Fashion Shop
          </h1>
          <div className="d-inline-flex">
            <p className="m-0">
              <a href="/">Trang chủ</a>
            </p>
            <p className="m-0 px-2">-</p>
            <p className="m-0">Danh mục sản phẩm</p>
          </div>
        </div>
      </div>
      {/* Page Header End */}
      <div class="container-fluid pt-5">
        <div class="row px-xl-5">
          <NavBarComponent />
          <div class="col-lg-9 col-md-12">
            <div className="row pb-3">
              <div className="col-12 pb-1">
                <div className="d-flex align-items-center justify-content-between mb-4">
                  {!isHiddenSearch && (
                    <ButttonInputSearchNavbar
                      size="large"
                      bordered={false}
                      textButton="Tìm kiếm"
                      placeholder="Bạn tìm gì hôm nay"
                      onChange={onSearch}
                      backgroundColorButton="#5a20c1"
                    />
                  )}
                  <div className="dropdown ml-4">
                    <button
                      className="btn border dropdown-toggle"
                      type="button"
                      id="triggerId"
                      data-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      Sort by
                    </button>
                    <div
                      className="dropdown-menu dropdown-menu-right"
                      aria-labelledby="triggerId"
                    >
                      <a className="dropdown-item" href="#">
                        Latest
                      </a>
                      <a className="dropdown-item" href="#">
                        Popularity
                      </a>
                      <a className="dropdown-item" href="#">
                        Best Rating
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {products
                ?.filter((pro) => {
                  if (searchDebounce === "") {
                    return pro;
                  } else if (
                    pro?.name
                      ?.toLowerCase()
                      ?.includes(searchDebounce?.toLowerCase())
                  ) {
                    return pro;
                  }
                })
                ?.map((product) => (
                  <CardComponent
                    key={product._id}
                    countInStock={product.countInStock}
                    description={product.description}
                    images={product.images}
                    name={product.name}
                    gender={product.gender}
                    price={product.price}
                    rating={product.rating}
                    type={product.type}
                    selled={product.selled}
                    discount={product.discount}
                    id={product._id} // Sử dụng spread operator để truyền props
                  />
                ))}

              <div className="col-12 pb-1">
                <Pagination
                  current={panigate.page}
                  pageSize={panigate.limit}
                  total={panigate.total * panigate.limit} // Tổng số sản phẩm
                  onChange={onChange}
                  style={{ textAlign: "center", marginTop: "10px" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <FooterComponent />
    </Loading>
  );
};

export default TypeProductPage;

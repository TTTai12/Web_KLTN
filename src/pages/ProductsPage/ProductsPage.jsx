import React, { useState, useEffect } from "react";
import NavBarComponent from "../../components/NavBarComponent/NavBarComponent";
import CardComponent from "../../components/CardComponent/CardComponent";
import { Col, Pagination, Row } from "antd";
import { WrapperNavbar, WrapperProducts } from "./style";
import * as ProductService from "../../services/ProductService";
import Loading from "../../components/LoadingComponent/Loading";
import { useDebounce } from "../../hooks/useDebounce";
import TypeProduct from "../../components/TypeProduct/TypeProduct";
import FooterComponent from "../../components/FooterComponent/FooterComponent";
import { searchProduct as searchProductAction } from "../../redux/slides/productSlide";
import { useDispatch, useSelector } from "react-redux";
import ButttonInputSearchNavbar from "../../components/ButtonInputSearchNavbar/ButtonInputSearchNavbar";

const ProductsPage = ({ isHiddenSearch = false }) => {
  const searchValue = useSelector((state) => state?.product?.search); // Đổi tên biến ở đây
  const searchDebounce = useDebounce(searchValue, 500);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(6);
  const dispatch = useDispatch();
  const [selectedType, setSelectedType] = useState(null);
  const [typeProducts, setTypeProducts] = useState([]);
  const [panigate, setPanigate] = useState({
    page: 1,
    limit: 10,
    total: 1,
  });

  const fetchAllTypeProduct = async () => {
    const res = await ProductService.getAllTypeProduct();
    if (res?.status === "OK") {
      setTypeProducts(res?.data);
    }
  };

  useEffect(() => {
    fetchAllTypeProduct();
  }, []);

  const fetchAllProducts = async (search, page, limit) => {
    setLoading(true);
    const res = await ProductService.getAllProduct(search, page, limit);
    if (res?.status === "OK") {
      setLoading(false);
      setProducts(res?.data);
      setPanigate({ ...panigate, total: res.total }); // Tổng số sản phẩm từ API
    } else {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchAllProducts(searchDebounce, panigate.page - 1, panigate.limit);
  }, [searchDebounce, panigate.page, panigate.limit]);

  const onChange = (page, pageSize) => {
    setPanigate({ ...panigate, page, limit: pageSize });
  };

  const onSearch = (e) => {
    setSearch(e.target.value);
    dispatch(searchProductAction(e.target.value)); // Giữ nguyên
  };
  const handleFilterByType = (type) => {
    setSelectedType(type);
    setLimit(6);
  };

  return (
    <Loading isPending={loading}>
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
              <div
                className="navbar-nav w-100 overflow-hidden"
                style={{ height: "410px" }}
              >
                {typeProducts.map((item) => (
                  <TypeProduct
                    key={item} // Dùng item làm key
                    name={item} // Gửi tên loại sản phẩm vào TypeProduct
                    onClick={() => handleFilterByType(item)} // Gọi hàm lọc khi loại sản phẩm được chọn
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
                    Fashion
                  </span>
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
              <div
                className="collapse navbar-collapse justify-content-between"
                id="navbarCollapse"
              >
                <div className="navbar-nav mr-auto py-0">
                  <a href="/" className="nav-item nav-link">
                    Trang chủ
                  </a>
                  <a href="/products" className="nav-item nav-link active">
                    Sản phẩm
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
            <p className="m-0">Sản phẩm</p>
          </div>
        </div>
      </div>
      {/* Page Header End */}
      <div className="container-fluid pt-5">
        <div className="row px-xl-5">
          <NavBarComponent />
          <div className="col-lg-9 col-md-12">
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
                      sắp xếp theo
                    </button>
                    <div
                      className="dropdown-menu dropdown-menu-right"
                      aria-labelledby="triggerId"
                    >
                      <a className="dropdown-item" href="#">
                        Mới nhất
                      </a>
                      <a className="dropdown-item" href="#">
                        Phổ biến nhất
                      </a>
                      <a className="dropdown-item" href="#">
                        Đánh giá cao nhất
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
                    price={product.price}
                    rating={product.rating}
                    type={product.type}
                    gender={product.gender}
                    selled={product.selled}
                    discount={product.discount}
                    id={product._id} // Sử dụng spread operator để truyền props
                  />
                ))}

              <div className="col-12 pb-1">
                <Pagination
                  current={panigate.page}
                  pageSize={panigate.limit}
                  total={panigate.total} // Tổng số sản phẩm
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

export default ProductsPage;

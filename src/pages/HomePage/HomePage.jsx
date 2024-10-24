import React, { useEffect, useState } from "react";
import TypeProduct from "../../components/TypeProduct/TypeProduct";
import {
  WrapperButtonMore,
  WrapperProducts,
  WrapperTypeProduct,
} from "./style";
import slider1 from "../../assets/images/slider1.webp";
import slider2 from "../../assets/images/slider2.webp";
import slider3 from "../../assets/images/slider3.webp";
import SliderComponent from "../../components/SliderComponent/SliderComponent";
import CardComponent from "../../components/CardComponent/CardComponent";
import * as ProductService from "../../services/ProductService";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../components/LoadingComponent/Loading";
import { useSelector } from "react-redux";
import { useDebounce } from "../../hooks/useDebounce";
import FooterComponent from "../../components/FooterComponent/FooterComponent";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const searchProduct = useSelector((state) => state?.product?.search);
  const searchDebounce = useDebounce(searchProduct, 500);
  const [limit, setLimit] = useState(6);
  const [typeProducts, setTypeProducts] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const handleNavigateLogin = () => {
    navigate("/sign-in");
  };
  const handleNavigateRegister = () => {
    navigate("/sign-up");
  };
  const fetchProductAll = async (context) => {
    const limit = context?.queryKey[1];
    const search = context?.queryKey[2];
    const type = context?.queryKey[3];
    const res = await ProductService.getAllProduct(search, limit, type);
    return res;
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

  const {
    isPending,
    data: products,
    isPreviousData,
  } = useQuery({
    queryKey: ["products", limit, searchDebounce, selectedType],
    queryFn: fetchProductAll,
    retry: 3,
    retryDelay: 1000,
    placeholderData: (previousData) => previousData,
  });

  const handleFilterByType = (type) => {
    setSelectedType(type);
    setLimit(6);
  };

  return (
    <Loading isPending={isPending}>
      <div className="container-fluid mb-5">
        <div className="row border-top px-xl-5">
          <div className="col-lg-3 d-none d-lg-block">
            <a
              className="btn shadow-none d-flex align-items-center justify-content-between bg-primary text-white w-100"
              data-toggle="collapse"
              href="#navbar-vertical"
              style={{ height: "65px", marginTop: "-1px", padding: "0 30px" }}
            >
              <h6 className="m-0">Categories</h6>
              <i className="fa fa-angle-down text-dark"></i>
            </a>
            <nav
              className="collapse show navbar navbar-vertical navbar-light align-items-start p-0 border border-top-0 border-bottom-0"
              id="navbar-vertical"
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
                  <a href="/" className="nav-item nav-link active">
                    Home
                  </a>
                  <a href="/products" className="nav-item nav-link">
                    Shop
                  </a>
                  <a href="detail.html" className="nav-item nav-link">
                    Shop Detail
                  </a>
                  <div className="nav-item dropdown">
                    <a
                      href="#"
                      className="nav-link dropdown-toggle"
                      data-toggle="dropdown"
                    >
                      Pages
                    </a>
                    <div className="dropdown-menu rounded-0 m-0">
                      <a href="cart.html" className="dropdown-item">
                        Shopping Cart
                      </a>
                      <a href="checkout.html" className="dropdown-item">
                        Checkout
                      </a>
                    </div>
                  </div>
                  <a href="contact.html" className="nav-item nav-link">
                    Contact
                  </a>
                </div>
                <div className="navbar-nav ml-auto py-0">
                  {!user?.access_token && ( // Kiểm tra nếu người dùng chưa đăng nhập
                    <>
                      <a
                        onClick={handleNavigateLogin}
                        style={{ cursor: "pointer" }}
                        className="nav-item nav-link"
                      >
                        Login
                      </a>
                      <a
                        onClick={handleNavigateRegister}
                        style={{ cursor: "pointer" }}
                        className="nav-item nav-link"
                      >
                        Register
                      </a>
                    </>
                  )}
                </div>
              </div>
            </nav>
            <div
              id="header-carousel"
              className="carousel slide"
              data-ride="carousel"
            >
              <div className="carousel-inner">
                <div
                  className="carousel-item active"
                  style={{ height: "410px" }}
                >
                  <img
                    className="img-fluid"
                    src="img/carousel-1.jpg"
                    alt="Image"
                  />
                  <div className="carousel-caption d-flex flex-column align-items-center justify-content-center">
                    <div className="p-3" style={{ maxWidth: "700px" }}>
                      <h4 className="text-light text-uppercase font-weight-medium mb-3">
                        10% Off Your First Order
                      </h4>
                      <h3 className="display-4 text-white font-weight-semi-bold mb-4">
                        Fashionable Dress
                      </h3>
                      <a href="" className="btn btn-light py-2 px-3">
                        Shop Now
                      </a>
                    </div>
                  </div>
                </div>
                <div className="carousel-item" style={{ height: "410px" }}>
                  <img
                    className="img-fluid"
                    src="img/carousel-2.jpg"
                    alt="Image"
                  />
                  <div className="carousel-caption d-flex flex-column align-items-center justify-content-center">
                    <div className="p-3" style={{ maxWidth: "700px" }}>
                      <h4 className="text-light text-uppercase font-weight-medium mb-3">
                        10% Off Your First Order
                      </h4>
                      <h3 className="display-4 text-white font-weight-semi-bold mb-4">
                        Reasonable Price
                      </h3>
                      <a href="" className="btn btn-light py-2 px-3">
                        Shop Now
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <a
                className="carousel-control-prev"
                href="#header-carousel"
                data-slide="prev"
              >
                <div
                  className="btn btn-dark"
                  style={{ width: "45px", height: "45px" }}
                >
                  <span className="carousel-control-prev-icon mb-n2"></span>
                </div>
              </a>
              <a
                className="carousel-control-next"
                href="#header-carousel"
                data-slide="next"
              >
                <div
                  className="btn btn-dark"
                  style={{ width: "45px", height: "45px" }}
                >
                  <span className="carousel-control-next-icon mb-n2"></span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="container-fluid pt-5">
        <div className="row px-xl-5 pb-3">
          <div className="col-lg-3 col-md-6 col-sm-12 pb-1">
            <div
              className="d-flex align-items-center border mb-4"
              style={{ padding: "30px" }}
            >
              <h1 className="fa fa-check text-primary m-0 mr-3"></h1>
              <h5 className="font-weight-semi-bold m-0">Quality Product</h5>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 col-sm-12 pb-1">
            <div
              className="d-flex align-items-center border mb-4"
              style={{ padding: "30px" }}
            >
              <h1 className="fas fa-shipping-fast text-primary m-0 mr-2"></h1>
              <h5 className="font-weight-semi-bold m-0">Free Shipping</h5>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 col-sm-12 pb-1">
            <div
              className="d-flex align-items-center border mb-4"
              style={{ padding: "30px" }}
            >
              <h1 className="fas fa-exchange-alt text-primary m-0 mr-3"></h1>
              <h5 className="font-weight-semi-bold m-0">14-Day Return</h5>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 col-sm-12 pb-1">
            <div
              className="d-flex align-items-center border mb-4"
              style={{ padding: "30px" }}
            >
              <h1 className="fa fa-phone-volume text-primary m-0 mr-3"></h1>
              <h5 className="font-weight-semi-bold m-0">24/7 Support</h5>
            </div>
          </div>
        </div>
      </div>
      {/* card sản phẩm */}
      <div className="container-fluid pt-5">
        <div className="row px-xl-5 pb-3">
          {products?.data?.map((product) => (
            <CardComponent
              key={product._id}
              countInStock={product.countInStock}
              description={product.description}
              images={product.images} // Cập nhật từ image thành images
              name={product.name}
              price={product.price}
              rating={product.rating}
              type={product.type}
              selled={product.selled}
              discount={product.discount}
              id={product._id} // Sử dụng spread operator để truyền props
            />
          ))}
        </div>
      </div>
      {/* // Offer Start */}
      <div className="container-fluid offer pt-5">
        <div className="row px-xl-5">
          <div className="col-md-6 pb-4">
            <div className="position-relative bg-secondary text-center text-md-right text-white mb-2 py-5 px-5">
              <img src="img/offer-1.png" alt="" />
              <div className="position-relative" style={{ zIndex: 1 }}>
                <h5 className="text-uppercase text-primary mb-3">
                  20% off the all order
                </h5>
                <h1 className="mb-4 font-weight-semi-bold">
                  Spring Collection
                </h1>
                <a href="" className="btn btn-outline-primary py-md-2 px-md-3">
                  Shop Now
                </a>
              </div>
            </div>
          </div>
          <div className="col-md-6 pb-4">
            <div className="position-relative bg-secondary text-center text-md-left text-white mb-2 py-5 px-5">
              <img src="img/offer-2.png" alt="" />
              <div className="position-relative" style={{ zIndex: 1 }}>
                <h5 className="text-uppercase text-primary mb-3">
                  20% off the all order
                </h5>
                <h1 className="mb-4 font-weight-semi-bold">
                  Winter Collection
                </h1>
                <a href="" className="btn btn-outline-primary py-md-2 px-md-3">
                  Shop Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* // Offer End */}
      {/* card sản phẩm */}
      <div className="container-fluid pt-5">
        <div className="text-center mb-4">
          <h2 className="section-title px-5">
            <span className="px-2">Trendy Products</span>
          </h2>
        </div>
        <div className="row px-xl-5 pb-3">
          {products?.data?.map((product) => (
            <CardComponent
              key={product._id}
              countInStock={product.countInStock}
              description={product.description}
              images={product.images} // Cập nhật từ image thành images
              name={product.name}
              price={product.price}
              rating={product.rating}
              type={product.type}
              selled={product.selled}
              discount={product.discount}
              id={product._id} // Sử dụng spread operator để truyền props
            />
          ))}
        </div>
      </div>
      {/* <!-- Subscribe Start --> */}
      <div className="container-fluid bg-secondary my-5">
        <div className="row justify-content-md-center py-5 px-xl-5">
          <div className="col-md-6 col-12 py-5">
            <div className="text-center mb-2 pb-2">
              <h2 className="section-title px-5 mb-3">
                <span className="bg-secondary px-2">Stay Updated</span>
              </h2>
              <p>
                Amet lorem at rebum amet dolores. Elitr lorem dolor sed amet
                diam labore at justo ipsum eirmod duo labore labore.
              </p>
            </div>
            <form action="">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control border-white p-4"
                  placeholder="Email Goes Here"
                />
                <div className="input-group-append">
                  <button className="btn btn-primary px-4">Subscribe</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* card sản phẩm */}
      <div className="container-fluid pt-5">
        <div className="text-center mb-4">
          <h2 className="section-title px-5">
            <span className="px-2">Just Arrived</span>
          </h2>
        </div>
        <div className="row px-xl-5 pb-3">
          {products?.data?.map((product) => (
            <CardComponent
              key={product._id}
              countInStock={product.countInStock}
              description={product.description}
              images={product.images} // Cập nhật từ image thành images
              name={product.name}
              price={product.price}
              rating={product.rating}
              type={product.type}
              selled={product.selled}
              discount={product.discount}
              id={product._id} // Sử dụng spread operator để truyền props
            />
          ))}
        </div>
      </div>
      {/* button */}
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          marginTop: "20px",
        }}
      >
        <WrapperButtonMore
          textButton={isPreviousData ? "Load more" : "Xem thêm"}
          type="outline"
          styleButton={{
            border: `1px solid ${
              products?.total === products?.data?.length ? "#f5f5f5" : "#9255FD"
            }`,
            color: `${
              products?.total === products?.data?.length ? "#f5f5f5" : "#9255FD"
            }`,
            width: "240px",
            height: "38px",
            borderRadius: "4px",
          }}
          disabled={
            products?.total === products?.data?.length ||
            products?.totalPage === 1
          }
          styleTextButton={{ fontWeight: 500 }}
          onClick={() => setLimit((prev) => prev + 8)}
        />
      </div>
      <FooterComponent />
      
    </Loading>
  );
};

export default HomePage;

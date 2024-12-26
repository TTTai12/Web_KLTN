import React, { useEffect, useState } from "react";
import TypeProduct from "../../components/TypeProduct/TypeProduct";
import {
  WrapperButtonMore,
  WrapperProducts,
  WrapperTypeProduct,
} from "./style";
import CardComponent from "../../components/CardComponent/CardComponent";
import * as ProductService from "../../services/ProductService";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../components/LoadingComponent/Loading";
import { useSelector } from "react-redux";
import { useDebounce } from "../../hooks/useDebounce";
import FooterComponent from "../../components/FooterComponent/FooterComponent";
import { useNavigate, useLocation } from "react-router-dom";

const HomePage = () => {
  const searchProduct = useSelector((state) => state?.product?.search);
  const searchDebounce = useDebounce(searchProduct, 500);
  const [limit, setLimit] = useState(6);
  const [typeProducts, setTypeProducts] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedGender, setSelectedGender] = useState(null);
  const user = useSelector((state) => state.user);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [panigate, setPanigate] = useState({ page: 1, limit: 10, total: 1 });
  const navigate = useNavigate();
  const { state } = useLocation();

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
    const gender = context?.queryKey[4];
    const res = await ProductService.getAllProduct(search, limit, type, gender);
    return res;
  };

  const fetchAllTypeProduct = async () => {
    const res = await ProductService.getAllTypeProduct();
    if (res?.status === "OK") {
      setTypeProducts(res?.data);
    }
  };

  useEffect(() => {
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

  useEffect(() => {
    fetchAllTypeProduct();
  }, []);

  const {
    isPending,
    data: productData,
    isPreviousData,
  } = useQuery({
    queryKey: ["products", limit, searchDebounce, selectedType, selectedGender],
    queryFn: fetchProductAll,
    retry: 3,
    retryDelay: 1000,
    placeholderData: (previousData) => previousData,
  });

  useEffect(() => {
    if (productData) {
      setProducts(productData);
    }
  }, [productData]);

  const handleFilterByType = (type) => {
    setSelectedType(type);
    setLimit(6);
  };

  const handleFilterByGender = (gender) => {
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

  const images = [
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTukelZQ3qqo_D-kBj5t1yNbfK1i5D8urVtkA&s",
    "https://salt.tikicdn.com/cache/100x100/ts/category/00/5d/97/384ca1a678c4ee93a0886a204f47645d.png.webp",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTukelZQ3qqo_D-kBj5t1yNbfK1i5D8urVtkA&s",
    "https://salt.tikicdn.com/cache/100x100/ts/category/55/5b/80/48cbaafe144c25d5065786ecace86d38.png.webp",
  ];

  const categories = [
    {
      gender: "Nam",
      items: [
        { name: "Áo khoác",  },
        { name: "Áo",  },
        { name: "Vớ",  },
        { name: "Balo", },
      ],
    },
    {
      gender: "Nữ",
      items: [
        { name: "Quần",  },
        { name: "Váy",  },
        { name: "Túi xách",  },
      ],
    },
  ];

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
              <h6 className="m-0">Danh mục </h6>
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
                {categories.map((categoryGroup) => (
                  <div key={categoryGroup.gender} className="mb-4">
                    {/* Không hiển thị tiêu đề gender */}
                    {categoryGroup.items.map((category, index) => (
                      <TypeProduct
                        key={`${categoryGroup.gender}-${index}`}
                        name={category.name}
                        image={category.image}
                        gender={categoryGroup.gender}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </nav>
          </div>

          <div className="col-lg-9">
            <nav className="navbar navbar-expand-lg bg-light navbar-light py-3 py-lg-0 px-0">
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
                    Trang chủ
                  </a>
                  <a href="/products" className="nav-item nav-link">
                    Sản phẩm
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
                        Giảm 10% cho sản phẩm đầu tiên
                      </h4>
                      <h3 className="display-4 text-white font-weight-semi-bold mb-4">
                        Váy thời trang
                      </h3>
                      <a href="" className="btn btn-light py-2 px-3">
                        Mua ngay
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
                        Giảm 20% cho sản phẩm đầu tiên
                      </h4>
                      <h3 className="display-4 text-white font-weight-semi-bold mb-4">
                        Áo thời trang
                      </h3>
                      <a href="" className="btn btn-light py-2 px-3">
                        Mua ngay
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
              gender={product.gender}
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
                  Sale 20% cho các sản phẩm
                </h5>
                <h1 className="mb-4 font-weight-semi-bold">
                  Bộ sưu tập mùa xuân
                </h1>
                <a href="" className="btn btn-outline-primary py-md-2 px-md-3">
                  Mua ngay
                </a>
              </div>
            </div>
          </div>
          <div className="col-md-6 pb-4">
            <div className="position-relative bg-secondary text-center text-md-left text-white mb-2 py-5 px-5">
              <img src="img/offer-2.png" alt="" />
              <div className="position-relative" style={{ zIndex: 1 }}>
                <h5 className="text-uppercase text-primary mb-3">
                  Sale 20% cho các sản phẩm
                </h5>
                <h1 className="mb-4 font-weight-semi-bold">
                  Bộ sưu tập mùa đông
                </h1>
                <a href="" className="btn btn-outline-primary py-md-2 px-md-3">
                  Mua ngay
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
            <span className="px-2">Sản phẩm bán chạy nhất</span>
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
                <span className="bg-secondary px-2">Cập nhật mới</span>
              </h2>
              <p>
                Hãy nhập mail để nhận được nhưng thông báo mới nhất của website
                về sản phẩm và sự kiện
              </p>
            </div>
            <form action="">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control border-white p-4"
                  placeholder="Nhập Email ở đây"
                />
                <div className="input-group-append">
                  <button className="btn btn-primary px-4">Đăng ký</button>
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
            <span className="px-2">Các sản phẩm mới</span>
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

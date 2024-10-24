import React, { useState } from "react";
import { Row, Col, Image, Rate, Card } from "antd";
import {
  WrapperStyleNameProduct,
  WrapperStyleTextSell,
  WrapperPriceProduct,
  WrapperPriceTextProduct,
  WrapperAddressProduct,
  WrapperQualityProduct,
  WrapperInputNumber,
  WrapperDescriptionProduct,
  DropdownContent,
  DropdownToggle,
} from "./style";
import {
  MinusOutlined,
  PlusOutlined,
  StarFilled,
  DownOutlined,
  UpOutlined,
} from "@ant-design/icons";
import ButtonComponent from "../ButtonComponent/ButtonComponent";
import * as ProductService from "../../services/ProductService";
import { useQuery } from "@tanstack/react-query";
import Loading from "../LoadingComponent/Loading";
import { convertPrice } from "../../utils";
import { useDispatch, useSelector } from "react-redux";
import TypeProduct from "../../components/TypeProduct/TypeProduct";
import { useLocation, useNavigate } from "react-router-dom";
import { addOrderProduct } from "../../redux/slides/orderSlide";

const ProductDetailsComponent = ({ idProduct }) => {
  const [numProduct, setNumProduct] = useState(1);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const user = useSelector((state) => state.user);
  const product = useSelector((state) => state.product);
  const order = useSelector((state) => state.order);
  const [errorLimitOrder, setErrorLimitOrder] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const onChange = (value) => {
    setNumProduct(Number(value));
  };

  const fetchGetDetailsProduct = async (context) => {
    const id = context?.queryKey && context?.queryKey[1];
    if (id) {
      const res = await ProductService.getDetailsProduct(id);
      return res.data;
    }
  };

  const handleChangeCount = (type, limited) => {
    if (type === "increase") {
      if (!limited) {
        setNumProduct(numProduct + 1);
      }
    } else {
      if (!limited) {
        setNumProduct(numProduct - 1);
      }
    }
  };

  const { isPending, data: productDetails } = useQuery({
    queryKey: ["products-details", idProduct],
    queryFn: fetchGetDetailsProduct,
    enabled: !!idProduct,
  });

  const handleAddOrderProduct = () => {
    if (!user?.id) {
      navigate("/sign-in", { state: location?.pathname });
    } else {
      const orderRedux = order?.orderItems?.find(
        (item) => item.product === productDetails?._id
      );
      if (
        orderRedux?.amount + numProduct <= orderRedux?.countInstock ||
        (!orderRedux && productDetails?.countInStock > 0)
      ) {
        dispatch(
          addOrderProduct({
            orderItem: {
              name: productDetails?.name,
              amount: numProduct,
              image: productDetails?.image,
              price: productDetails?.price,
              product: productDetails?._id,
              discount: productDetails?.discount,
              countInstock: productDetails?.countInStock,
            },
          })
        );
      } else {
        setErrorLimitOrder(true);
      }
    }
  };

  const fetchGetRelatedProducts = async (context) => {
    const id = context?.queryKey && context?.queryKey[1];
    if (id) {
      const res = await ProductService.getRelatedProducts(id);
      return res.data;
    }
  };

  const { isPending: isRelatedLoading, data: relatedProducts } = useQuery({
    queryKey: ["related-products", idProduct],
    queryFn: fetchGetRelatedProducts,
    enabled: !!idProduct,
  });

  // State để quản lý chỉ số của ảnh hiện tại
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isThumbnailClicked, setIsThumbnailClicked] = useState(false);
  // Danh sách các ảnh từ productDetails
  const productImages = productDetails?.images || [];

  // Hàm xử lý khi nhấn vào ảnh
  const handleImageClick = (index) => {
    setCurrentImageIndex(index); // Cập nhật chỉ số ảnh hiện tại
    setIsThumbnailClicked(true); // Đánh dấu rằng ảnh phụ đã được nhấn
  };
  const handleBackToMainImage = () => {
    setIsThumbnailClicked(false); // Quay lại ảnh chính
    setCurrentImageIndex(0); // Trở lại ảnh đầu tiên
  };
  return (
    <Loading isPending={isPending}>
      <div className="container-fluid py-5">
        <div className="row px-xl-5">
          <div className="col-lg-5 pb-5">
            <div
              id="product-carousel"
              className="carousel slide"
              data-ride="carousel"
            >
              <div className="carousel-inner border">
                <div className="carousel-item active">
                  {isThumbnailClicked ? (
                    <Image
                      className="w-100 h-100"
                      src={productImages[currentImageIndex]} // Sử dụng ảnh hiện tại
                      alt="image product"
                      preview={false}
                      style={{
                        objectFit: "contain",
                        display: "block",
                      }}
                    />
                  ) : (
                    <Image
                      className="w-100 h-100"
                      src={productImages[0]} // Hiển thị ảnh chính (ảnh đầu tiên)
                      alt="image product"
                      preview={false}
                      style={{
                        objectFit: "contain",
                        display: "block",
                      }}
                    />
                  )}

                  {/* Chỉ hiển thị ảnh phụ nếu đã nhấn vào ảnh phụ */}
                  <div className="wrap-slick3-dots">
                    <ul className="slick3-dots" role="tablist">
                      {productImages.map((image, index) => (
                        <li
                          key={index}
                          className={
                            currentImageIndex === index ? "slick-active" : ""
                          }
                          role="presentation"
                          onClick={() => handleImageClick(index)} // Gọi hàm handleImageClick
                        >
                          <img
                            src={image}
                            alt={`Product detail ${index + 1}`} // Cập nhật số thứ tự
                            onClick={
                              index === 0 ? handleBackToMainImage : undefined
                            } // Gọi hàm quay lại nếu là ảnh chính
                          />
                          <div className="slick3-dot-overlay"></div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Các điều khiển carousel */}
                <a
                  className="carousel-control-prev"
                  href="#product-carousel"
                  data-slide="prev"
                >
                  <i className="fa fa-2x fa-angle-left text-dark"></i>
                </a>
                <a
                  className="carousel-control-next"
                  href="#product-carousel"
                  data-slide="next"
                >
                  <i className="fa fa-2x fa-angle-right text-dark"></i>
                </a>
              </div>
            </div>
          </div>

          <div className="col-lg-7 pb-5" style={{ fontSize: "20px" }}>
            <h3 className="font-weight-semi-bold">{productDetails?.name}</h3>
            <div className="d-flex mb-3">
              <div className="text-primary mr-2">
                <Rate
                  allowHalf
                  defaultValue={productDetails?.rating}
                  value={productDetails?.rating}
                />
              </div>
              <small className="pt-1">
                ({productDetails?.reviews} Reviews)
              </small>
            </div>
            <h3 className="font-weight-semi-bold mb-4">
              {convertPrice(productDetails?.price)}
            </h3>
            <p className="mb-4">{productDetails?.description}</p>
            <div className="d-flex mb-3">
              <p className="text-dark font-weight-medium mb-0 mr-3">Sizes:</p>
              <form>
                <div className="custom-control custom-radio custom-control-inline">
                  <input
                    type="radio"
                    className="custom-control-input"
                    id="size-1"
                    name="size"
                  />
                  <label className="custom-control-label" htmlFor="size-1">
                    XS
                  </label>
                </div>
                <div className="custom-control custom-radio custom-control-inline">
                  <input
                    type="radio"
                    className="custom-control-input"
                    id="size-2"
                    name="size"
                  />
                  <label className="custom-control-label" htmlFor="size-2">
                    S
                  </label>
                </div>
                <div className="custom-control custom-radio custom-control-inline">
                  <input
                    type="radio"
                    className="custom-control-input"
                    id="size-3"
                    name="size"
                  />
                  <label className="custom-control-label" htmlFor="size-3">
                    M
                  </label>
                </div>
                <div className="custom-control custom-radio custom-control-inline">
                  <input
                    type="radio"
                    className="custom-control-input"
                    id="size-4"
                    name="size"
                  />
                  <label className="custom-control-label" htmlFor="size-4">
                    L
                  </label>
                </div>
                <div className="custom-control custom-radio custom-control-inline">
                  <input
                    type="radio"
                    className="custom-control-input"
                    id="size-5"
                    name="size"
                  />
                  <label className="custom-control-label" htmlFor="size-5">
                    XL
                  </label>
                </div>
              </form>
            </div>
            <div className="d-flex mb-4">
              <p className="text-dark font-weight-medium mb-0 mr-3">Colors:</p>
              <form>
                <div className="custom-control custom-radio custom-control-inline">
                  <input
                    type="radio"
                    className="custom-control-input"
                    id="color-1"
                    name="color"
                  />
                  <label className="custom-control-label" htmlFor="color-1">
                    Black
                  </label>
                </div>
                <div className="custom-control custom-radio custom-control-inline">
                  <input
                    type="radio"
                    className="custom-control-input"
                    id="color-2"
                    name="color"
                  />
                  <label className="custom-control-label" htmlFor="color-2">
                    White
                  </label>
                </div>
                <div className="custom-control custom-radio custom-control-inline">
                  <input
                    type="radio"
                    className="custom-control-input"
                    id="color-3"
                    name="color"
                  />
                  <label className="custom-control-label" htmlFor="color-3">
                    Red
                  </label>
                </div>
                <div className="custom-control custom-radio custom-control-inline">
                  <input
                    type="radio"
                    className="custom-control-input"
                    id="color-4"
                    name="color"
                  />
                  <label className="custom-control-label" htmlFor="color-4">
                    Blue
                  </label>
                </div>
                <div className="custom-control custom-radio custom-control-inline">
                  <input
                    type="radio"
                    className="custom-control-input"
                    id="color-5"
                    name="color"
                  />
                  <label className="custom-control-label" htmlFor="color-5">
                    Green
                  </label>
                </div>
              </form>
            </div>

            <div className="d-flex align-items-center mb-4 pt-2">
              <div
                className="input-group quantity mr-3"
                style={{ width: "130px" }}
              >
                <div className="input-group-btn">
                  <button
                    className="btn btn-primary btn-minus"
                    onClick={() =>
                      handleChangeCount("decrease", numProduct === 1)
                    }
                  >
                    <i className="fa fa-minus"></i>
                  </button>
                </div>
                <input
                  type="text"
                  className="form-control bg-secondary text-center"
                  value={numProduct}
                  onChange={onChange}
                  max={productDetails?.countInStock}
                  min={1}
                  style={{ width: "100%" }} // Đảm bảo input có chiều rộng 100%
                />
                <div className="input-group-btn">
                  <button
                    className="btn btn-primary btn-plus"
                    onClick={() =>
                      handleChangeCount(
                        "increase",
                        numProduct === productDetails?.countInStock
                      )
                    }
                  >
                    <i className="fa fa-plus"></i>
                  </button>
                </div>
              </div>
              <button
                className="btn btn-primary px-3"
                onClick={handleAddOrderProduct}
              >
                <i className="fa fa-shopping-cart mr-1"></i> Chọn Mua
              </button>
            </div>

            <div className="d-flex pt-2">
              <p className="text-dark font-weight-medium mb-0 mr-2">
                Chia sẻ trên:
              </p>
              <div className="d-inline-flex">
                <a className="text-dark px-2" href="">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a className="text-dark px-2" href="">
                  <i className="fab fa-twitter"></i>
                </a>
                <a className="text-dark px-2" href="">
                  <i className="fab fa-linkedin-in"></i>
                </a>
                <a className="text-dark px-2" href="">
                  <i className="fab fa-pinterest"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="row px-xl-5">
          <div className="col">
            <div className="nav nav-tabs justify-content-center border-secondary mb-4">
              <a
                className="nav-item nav-link active"
                data-toggle="tab"
                href="#tab-pane-1"
              >
                Description
              </a>
              <a
                className="nav-item nav-link"
                data-toggle="tab"
                href="#tab-pane-2"
              >
                Information
              </a>
              <a
                className="nav-item nav-link"
                data-toggle="tab"
                href="#tab-pane-3"
              >
                Reviews (0)
              </a>
            </div>
            <div className="tab-content">
              <div className="tab-pane fade show active" id="tab-pane-1">
                <h4 className="mb-3">Product Description</h4>
                <p>{productDetails?.description}</p>
              </div>
              <div className="tab-pane fade" id="tab-pane-2">
                <h4 className="mb-3">Additional Information</h4>
                <p>{productDetails?.information}</p>
                <div className="row">
                  <div className="col-md-6">
                    <ul className="list-group list-group-flush">
                      <li className="list-group-item px-0">Stand Up</li>
                      <li className="list-group-item px-0">
                        Folded (w/o wheels)
                      </li>
                      <li className="list-group-item px-0">
                        Folded (w/ wheels)
                      </li>
                      <li className="list-group-item px-0">
                        Door Pass Through
                      </li>
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <ul className="list-group list-group-flush">
                      <li className="list-group-item px-0">
                        35″L x 24″W x 37-45″H(front to back wheel)
                      </li>
                      <li className="list-group-item px-0">
                        32.5″L x 18.5″W x 16.5″H
                      </li>
                      <li className="list-group-item px-0">
                        32.5″L x 24″W x 18.5″H
                      </li>
                      <li className="list-group-item px-0">24</li>
                    </ul>
                  </div>
                </div>
              </div>
              {/* review */}
              <div className="tab-pane fade" id="tab-pane-3">
                <div className="row">
                  <div className="col-md-6">
                    <h4 className="mb-4">
                      1 review for "Colorful Stylish Shirt"
                    </h4>
                    <div className="media mb-4">
                      <img
                        src="img/user.jpg"
                        alt="Image"
                        className="img-fluid mr-3 mt-1"
                        style={{ width: "45px" }}
                      />
                      <div className="media-body">
                        <h6>
                          John Doe
                          <small>
                            {" "}
                            - <i>01 Jan 2045</i>
                          </small>
                        </h6>
                        <div className="text-primary mb-2">
                          <i className="fas fa-star"></i>
                          <i className="fas fa-star"></i>
                          <i className="fas fa-star"></i>
                          <i className="fas fa-star-half-alt"></i>
                          <i className="far fa-star"></i>
                        </div>
                        <p>
                          Diam amet duo labore stet elitr ea clita ipsum, tempor
                          labore accusam ipsum et no at. Kasd diam tempor rebum
                          magna dolores sed sed eirmod ipsum.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <h4 className="mb-4">Leave a review</h4>
                    <small>
                      Your email address will not be published. Required fields
                      are marked *
                    </small>
                    <div className="d-flex my-3">
                      <p className="mb-0 mr-2">Your Rating * :</p>
                      <div className="text-primary">
                        <i className="far fa-star"></i>
                        <i className="far fa-star"></i>
                        <i className="far fa-star"></i>
                        <i className="far fa-star"></i>
                        <i className="far fa-star"></i>
                      </div>
                    </div>
                    <form>
                      <div className="form-group">
                        <label htmlFor="message">Your Review *</label>
                        <textarea
                          id="message"
                          cols="30"
                          rows="5"
                          className="form-control"
                        ></textarea>
                      </div>
                      <div className="form-group">
                        <label htmlFor="name">Your Name *</label>
                        <input type="text" className="form-control" id="name" />
                      </div>
                      <div className="form-group">
                        <label htmlFor="email">Your Email *</label>
                        <input
                          type="email"
                          className="form-control"
                          id="email"
                        />
                      </div>
                      <div className="form-group mb-0">
                        <input
                          type="submit"
                          value="Leave Your Review"
                          className="btn btn-primary px-3"
                        />
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container-fluid py-5">
          <div className="text-center mb-4">
            <h2 className="section-title px-5">
              <span className="px-2">You May Also Like</span>
            </h2>
          </div>

          <div className="text-center mb-4">
            <h2 className="section-title px-5">
              <span className="px-2">You May Also Like</span>
            </h2>
          </div>
          <div className="row px-xl-5">
            <div className="col">
              <div className="owl-carousel related-carousel">
                {products?.data?.map((product) => (
                  <div className="card product-item border-0" key={product._id}>
                    <div className="card-header product-img position-relative overflow-hidden bg-transparent border p-0">
                      <img
                        className="img-fluid w-100"
                        src={product.images[0] || "path/to/default/image.jpg"}
                        alt={product.name}
                      />
                    </div>
                    <div className="card-body border-left border-right text-center p-0 pt-4 pb-3">
                      <h6 className="text-truncate mb-3">{product.name}</h6>
                      <div className="d-flex justify-content-center">
                        <h6>${product.price}</h6>
                        {product.discount > 0 && (
                          <h6 className="text-muted ml-2">
                            <del>
                              $
                              {(product.price * (1 + product.discount)).toFixed(
                                2
                              )}
                            </del>
                          </h6>
                        )}
                      </div>
                    </div>
                    <div className="card-footer d-flex justify-content-between bg-light border">
                      <a
                        href={`/product/${product._id}`}
                        className="btn btn-sm text-dark p-0"
                      >
                        <i className="fas fa-eye text-primary mr-1"></i>View
                        Detail
                      </a>
                      <a href="#" className="btn btn-sm text-dark p-0">
                        <i className="fas fa-shopping-cart text-primary mr-1"></i>
                        Add To Cart
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Loading>
  );
};

export default ProductDetailsComponent;

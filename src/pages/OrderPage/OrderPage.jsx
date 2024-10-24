import { Form } from "antd";
import React, { useEffect, useState } from "react";
import { CustomCheckbox } from "./style";
import { useDispatch, useSelector } from "react-redux";
import {
  decreaseAmount,
  increaseAmount,
  removeAllOrderProduct,
  removeOrderProduct,
  selectedOrder,
} from "../../redux/slides/orderSlide";
import { convertPrice } from "../../utils";
import { useMemo } from "react";
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as UserService from "../../services/UserService";
import * as message from "../../components/Message/Message";
import { updateUser } from "../../redux/slides/userSlide";
import { useNavigate } from "react-router-dom";
import StepComponent from "../../components/StepComponent/StepComponent";
import TypeProduct from "../../components/TypeProduct/TypeProduct";
import FooterComponent from "../../components/FooterComponent/FooterComponent";

const OrderPage = () => {
  const order = useSelector((state) => state.order);
  const user = useSelector((state) => state.user);
  const [typeProducts, setTypeProducts] = useState([]);
  const [listChecked, setListChecked] = useState([]);
  const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false);
  const [stateUserDetails, setStateUserDetails] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
  });
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const dispatch = useDispatch();
  const onChange = (e) => {
    if (listChecked.includes(e.target.value)) {
      const newListChecked = listChecked.filter(
        (item) => item !== e.target.value
      );
      setListChecked(newListChecked);
    } else {
      setListChecked([...listChecked, e.target.value]);
    }
  };

  const handleChangeCount = (type, idProduct, limited) => {
    if (type === "increase") {
      if (!limited) {
        dispatch(increaseAmount({ idProduct }));
      }
    } else {
      if (!limited) {
        dispatch(decreaseAmount({ idProduct }));
      }
    }
  };

  const handleDeleteOrder = (idProduct) => {
    dispatch(removeOrderProduct({ idProduct }));
  };

  const handleOnchangeCheckAll = (e) => {
    if (e.target.checked) {
      const newListChecked = [];
      order?.orderItems?.forEach((item) => {
        newListChecked.push(item?.product);
      });
      setListChecked(newListChecked);
    } else {
      setListChecked([]);
    }
  };

  useEffect(() => {
    dispatch(selectedOrder({ listChecked }));
  }, [listChecked]);

  useEffect(() => {
    form.setFieldsValue(stateUserDetails);
  }, [form, stateUserDetails]);

  useEffect(() => {
    if (isOpenModalUpdateInfo) {
      setStateUserDetails({
        city: user?.city,
        name: user?.name,
        address: user?.address,
        phone: user?.phone,
      });
    }
  }, [isOpenModalUpdateInfo]);

  const handleChangeAddress = () => {
    setIsOpenModalUpdateInfo(true);
  };

  const priceMemo = useMemo(() => {
    const result = order?.orderItemsSelected?.reduce((total, cur) => {
      return total + cur.price * cur.amount;
    }, 0);
    return result;
  }, [order]);

  const priceDiscountMemo = useMemo(() => {
    const result = order?.orderItemsSelected?.reduce((total, cur) => {
      const totalDiscount = cur.discount ? cur.discount : 0;
      const discountPerItem = (cur.price * totalDiscount) / 100; // Tính giảm giá cho mỗi đơn vị sản phẩm
      return total + discountPerItem * cur.amount; // Nhân giảm giá cho từng đơn vị sản phẩm với số lượng
    }, 0);
    if (Number(result)) {
      return result;
    }
    return 0;
  }, [order]);

  // đang lõi code này
  // const deliveryPriceMemo = useMemo(() => {
  //   if (priceMemo >= 20000 && priceMemo < 500000) {
  //     return 10000;
  //   } else if (priceMemo >= 500000 || order?.orderItemsSelected?.length === 0) {
  //     return 0;
  //   } else {
  //     return 20000;
  //   }
  // }, [priceMemo]);
  const deliveryPriceMemo = useMemo(() => {
    if (priceMemo > 200000) {
      return 10000;
    } else if (priceMemo === 0) {
      return 0;
    } else {
      return 20000;
    }
  }, [priceMemo]);

  const totalPriceMemo = useMemo(() => {
    return (
      Number(priceMemo) - Number(priceDiscountMemo) + Number(deliveryPriceMemo)
    );
  }, [priceMemo, priceDiscountMemo, deliveryPriceMemo]);

  const handleRemoveAllOrder = () => {
    if (listChecked?.length > 1) {
      dispatch(removeAllOrderProduct({ listChecked }));
    }
  };

  const handleAddCard = () => {
    if (!order?.orderItemsSelected?.length) {
      message.error("Vui lòng chọn sản phẩm");
    } else if (!user?.phone || !user.address || !user.name || !user.city) {
      setIsOpenModalUpdateInfo(true);
    } else {
      navigate("/payment");
    }
  };

  const mutationUpdate = useMutationHooks((data) => {
    const { id, token, ...rests } = data;
    const res = UserService.updateUser(id, { ...rests }, token);
    return res;
  });

  const { isPending, data } = mutationUpdate;

  const handleCancleUpdate = () => {
    setStateUserDetails({
      name: "",
      email: "",
      phone: "",
      isAdmin: false,
    });
    form.resetFields();
    setIsOpenModalUpdateInfo(false);
  };
  const handleUpdateInforUser = () => {
    const { name, address, city, phone } = stateUserDetails;
    if (name && address && city && phone) {
      mutationUpdate.mutate(
        { id: user?.id, token: user?.access_token, ...stateUserDetails },
        {
          onSuccess: () => {
            dispatch(updateUser({ name, address, city, phone }));
            setIsOpenModalUpdateInfo(false);
          },
        }
      );
    }
  };

  const handleOnchangeDetails = (e) => {
    setStateUserDetails({
      ...stateUserDetails,
      [e.target.name]: e.target.value,
    });
  };
  const itemsDelivery = [
    {
      title: "20.000 VND",
      description: "Dưới 200.000 VND",
    },
    {
      title: "10.000 VND",
      description: "Từ 200.000 VND đến dưới 500.000 VND",
    },
    {
      title: "Free ship",
      description: "Trên 500.000 VND",
    },
  ];
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
              <h6 className="m-0">Categories</h6>
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
            Our Shop
          </h1>
          <div className="d-inline-flex">
            <p className="m-0">
              <a href="/">Home</a>
            </p>
            <p className="m-0 px-2">-</p>
            <p className="m-0">Shop</p>
          </div>
        </div>
      </div>
      {/* Page Header End */}
      <div className="container-fluid pt-5">
        <div className="row px-xl-5">
          <div className="col-lg-8 table-responsive mb-5">
            <table className="table table-bordered text-center mb-0">
              <thead className="bg-secondary text-dark">
                <tr>
                  <th>Sản phẩm</th>
                  <th>Đơn giá</th>
                  <th>Số lượng</th>
                  <th>Thành tiền</th>
                  <th>Xóa</th>
                </tr>
              </thead>
              <tbody className="align-middle">
                {(order?.orderItems || []).map((item) => (
                  <tr key={item.product}>
                    <td className="align-middle">
                      <CustomCheckbox
                        onChange={onChange}
                        value={item.product}
                        checked={listChecked.includes(item.product)}
                      />
                      <img
                        src={
                          item.images && item.images.length > 0
                            ? item.images[0]
                            : undefined
                        } 
                        style={{ width: "50px" }}
                      />{" "}
                      {item.name}
                    </td>
                    <td className="align-middle">{convertPrice(item.price)}</td>
                    <td className="align-middle">
                      <div
                        className="input-group quantity mx-auto"
                        style={{ width: "100px" }}
                      >
                        <div className="input-group-btn">
                          <button
                            className="btn btn-sm btn-primary btn-minus"
                            onClick={() =>
                              handleChangeCount(
                                "decrease",
                                item.product,
                                item.amount === 1
                              )
                            }
                          >
                            <i className="fa fa-minus"></i>
                          </button>
                        </div>
                        <input
                          type="text"
                          className="form-control form-control-sm bg-secondary text-center"
                          value={item.amount}
                          readOnly
                        />
                        <div className="input-group-btn">
                          <button
                            className="btn btn-sm btn-primary btn-plus"
                            onClick={() =>
                              handleChangeCount(
                                "increase",
                                item.product,
                                item.amount === item.countInStock,
                                item.amount === 1
                              )
                            }
                          >
                            <i className="fa fa-plus"></i>
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="align-middle">
                      {convertPrice(item.price * item.amount)}
                    </td>
                    <td className="align-middle">
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => handleDeleteOrder(item.product)}
                      >
                        <i className="fa fa-times"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="col-lg-4">
            <form className="mb-5">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control p-4"
                  placeholder="Mã giảm giá"
                />
                <div className="input-group-append">
                  <button className="btn btn-primary">Áp dụng mã</button>
                </div>
              </div>
            </form>
            <div className="card border-secondary mb-5">
              <div className="card-header bg-secondary border-0">
                <h4 className="font-weight-semi-bold m-0">
                  Tổng quan giỏ hàng
                </h4>
              </div>
              <div className="card-body">
                <div className="d-flex justify-content-between mb-3 pt-1">
                  <h6 className="font-weight-medium">Tạm tính</h6>
                  <h6 className="font-weight-medium">
                    {convertPrice(priceMemo)}
                  </h6>
                </div>
                <div className="d-flex justify-content-between">
                  <h6 className="font-weight-medium">Phí giao hàng</h6>
                  <h6 className="font-weight-medium">
                    {convertPrice(deliveryPriceMemo)}
                  </h6>
                </div>
              </div>
              <div className="card-footer border-secondary bg-transparent">
                <div className="d-flex justify-content-between mt-2">
                  <h5 className="font-weight-bold">Tổng tiền</h5>
                  <h5 className="font-weight-bold">
                    {convertPrice(totalPriceMemo)}
                  </h5>
                </div>
                <button
                  className="btn btn-block btn-primary my-3 py-3"
                  onClick={handleAddCard}
                >
                  Mua hàng
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <FooterComponent />
    </>
  );
};

export default OrderPage;

import { Form, Radio } from "antd";
import React, { useEffect, useState, useMemo } from "react";
import {
  Label,
  WrapperInfo,
  WrapperLeft,
  WrapperRadio,
  WrapperRight,
  WrapperTotal,
  WrapperStyleHeaderDelivery,
} from "./style";

import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { useDispatch, useSelector } from "react-redux";
import { convertPrice } from "../../utils";
import ModalComponent from "../../components/ModalComponent/ModalComponent";
import InputComponent from "../../components/InputComponent/InputComponent";
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as UserService from "../../services/UserService";
import * as OrderService from "../../services/OrderService";
import Loading from "../../components/LoadingComponent/Loading";
import * as message from "../../components/Message/Message";
import { updateUser } from "../../redux/slides/userSlide";
import { useNavigate } from "react-router-dom";
import { removeAllOrderProduct } from "../../redux/slides/orderSlide";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import * as PaymentService from "../../services/PaymentService";

const PaymentPage = () => {
  const order = useSelector((state) => state.order);
  const user = useSelector((state) => state.user);

  const [delivery, setDelivery] = useState("fast");
  const [payment, setPayment] = useState("later_money");
  const navigate = useNavigate();
  const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false);
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const [stateUserDetails, setStateUserDetails] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
  });

  useEffect(() => {
    form.setFieldsValue(stateUserDetails);
  }, [form, stateUserDetails]);

  useEffect(() => {
    if (user) {
      setStateUserDetails({
        name: user.name || "",
        city: user.city || "",
        phone: user.phone || "",
        address: user.address || "",
      });
    }
  }, [user]);

  // useEffect(() => {
  //   if (isOpenModalUpdateInfo) {
  //     setStateUserDetails({
  //       city: user?.city,
  //       name: user?.name,
  //       address: user?.address,
  //       phone: user?.phone,
  //     });
  //   }
  // }, [isOpenModalUpdateInfo]);

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

  const handleAddOrder = () => {
    if (
      user?.access_token &&
      order?.orderItemsSelected &&
      user?.name &&
      user?.address &&
      user?.phone &&
      user?.city &&
      priceMemo &&
      user?.id
    ) {
      mutationAddOrder.mutate({
        token: user?.access_token,
        orderItems: order?.orderItemsSelected,
        fullName: user?.name,
        address: user?.address,
        phone: user?.phone,
        city: user?.city,
        paymentMethod: payment,
        itemsPrice: priceMemo,
        shippingPrice: deliveryPriceMemo,
        totalPrice: totalPriceMemo,
        user: user?.id,
        email: user?.email,
      });
    }
  };

  const mutationUpdate = useMutationHooks((data) => {
    const { id, token, ...rests } = data;
    const res = UserService.updateUser(id, { ...rests }, token);
    return res;
  });

  const mutationAddOrder = useMutationHooks((data) => {
    const { token, ...rests } = data;
    const res = OrderService.createOrder({ ...rests }, token);
    return res;
  });

  const { isPending, data } = mutationUpdate;
  const {
    data: dataAdd,
    isPending: isPendingAddOrder,
    isSuccess,
    isError,
  } = mutationAddOrder;

  useEffect(() => {
    if (isSuccess && dataAdd?.status === "OK") {
      const arrayOrdered = [];
      order?.orderItemsSelected?.forEach((element) => {
        arrayOrdered.push(element.product);
      });
      dispatch(removeAllOrderProduct({ listChecked: arrayOrdered }));
      message.success("Đặt hàng thành công");
      navigate("/orderSuccess", {
        state: {
          delivery,
          payment,
          orders: order?.orderItemsSelected,
          totalPriceMemo: totalPriceMemo,
        },
      });
    } else if (isError) {
      message.error();
    }
  }, [isSuccess, isError]);

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

  const onSuccessPaypal = (details, data) => {
    mutationAddOrder.mutate({
      token: user?.access_token,
      orderItems: order?.orderItemsSelected,
      fullName: user?.name,
      address: user?.address,
      phone: user?.phone,
      city: user?.city,
      paymentMethod: payment,
      itemsPrice: priceMemo,
      shippingPrice: deliveryPriceMemo,
      totalPrice: totalPriceMemo,
      user: user?.id,
      isPaid: true,
      paidAt: details.update_time,
      email: user?.email,
    });
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

  const handleDelivery = (e) => {
    setDelivery(e.target.value);
  };

  const handlePayment = (e) => {
    setPayment(e.target.value);
  };

  return (
    <div className="container-fluid pt-5">
      <div className="row px-xl-5">
        <div className="col-lg-8">
          <div className="mb-4">
            <h4 className="font-weight-semi-bold mb-4">Địa chỉ thanh toán</h4>
            <div className="row">
              <div className="col-md-6 form-group">
                <label>Tên</label>
                <InputComponent
                  value={stateUserDetails["name"]}
                  onChange={handleOnchangeDetails}
                  name="name"
                  placeholder="Nhập tên"
                />
              </div>
              <div className="col-md-6 form-group">
                <label>Thành phố</label>
                <InputComponent
                  value={stateUserDetails["city"]}
                  onChange={handleOnchangeDetails}
                  name="city"
                  placeholder="Nhập thành phố"
                />
              </div>
              <div className="col-md-6 form-group">
                <label>Số điện thoại</label>
                <InputComponent
                  value={stateUserDetails.phone}
                  onChange={handleOnchangeDetails}
                  name="phone"
                  placeholder="Nhập số điện thoại"
                />
              </div>
              <div className="col-md-6 form-group">
                <label>Địa chỉ</label>
                <InputComponent
                  value={stateUserDetails.address}
                  onChange={handleOnchangeDetails}
                  name="address"
                  placeholder="Nhập địa chỉ"
                />
              </div>
            </div>
          </div>
          {/* Phần Shipping Address có thể dùng tương tự */}
        </div>

        <div className="col-lg-4">
          <div className="card border-secondary mb-5">
            <div className="card-header bg-secondary border-0">
              <h4 className="font-weight-semi-bold m-0">Tổng đơn hàng</h4>
            </div>

            <div className="card-body">
              <h5 className="font-weight-medium mb-3">Sản phẩm</h5>
              {order.orderItemsSelected &&
                order.orderItemsSelected.map((item) => (
                  <div
                    key={item.product.id}
                    className="d-flex justify-content-between mb-3"
                  >
                    <p>{item.name}</p>
                    <p>{convertPrice(item.price)}</p>
                  </div>
                ))}
              <div className="d-flex justify-content-between mb-3 pt-1">
                <span className="font-weight-medium">Tạm tính</span>
                <span className="font-weight-medium">
                  {convertPrice(priceMemo)}
                </span>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <span>Giảm giá</span>
                <span>{convertPrice(priceDiscountMemo)}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span className="font-weight-medium">Phí giao hàng</span>
                <span className="font-weight-medium">
                  {convertPrice(deliveryPriceMemo)}
                </span>
              </div>
              <div className="d-flex justify-content-between mt-2">
                <h5 className="font-weight-bold">Tổng cộng</h5>
                <h5 className="font-weight-bold">
                  {convertPrice(totalPriceMemo)}
                </h5>
              </div>
            </div>
          </div>
          <div className="card border-secondary mb-5">
            <div className="card-header bg-secondary border-0">
              <h4 className="font-weight-semi-bold m-0">
                Phương thức thanh toán
              </h4>
            </div>
            <div className="card-body">
              <div className="form-group">
                <div className="custom-control custom-radio">
                  <input
                    type="radio"
                    className="custom-control-input"
                    name="payment"
                    id="paypal"
                    checked={payment === "paypal"}
                    onChange={() => setPayment("paypal")} // Cập nhật trạng thái payment
                  />
                  <label className="custom-control-label" htmlFor="paypal">
                    Paypal
                  </label>
                </div>
              </div>
              <div className="form-group">
                <div className="custom-control custom-radio">
                  <input
                    type="radio"
                    className="custom-control-input"
                    name="payment"
                    id="vnpay"
                    checked={payment === "vnpay"}
                    onChange={() => setPayment("vnpay")} // Cập nhật trạng thái payment
                  />
                  <label className="custom-control-label" htmlFor="vnpay">
                    VNPAY
                  </label>
                </div>
              </div>
              <div className="form-group">
                <div className="custom-control custom-radio">
                  <input
                    type="radio"
                    className="custom-control-input"
                    name="payment"
                    id="directcheck"
                    checked={payment === "directcheck"}
                    onChange={() => setPayment("directcheck")} // Cập nhật trạng thái payment
                  />
                  <label className="custom-control-label" htmlFor="directcheck">
                    Direct Check
                  </label>
                </div>
              </div>
              <div className="form-group">
                <div className="custom-control custom-radio">
                  <input
                    type="radio"
                    className="custom-control-input"
                    name="payment"
                    id="banktransfer"
                    checked={payment === "banktransfer"}
                    onChange={() => setPayment("banktransfer")} // Cập nhật trạng thái payment
                  />
                  <label
                    className="custom-control-label"
                    htmlFor="banktransfer"
                  >
                    Bank Transfer
                  </label>
                </div>
              </div>
            </div>
            <div className="card-footer border-secondary bg-transparent">
              {/* Hiển thị phần thanh toán PayPal */}
              {payment === "paypal" ? (
                <div style={{ width: "320px" }}>
                  <PayPalScriptProvider options={{ "client-id": "test" }}>
                    <PayPalButtons
                      createOrder={(data, actions) =>
                        actions.order.create({
                          purchase_units: [
                            {
                              amount: {
                                value: (totalPriceMemo / 24545).toFixed(2),
                              },
                            },
                          ],
                        })
                      }
                      onApprove={onSuccessPaypal}
                    />
                  </PayPalScriptProvider>
                </div>
              ) : payment === "vnpay" ? (
                // Tùy chọn thanh toán VNPAY
                <ButtonComponent
                  size={40}
                  styleButton={{
                    background: "rgb(16, 135, 255)",
                    height: "48px",
                    width: "320px",
                    border: "none",
                    borderRadius: "4px",
                  }}
                  textButton={"Thanh toán với VNPAY"}
                  styleTextButton={{
                    color: "#fff",
                    fontSize: "15px",
                    fontWeight: "700",
                  }}
                />
              ) : (
                // Nút đặt hàng khi không có tùy chọn thanh toán
                <button
                  className="btn btn-lg btn-block btn-primary font-weight-bold my-3 py-3"
                  onClick={handleAddOrder}
                >
                  Đặt hàng
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;

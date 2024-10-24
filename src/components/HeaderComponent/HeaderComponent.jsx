import React from "react";
import { Badge, Col } from "antd";
import {
  WrapperHeader,
  WrapperTextHeader,
  WrapperHeaderAccount,
  Span,
  WrapperContentPopup,
} from "./style";
import { useState } from "react";
import { Popover } from "antd";
import ButttonInputSearch from "../ButtonInputSearch/ButtonInputSearch";
import {
  UserOutlined,
  CaretDownOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as UserService from "../../services/UserService";
import { resetUser } from "../../redux/slides/userSlide";
import Loading from "../LoadingComponent/Loading";
import { searchProduct } from "../../redux/slides/productSlide";
import { useEffect } from "react";
import logoImage from "../../assets/images/logo-store-2.png";

const HeaderComponent = ({ isHiddenSearch = false, isHiddenCart = false }) => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [userName, setUserName] = useState("");
  const [userAvatar, setUserAvatar] = useState("");
  const [search, setSearch] = useState("");
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const order = useSelector((state) => state.order);
  const [loading, setLoading] = useState(false);
 

  const handleLogout = async () => {
    setLoading(true);
    await UserService.logoutUser();
    dispatch(resetUser());
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    setUserName(user?.name);
    setUserAvatar(user?.avatar);
    setLoading(false);
  }, [user?.name, user?.avatar]);

  const content = (
    <div>
      <WrapperContentPopup onClick={() => handleClickNavigate("profile")}>
        Thông tin người dùng
      </WrapperContentPopup>
      {user?.isAdmin && (
        <WrapperContentPopup onClick={() => handleClickNavigate("admin")}>
          Quản lí hệ thống
        </WrapperContentPopup>
      )}
      <WrapperContentPopup onClick={() => handleClickNavigate(`my-order`)}>
        Đơn hàng của tôi
      </WrapperContentPopup>
      <WrapperContentPopup onClick={() => handleClickNavigate()}>
        Đăng xuất
      </WrapperContentPopup>
    </div>
  );

  const handleClickNavigate = (type) => {
    if (type === "profile") {
      navigate("/profile-user");
    } else if (type === "admin") {
      navigate("/system/admin");
    } else if (type === "my-order") {
      navigate("/my-order", {
        state: {
          id: user?.id,
          token: user?.access_token,
        },
      });
    } else {
      handleLogout();
    }
    setIsOpenPopup(false);
  };

  const onSearch = (e) => {
    setSearch(e.target.value);
    dispatch(searchProduct(e.target.value));
  };

  return (
    <>
      <div className="container-fluid">
        <div className="row bg-secondary py-2 px-xl-5">
          <div className="col-lg-6 d-none d-lg-block">
            <div className="d-inline-flex align-items-center">
              <a className="text-dark" href="">
                FAQs
              </a>
              <span className="text-muted px-2">|</span>
              <a className="text-dark" href="">
                Help
              </a>
              <span className="text-muted px-2">|</span>
              <a className="text-dark" href="">
                Support
              </a>
            </div>
          </div>
          <div className="col-lg-6 text-center text-lg-right">
            <div className="d-inline-flex align-items-center">
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
                <i className="fab fa-instagram"></i>
              </a>
              <a className="text-dark pl-2" href="">
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>
        </div>
        <div className="row align-items-center py-3 px-xl-5">
          <div className="col-lg-3 d-none d-lg-block">
            <a href="/" className="text-decoration-none">
              <h1 className="m-0 display-5 font-weight-semi-bold">
                <span className="text-primary font-weight-bold border px-3 mr-1">
                  Fashion
                </span>
                Shop
              </h1>
            </a>
          </div>
          {!isHiddenSearch && (
            <ButttonInputSearch
              size="large"
              bordered={false}
              textButton="Tìm kiếm"
              placeholder="Bạn tìm gì hôm nay"
              onChange={onSearch}
              backgroundColorButton="#5a20c1"
            />
          )}
          <div className="col-lg-3 col-6 text-right">
            <a className="btn border">
              <Loading isPending={loading}>
                <WrapperHeaderAccount>
                  {userAvatar ? (
                    <img
                      src={userAvatar}
                      alt="avatar"
                      style={{
                        height: "40px",
                        width: "40px",
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <UserOutlined style={{ fontSize: "30px" }} />
                  )}
                  {user?.access_token && (
                    <Popover
                      content={content}
                      trigger="click"
                      open={isOpenPopup}
                    >
                      <div
                        style={{
                          cursor: "pointer",
                          maxWidth: 100,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                        onClick={() => setIsOpenPopup((prev) => !prev)}
                      >
                        {userName?.length ? userName : user?.email}
                      </div>
                    </Popover>
                  )}
                </WrapperHeaderAccount>
              </Loading>
            </a>
            <a className="btn border">
              {!isHiddenCart && (
                <div
                  onClick={() => navigate("/order")}
                  style={{ cursor: "pointer" }}
                >
                  <Badge count={order?.orderItems?.length} size="small">
                    <i
                      className="fas fa-shopping-cart text-primary"
                      style={{ fontSize: "20px" }}
                    ></i>
                  </Badge>
                </div>
              )}
            </a>
            <a href="" className="btn border" style={{ fontSize: "20px" }}>
              <i className="fas fa-heart text-primary"></i>
              <span className="badge">0</span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default HeaderComponent;

import Loading from "../LoadingComponent/Loading";
import { useState, useEffect } from "react";
import { resetUser } from "../../redux/slides/userSlide";
import { useDispatch, useSelector } from "react-redux";
import { WrapperHeaderAccount, WrapperContentPopup } from "./style";
import { UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const AdminHeader = () => {
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.user);
  const [userAvatar, setUserAvatar] = useState("");
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
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
    <li>
      <div className="dropdown-divider"></div>
      <a
        className="dropdown-item"
        onClick={() => handleClickNavigate("profile")}
      >
        Thông tin người dùng
      </a>
      {user?.isAdmin && (
        <a
          className="dropdown-item"
          onClick={() => handleClickNavigate("admin")}
        >
          Quản lí hệ thống
        </a>
      )}
      <a
        className="dropdown-item"
        onClick={() => handleClickNavigate("my-order")}
      >
        Đơn hàng của tôi
      </a>
      <div className="dropdown-divider"></div>
      <a className="dropdown-item" onClick={handleLogout}>
        Đăng xuất
      </a>
    </li>
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

  return (
    <div className="main-header">
      <div className="main-header-logo">
        {/* Logo Header */}
        <div className="logo-header" data-background-color="dark">
          <a href="/" className="logo">
            <img
              src="../../assets/img/kaiadmin/logo_light.svg"
              alt="navbar brand"
              className="navbar-brand"
              height="20"
            />
          </a>
          <div className="nav-toggle">
            <button className="btn btn-toggle toggle-sidebar">
              <i className="gg-menu-right"></i>
            </button>
            <button className="btn btn-toggle sidenav-toggler">
              <i className="gg-menu-left"></i>
            </button>
          </div>
          <button className="topbar-toggler more">
            <i className="gg-more-vertical-alt"></i>
          </button>
        </div>
        {/* End Logo Header */}
      </div>
      {/* Navbar Header */}
      <nav className="navbar navbar-header navbar-header-transparent navbar-expand-lg border-bottom">
        <div className="container-fluid">
          <nav className="navbar navbar-header-left navbar-expand-lg navbar-form nav-search p-0 d-none d-lg-flex">
            <div className="input-group">
              <div className="input-group-prepend">
                <button type="submit" className="btn btn-search pe-1">
                  <i className="fa fa-search search-icon"></i>
                </button>
              </div>
              <input
                type="text"
                placeholder="Search ..."
                className="form-control"
              />
            </div>
          </nav>

          <ul className="navbar-nav topbar-nav ms-md-auto align-items-center">
            <li className="nav-item topbar-icon dropdown hidden-caret d-flex d-lg-none">
              <a
                className="nav-link dropdown-toggle"
                data-bs-toggle="dropdown"
                href="#"
                role="button"
                aria-expanded="false"
                aria-haspopup="true"
              >
                <i className="fa fa-search"></i>
              </a>
              <ul className="dropdown-menu dropdown-search animated fadeIn">
                <form className="navbar-left navbar-form nav-search">
                  <div className="input-group">
                    <input
                      type="text"
                      placeholder="Search ..."
                      className="form-control"
                    />
                  </div>
                </form>
              </ul>
            </li>
            <li className="nav-item topbar-icon dropdown hidden-caret">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="messageDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <i className="fa fa-envelope"></i>
              </a>
              <ul
                className="dropdown-menu messages-notif-box animated fadeIn"
                aria-labelledby="messageDropdown"
              >
                <li>
                  <div className="dropdown-title d-flex justify-content-between align-items-center">
                    Messages
                    <a href="#" className="small">
                      Mark all as read
                    </a>
                  </div>
                </li>
                <li>
                  <div className="message-notif-scroll scrollbar-outer">
                    <div className="notif-center">
                      <a href="#">
                        <div className="notif-img">
                          <img
                            src="assets/img/jm_denis.jpg"
                            alt="Img Profile"
                          />
                        </div>
                        <div className="notif-content">
                          <span className="subject">Jimmy Denis</span>
                          <span className="block">How are you?</span>
                          <span className="time">5 minutes ago</span>
                        </div>
                      </a>
                      {/* Thêm các thông báo khác vào đây */}
                    </div>
                  </div>
                </li>
                <li>
                  <a className="see-all" href="javascript:void(0);">
                    See all messages<i className="fa fa-angle-right"></i>
                  </a>
                </li>
              </ul>
            </li>
            <li className="nav-item topbar-user dropdown hidden-caret">
              <a
                className="dropdown-toggle profile-pic"
                data-bs-toggle="dropdown"
                href="#"
                aria-expanded="false"
              >
                <div className="avatar-sm">
                  {userAvatar ? (
                    <img
                      src={userAvatar}
                      alt="avatar"
                      className="avatar-img rounded-circle"
                      style={{
                        height: "40px",
                        width: "40px",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <UserOutlined style={{ fontSize: "30px" }} />
                  )}
                </div>
                <span className="profile-username">
                  <span className="op-7">Chào,</span>
                  <span className="fw-bold">{userName || user?.email}</span>
                </span>
              </a>
              <ul className="dropdown-menu dropdown-user animated fadeIn">
                <div className="dropdown-user-scroll scrollbar-outer">
                  <li>
                    <div className="user-box">
                      <div className="avatar-lg">
                        {userAvatar ? (
                          <img
                            src={userAvatar}
                            alt="image profile"
                            className="avatar-img rounded"
                            style={{
                              height: "60px",
                              width: "60px",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <UserOutlined style={{ fontSize: "50px" }} />
                        )}
                      </div>
                      <div className="u-text">
                        <h4>{userName || "Hizrian"}</h4>
                        <p className="text-muted">
                          {user?.email || "hello@example.com"}
                        </p>
                        <a
                          href="profile.html"
                          className="btn btn-xs btn-secondary btn-sm"
                        >
                          View Profile
                        </a>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="dropdown-divider"></div>
                    <a
                      className="dropdown-item"
                      onClick={() => handleClickNavigate("profile")}
                    >
                      Thông tin người dùng
                    </a>
                    {user?.isAdmin && (
                      <a
                        className="dropdown-item"
                        onClick={() => handleClickNavigate("admin")}
                      >
                        Quản lí hệ thống
                      </a>
                    )}
                    <a
                      className="dropdown-item"
                      onClick={() => handleClickNavigate("my-order")}
                    >
                      Đơn hàng của tôi
                    </a>
                    <div className="dropdown-divider"></div>
                    <a className="dropdown-item" onClick={handleLogout}>
                      Đăng xuất
                    </a>
                  </li>
                </div>
              </ul>
            </li>

            {/* Các phần tử khác trong topbar */}
          </ul>
        </div>
      </nav>
      {/* End Navbar */}
    </div>
  );
};
export default AdminHeader;

import Loading from "../LoadingComponent/Loading"; // Nếu có lỗi liên quan đến Loading, hãy kiểm tra đường dẫn
import { useState, useEffect } from "react";
import { resetUser } from "../../redux/slides/userSlide"; // Đảm bảo rằng đường dẫn đúng
import { useDispatch, useSelector } from "react-redux";
import { WrapperHeaderAccount, WrapperContentPopup } from "./style"; // Kiểm tra nếu bạn cần import style
import { UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import * as UserService from "../../services/UserService"; // Nhập UserService với cách này

const AdminHeader = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [userAvatar, setUserAvatar] = useState("");
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  const handleLogout = async () => {
    setLoading(true);
    try {
      await UserService.logoutUser(); // Đảm bảo UserService được nhập đúng
      dispatch(resetUser());
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setUserName(user?.name);
    setUserAvatar(user?.avatar);
  }, [user]);

  const handleClickNavigate = (type) => {
    switch (type) {
      case "profile":
        navigate("/profile-user");
        break;
      case "admin":
        navigate("/system/admin");
        break;
      case "my-order":
        navigate("/my-order", {
          state: {
            id: user?.id,
            token: user?.access_token,
          },
        });
        break;
      case "logout":
        handleLogout();
        break;
      default:
        break;
    }
    setIsOpenPopup(false);
  };

  const content = (
    <li>
      <div className="dropdown-divider"></div>
      <a className="dropdown-item" onClick={() => handleClickNavigate("profile")}>
        Thông tin người dùng
      </a>
      {user?.isAdmin && (
        <a className="dropdown-item" onClick={() => handleClickNavigate("admin")}>
          Quản lí hệ thống
        </a>
      )}
      <a className="dropdown-item" onClick={() => handleClickNavigate("my-order")}>
        Đơn hàng của tôi
      </a>
      <div className="dropdown-divider"></div>
      <a className="dropdown-item" onClick={() => handleClickNavigate("logout")}>
        Đăng xuất
      </a>
    </li>
  );

  return (
    <div className="main-header">
      <div className="main-header-logo">
        <div className="logo-header" data-background-color="dark">
          <a href="/" className="logo">
            <img
              src="../../assets/img/kaiadmin/logo_light.svg" // Đảm bảo đường dẫn chính xác
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
      </div>

      <nav className="navbar navbar-header navbar-header-transparent navbar-expand-lg border-bottom">
        <div className="container-fluid">
          <ul className="navbar-nav topbar-nav ms-md-auto align-items-center">
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
                        <a href="profile.html" className="btn btn-xs btn-secondary btn-sm">
                          View Profile
                        </a>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="dropdown-divider"></div>
                    {content}
                  </li>
                </div>
              </ul>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default AdminHeader;

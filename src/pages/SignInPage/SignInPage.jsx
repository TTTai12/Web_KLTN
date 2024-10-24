import React, { useEffect } from "react";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import InputForm from "../../components/InputForm/InputForm";
import {
  WrapperContainerLeft,
  WrapperContainerRight,
  WrapperTextLight,
} from "./style";
import imageLogo from "../../assets/images/logo-login.png";
import { Image } from "antd";
import { EyeFilled, EyeInvisibleFilled } from "@ant-design/icons";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import * as UserService from "../../services/UserService";
import { useMutationHooks } from "../../hooks/useMutationHook";
import Loading from "../../components/LoadingComponent/Loading";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { updateUser } from "../../redux/slides/userSlide";

const SignInPage = () => {
  const [isShowPassword, setIsShowPassword] = useState(false);
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const mutation = useMutationHooks((data) => UserService.loginUser(data));
  const { data, isPending, isSuccess } = mutation;

  useEffect(() => {
    if (isSuccess && data?.message === "SUCCESS") {
      if (location?.state) {
        navigate(location?.state);
      } else {
        navigate("/");
      }
      localStorage.setItem("access_token", JSON.stringify(data?.access_token));
      localStorage.setItem(
        "refresh_token",
        JSON.stringify(data?.refresh_token)
      );
      if (data?.access_token) {
        const decoded = jwtDecode(data?.access_token);
        if (decoded?.id) {
          handleGetDetailsUser(decoded?.id, data?.access_token);
        }
      }
    }
  }, [isSuccess]);

  const handleGetDetailsUser = async (id, token) => {
    const storage = localStorage.getItem("refresh_token");
    const refreshToken = JSON.parse(storage);
    const res = await UserService.getDetailsUser(id, token);
    dispatch(updateUser({ ...res?.data, access_token: token, refreshToken }));
  };

  const handleNavigateSignUp = () => {
    navigate("/sign-up");
  };

  const handleOnchangeEmail = (value) => {
    setEmail(value);
  };

  const handleOnchangePassword = (value) => {
    setPassword(value);
  };

  const handleSignIn = () => {
    console.log("logingloin");
    mutation.mutate({
      email,
      password,
    });
  };

  return (
    <div style={{ backgroundColor: "#666666" }}>
      <div className="limiter">
        <div className="container-login100">
          <div className="wrap-login100">
            <form className="login100-form validate-form">
              <span className="login100-form-title p-b-43">
                Login to continue
              </span>

              <div
                className="wrap-input100 validate-input"
                data-validate="Valid email is required: ex@abc.xyz"
              >
                <InputForm
                  className={`input100 ${email ? "has-val" : ""}`}
                  value={email}
                  onChange={handleOnchangeEmail}
                />

                <span className="focus-input100"></span>
                <span className="label-input100">Email</span>
              </div>

              <div
                className="wrap-input100 validate-input"
                data-validate="Password is required"
              >
                <InputForm
                  className={`input100 ${password ? "has-val" : ""}`}
                  type={isShowPassword ? "text" : "password"}
                  value={password}
                  onChange={handleOnchangePassword}
                />
                <span className="focus-input100"></span>
                <span className="label-input100">Password</span>
                <span
                  className="toggle-password"
                  onClick={() => setIsShowPassword(!isShowPassword)} // Đổi trạng thái isShowPassword khi click
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                  }}
                >
                  {isShowPassword ? <EyeFilled /> : <EyeInvisibleFilled />}
                </span>
              </div>
              <div className="flex-sb-m w-full p-t-3 p-b-32">
                <div className="contact100-form-checkbox">
                  <input
                    className="input-checkbox100"
                    id="ckb1"
                    type="checkbox"
                    name="remember-me"
                  />
                  <label className="label-checkbox100" htmlFor="ckb1">
                    Remember me
                  </label>
                </div>

                <div>
                  <a href="#" className="txt1">
                    Forgot Password?
                  </a>
                </div>
              </div>
              {data?.status === "ERR" && (
                <span style={{ color: "red" }}>{data?.message}</span>
              )}
              <Loading isPending={isPending}>
                <div className="container-login100-form-btn">
                  <ButtonComponent
                    disabled={!email.length || !password.length}
                    onClick={handleSignIn}
                    size={40}
                    styleButton={{
                      background: "rgb(255, 57, 69)",
                      height: "48px",
                      width: "100%",
                      border: "none",
                      borderRadius: "4px",
                      margin: "26px 0 10px",
                    }}
                    textButton={"Đăng nhập"}
                    styleTextButton={{
                      color: "#fff",
                      fontSize: "15px",
                      fontWeight: "700",
                    }}
                  ></ButtonComponent>
                </div>
              </Loading>

              <div className="text-center p-t-46 p-b-20">
                <span className="txt2">or sign up using</span>
              </div>

              <div className="login100-form-social flex-c-m">
                <a
                  href="#"
                  className="login100-form-social-item flex-c-m bg1 m-r-5"
                >
                  <i className="fa fa-facebook-f" aria-hidden="true"></i>
                </a>

                <a
                  href="#"
                  className="login100-form-social-item flex-c-m bg2 m-r-5"
                >
                  <i className="fa fa-twitter" aria-hidden="true"></i>
                </a>
              </div>
            </form>

            <div
              className="login100-more"
              style={{
                backgroundImage: "url('img/321.jpg')",
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;

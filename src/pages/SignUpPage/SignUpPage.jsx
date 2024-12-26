import React, { useState, useEffect } from "react";
import {
  WrapperContainerLeft,
  WrapperContainerRight,
  WrapperTextLight,
} from "./style";
import InputForm from "../../components/InputForm/InputForm";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { Image } from "antd";
import { EyeFilled, EyeInvisibleFilled } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import * as UserService from "../../services/UserService";
import { useMutationHooks } from "../../hooks/useMutationHook";
import Loading from "../../components/LoadingComponent/Loading";
import * as message from "../../components/Message/Message";

const SignUpPage = () => {
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");

  const mutation = useMutationHooks((data) => UserService.signupUser(data));
  const { data, isPending, isSuccess, isError } = mutation;

  useEffect(() => {
    if (isSuccess && data?.message === "SUCCESS") {
      message.success();
      handleNavigateSignIn();
    } else if (isError) {
      message.error();
    }
  }, [isSuccess, isError]);

  const navigate = useNavigate();

  const handleOnchangeEmail = (value) => setEmail(value);
  const handleOnchangePassword = (value) => setPassword(value);
  const handleOnchangeConfirmPassword = (value) => setConfirmPassword(value);
  const handleOnchangeName = (value) => setName(value);
  const handleOnchangePhone = (value) => setPhone(value);
  const handleOnchangeCity = (value) => setCity(value);
  const handleOnchangeAddress = (value) => setAddress(value);

  const handleNavigateSignIn = () => {
    navigate("/sign-in");
  };

  const handleSignUp = () => {
    if (!email.includes("@")) {
      return message.error("Email không hợp lệ");
    }
    if (password !== confirmPassword) {
      return message.error("Mật khẩu và xác nhận mật khẩu không khớp");
    }
    if (password.length < 6) {
      return message.error("Mật khẩu phải ít nhất 6 ký tự");
    }
    if (!name || !phone || !city || !address) {
      return message.error("Vui lòng điền đầy đủ thông tin");
    }

    mutation.mutate({
      email,
      password,
      confirmPassword,
      name,
      phone,
      city,
      address,
    });
    console.log("sign-up", {
      email,
      password,
      confirmPassword,
      name,
      phone,
      city,
      address,
    });
  };

  return (
    <div style={{ backgroundColor: "#666666" }}>
      <div className="limiter">
        <div className="container-login100">
          <div className="wrap-login100">
            <form
              className="login100-form validate-form"
              onSubmit={handleSignUp}
            >
              <span className="login100-form-title p-b-43">
                Đăng ký tài khoản mới
              </span>

              {/* Name */}
              <div
                className="wrap-input100 validate-input"
                data-validate="Name is required"
              >
                <InputForm
                  className={`input100 ${name ? "has-val" : ""}`}
                  value={name}
                  onChange={handleOnchangeName}
                />
                <span className="focus-input100"></span>
                <span className="label-input100">Name</span>
              </div>

              {/* Phone */}
              <div
                className="wrap-input100 validate-input"
                data-validate="Phone is required"
              >
                <InputForm
                  className={`input100 ${phone ? "has-val" : ""}`}
                  value={phone}
                  onChange={handleOnchangePhone}
                />
                <span className="focus-input100"></span>
                <span className="label-input100">Phone</span>
              </div>

              {/* City */}
              <div
                className="wrap-input100 validate-input"
                data-validate="City is required"
              >
                <InputForm
                  className={`input100 ${city ? "has-val" : ""}`}
                  value={city}
                  onChange={handleOnchangeCity}
                />
                <span className="focus-input100"></span>
                <span className="label-input100">City</span>
              </div>

              {/* Address */}
              <div
                className="wrap-input100 validate-input"
                data-validate="Address is required"
              >
                <InputForm
                  className={`input100 ${address ? "has-val" : ""}`}
                  value={address}
                  onChange={handleOnchangeAddress}
                />
                <span className="focus-input100"></span>
                <span className="label-input100">Address</span>
              </div>

              {/* Email */}
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

              {/* Password */}
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

              {/* Confirm Password */}
              <div
                className="wrap-input100 validate-input"
                data-validate="Password confirmation is required"
              >
                <InputForm
                  className={`input100 ${confirmPassword ? "has-val" : ""}`}
                  type={isShowConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={handleOnchangeConfirmPassword}
                />
                <span className="focus-input100"></span>
                <span className="label-input100">Confirm Password</span>
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
               
                </span>
              </div>

              {/* Error Message */}
              {data?.status === "ERR" && (
                <span style={{ color: "red" }}>{data?.message}</span>
              )}

              {/* Đăng ký button */}
              <Loading isPending={isPending}>
                <div className="container-login100-form-btn">
                  <ButtonComponent
                    disabled={
                      !email.length ||
                      !password.length ||
                      !confirmPassword.length ||
                      !name.length ||
                      !phone.length ||
                      !city.length ||
                      !address.length
                    }
                    onClick={handleSignUp}
                    size={40}
                    textButton={"Đăng ký"}
                    styleButton={{
                      background: "rgb(255, 57, 69)",
                      height: "48px",
                      width: "100%",
                      border: "none",
                      borderRadius: "20px",
                    }}
                    styleTextButton={{
                      color: "#fff",
                      fontSize: "15px",
                      fontWeight: "700",
                    }}
                  ></ButtonComponent>
                </div>
              </Loading>

              {/* Điều hướng sang trang đăng nhập */}
              <div className="text-center p-t-46 p-b-20">
                <p>
                  Bạn đã có tài khoản?{" "}
                  <WrapperTextLight onClick={handleNavigateSignIn}>
                    {" "}
                    Đăng nhập
                  </WrapperTextLight>
                </p>
              </div>
            </form>

            {/* Phần hình ảnh bên phải */}
            <div
              className="login100-more"
              style={{ backgroundImage: "url('img/12.jpg')" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SignUpPage;

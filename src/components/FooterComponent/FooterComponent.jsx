import React from "react";

const FooterComponent = ({}) => {
  return (
    <div>
      <div className="container-fluid bg-secondary text-dark mt-5 pt-5">
        <div className="row px-xl-5 pt-5">
          <div className="col-lg-4 col-md-12 mb-5 pr-3 pr-xl-5">
            <a href="" className="text-decoration-none">
              <h1 className="mb-4 display-5 font-weight-semi-bold">
                <span className="text-primary font-weight-bold border border-white px-3 mr-1">
                  Fashion
                </span>
                Shop
              </h1>
            </a>
            <p>
              Fashion Shop là một website thương mại với mong muốn mang lại
              những trải nghiệm mua hàng tiện lợi và giá cả hợp lý cho khách
              hàng
            </p>
            <p className="mb-2">
              <i className="fa fa-map-marker-alt text-primary mr-3"></i>123 Quận
              7, TP.HCM
            </p>
            <p className="mb-2">
              []
              <i className="fa fa-envelope text-primary mr-3"></i>
              FaS@gmail.com
            </p>
            <p className="mb-0">
              <i className="fa fa-phone-alt text-primary mr-3"></i>012 345
              67890
            </p>
          </div>
          <div className="col-lg-8 col-md-12">
            <div className="row">
              {Array.from({ length: 1 }, (_, index) => (
                <div className="col-md-4 mb-5" key={index}>
                  <h5 className="font-weight-bold text-dark mb-4">
                    Liên kết nhanh
                  </h5>
                  <div className="d-flex flex-column justify-content-start">
                    <a className="text-dark mb-2" href="/">
                      <i className="fa fa-angle-right mr-2"></i>Trang chủ
                    </a>
                    <a className="text-dark mb-2" href="/">
                      <i className="fa fa-angle-right mr-2"></i>Sản phẩm
                    </a>
                    <a className="text-dark mb-2" href="/order">
                      <i className="fa fa-angle-right mr-2"></i>Giỏ hàng
                    </a>
                    <a className="text-dark mb-2" href="/payment">
                      <i className="fa fa-angle-right mr-2"></i>Thanh toán
                    </a>
                  </div>
                </div>
              ))}
              <div className="col-md-4 mb-5">
                <h5 className="font-weight-bold text-dark mb-4">Bản tin</h5>
                <form action="">
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control border-0 py-4"
                      placeholder="Nhập tên"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="email"
                      className="form-control border-0 py-4"
                      placeholder="Nhập email"
                      required
                    />
                  </div>
                  <div>
                    <button
                      className="btn btn-primary btn-block border-0 py-3"
                      type="submit"
                    >
                      Đăng ký ngay
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- Back to Top --> */}
      <a href="#" class="btn btn-primary back-to-top">
        <i class="fa fa-angle-double-up"></i>
      </a>
    </div>
  );
};

export default FooterComponent;

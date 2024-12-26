import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addOrderProduct } from "../../redux/slides/orderSlide"; // Nhập hành động thêm sản phẩm
import { convertPrice } from "../../utils"; // Hàm chuyển đổi giá

const CardComponent = (props) => {
  const {
    countInStock,
    images = [], // Đổi từ image thành images và gán giá trị mặc định là mảng rỗng
    name,
    price,
    discount,
    id,
  } = props;

  const navigate = useNavigate();
  const dispatch = useDispatch(); // Khởi tạo dispatch để gửi hành động
  const order = useSelector((state) => state.order); // Lấy trạng thái đơn hàng từ Redux

  const handleDetailsProduct = (id) => {
    navigate(`/product-details/${id}`);
  };

  const handleAddOrderProduct = () => {
    const orderRedux = order?.orderItems?.find((item) => item.product === id);
    
    if ((orderRedux?.amount + 1) <= countInStock || !orderRedux) {
      dispatch(addOrderProduct({
        orderItem: {
          name,
          amount: 1,
          image: images[0] || '', // Sử dụng ảnh đầu tiên trong mảng images, nếu không có thì trả về chuỗi rỗng
          price,
          product: id,
          discount,
          countInstock: countInStock,
        }
      }));
    } else {
      alert("Không thể thêm sản phẩm. Số lượng vượt quá số lượng có sẵn.");
    }
  };

  return (
    <div className="col-lg-3 col-md-6 col-sm-12 pb-1">
      <div className="card product-item border-0 mb-4">
        <div
          className="card-header product-img position-relative overflow-hidden bg-transparent border p-0"
          onClick={() => handleDetailsProduct(id)} // Chuyển hướng khi nhấp vào ảnh
          style={{ cursor: "pointer" }} // Thêm con trỏ để chỉ rõ có thể nhấp vào
        >
          <img className="img-fluid w-100" src={images[0] || ''} alt={name} /> {/* Kiểm tra ảnh */}
        </div>
        <div className="card-body border-left border-right text-center p-0 pt-4 pb-3">
          <h6 className="text-truncate mb-3">{name}</h6>
          <div className="d-flex justify-content-center">
            <h6>{convertPrice(price)}</h6>
            <h6 className="text-muted ml-2">
              <del>{discount > 0 ? `${convertPrice(price * (1 - discount / 100))}` : ''}</del> {/* Hiển thị giá đã giảm */}
            </h6>
          </div>
        </div>
        <div className="card-footer d-flex justify-content-between bg-light border">
          <a
            onClick={() => handleDetailsProduct(id)}
            className="btn btn-sm text-dark p-0"
          >
            <i className="fas fa-eye text-primary mr-1"></i>Xem chi tiết
          </a>
          <button
            onClick={handleAddOrderProduct} // Gọi hàm thêm sản phẩm vào giỏ hàng
            className="btn btn-sm text-dark p-0"
          >
            <i className="fas fa-shopping-cart text-primary mr-1"></i>
            Thêm vào giỏ hàng
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardComponent;

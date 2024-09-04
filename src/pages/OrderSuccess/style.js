import { Radio } from "antd";
import styled from "styled-components";

export const WrapperStyleHeader = styled.div`
  background: rgb(255, 255, 255);
  padding: 9px 16px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  span {
    color: rgb(36, 36, 36);
    font-weight: 400;
    font-size: 13px;
  }
`;

export const WrapperValue = styled.div`
  background: rgb(240, 248, 255);
  border: 1px solid rgb(194, 225, 255);
  padding: 10px;
  width: fit-content;
  border-radius: 6px;
  margin-top: 4px;
`;

export const WrapperContainer = styled.div`
  width: 100%;
  box-sizing: border-box;
`;

export const WrapperListOrder = styled.div`
  margin-bottom: 20px;
`;

export const WrapperItemOrder = styled.div`
  display: flex;
  align-items: center;
  padding: 9px 16px;
  background: #fff;
  margin-top: 12px;
  justify-content: center;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
`;
export const WrapperItemPrice = styled.div`
  background: #fff; // Nền trắng để nổi bật hơn
  border: 1px solid #ddd; // Đường viền mảnh để phân tách
  border-radius: 6px; // Bo tròn các góc
  padding: 16px; // Khoảng cách nội dung và viền
  margin-top: 20px; // Khoảng cách với các phần tử khác
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); // Đổ bóng nhẹ để tạo độ nổi
  font-size: 30px; // Kích thước chữ lớn để nổi bật
  color: red; // Màu chữ đỏ
  text-align: center; // Căn giữa nội dung văn bản
  width: fit-content; // Chiều rộng tự động dựa trên nội dung
  margin: 20px auto; // Căn giữa khung và tạo khoảng cách từ trên và dưới
`;

export const WrapperPriceDiscount = styled.span`
  color: #999;
  font-size: 12px;
  text-decoration: line-through;
  margin-left: 4px;
`;

export const WrapperCountOrder = styled.div`
  display: flex;
  align-items: center;
  width: 84px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

export const WrapperRight = styled.div`
  width: 320px;
  margin-left: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;

  @media (max-width: 768px) {
    width: 100%;
    margin-left: 0;
    padding: 0 16px;
  }
`;

export const WrapperInfo = styled.div`
  padding: 17px 20px;
  border-bottom: 1px solid #f5f5f5;
  background: #fff;
  border-top-right-radius: 6px;
  border-top-left-radius: 6px;
  width: 100%;
  box-sizing: border-box;
`;

export const WrapperItemOrderInfo = styled.div`
  border-bottom: 1px solid #f5f5f5;
  background: #fff;
  border-top-right-radius: 6px;
  border-top-left-radius: 6px;
  width: 100%;
  display: flex;
  justify-content: center;
  flex-wrap: wrap; // Để các mục tự động xuống dòng khi không đủ không gian
  gap: 16px; // Khoảng cách giữa các mục
`;

export const WrapperTotal = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 17px 20px;
  background: #fff;
  border-bottom-right-radius: 6px;
  border-bottom-left-radius: 6px;
`;

export const Label = styled.span`
  font-size: 12px;
  color: #000;
  font-weight: bold;
`;

export const WrapperRadio = styled(Radio.Group)`
  margin-top: 6px;
  background: rgb(240, 248, 255);
  border: 1px solid rgb(194, 225, 255);
  width: 500px;
  border-radius: 4px;
  height: 100px;
  padding: 16px;
  font-weight: normal;
  display: flex;
  flex-direction: column;
  gap: 10px;
  justify-content: center;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

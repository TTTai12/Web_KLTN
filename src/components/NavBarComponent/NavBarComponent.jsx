import React from "react";
import { WrapperContent, WrapperLabelText, WrapperTextPrice } from "./style";
import TypeProductNavbar from "../TypeProductNavbar/TypeProductNavbar";
import { Checkbox, Rate } from "antd";
import "./style.css";

const NavBarComponent = () => {
  const onChange = () => {};

  const images = [
    "https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/MU2G3?wid=890&hei=890&fmt=jpeg&qlt=90&.v=1693236163178",
    "https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/HPBJ2?wid=890&hei=890&fmt=jpeg&qlt=90&.v=1601575259000",
    "https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/HQ5Z2?wid=890&hei=890&fmt=jpeg&qlt=90&.v=1661963682947",
    "https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/MUW23?wid=890&hei=890&fmt=jpeg&qlt=90&.v=1712255585028",
    "https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/MT0N3?wid=890&hei=890&fmt=jpeg&qlt=90&.v=1692999418841",
    "https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/MK0Q3?wid=890&hei=890&fmt=jpeg&qlt=90&.v=1646446502407",
    "https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/MU7V2?wid=532&hei=582&fmt=png-alpha&.v=1542406861289",
  ];

  const renderContent = (type, options) => {
    switch (type) {
      case "text":
        return options.map((option, index) => (
          <div key={option} className="category-item">
    
        
            <TypeProductNavbar name={option} image={images[index]} />
     
        </div>
        ));
      case "checkbox":
        return (
          <Checkbox.Group
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
            onChange={onChange}
          >
            {options.map((option) => (
              <Checkbox
                style={{ marginLeft: 0 }}
                value={option.value}
                key={option.value}
              >
                {option.label}
              </Checkbox>
            ))}
          </Checkbox.Group>
        );
      case "star":
        return options.map((option) => (
          <div style={{ display: "flex" }} key={option}>
            <Rate style={{ fontSize: "12px" }} disabled defaultValue={option} />
            <span> {`từ ${option} sao`}</span>
          </div>
        ));
      case "price":
        return options.map((option) => (
          <WrapperTextPrice key={option}>{option}</WrapperTextPrice>
        ));
      default:
        return {};
    }
  };

  return (
    <div style={{ backgroundColor: "rgb(255, 255, 255)", marginRight: "15px" }}>
      <WrapperLabelText>Danh mục sản phẩm</WrapperLabelText>
      <WrapperContent>
        <div className="category">
          {renderContent("text", [
            "Dây sạc",
            "Giá đỡ",
            "Kính Cường Lực",
            "Tai Nghe",
            "Ốp Lưng",
            "TIVI",
            "Bộ Sạc",
          ])}
        </div>
      </WrapperContent>
    </div>
  );
};

export default NavBarComponent;

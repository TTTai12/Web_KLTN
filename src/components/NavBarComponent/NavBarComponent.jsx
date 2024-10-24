import React from "react";
import { WrapperContent, WrapperLabelText, WrapperTextPrice } from "./style";
import TypeProductNavbar from "../TypeProductNavbar/TypeProductNavbar";
import { Checkbox, Rate } from "antd";
import "./style.css";

const NavBarComponent = () => {
  const onChange = () => {};

  const images = [
    "https://salt.tikicdn.com/cache/100x100/ts/category/92/b5/c0/3ffdb7dbfafd5f8330783e1df20747f6.png.webp",
    "https://salt.tikicdn.com/cache/100x100/ts/category/54/c0/ff/fe98a4afa2d3e5142dc8096addc4e40b.png.webp",
    "https://salt.tikicdn.com/cache/100x100/ts/category/8b/d4/a8/5924758b5c36f3b1c43b6843f52d6dd2.png.webp",
    "https://salt.tikicdn.com/cache/100x100/ts/category/2d/7c/45/e4976f3fa4061ab310c11d2a1b759e5b.png.webp",
    "https://salt.tikicdn.com/cache/100x100/ts/category/61/d4/ea/e6ea3ffc1fcde3b6224d2bb691ea16a2.png.webp",
    "https://salt.tikicdn.com/cache/100x100/ts/category/61/d4/ea/e6ea3ffc1fcde3b6224d2bb691ea16a2.png.webp",
    "https://salt.tikicdn.com/cache/100x100/ts/category/61/d4/ea/e6ea3ffc1fcde3b6224d2bb691ea16a2.png.webp",
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
    <div className="col-lg-3 col-md-12">
    {/* Danh mục sản phẩm Start */}
    
        <div className="category">
          {renderContent("text", [
            "Quần",
            "Aó",
            "váy",
            "Áo khác",
          ])}
        </div>
   
    {/* Danh mục sản phẩm End */}

    {/* Filter by price Start */}
    <div className="border-bottom mb-4 pb-4">
      <h5 className="font-weight-semi-bold mb-4">Filter by price</h5>
      <form>
        {['All Price', '$0 - $100', '$100 - $200', '$200 - $300', '$300 - $400', '$400 - $500'].map((price, index) => (
          <div className="custom-control custom-checkbox d-flex align-items-center justify-content-between mb-3" key={index}>
            <input type="checkbox" className="custom-control-input" id={`price-${index}`} />
            <label className="custom-control-label" htmlFor={`price-${index}`}>{price}</label>
            <span className="badge border font-weight-normal">{Math.floor(Math.random() * 300) + 100}</span>
          </div>
        ))}
      </form>
    </div>
    {/* Filter by price End */}

    {/* Filter by color Start */}
    <div className="border-bottom mb-4 pb-4">
      <h5 className="font-weight-semi-bold mb-4">Filter by color</h5>
      <form>
        {['All Color', 'Black', 'White', 'Red', 'Blue', 'Green'].map((color, index) => (
          <div className="custom-control custom-checkbox d-flex align-items-center justify-content-between mb-3" key={index}>
            <input type="checkbox" className="custom-control-input" id={`color-${index}`} />
            <label className="custom-control-label" htmlFor={`color-${index}`}>{color}</label>
            <span className="badge border font-weight-normal">{Math.floor(Math.random() * 300) + 100}</span>
          </div>
        ))}
      </form>
    </div>
    {/* Filter by color End */}

    {/* Filter by size Start */}
    <div className="mb-5">
      <h5 className="font-weight-semi-bold mb-4">Filter by size</h5>
      <form>
        {['All Size', 'XS', 'S', 'M', 'L', 'XL'].map((size, index) => (
          <div className="custom-control custom-checkbox d-flex align-items-center justify-content-between mb-3" key={index}>
            <input type="checkbox" className="custom-control-input" id={`size-${index}`} />
            <label className="custom-control-label" htmlFor={`size-${index}`}>{size}</label>
            <span className="badge border font-weight-normal">{Math.floor(Math.random() * 300) + 100}</span>
          </div>
        ))}
      </form>
    </div>
    {/* Filter by size End */}
  </div>
  );
};

export default NavBarComponent;

import React from "react";
import { useNavigate } from "react-router-dom";
import TypeProduct from "../TypeProduct/TypeProduct"
const GenderTypeProductNavbar = ({ name, image, gender }) => {
  const navigate = useNavigate();

  const handleNavigatetype = (type, gender) => {
    const formattedType = type
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/ /g, "_");

    navigate(`/product/${gender}/${formattedType}`, {
      state: { type, gender },
    });
  };

  const handleItemClick = () => {
    handleNavigatetype(name, gender);
  };

  return (
    <div
      className="category-item"
      style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
      onClick={handleItemClick}
    >
      <img
        src={image}
        alt={name}
        style={{ width: "32px", height: "32px", marginRight: "10px" }}
      />
      <span style={{ cursor: "pointer" }}>{name}</span>
      
    </div>
  );
};

export default GenderTypeProductNavbar;

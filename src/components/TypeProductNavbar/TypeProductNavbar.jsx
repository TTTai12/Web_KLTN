import React from "react";
import { useNavigate } from "react-router-dom";

const TypeProductNavbar = ({ name, image }) => {
  const navigate = useNavigate();

  const handleNavigatetype = (type) => {
    navigate(
      `/product/${type
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/ /g, "_")}`,
      { state: type }
    );
  };

  const handleItemClick = () => {
    handleNavigatetype(name);
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

export default TypeProductNavbar;

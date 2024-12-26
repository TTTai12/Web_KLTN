import React from "react";
import { useNavigate } from "react-router-dom";

const TypeProductNavbar = ({ name, gender }) => {
  const navigate = useNavigate();

  const handleNavigatetype = (type, gender) => {
    const formattedType = type
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/ /g, "_");

    navigate(`/product/${gender}/${formattedType}`, { state: { type, gender } });
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
      <span style={{ cursor: "pointer" }}>{name}</span>
    </div>
  );
};

export default TypeProductNavbar;

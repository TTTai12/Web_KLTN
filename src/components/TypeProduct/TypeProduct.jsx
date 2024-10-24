import React from "react";
import { useNavigate } from "react-router-dom";

const TypeProduct = ({ name }) => {
  const navigate = useNavigate();
  const handleNavigatetype = (type) => {
    navigate(
      `/product/${type
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        ?.replace(/ /g, "_")}`,
      { state: type }
    );
  };
  return (
    <a
     className="nav-item nav-link"
      onClick={() => handleNavigatetype(name)}
    >
      {name}
    </a>
  );
};

export default TypeProduct;

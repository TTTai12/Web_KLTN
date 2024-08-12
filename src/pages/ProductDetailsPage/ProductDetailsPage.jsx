import React from "react";
import ProductDetailsComponent from "../../components/ProductDetailsComponent/ProductDetailsComponent";
import { Navigate, useNavigate, useParams } from "react-router-dom"

const ProductDetailsPage = () => {
  const {id} = useParams()
  const navigate = useNavigate()
  return (
    <div style={{padding: "1px 120px", background: "#efefef", minHeight: "100vh",}}>
        <h3><span style={{cursor: 'pointer', fontWeight: 'bold'}} onClick={() => navigate("/")}>Trang chủ</span> &gt; Chi tiết sản phẩm</h3>
      <ProductDetailsComponent idProduct={id}/>
    </div>
  );
};

export default ProductDetailsPage;

import React, { useState } from "react";
import { Row, Col, Image, Rate, Card } from "antd";
import {
  WrapperStyleNameProduct,
  WrapperStyleTextSell,
  WrapperPriceProduct,
  WrapperPriceTextProduct,
  WrapperAddressProduct,
  WrapperQualityProduct,
  WrapperInputNumber,
  WrapperDescriptionProduct,
} from "./style";
import { MinusOutlined, PlusOutlined, StarFilled } from "@ant-design/icons";
import ButtonComponent from "../ButtonComponent/ButtonComponent";
import * as ProductService from "../../services/ProductService";
import { useQuery } from "@tanstack/react-query";
import Loading from "../LoadingComponent/Loading";
import { convertPrice } from "../../utils";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { addOrderProduct } from "../../redux/slides/orderSlide";

const ProductDetailsComponent = ({ idProduct }) => {
  const [numProduct, setNumProduct] = useState(1);
  const user = useSelector((state) => state.user);
  const product = useSelector((state) => state.product);
  const order = useSelector((state) => state.order);
  const [errorLimitOrder, setErrorLimitOrder] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const onChange = (value) => {
    setNumProduct(Number(value));
  };

  const fetchGetDetailsProduct = async (context) => {
    const id = context?.queryKey && context?.queryKey[1];
    if (id) {
      const res = await ProductService.getDetailsProduct(id);
      return res.data;
    }
  };

  const handleChangeCount = (type, limited) => {
    if (type === 'increase') {
      if (!limited) {
        setNumProduct(numProduct + 1);
      }
    } else {
      if (!limited) {
        setNumProduct(numProduct - 1);
      }
    }
  };

  const { isPending, data: productDetails } = useQuery({
    queryKey: ['products-details', idProduct],
    queryFn: fetchGetDetailsProduct,
    enabled: !!idProduct,
  });

  const handleAddOrderProduct = () => {
    if (!user?.id) {
      navigate('/sign-in', { state: location?.pathname });
    } else {
      const orderRedux = order?.orderItems?.find((item) => item.product === productDetails?._id);
      if ((orderRedux?.amount + numProduct) <= orderRedux?.countInstock || (!orderRedux && productDetails?.countInStock > 0)) {
        dispatch(addOrderProduct({
          orderItem: {
            name: productDetails?.name,
            amount: numProduct,
            image: productDetails?.image,
            price: productDetails?.price,
            product: productDetails?._id,
            discount: productDetails?.discount,
            countInstock: productDetails?.countInStock,
          }
        }));
      } else {
        setErrorLimitOrder(true);
      }
    }
  }
  const fetchGetRelatedProducts = async (context) => {
    const id = context?.queryKey && context?.queryKey[1];
    if (id) {
      const res = await ProductService.getRelatedProducts(id);
      return res.data;
    }
  };

  const { isPending: isRelatedLoading, data: relatedProducts } = useQuery({
    queryKey: ['related-products', idProduct],
    queryFn: fetchGetRelatedProducts,
    enabled: !!idProduct
  });

  return (
    <Loading isPending={isPending}>
      <Row style={{ padding: '16px', background: '#fff', borderRadius: '4px', height: '100%' }}>
        <Col span={10} style={{ borderRight: '1px solid #e5e5e5', paddingRight: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Image src={productDetails?.image} alt="image product" preview={false} style={{ width: '100%', height: 'auto', maxWidth: '500px', objectFit: 'contain' }} />
        </Col>
        <Col span={14} style={{ paddingLeft: "10px" }}>
          <WrapperStyleNameProduct>{productDetails?.name}</WrapperStyleNameProduct>
          <div>
            <Rate allowHalf defaultValue={productDetails?.rating} value={productDetails?.rating} />
            <WrapperStyleTextSell> | Đã bán 1000+</WrapperStyleTextSell>
          </div>
          <WrapperPriceProduct>
            <WrapperPriceTextProduct>{convertPrice(productDetails?.price)}</WrapperPriceTextProduct>
          </WrapperPriceProduct>
          <WrapperAddressProduct>
            <span> Giao Đến </span>
            <span className="address"> {user?.address} - </span>
            <span className="change-address"> Đổi địa chỉ </span>
          </WrapperAddressProduct>
          <div
            style={{
              margin: "10px 0 20px",
              padding: "10px 0",
              borderTop: "1px solid #e5e5e5",
              borderBottom: "1px solid #e5e5e5",
            }}
          >
            <div style={{ marginBottom: "10px" }}>Số Lượng</div>
            <WrapperQualityProduct>
              <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={() => handleChangeCount('decrease', numProduct === 1)}>
                <MinusOutlined style={{ color: '#000', fontSize: '20px' }} />
              </button>
              <WrapperInputNumber onChange={onChange} defaultValue={1} max={productDetails?.countInStock} min={1} value={numProduct} size="small" />
              <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={() => handleChangeCount('increase', numProduct === productDetails?.countInStock)}>
                <PlusOutlined style={{ color: '#000', fontSize: '20px' }} />
              </button>
            </WrapperQualityProduct>
            
          </div>
          <div
            style={{
              margin: "10px 0 20px",
              padding: "10px 0",
              borderTop: "1px solid #e5e5e5",
              borderBottom: "1px solid #e5e5e5",
            }}
          >
            <div style={{ marginBottom: "10px" , fontSize:'20px',color: 'rgb(39, 39, 42)'}}>Đặc điểm nổi bật</div>
            <WrapperDescriptionProduct>
            <div>
              <Image style={{ width: '16px', height: '16px' }} src="https://salt.tikicdn.com/ts/upload/81/61/d4/92e63f173e7983b86492be159fe0cff4.png" alt="blue-check" />
              <span className="description">{productDetails?.description}</span>
            </div>
            </WrapperDescriptionProduct>
            
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <ButtonComponent
              size={40}
              styleButton={{
                background: "rgb(255, 57, 69)",
                height: "48px",
                width: "220px",
                border: "none",
                borderRadius: "4px",
              }}
              onClick={handleAddOrderProduct}
              textButton={"Chọn Mua"}
              styleTextButton={{ color: "#fff" }}
            ></ButtonComponent>
            <ButtonComponent
              size={40}
              styleButton={{
                background: "#fff",
                height: "48px",
                width: "220px",
                border: "1px solid rgb(13, 92, 182)",
                borderRadius: "4px",
              }}
              textButton={"Mua trước trả sau"}
              styleTextButton={{ color: "rgb(13, 92, 182)", fontSize: "15px" }}
            ></ButtonComponent>
          </div>
        </Col>
        </Row>
      <Row style={{ padding: '16px', background: '#fff', borderRadius: '4px', marginTop: '16px' }}>
        <h2>Sản phẩm tương tự</h2>
        {isRelatedLoading ? (
          <Loading />
        ) : (
          <Row gutter={[16, 16]}>
            {relatedProducts?.map(product => (
              <Col key={product._id} span={6}>
                <Card
                  hoverable
                  cover={<img alt={product.name} src={product.image} />}
                  onClick={() => navigate(`/product/${product._id}`)}
                >
                  <Card.Meta title={product.name} description={convertPrice(product.price)} />
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Row>
    </Loading>
  );
};

export default ProductDetailsComponent;
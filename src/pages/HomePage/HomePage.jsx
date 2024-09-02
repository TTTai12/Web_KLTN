import React, { useEffect, useRef, useState } from "react";
import TypeProduct from "../../components/TypeProduct/TypeProduct";
import {
  WrapperButtonMore,
  WrapperProducts,
  WrapperTypeProduct,
} from "./style";
import slider1 from "../../assets/images/slider1.webp";
import slider2 from "../../assets/images/slider2.webp";
import slider3 from "../../assets/images/slider3.webp";
import SliderComponent from "../../components/SliderComponent/SliderComponent";
import CardComponent from "../../components/CardComponent/CardComponent";
import * as ProductService from "../../services/ProductService";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../components/LoadingComponent/Loading";
import { useSelector } from "react-redux";
import { useDebounce } from "../../hooks/useDebounce";
import FooterComponent from "../../components/FooterComponent/FooterComponent";
// links này là cho Footer
const supportLinks = [
  { href: "https://example.com/link1", text: "Hotline" },
  { href: "https://example.com/link2", text: "Các câu hỏi thường gặp" },
  { href: "https://example.com/link2", text: "Gửi yêu cầu hỗ trợ" },
  { href: "https://example.com/link2", text: "Hướng dẫn đặt hàng" },
  { href: "https://example.com/link2", text: "Phương thức vận chuyển" },
  { href: "https://example.com/link2", text: "Chính sách đổi trả" },
  { href: "mailto:tientantai12@gmail.com", text: "Báo lỗi bảo mật " },
  { href: "https://example.com/link2", text: "Hướng dẫn trả góp" },
];

const StoreLinks = [
  { href: "https://example.com/tiki1", text: "Giới thiệu NhânTàiStore" },
  { href: "https://example.com/tiki2", text: "NhânTàiStore Blog" },
  { href: "https://example.com/tiki2", text: "Tuyển dụng" },
  { href: "https://example.com/tiki2", text: "Chính sách bảo mật thanh toán" },
  {
    href: "https://example.com/tiki2",
    text: "Chính sách bảo mật thông tin cá nhân",
  },
  {
    href: "https://example.com/tiki2",
    text: "Chính sách giải quyết khiếu nại",
  },
  {
    href: "https://example.com/tiki2",
    text: "Tiếp thị liên kết cùng NhânTàiStore",
  },
  { href: "https://example.com/tiki2", text: "Bán hàng doanh nghiệp" },
  { href: "https://example.com/tiki2", text: "Điều kiện vận chuyển" },
];

const CooperationLinks = [
  { href: "https://example.com/tiki1", text: "Quy chế hoạt động sàn GDTMDT" },
  { href: "https://example.com/tiki2", text: "Bán hàng cùng NhânTàiStore" },
];

const HomePage = () => {
  const searchProduct = useSelector((state) => state?.product?.search);
  const searchDebounce = useDebounce(searchProduct, 500);
  const [loading, setLoading] = useState(false);
  const [limit, setLimit] = useState(6);
  const [typeProducts, setTypeProducts] = useState([]);

  const fetchProductAll = async (context) => {
    const limit = context?.queryKey && context?.queryKey[1];
    const search = context?.queryKey && context?.queryKey[2];
    const res = await ProductService.getAllProduct(search, limit);

    return res;
  };
  const fetchAllTypeProduct = async () => {
    const res = await ProductService.getAllTypeProduct();
    if (res?.status === "OK") {
      setTypeProducts(res?.data);
    }
  };
  useEffect(() => {
    fetchAllTypeProduct();
  }, []);
  const {
    isPending,
    data: products,
    isPreviousData,
  } = useQuery({
    queryKey: ["products", limit, searchDebounce],
    queryFn: fetchProductAll,
    retry: 3,
    retryDelay: 1000,
    placeholderData: (previousData) => previousData,
  });

  return (
    <Loading isPending={isPending || loading}>
      <div style={{ width: "1270px", margin: "0 auto" }}>
        <WrapperTypeProduct>
          {typeProducts.map((item) => {
            return <TypeProduct name={item} key={item} />;
          })}
        </WrapperTypeProduct>
      </div>
      <div
        className="body"
        style={{ width: "100%", backgroundColor: "#efefef" }}
      >
        <div
          id="container"
          style={{ height: "100%", width: "1270px", margin: "0 auto" }}
        >
          <SliderComponent arrImages={[slider1, slider2, slider3]} />
          <div
            style={{
              marginTop: "20px",
              display: "flex",
              alignItems: "center",
              gap: "30px",
              flexWrap: "wrap",
            }}
          >
            <WrapperProducts>
              {products?.data?.map((product) => {
                return (
                  <CardComponent
                    key={product._id}
                    countInStock={product.countInStock}
                    description={product.description}
                    image={product.image}
                    name={product.name}
                    price={product.price}
                    rating={product.rating}
                    type={product.type}
                    selled={product.selled}
                    discount={product.discount}
                    id={product._id}
                  />
                );
              })}
            </WrapperProducts>
          </div>
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              marginTop: "20px",
            }}
          >
            <WrapperButtonMore
              textButton={isPreviousData ? "Load more" : "Xem thêm"}
              type="outline"
              styleButton={{
                border: `1px solid ${
                  products?.total === products?.data?.length
                    ? "#f5f5f5"
                    : "#9255FD"
                }`,
                color: `${
                  products?.total === products?.data?.length
                    ? "#f5f5f5"
                    : "#9255FD"
                }`,
                width: "240px",
                height: "38px",
                borderRadius: "4px",
              }}
              disabled={
                products?.total === products?.data?.length ||
                products?.totalPage === 1
              }
              styleTextButton={{ fontWeight: 500 }}
              onClick={() => setLimit((prev) => prev + 8)}
            />
          </div>
        </div>
      </div>

      <FooterComponent
        supportLinks={supportLinks}
        StoreLinks={StoreLinks}
        CooperationLinks={CooperationLinks}
      />
    </Loading>
  );
};

export default HomePage;

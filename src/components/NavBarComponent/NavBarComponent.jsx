import React from "react";
import GenderTypeProductNavbar from "../../components/GenderTypeProductNavbar copy/GenderTypeProductNavbar";
import "./style.css";

const NavBarComponent = () => {
  const images = [
    "https://bizweb.dktcdn.net/100/415/697/products/ak046.png?v=1701405178907",
    "https://salt.tikicdn.com/cache/100x100/ts/category/00/5d/97/384ca1a678c4ee93a0886a204f47645d.png.webp",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTukelZQ3qqo_D-kBj5t1yNbfK1i5D8urVtkA&s",
    "https://salt.tikicdn.com/cache/100x100/ts/category/55/5b/80/48cbaafe144c25d5065786ecace86d38.png.webp",
    "https://ngocminhcamera.vn/wp-content/uploads/2020/03/balo-may-anh-case-logic-206-1-800x800-2.jpg",
    "https://media.istockphoto.com/id/543836220/vi/anh/tr%E1%BB%91ng-v%E1%BB%9B-%C4%91en-thi%E1%BA%BFt-k%E1%BA%BF-mockup-c%C3%B4-l%E1%BA%ADp-c%E1%BA%AFt-%C4%91%C6%B0%E1%BB%9Dng.jpg?s=612x612&w=0&k=20&c=BaEYk52fuzjMoQGZgugDwULKslC2RyyXbAILktpuWPw=",
    "https://jola.vn/cdn/720/Product/tJ9hvk9-c/1005-tui-da-mini-quai-xich-phong-cach-han-quoc-9x15x3cm.jpg",
  ];

  // Tạo nhóm loại sản phẩm theo giới tính
  const categories = [
    {
      gender: "Nam",
      items: [
        { name: "Áo khoác", image: images[0] },
        { name: "Áo", image: images[1] },
        { name: "Vớ", image: images[5] },
        { name: "Balo", image: images[4] },
      ],
    },
    {
      gender: "Nữ",
      items: [
        { name: "Quần", image: images[2] },
        { name: "Váy", image: images[3] },
        { name: "Túi xách", image: images[6] },
      ],
    },
  ];

  return (
    <div className="col-lg-3 col-md-12">
      {/* Filter by Gender and Category Start */}
      <div className="category mb-5">
        <h5>Danh mục</h5>
        {categories.map((categoryGroup) => (
          <div key={categoryGroup.gender} className="mb-4">
            {categoryGroup.items.map((category, index) => (
              <GenderTypeProductNavbar
                key={`${categoryGroup.gender}-${index}`}
                name={category.name}
                image={category.image}
                gender={categoryGroup.gender} // Truyền gender vào
              />
            ))}
          </div>
        ))}
      </div>
      {/* Filter by Gender and Category End */}
    </div>
  );
};

export default NavBarComponent;

import { Button, Form, Select, Space } from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import React, { useRef } from "react";
import { WrapperHeader, WrapperUploadFile } from "./style";
import TableComponent from "../TableComponent/TableComponent";
import { useState } from "react";
import InputComponent from "../InputComponent/InputComponent";
import { getBase64, renderOptions } from "../../utils";
import * as ProductService from "../../services/ProductService";
import { useMutationHooks } from "../../hooks/useMutationHook";
import Loading from "../../components/LoadingComponent/Loading";
import { useEffect } from "react";
import * as message from "../../components/Message/Message";
import { useQuery } from "@tanstack/react-query";
import DrawerComponent from "../DrawerComponent/DrawerComponent";
import { useSelector } from "react-redux";
import ModalComponent from "../ModalComponent/ModalComponent";

const AdminProduct = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rowSelected, setRowSelected] = useState("");
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [isPendingUpdate, setIsPendingUpdate] = useState(false);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const user = useSelector((state) => state?.user);
  const searchInput = useRef(null);
  const inittial = () => ({
    name: "",
    price: "",
    description: "",
    rating: "",
    images: [],
    type: "",
    countInStock: "",
    newType: "",
    discount: "",
    information: "",
    gender: "",
  });
  const [stateProduct, setStateProduct] = useState(inittial());
  const [stateProductDetails, setStateProductDetails] = useState(inittial());

  const [form] = Form.useForm();

  const mutation = useMutationHooks((data) => {
    const {
      name,
      price,
      description,
      rating,
      images,
      type,
      countInStock,
      information,
      discount,
      gender,
    } = data;
    const res = ProductService.createProduct({
      name,
      price,
      description,
      rating,
      images,
      type,
      countInStock,
      discount,
      information,
      gender,
    });
    return res;
  });
  const mutationUpdate = useMutationHooks((data) => {
    const { id, token, ...rests } = data;
    const res = ProductService.updateProduct(id, token, { ...rests });
    return res;
  });

  const mutationDeleted = useMutationHooks((data) => {
    const { id, token } = data;
    const res = ProductService.deleteProduct(id, token);
    return res;
  });

  const mutationDeletedMany = useMutationHooks((data) => {
    const { token, ...ids } = data;
    const res = ProductService.deleteManyProduct(ids, token);
    return res;
  });

  const getAllProducts = async () => {
    const res = await ProductService.getAllProduct();
    return res;
  };

  const fetchGetDetailsProduct = async (rowSelected) => {
    const res = await ProductService.getDetailsProduct(rowSelected);
    if (res?.data) {
      setStateProductDetails({
        name: res?.data?.name,
        price: res?.data?.price,
        description: res?.data?.description,
        rating: res?.data?.rating,
        images: res?.data?.images, // Thay đổi từ 'image' thành 'images'
        type: res?.data?.type,
        gender: res?.data?.gender,
        countInStock: res?.data?.countInStock,
        discount: res?.data?.discount,
        information: res?.data?.information,
      });
    }
    setIsPendingUpdate(false);
  };

  useEffect(() => {
    if (!isModalOpen) {
      form.setFieldsValue(stateProductDetails);
    } else {
      form.setFieldsValue(inittial());
    }
  }, [form, stateProductDetails, isModalOpen]);

  useEffect(() => {
    if (rowSelected && isOpenDrawer) {
      setIsPendingUpdate(true);
      fetchGetDetailsProduct(rowSelected);
    }
  }, [rowSelected, isOpenDrawer]);

  const handleDetailsProduct = () => {
    setIsOpenDrawer(true);
  };

  const handleDelteManyProducts = (ids) => {
    mutationDeletedMany.mutate(
      { ids: ids, token: user?.access_token },
      {
        onSettled: () => {
          queryProduct.refetch();
        },
      }
    );
  };

  const fetchAllTypeProduct = async () => {
    const res = await ProductService.getAllTypeProduct();
    return res;
  };

  const { data, isPending, isSuccess, isError } = mutation;
  const {
    data: dataUpdated,
    isPending: isPendingUpdated,
    isSuccess: isSuccessUpdated,
    isError: isErrorUpdated,
  } = mutationUpdate;
  const {
    data: dataDeleted,
    isPending: isPendingDeleted,
    isSuccess: isSuccessDelected,
    isError: isErrorDeleted,
  } = mutationDeleted;
  const {
    data: dataDeletedMany,
    isPending: isPendingDeletedMany,
    isSuccess: isSuccessDelectedMany,
    isError: isErrorDeletedMany,
  } = mutationDeletedMany;

  const queryProduct = useQuery({
    queryKey: ["products"],
    queryFn: getAllProducts,
  });
  const typeProduct = useQuery({
    queryKey: ["type-product"],
    queryFn: fetchAllTypeProduct,
  });
  const { isPending: isPendingProducts, data: products } = queryProduct;
  const renderAction = () => {
    return (
      <div>
        <DeleteOutlined
          style={{ color: "red", fontSize: "30px", cursor: "pointer" }}
          onClick={() => setIsModalOpenDelete(true)}
        />
        <EditOutlined
          style={{ color: "orange", fontSize: "30px", cursor: "pointer" }}
          onClick={handleDetailsProduct}
        />
      </div>
    );
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    // setSearchText(selectedKeys[0]);
    // setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    // setSearchText('');
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <InputComponent
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    // render: (text) =>
    //   searchedColumn === dataIndex ? (
    //     // <Highlighter
    //     //   highlightStyle={{
    //     //     backgroundColor: '#ffc069',
    //     //     padding: 0,
    //     //   }}
    //     //   searchWords={[searchText]}
    //     //   autoEscape
    //     //   textToHighlight={text ? text.toString() : ''}
    //     // />
    //   ) : (
    //     text
    //   ),
  });

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      sorter: (a, b) => a.name.length - b.name.length,
      ...getColumnSearchProps("name"),
    },
    {
      title: "Price",
      dataIndex: "price",
      sorter: (a, b) => a.price - b.price,
      filters: [
        {
          text: ">= 50",
          value: ">=",
        },
        {
          text: "<= 50",
          value: "<=",
        },
      ],
      onFilter: (value, record) => {
        if (value === ">=") {
          return record.price >= 50;
        }
        return record.price <= 50;
      },
    },
    {
      title: "Gender",
      dataIndex: "gender",
      filters: [
        { text: "Male", value: "male" },
        { text: "Female", value: "female" },
        { text: "Other", value: "other" },
      ],
      onFilter: (value, record) => record.gender.includes(value),
    },
    {
      title: "Count In Stock",
      dataIndex: "countInStock",
      sorter: (a, b) => a.countInStock - b.countInStock,
      filters: [
        {
          text: ">= 10",
          value: ">=",
        },
        {
          text: "<= 10",
          value: "<=",
        },
      ],
      onFilter: (value, record) => {
        if (value === ">=") {
          return record.countInStock >= 10;
        }
        return record.countInStock <= 10;
      },
    },
    {
      title: "Type",
      dataIndex: "type",
    },
    {
      title: "Description",
      dataIndex: "description",
    },
    {
      title: "Information",
      dataIndex: "information",
    },
    {
      title: "Discount",
      dataIndex: "discount",
    },
    {
      title: "Action",
      dataIndex: "action",
      render: renderAction,
    },
  ];
  
  const dataTable =
    products?.data?.length &&
    products?.data?.map((product) => {
      return { ...product, key: product._id };
    });

  useEffect(() => {
    if (isSuccess && data?.status === "OK") {
      message.success();
      handleCancel();
    } else if (isError) {
      message.error();
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isSuccessDelectedMany && dataDeletedMany?.status === "OK") {
      message.success();
    } else if (isErrorDeletedMany) {
      message.error();
    }
  }, [isSuccessDelectedMany]);

  useEffect(() => {
    if (isSuccessDelected && dataDeleted?.status === "OK") {
      message.success();
      handleCancelDelete();
    } else if (isErrorDeleted) {
      message.error();
    }
  }, [isSuccessDelected]);

  const handleCloseDrawer = () => {
    setIsOpenDrawer(false);
    setStateProductDetails({
      name: "",
      price: "",
      description: "",
      rating: "",
      images: [],
      type: "",
      gender: "",
      countInStock: "",
      information: "",
    });
    form.resetFields();
  };

  useEffect(() => {
    if (isSuccessUpdated && dataUpdated?.status === "OK") {
      message.success();
      handleCloseDrawer();
    } else if (isErrorUpdated) {
      message.error();
    }
  }, [isSuccessUpdated]);

  const handleCancelDelete = () => {
    setIsModalOpenDelete(false);
  };

  const handleDeleteProduct = () => {
    mutationDeleted.mutate(
      { id: rowSelected, token: user?.access_token },
      {
        onSettled: () => {
          queryProduct.refetch();
        },
      }
    );
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setStateProduct({
      name: "",
      price: "",
      description: "",
      information: "",
      rating: "",
      images: [],
      gender: "",
      type: "",
      countInStock: "",
      discount: "",
    });
    form.resetFields();
  };

  const onFinish = () => {
    const params = {
      name: stateProduct.name,
      price: stateProduct.price,
      description: stateProduct.description,
      information: stateProduct.information,
      rating: stateProduct.rating,
      images: stateProduct.images, // Thay 'image' bằng 'images'
      gender: stateProduct.gender,
      type:
        stateProduct.type === "add_type"
          ? stateProduct.newType
          : stateProduct.type,
      countInStock: stateProduct.countInStock,
      discount: stateProduct.discount,
    };

    mutation.mutate(params, {
      onSettled: () => {
        queryProduct.refetch();
      },
    });
  };

  const handleOnchange = (e) => {
    setStateProduct({
      ...stateProduct,
      [e.target.name]: e.target.value,
    });
  };

  const handleOnchangeDetails = (e) => {
    setStateProductDetails({
      ...stateProductDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleOnchangeAvatar = async ({ fileList }) => {
    // Tạo một mảng để chứa các preview image
    const newImages = await Promise.all(
      fileList.map(async (file) => {
        if (!file.url && !file.preview) {
          file.preview = await getBase64(file.originFileObj); // Tạo preview cho ảnh
        }
        return file.preview; // Trả về preview của ảnh
      })
    );

    // Cập nhật state với mảng hình ảnh mới
    setStateProduct((prevState) => ({
      ...prevState,
      images: newImages, // Đặt images thành mảng mới chứa tất cả ảnh đã chọn
    }));
  };

  const handleOnchangeAvatarDetails = async ({ fileList }) => {
    // Lấy danh sách hình ảnh đã chọn
    const newImages = await Promise.all(
      fileList.map(async (file) => {
        if (!file.url && !file.preview) {
          file.preview = await getBase64(file.originFileObj); // Tạo URL cho hình ảnh
        }
        return file.preview; // Trả về preview cho từng hình ảnh
      })
    );

    setStateProductDetails((prevState) => ({
      ...prevState,
      images: newImages, // Cập nhật trạng thái với tất cả hình ảnh
    }));
  };

  const onUpdateProduct = () => {
    mutationUpdate.mutate(
      {
        id: rowSelected,
        token: user?.access_token,
        ...stateProductDetails,
        images: stateProductDetails.images,
      }, // Thêm 'images'
      {
        onSettled: () => {
          queryProduct.refetch();
        },
      }
    );
  };

  const handleChangeSelect = (value) => {
    setStateProduct({
      ...stateProduct,
      type: value,
    });
  };

  return (
    <div>
      <WrapperHeader>Quản lý sản phẩm</WrapperHeader>
      <div style={{ marginTop: "10px" }}>
        <Button onClick={() => setIsModalOpen(true)}>
          <PlusOutlined />
        </Button>
      </div>
      <div style={{ marginTop: "20px" }}>
        <TableComponent
          handleDelteMany={handleDelteManyProducts}
          columns={columns}
          isPending={isPendingProducts}
          data={dataTable}
          onRow={(record, rowIndex) => {
            return {
              onClick: (event) => {
                setRowSelected(record._id);
              },
            };
          }}
        />
      </div>
      <ModalComponent
        forceRender
        title="Tạo sản phẩm"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <Loading isPending={isPending}>
          <Form
            name="basic"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            onFinish={onFinish}
            autoComplete="on"
            form={form}
          >
            <Form.Item
              label="Tên Sản Phẩm"
              name="name"
              rules={[{ required: true, message: "Hãy nhập tên sản phẩm" }]}
            >
              <InputComponent
                value={stateProduct["name"]}
                onChange={handleOnchange}
                name="name"
              />
            </Form.Item>

            <Form.Item
              label="Loại"
              name="type"
              rules={[{ required: true, message: "Hãy nhập loại sản phẩm" }]}
            >
              <Select
                name="type"
                // defaultValue="lucy"
                // style={{ width: 120 }}
                value={stateProduct.type}
                onChange={handleChangeSelect}
                options={renderOptions(typeProduct?.data?.data)}
              />
            </Form.Item>
            <Form.Item
              label="Giới Tính"
              name="gender"
              rules={[
                { required: true, message: "Hãy chọn giới tính sản phẩm" },
              ]}
            >
              <Select
                value={stateProduct.gender} // Liên kết với stateProduct
                onChange={(value) => {
                  setStateProduct((prev) => ({
                    ...prev,
                    gender: value, // Cập nhật giá trị gender trong state
                  }));
                }}
                options={[
                  { value: "Male", label: "Nam" },
                  { value: "Female", label: "Nữ" },
                  { value: "Unisex", label: "Unisex" },
                ]}
              />
            </Form.Item>

            {stateProduct.type === "add_type" && (
              <Form.Item
                label="New type"
                name="newType"
                rules={[{ required: true, message: "Hãy nhập loại sản phẩm" }]}
              >
                <InputComponent
                  value={stateProduct.newType}
                  onChange={handleOnchange}
                  name="newType"
                />
              </Form.Item>
            )}
            <Form.Item
              label="Số Lượng"
              name="countInStock"
              rules={[
                { required: true, message: "Hãy nhập số lượng sản phẩm" },
              ]}
            >
              <InputComponent
                value={stateProduct.countInStock}
                onChange={handleOnchange}
                name="countInStock"
              />
            </Form.Item>
            <Form.Item
              label="Giá"
              name="price"
              rules={[{ required: true, message: "Hãy nhập giá sản phẩm" }]}
            >
              <InputComponent
                value={stateProduct.price}
                onChange={handleOnchange}
                name="price"
              />
            </Form.Item>
            <Form.Item
              label="Mô Tả"
              name="description"
              rules={[{ required: true, message: "Hãy nhập mô tả sản phẩm" }]}
            >
              <InputComponent
                value={stateProduct.description}
                onChange={handleOnchange}
                name="description"
              />
            </Form.Item>
            <Form.Item
              label="Thông tin sản phẩm"
              name="information"
              rules={[
                { required: true, message: "Hãy nhập thông tin sản phẩm" },
              ]}
            >
              <InputComponent
                value={stateProduct.information}
                onChange={handleOnchange}
                name="information"
              />
            </Form.Item>
            <Form.Item
              label="Đánh Giá"
              name="rating"
              rules={[
                { required: true, message: "Hãy nhập đánh giá sản phẩm" },
              ]}
            >
              <InputComponent
                value={stateProduct.rating}
                onChange={handleOnchange}
                name="rating"
              />
            </Form.Item>

            <Form.Item
              label="Giảm Giá"
              name="discount"
              rules={[
                { required: true, message: "Hãy nhập giảm giá của sản phẩm" },
              ]}
            >
              <InputComponent
                value={stateProduct.discount}
                onChange={handleOnchange}
                name="discount"
              />
            </Form.Item>
            <Form.Item
              label="Hình Ảnh"
              name="images"
              rules={[
                { required: true, message: "Hãy chọn hình ảnh sản phẩm!" },
              ]}
            >
              <WrapperUploadFile onChange={handleOnchangeAvatar} maxCount={2}>
                <Button>Select File</Button>
                {stateProduct.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    style={{
                      height: "60px",
                      width: "60px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      marginLeft: "10px",
                    }}
                    alt={`avatar ${index + 1}`}
                  />
                ))}
              </WrapperUploadFile>
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Loading>
      </ModalComponent>
      <DrawerComponent
        title="Chi tiết sản phẩm"
        isOpen={isOpenDrawer}
        onClose={() => setIsOpenDrawer(false)}
        width="90%"
      >
        <Loading isPending={isPendingUpdate || isPendingUpdated}>
          <Form
            name="basic"
            labelCol={{ span: 2 }}
            wrapperCol={{ span: 22 }}
            onFinish={onUpdateProduct}
            autoComplete="on"
            form={form}
          >
            <Form.Item
              label="Tên Sản Phẩm"
              name="name"
              rules={[{ required: true, message: "Hãy nhập tên sản phẩm!" }]}
            >
              <InputComponent
                value={stateProductDetails["name"]}
                onChange={handleOnchangeDetails}
                name="name"
              />
            </Form.Item>

            <Form.Item
              label="Loại"
              name="type"
              rules={[{ required: true, message: "Hãy nhập loại sản phẩm!" }]}
            >
              <InputComponent
                value={stateProductDetails["type"]}
                onChange={handleOnchangeDetails}
                name="type"
              />
            </Form.Item>
            <Form.Item
              label="Số Lượng"
              name="countInStock"
              rules={[
                { required: true, message: "Hãy nhập số lượng sản phẩm!" },
              ]}
            >
              <InputComponent
                value={stateProductDetails.countInStock}
                onChange={handleOnchangeDetails}
                name="countInStock"
              />
            </Form.Item>
            <Form.Item
              label="Giá"
              name="price"
              rules={[{ required: true, message: "Hãy nhập giá sản phẩm!" }]}
            >
              <InputComponent
                value={stateProductDetails.price}
                onChange={handleOnchangeDetails}
                name="price"
              />
            </Form.Item>
            <Form.Item
              label="Mô Tả"
              name="description"
              rules={[{ required: true, message: "Hãy nhập mô tả sản phẩm!" }]}
            >
              <InputComponent
                value={stateProductDetails.description}
                onChange={handleOnchangeDetails}
                name="description"
              />
            </Form.Item>
            <Form.Item
              label="Thông tin sản phẩm"
              name="information"
              rules={[
                { required: true, message: "Hãy nhập thông tin sản phẩm" },
              ]}
            >
              <InputComponent
                value={stateProductDetails.information}
                onChange={handleOnchangeDetails}
                name="information"
              />
            </Form.Item>
            <Form.Item
              label="Đánh Giá"
              name="rating"
              rules={[
                { required: true, message: "Hãy nhập đánh giá sản phẩm!" },
              ]}
            >
              <InputComponent
                value={stateProductDetails.rating}
                onChange={handleOnchangeDetails}
                name="rating"
              />
            </Form.Item>
            <Form.Item
              label="Giảm Giá"
              name="discount"
              rules={[
                { required: true, message: "Hãy nhập giảm giá của sản phẩm" },
              ]}
            >
              <InputComponent
                value={stateProduct.discount}
                onChange={handleOnchangeDetails}
                name="discount"
              />
            </Form.Item>
            <Form.Item
              label="Hình Ảnh"
              name="images"
              rules={[
                { required: true, message: "Hãy chọn hình ảnh sản phẩm!" },
              ]}
            >
              <WrapperUploadFile
                onChange={handleOnchangeAvatarDetails}
                maxCount={2}
              >
                <Button>Select File</Button>
                {stateProduct.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    style={{
                      height: "60px",
                      width: "60px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      marginLeft: "10px",
                    }}
                    alt={`avatar ${index + 1}`}
                  />
                ))}
              </WrapperUploadFile>
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
              <Button type="primary" htmlType="submit">
                Apply
              </Button>
            </Form.Item>
          </Form>
        </Loading>
      </DrawerComponent>
      <ModalComponent
        title="Xóa sản phẩm"
        open={isModalOpenDelete}
        onCancel={handleCancelDelete}
        onOk={handleDeleteProduct}
      >
        <Loading isPending={isPendingDeleted}>
          <div>Bạn có chắc xóa sản phẩm này không?</div>
        </Loading>
      </ModalComponent>
    </div>
  );
};

export default AdminProduct;

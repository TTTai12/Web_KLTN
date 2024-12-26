import { Button, Space, Card, Statistic, Tabs } from "antd";
import React, { useState, useEffect } from "react";
import { WrapperHeader } from "./style";
import TableComponent from "../TableComponent/TableComponent";
import InputComponent from "../InputComponent/InputComponent";
import Loading from "../LoadingComponent/Loading";
import * as OrderService from "../../services/OrderService";
import { useQuery } from "@tanstack/react-query";
import { SearchOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { orderContant } from "../../contant";
import LineChartComponent from "./LineChartComponent";
import BarChartRevenue from "./BarChartRevenue";
import BarChartRevenue1 from "./BarChartRevenue1";
import {
  convertPrice,
  convertRevenueDataByWeek,
  convertRevenueDataByMonth,
} from "./1utils";
import { convertDataByDate, filterDataByDateRange } from "../../utils";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Line } from "react-chartjs-2";
import AdminMain from "../AdminMain/AdminMain";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Đăng ký các thành phần
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const { TabPane } = Tabs;

const OrderAdmin = () => {
  const user = useSelector((state) => state?.user);
  const getAllOrder = async () => {
    const res = await OrderService.getAllOrder(user?.access_token);
    return res;
  };
  const queryOrder = useQuery({ queryKey: ["orders"], queryFn: getAllOrder });
  const { isLoading: isLoadingOrders, data: allOrders } = queryOrder;

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
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
            onClick={confirm}
          >
            Search
          </Button>
          <Button
            size="small"
            style={{
              width: 90,
            }}
            onClick={clearFilters}
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
  });

  const columns = [
    {
      title: "User name",
      dataIndex: "userName",
      sorter: (a, b) => a.userName.length - b.userName.length,
      ...getColumnSearchProps("userName"),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      sorter: (a, b) => a.phone.length - b.phone.length,
      ...getColumnSearchProps("phone"),
    },
    {
      title: "Address",
      dataIndex: "address",
      sorter: (a, b) => a.address.length - b.address.length,
      ...getColumnSearchProps("address"),
    },
    {
      title: "Paided",
      dataIndex: "isPaid",
      sorter: (a, b) => a.isPaid.length - b.isPaid.length,
      ...getColumnSearchProps("isPaid"),
    },
    {
      title: "Shipped",
      dataIndex: "isDelivered",
      sorter: (a, b) => a.isDelivered.length - b.isDelivered.length,
      ...getColumnSearchProps("isDelivered"),
    },
    {
      title: "Payment method",
      dataIndex: "paymentMethod",
      sorter: (a, b) => a.paymentMethod.length - b.paymentMethod.length,
      ...getColumnSearchProps("paymentMethod"),
    },
    {
      title: "Total price",
      dataIndex: "totalPrice",
      sorter: (a, b) => a.totalPrice.length - b.totalPrice.length,
      ...getColumnSearchProps("totalPrice"),
    },
  ];

  const dataTable =
    allOrders?.data?.length &&
    allOrders?.data?.map((order) => {
      return {
        ...order,
        key: order._id,
        userName: order?.shippingAddress?.fullName,
        phone: order?.shippingAddress?.phone,
        address: order?.shippingAddress?.address,
        paymentMethod: orderContant.payment[order?.paymentMethod],
        isPaid: order?.isPaid ? "TRUE" : "FALSE",
        isDelivered: order?.isDelivered ? "TRUE" : "FALSE",
        totalPrice: convertPrice(order?.totalPrice),
      };
    });

  const totalRevenue = allOrders?.data?.reduce(
    (total, order) => total + order.totalPrice,
    0
  );
  const revenueDataByWeek = convertRevenueDataByWeek(allOrders?.data);
  const revenueDataByMonth = convertRevenueDataByMonth(allOrders?.data);

  const [startDate, setStartDate] = useState(new Date("2024-12-20"));
  const [endDate, setEndDate] = useState(new Date("2024-12-26"));
  const [filteredData, setFilteredData] = useState([]);

  const handleFilter = () => {
    const formattedStartDate = startDate.toISOString().split("T")[0];
    const formattedEndDate = endDate.toISOString().split("T")[0];
    const filtered = filterDataByDateRange(
      allOrders?.data || [],
      formattedStartDate,
      formattedEndDate
    );
    setFilteredData(filtered);
  };

  const data = {
    labels: filteredData.map((data) => data.date),
    datasets: [
      {
        label: "Tổng doanh thu",
        data: filteredData.map((data) => data.totalRevenue),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        fill: false,
        yAxisID: "y-revenue",
        tension: 0.1,
      },
      {
        label: "Tổng đơn hàng",
        data: filteredData.map((data) => data.totalOrders),
        backgroundColor: "rgba(153, 102, 255, 0.6)",
        borderColor: "rgba(153, 102, 255, 1)",
        fill: false,
        yAxisID: "y-orders",
        tension: 0.1,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        type: "linear",
        display: true,
        position: "left",
        id: "y-orders",
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        id: "y-revenue",
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  return (
    <div>
      <WrapperHeader>Quản lý đơn hàng</WrapperHeader>
      <div className="chart" style={{ display: "flex" }}>
        <Card style={{ width: 300 }}>
          <Statistic
            title="Tổng doanh thu"
            value={totalRevenue}
            precision={2}
            valueStyle={{ color: "#3f8600" }}
            suffix="VND"
          />
        </Card>
      </div>

      <div style={{ marginTop: 50 }}>
        <Tabs defaultActiveKey="1">
          <TabPane tab="Doanh thu theo tháng" key="1">
            <div style={{ height: 400, width: "100%", marginTop: 50 }}>
              <BarChartRevenue data={revenueDataByMonth} />
            </div>
          </TabPane>
          <TabPane tab="Doanh thu theo tuần" key="2">
            <div style={{ height: 400, width: "100%", marginTop: 50 }}>
              <BarChartRevenue1 data={revenueDataByWeek} />
            </div>
          </TabPane>
          <TabPane tab="Doanh thu số đơn hàng theo ngày" key="3">
            {/* <div style={{ height: 400, width: "100%", marginTop: 50 }}>
            <LineChartComponent data={allOrders?.data} />
          </div> */}
            <div>
              <h2>Chọn khoảng thời gian</h2>
              <div>
                <label>Ngày bắt đầu:</label>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  dateFormat="yyyy-MM-dd"
                />
              </div>
              <div>
                <label>Ngày kết thúc:</label>
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  dateFormat="yyyy-MM-dd"
                />
              </div>
              <button onClick={handleFilter}>Lọc dữ liệu</button>

              {/* Hiển thị dữ liệu đã lọc dưới dạng biểu đồ */}
              <div>
                <h2>Kết quả lọc</h2>
                <Line data={data} />
              </div>
            </div>
          </TabPane>
        </Tabs>
      </div>
      <div style={{ marginTop: "50px" }}>
        <TableComponent
          columns={columns}
          isLoading={isLoadingOrders}
          data={dataTable}
        />
      </div>
      <div>
        {" "}
        {isLoadingOrders ? (
          <Loading />
        ) : (
          <AdminMain orders={allOrders?.data || []} />
        )}{" "}
      </div>
    </div>
  );
};

export default OrderAdmin;

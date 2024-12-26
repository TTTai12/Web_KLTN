// utils.js
export const convertPrice = (price) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

export const convertRevenueDataByWeek = (orders) => {
  const revenueData = Array.from({ length: 1 * 4 }, (_, index) => {
    const week = index + 1;
    return { week: `Week ${week}`, revenue: 0 };
  });

  orders?.forEach((order) => {
    const date = new Date(order.createdAt); // Lấy ngày tạo đơn hàng
    const week = Math.ceil(date.getDate() / 7); // Xác định tuần trong tháng (1-4)
    if (revenueData[week - 1]) {
      revenueData[week - 1].revenue += order.totalPrice;
    }
  });

  return revenueData;
};

export const convertRevenueDataByMonth = (orders) => {
  const revenueData = [];
  const months = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
  ];

  months.forEach((month, index) => {
    revenueData.push({ month, revenue: 0 });
  });

  orders?.forEach((order) => {
    const date = new Date(order.createdAt);
    const monthIndex = date.getMonth();
    revenueData[monthIndex].revenue += order.totalPrice;
  });

  return revenueData;
};





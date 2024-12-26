import { orderContant } from "./contant";

export const isJsonString = (data) => {
  try {
    JSON.parse(data);
  } catch (error) {
    return false;
  }
  return true;
};

export const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}

export const renderOptions = (arr) => {
  let results = [];
  if (arr) {
    results = arr?.map((opt) => {
      return {
        value: opt,
        label: opt,
      };
    });
  }
  results.push({
    label: "Thêm type",
    value: "add_type",
  });
  return results;
};

export const convertPrice = (price) => {
  try {
    const result = price?.toLocaleString().replaceAll(",", ".");
    return `${result} VND`;
  } catch (error) {
    return null;
  }
};

// export const initFacebookSDK = () => {
//     if (window.FB) {
//       window.FB.XFBML.parse();
//     }
//     let locale = "vi_VN";
//     window.fbAsyncInit = function () {
//       window.FB.init({
//         appId: process.env.REACT_APP_FB_ID,// You App ID
//         cookie: true, // enable cookies to allow the server to access
//         // the session
//         xfbml: true, // parse social plugins on this page
//         version: "v2.1" // use version 2.1
//       });
//     };
//     // Load the SDK asynchronously
//     (function (d, s, id) {
//       var js,
//         fjs = d.getElementsByTagName(s)[0];
//       if (d.getElementById(id)) return;
//       js = d.createElement(s);
//       js.id = id;
//       js.src = `//connect.facebook.net/${locale}/sdk.js`;
//       fjs.parentNode.insertBefore(js, fjs);
//     })(document, "script", "facebook-jssdk");
//   };

export const convertDataChart = (data, type) => {
  try {
    const object = {};
    Array.isArray(data) &&
      data.forEach((opt) => {
        if (!object[opt[type]]) {
          object[opt[type]] = 1;
        } else {
          object[opt[type]] += 1;
          console.log(
            "c;getBase64",
            object[opt[type]],
            typeof object[opt[type]]
          );
        }
      });
    const results =
      Array.isArray(Object.keys(object)) &&
      Object.keys(object).map((item) => {
        return {
          name: orderContant.payment[item],
          value: object[item],
        };
      });
    return results;
  } catch (e) {
    return [];
  }
};
// utils.js

export const convertRevenueDataChart = (orders) => {
  const totalRevenue = orders?.reduce(
    (total, order) => total + order.totalPrice,
    0
  );
  return [
    { name: "Total Revenue", value: totalRevenue },
    { name: "Others", value: 0 }, // Để biểu đồ không bị rỗng
  ];
};
export const convertDataByDate = (orders) => {
  if (!orders) return [];

  const result = {};

  orders.forEach((order) => {
    const date = new Date(order.createdAt).toLocaleDateString();
    if (result[date]) {
      result[date].totalOrders += 1;
      result[date].totalRevenue += order.totalPrice;
    } else {
      result[date] = {
        totalOrders: 1,
        totalRevenue: order.totalPrice,
      };
    }
  });

  return Object.keys(result).map((date) => ({
    date,
    totalOrders: result[date].totalOrders,
    totalRevenue: result[date].totalRevenue,
  }));
};

export const filterDataByDateRange = (orders, startDate, endDate) => {
  if (!Array.isArray(orders)) return [];

  const result = {};

  const start = new Date(startDate);
  const end = new Date(endDate);

  orders.forEach((order) => {
    const date = new Date(order.createdAt);
    if (date >= start && date <= end) {
      const formattedDate = date.toLocaleDateString();
      if (result[formattedDate]) {
        result[formattedDate].totalOrders += 1;
        result[formattedDate].totalRevenue += order.totalPrice;
      } else {
        result[formattedDate] = {
          totalOrders: 1,
          totalRevenue: order.totalPrice,
        };
      }
    }
  });

  return Object.keys(result).map((date) => ({
    date,
    totalOrders: result[date].totalOrders,
    totalRevenue: result[date].totalRevenue,
  }));
};
// utils.js
export const filterDataByDate1 = (orders, date) => {
  if (!Array.isArray(orders)) return { totalOrders: 0, totalRevenue: 0 };

  const result = {
    totalOrders: 0,
    totalRevenue: 0,
  };
  const targetDate = new Date(date).toLocaleDateString();

  orders.forEach((order) => {
    const orderDate = new Date(order.createdAt).toLocaleDateString();
    if (orderDate === targetDate) {
      result.totalOrders += 1;
      result.totalRevenue += order.totalPrice;
    }
  });

  return result;
};

const Order = require("../models/OrderProduct");
const Product = require("../models/ProductModel");
// const EmailService = require("../services/EmailService")

const createOrder = (newOrder) => {
    return new Promise(async (resolve, reject) => {
      const {
        orderItems,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        totalPrice,
        fullName,
        address,
        city,
        phone,
        user,
        isPaid,
        paidAt,
        email,
      } = newOrder;
      try {
        const promises = orderItems.map(async (order) => {
          if (!order.size || !order.color) {
            throw new Error('Size và Color là bắt buộc cho mỗi sản phẩm.');
          }
  
          const productData = await Product.findOneAndUpdate(
            {
              _id: order.product,
              countInStock: { $gte: order.amount },
            },
            {
              $inc: {
                countInStock: -order.amount,
                selled: +order.amount,
              },
            },
            { new: true }
          );
          if (productData) {
            return {
              status: "OK",
              message: "SUCCESS",
            };
          } else {
            return {
              status: "ERR",
              message: "Sản phẩm không đủ hàng",
              id: order.product,
            };
          }
        });
  
        const results = await Promise.all(promises);
        const newData = results.filter((item) => item.id);
        if (newData.length) {
          const arrId = newData.map((item) => item.id);
          resolve({
            status: "ERR",
            message: `Sản phẩm với ID: ${arrId.join(", ")} không đủ hàng`,
          });
        } else {
          const createdOrder = await Order.create({
            orderItems,
            shippingAddress: {
              fullName,
              address,
              city,
              phone,
            },
            paymentMethod,
            itemsPrice,
            shippingPrice,
            totalPrice,
            user,
            isPaid,
            paidAt,
          });
          if (createdOrder) {
            resolve({
              status: "OK",
              message: "success",
              data: createdOrder,
            });
          }
        }
      } catch (e) {
        reject({
          status: "ERR",
          message: "An error occurred while creating the order",
          error: e.message,
        });
      }
    });
  };
  

const deleteManyProduct = (ids) => {
  return new Promise(async (resolve, reject) => {
    try {
      await Product.deleteMany({ _id: ids });
      resolve({
        status: "OK",
        message: "Delete product success",
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getAllOrderDetails = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const order = await Order.find({
        user: id,
      }).sort({ createdAt: -1, updatedAt: -1 });
      if (order === null) {
        resolve({
          status: "ERR",
          message: "The order is not defined",
        });
      }

      resolve({
        status: "OK",
        message: "SUCESSS",
        data: order,
      });
    } catch (e) {
      // console.log('e', e)
      reject(e);
    }
  });
};

const getOrderDetails = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const order = await Order.findById(id)
        .populate("user", "name email")
        .populate({
          path: "orderItems.product",
          model: "Product",
          select: "name price images size color",
        });

      if (!order) {
        resolve({
          status: "ERR",
          message: "Không tìm thấy đơn hàng",
        });
      } else {
        resolve({
          status: "OK",
          message: "THÀNH CÔNG",
          data: order,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const cancelOrderDetails = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let order = [];
      const promises = data.map(async (order) => {
        const productData = await Product.findOneAndUpdate(
          {
            _id: order.product,
            selled: { $gte: order.amount },
          },
          {
            $inc: {
              countInStock: +order.amount,
              selled: -order.amount,
            },
          },
          { new: true }
        );
        if (productData) {
          order = await Order.findByIdAndDelete(id);
          if (order === null) {
            resolve({
              status: "ERR",
              message: "The order is not defined",
            });
          }
        } else {
          return {
            status: "OK",
            message: "ERR",
            id: order.product,
          };
        }
      });
      const results = await Promise.all(promises);
      const newData = results && results[0] && results[0].id;

      if (newData) {
        resolve({
          status: "ERR",
          message: `San pham voi id: ${newData} khong ton tai`,
        });
      }
      resolve({
        status: "OK",
        message: "success",
        data: order,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getAllOrder = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const allOrder = await Order.find().sort({
        createdAt: -1,
        updatedAt: -1,
      });
      resolve({
        status: "OK",
        message: "Success",
        data: allOrder,
      });
    } catch (e) {
      reject(e);
    }
  });
};
const getRevenue = async () => {
  try {
    const revenueData = await Order.aggregate([
      {
        $group: {
          _id: null, // Gộp tất cả đơn hàng
          totalRevenue: { $sum: "$totalPrice" }, // Tổng tiền từ các đơn
        },
      },
    ]);

    // Nếu không có dữ liệu trả về 0
    return revenueData[0]?.totalRevenue || 0;
  } catch (error) {
    throw new Error("Lỗi khi tính doanh thu: " + error.message);
  }
};
module.exports = {
  createOrder,
  getAllOrderDetails,
  getOrderDetails,
  cancelOrderDetails,
  getAllOrder,
  getRevenue,
};

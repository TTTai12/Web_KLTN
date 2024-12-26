const OrderService = require("../services/OrderService");

const createOrder = async (req, res) => {
  try {
    const {
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
      fullName,
      address,
      city,
      phone,
    } = req.body;
    if (
      !paymentMethod ||
      !itemsPrice ||
      !shippingPrice ||
      !totalPrice ||
      !fullName ||
      !address ||
      !city ||
      !phone
    ) {
      return res.status(400).json({
        status: "ERR",
        message: "All input fields are required",
      });
    }

    const response = await OrderService.createOrder(req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      status: "ERR",
      message: "An error occurred while creating the order",
      error: e.message,
    });
  }
};

const getAllOrderDetails = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(200).json({
        status: "ERR",
        message: "The userId is required",
      });
    }
    const response = await OrderService.getAllOrderDetails(userId);
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    return res.status(404).json({
      message: e,
    });
  }
};

const getDetailsOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    if (!orderId) {
      return res.status(200).json({
        status: "ERR",
        message: "The userId is required",
      });
    }
    const response = await OrderService.getOrderDetails(orderId);
    return res.status(200).json(response);
  } catch (e) {
    // console.log(e)
    return res.status(404).json({
      message: e,
    });
  }
};

const cancelOrderDetails = async (req, res) => {
  try {
    const data = req.body.orderItems;
    const orderId = req.body.orderId;
    if (!orderId) {
      return res.status(200).json({
        status: "ERR",
        message: "The orderId is required",
      });
    }
    const response = await OrderService.cancelOrderDetails(orderId, data);
    return res.status(200).json(response);
  } catch (e) {
    // console.log(e)
    return res.status(404).json({
      message: e,
    });
  }
};

const getAllOrder = async (req, res) => {
  try {
    const data = await OrderService.getAllOrder();
    return res.status(200).json(data);
  } catch (e) {
    // console.log(e)
    return res.status(404).json({
      message: e,
    });
  }
};
const createReview = async (req, res) => {
  try {
    const { productId } = req.params; // ID của sản phẩm từ URL
    const { user, name, email, rating, comment } = req.body; // Dữ liệu review từ body

    // Kiểm tra các trường bắt buộc
    if (!user || !name || !email || !rating || !comment) {
      return res.status(400).json({
        status: "ERR",
        message:
          "All fields are required: user, name, email, rating, and comment",
      });
    }

    // Kiểm tra rating hợp lệ
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        status: "ERR",
        message: "Rating must be between 1 and 5",
      });
    }

    // Tạo review cho sản phẩm
    const response = await ProductService.createReview(productId, {
      user,
      name,
      email,
      rating,
      comment,
    });

    return res.status(201).json({
      status: "OK",
      message: "Review added successfully",
      review: response,
    });
  } catch (e) {
    return res.status(500).json({
      status: "ERR",
      message: e.message || "An error occurred while adding the review",
    });
  }
};

const getRevenue = async (req, res) => {
  try {
    const totalRevenue = await orderService.getRevenue();
    res.status(200).json({
      success: true,
      data: { revenue: totalRevenue },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Không thể lấy doanh thu",
      error: error.message,
    });
  }
};



const getRevenueForOneDay = async (req, res) => {
  try {
    const { date } = req.query; // Mong đợi tham số query là date
    const startOfDay = new Date(date).setHours(0, 0, 0, 0);
    const endOfDay = new Date(date).setHours(23, 59, 59, 999);

    const totalRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfDay, $lt: endOfDay },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$amount' }, // Giả sử 'amount' là trường doanh thu
        },
      },
    ]);

    res.status(200).json({ totalRevenue: totalRevenue[0].totalRevenue });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy doanh thu', error });
  }
};

// controllers/OrderController.js
const getOrdersForOneDay = async (req, res) => {
  try {
    const { date } = req.query;
    const startOfDay = new Date(date).setHours(0, 0, 0, 0);
    const endOfDay = new Date(date).setHours(23, 59, 59, 999);

    const totalOrders = await Order.countDocuments({
      createdAt: { $gte: startOfDay, $lt: endOfDay },
    });

    res.status(200).json({ totalOrders });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy đơn hàng', error });
  }
};


module.exports = {
  createOrder,
  getAllOrderDetails,
  getDetailsOrder,
  cancelOrderDetails,
  getAllOrder,
  createReview,
  getRevenue,
  getRevenueForOneDay,
  getOrdersForOneDay
};

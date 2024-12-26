const express = require("express");
const router = express.Router()
const OrderController = require('../controllers/OrderController');
const { authUserMiddleWare } = require("../middleware/authMiddleware");

router.post('/create/:userId', OrderController.createOrder)
router.get('/get-all-order/:id',authUserMiddleWare, OrderController.getAllOrderDetails)
router.get('/get-details-order/:id', OrderController.getDetailsOrder)
router.delete('/cancel-order/:id',authUserMiddleWare, OrderController.cancelOrderDetails)
router.get('/get-all-order',authUserMiddleWare, OrderController.getAllOrder)
// Định nghĩa route để lấy doanh thu
router.get('/get-revenue', OrderController.getRevenue)
// routes/order.js
router.get('/revenue-for-day', authUserMiddleWare, OrderController.getRevenueForOneDay);
// routes/order.js
router.get('/orders-for-day', authUserMiddleWare, OrderController.getOrdersForOneDay);

module.exports = router
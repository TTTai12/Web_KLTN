// routes/reviewRoutes.js

const express = require("express");
const reviewController = require("../controllers/ReviewController");
const router = express.Router();
router.post("/", reviewController.addReview);
router.get("/:productId", reviewController.getReviews);
router.get("/", reviewController.getAllReviews);
router.delete("/:reviewId", reviewController.deleteReview);
module.exports = router;

const Review = require("../models/ReviewProduct");

const addReview = async (reviewData) => {
  const review = new Review(reviewData);
  await review.save();
  return review;
};

const getReviews = async (productId) => {
  return Review.find({ productId });
};

const getAllReviews = async () => {
  return Review.find();
};

const deleteReview = async (reviewId) => {
  return Review.findByIdAndDelete(reviewId);
};

module.exports = {
  addReview,
  getReviews,
  getAllReviews,
  deleteReview,
};

import axios from "axios";

export const getProductReviews = async (productId) => {
  const res = await axios.get(
    `${process.env.REACT_APP_API_URL}/reviews/${productId}`
  );
  return res.data;
};

export const addProductReview = async (reviewData) => {
  const res = await axios.post(
    `${process.env.REACT_APP_API_URL}/reviews`,
    reviewData
  );
  return res.data;
};

export const approveProductReview = async (reviewId) => {
  const res = await axios.put(
    `${process.env.REACT_APP_API_URL}/approve/reviews/${reviewId}`
  );
  return res.data;
};

export const deleteProductReview = async (reviewId) => {
  const res = await axios.delete(
    `${process.env.REACT_APP_API_URL}/reviews/${reviewId}` // Đảm bảo URL đúng
  );
  return res.data;
};

export const getAllReviews = async () => {
  const res = await axios.get(`${process.env.REACT_APP_API_URL}/reviews`);
  return res.data;
};

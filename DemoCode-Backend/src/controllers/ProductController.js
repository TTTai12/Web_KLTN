const ProductService = require("../services/ProductService");
const Product = require("../models/ProductModel"); // Import model Product

const createProduct = async (req, res) => {
  try {
    const {
      name,
      images,
      type,
      countInStock,
      price,
      rating,
      description,
      gender,
    } = req.body;
    if (
      !name ||
      !images ||
      !type ||
      !countInStock ||
      !price ||
      !rating ||
      !gender
    ) {
      return res.status(200).json({
        status: "ERR",
        message: "The input is required",
      });
    }

    const response = await ProductService.createProduct(req.body);

    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const data = req.body;

    // Kiểm tra productId và gender
    if (!productId) {
      return res.status(200).json({
        status: "ERR",
        message: "The productId is required",
      });
    }
    if (!data.gender) {
      return res.status(200).json({
        status: "ERR",
        message: "Gender is required",
      });
    }

    const response = await ProductService.updateProduct(productId, data);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getDetailsProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    if (!productId) {
      return res.status(200).json({
        status: "ERR",
        message: "The productId is required",
      });
    }

    const response = await ProductService.getDetailsProduct(productId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    if (!productId) {
      return res.status(200).json({
        status: "ERR",
        message: "the productId is required",
      });
    }
    const response = await ProductService.deleteProduct(productId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const deleteMany = async (req, res) => {
  try {
    const ids = req.body.ids;
    if (!ids) {
      return res.status(200).json({
        status: "ERR",
        message: "the ids is required",
      });
    }
    const response = await ProductService.deleteManyProduct(ids);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getAllProduct = async (req, res) => {
  try {
    const { limit, page, sort, filter } = req.query;
    const isPagination = limit !== undefined;

    let response;
    if (isPagination) {
      response = await ProductService.getAllProduct(
        Number(limit),
        Number(page),
        sort,
        filter
      );
    } else {
      response = await ProductService.getAllProduct(null, null, sort, filter);
    }
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e.message || "An error occurred while fetching products",
    });
  }
};

const getAllType = async (req, res) => {
  try {
    const response = await ProductService.getAllType();
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
const createReview = async (req, res) => {
  try {
    const productId = req.params.id;
    const { email, rating, comment } = req.body;

    if (!productId || !email || !rating || !comment) {
      return res.status(400).json({
        status: "ERR",
        message: "Thiếu thông tin cần thiết",
      });
    }

    const response = await ProductService.createReview(productId, {
      email,
      rating,
      comment,
    });

    // Serialize toàn bộ reviews khi trả về
    response.reviews = response.reviews.map((review) => ({
      ...review.toObject(),
      _id: review._id.toString(),
    }));

    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      message: e.message || "An error occurred while creating the review",
    });
  }
};




module.exports = {
  createProduct,
  updateProduct,
  getDetailsProduct,
  deleteProduct,
  getAllProduct,
  deleteMany,
  getAllType,

};

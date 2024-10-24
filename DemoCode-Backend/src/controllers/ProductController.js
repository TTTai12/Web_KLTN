const ProductService = require('../services/ProductService');



const createProduct = async (req, res) => {
    try {
        const { name, images, type, countInStock, price, rating, description } = req.body
        if (!name || !images || !type || !countInStock || !price || !rating ) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is required'
            })
        }

        const response = await ProductService.createProduct(req.body)

        return res.status(200).json(response)

    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}


const updateProduct = async (req, res) => {
    try {
        const productId = req.params.id
        const data = req.body
        if (!productId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The productId is required'
            })
        }
        const response = await ProductService.updateProduct(productId, data)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getDetailsProduct = async (req, res) => {
    try {
        const productId = req.params.id
        if (!productId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The productId is required'
            })
        }
        const response = await ProductService.getDetailsProduct(productId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id
        if(!productId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'the productId is required'
            })
        }
        const response = await ProductService.deleteProduct(productId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const deleteMany = async (req, res) => {
    try {
        const ids = req.body.ids
        if(!ids) {
            return res.status(200).json({
                status: 'ERR',
                message: 'the ids is required'
            })
        }
        const response = await ProductService.deleteManyProduct(ids)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getAllProduct = async (req, res) => {
    try {
        const { limit, page, sort, filter } = req.query;
        // Kiểm tra nếu không có limit và page thì sẽ lấy tất cả sản phẩm
        const isPagination = limit !== undefined;

        let response;
        if (isPagination) {
            // Nếu có limit và page thì lấy sản phẩm theo phân trang
            response = await ProductService.getAllProduct(Number(limit) , Number(page) , sort, filter);
        } else {
            // Nếu không có limit và page thì lấy tất cả sản phẩm
            response = await ProductService.getAllProduct(null, null, sort, filter);
        }
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: e.message || 'An error occurred while fetching products'
        });
    }
};
const getAllType = async (req, res) => {
    try {
        const response = await ProductService.getAllType()
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

module.exports = {
    createProduct,
    updateProduct,
    getDetailsProduct,
    deleteProduct,
    getAllProduct,
    deleteMany,
    getAllType
}

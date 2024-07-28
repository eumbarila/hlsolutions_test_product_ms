const productServices = require("../services/products.services");

/**
 * Controller class for handling product-related operations.
 */
class ProductsController {

    /**
     * Get all products.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     */
    async getAllProducts(req, res){
        const result = await productServices.getAll();
        res.status(200).json(result);    
	}

    /**
     * Get a product by ID.
     * @param {Object} req - The request object.
     * @param {UUID} req.params.id_product - The product UUID.
     * @param {Object} res - The response object.
     */
    async getById(req, res){
        const result = await productServices.getById(req.params.id_product);
        res.status(200).json(result);
    }

    /**
     * Create a new product.
     * @param {Object} req - The request object.
     * @param {String} req.body.name - The product name.
     * @param {String} req.body.description - The product description.
     * @param {int} req.body.quantity - The product quantity.
     * @param {int} req.body.price - The product price.
     * @param {String} req.body.category - The product category.
     * @param {Object} res - The response object.
     */
    async createProduct(req, res){
        const {name, description, quantity, price, category} = req.body;
        const result = await productServices.createProduct(name, description, quantity, price, category);
        res.status(201).send(`Product created.`);
    }

    /**
     * Update an existing product.
     * @param {Object} req - The request object.
     * @param {String} req.body.name - The product name.
     * @param {String} req.body.description - The product description.
     * @param {int} req.body.quantity - The product quantity.
     * @param {int} req.body.price - The product price.
     * @param {String} req.body.category - The product category.
     * @param {Object} res - The response object.
     */
    async updateProduct(req, res){
        const {name, description, quantity, price, category} = req.body;
        const result = await productServices.updateProduct(req.params.id_product, name, description, quantity, price, category);
        res.status(201).send(`Product updated.`);
    }

    /**
     * Delete a product.
     * @param {Object} req - The request object.
     * @param {UUID} req.params.id_product - The product UUID.
     * @param {Object} res - The response object.
     */
    async deleteProduct(req, res){
        const result = await productServices.deleteProduct(req.params.id_product);
        res.status(204).send();
    }

    /**
     * Handle ID error.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     */
    async idError(req, res){
        res.status(400).send("Id not provided.");
    }
}

module.exports = new ProductsController();
var express = require('express'),
    router = express.Router();

const productControllers = require('../controllers/products.controllers');
const asyncErrorMiddleware = require('../middlewares/asyncError.middleware');

router.route('/').get(asyncErrorMiddleware(productControllers.getAllProducts));
router.route("/:id_product").get(asyncErrorMiddleware(productControllers.getById));
router.route("/").post(asyncErrorMiddleware(productControllers.createProduct));
router.route("/:id_product").put(asyncErrorMiddleware(productControllers.updateProduct));
router.route("/").put(asyncErrorMiddleware(productControllers.idError));
router.route("/:id_product").delete(asyncErrorMiddleware(productControllers.deleteProduct));
router.route("/").delete(asyncErrorMiddleware(productControllers.idError));

module.exports = router;
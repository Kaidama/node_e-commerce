var express = require('express');
var router = express.Router();

let productController = require('./product/controllers/productController')

/* GET home page. */
router.get('/', productController.getAllProducts);
router.get('/:page', productController.getAllProducts);
module.exports = router;

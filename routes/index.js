var express = require('express');
var router = express.Router();

let productController = require('./product/controllers/productController')

/* GET home page. */
router.get('/', productController.getAllProducts);
router.get('/:page', (req, res) => {
    res.send('hello')
})
module.exports = router;

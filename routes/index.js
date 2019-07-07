var express = require('express');
var router = express.Router();

let productController = require('./product/controllers/productController')
let paginate = require('./product/utils/pagination')

/* GET home page. */
router.get('/', productController.getPageIfUserLoggedIn);

router.get('/page/:page', paginate);

module.exports = router;

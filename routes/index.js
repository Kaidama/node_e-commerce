var express = require('express');
var router = express.Router();

let productController = require('./product/controllers/productController')

/* GET home page. */
router.get('/', function(req, res, next) {
    productController.getAllProducts({})
                        .then( products => {
                            res.render('index', {
                                products: products
                            })
                        })
                        .catch( error => {
                            res.status(error.status).json(error)
                        })
});
router.get('/pages', function(req, res, next) {
   res.render('auth/test')
})
module.exports = router;

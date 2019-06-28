const express = require('express')
const router  = express.Router()

let productController = require('./controllers/productController')

let Product = require('./models/Product')

Product.createMapping(function (error, mapping) {
    if (error) {
        console.log('Error creating mapping')
        console.log(mapping)
    } else {
        console.log('Mapping created')
        console.log(mapping)
    }
})

let stream = Product.synchronize()
let count  = 0

stream.on('data', function () {
    count++
})

stream.on('close', function () {
    console.log(`Indexed ${ count } documents`)
})

stream.on('error', function () {
    console.log("30: Error: " + error)
})

router.get('/', function (req, res) {
    res.send('product page')
})

router.get('/:id', function (req, res) {
    productController.getProductByID(req.params.id)
                        .then( product => {
                            res.render('product/product', {
                                product: product
                            })
                        })
                        .catch( error => {
                            res.status(error.status).json(error)
                        })
})

router.get('/getproductsbycategoryid/:id', function (req, res) {
    productController.getProductsByCategoryID(req.params.id)
                        .then(products => {
                            res.render('product/products', {
                                products: products
                            })
                        })
                        .catch( error => {
                            res.status(error.status).json(error)
                        })
})

module.exports = router
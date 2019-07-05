const express = require('express')
const router = express.router()

const cartController = require('../cart/controller/cartController')

const Cart = require('../cart/models/Cart')

router.get('/api/users/cart', (req, res) =>{
    res.send('Hello world')
})
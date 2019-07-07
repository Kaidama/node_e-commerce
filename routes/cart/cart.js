const express = require('express')
const router = express.Router()


router.get('/', (req, res) => {
    res.render('cart/cart')
})

router.get('/')


module.exports = router


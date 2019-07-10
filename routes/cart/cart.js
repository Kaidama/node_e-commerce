const express = require('express')
const router = express.Router()
const cartController = require('./controllers/cartController')
const stripe = require('stripe')('sk_test_AetmvvrepQEQhLJwo12f1v1600cmOBe3xf')
const async = require('async')
const User = require('../users/models/User')

const Cart = require('../cart/models/Cart')
router.get('/', cartController.getUserShoppingCart)



// router.post('/product', (req, res) => {
//     res.json(req.body)
// })
router.post('/product', cartController.addToCart)


router.delete('/remove', cartController.removeProduct)

router.post('/payment', (req, res, next) => {
    let stripeToken = req.body.stripeToken
    let currentCharges = req.body.stripeMoney * 100

    stripe.customers
        .create({
            source: stripeToken

        })
        .then( customer => {
            let results = stripe.charges.create({
                amount: currentCharges,
                currency: 'usd',
                customer: customer.id
            })
            return results
        })
        .then( results => {
            // console.log(`results: `, results)
            async.waterfall([
                (callback) => {
                    Cart.findOne({ 
                        owner: req.user._id
                     }, (error, cart) => {
                        callback(error, cart)
                    })
                    
                },
                (cart, callback) => {
                    User.findOne({
                        _id: req.user._id,

                    }, (error, user) => {
                        if(user){
                            for(let i = 0; i < cart.items.length; i++){
                                user.history.push({
                                    item: cart.items[i].item,
                                    paid: cart.items[i].price
                                })
                            }
                            user.save((error, user) =>{
                                if(error) return next(error)
                                callback(error, user)
                            })
                        }
                    })
                },
                (user) => {
                    Cart.update({
                        owner: req.user._id
                    }, {
                        $set: {
                            items: [],
                            total: 0
                        }
                    }, (error, updated) => {
                        if(updated) res.send('Payment done successfully!')
                    }
                )
                }
            ])
        })
        .catch( error => {
            let errors = {}
            errors.status = 400
            errors.message = error;

            res.json(errors)
            
        })
    // res.json(req.body)
})
module.exports = router


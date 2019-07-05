const Cart = require('../models/Cart')

module.exports = {
    createUserCart: (req, res) =>{
        let cart = new Cart()

        cart.owner = req.user._id
        cart.save( error => {
            if(error){
                res.status(400).json({
                    confimation: 'failure',
                    message: error
                })
            } else {
                res.redirect('/')
            }
        })
    } 
}


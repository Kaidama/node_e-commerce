const mongoose = require('mongoose')
const Schema = mongoose.Schema

let CartSchema = new Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        total: { type: Number, default: 0},
        items: { type: mongoose.Schema.Types.ObjectId, ref: 'product'},
        quantity: {type: Number, default: 1},
        price: { type: Number, default: 0}
    }

})

module.exports = mongoose.model('cart', CartSchema)
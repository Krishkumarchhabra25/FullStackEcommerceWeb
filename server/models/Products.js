const mongoose = require('mongoose');

const ProductsSchema = new mongoose.Schema({
    image: String,
    title: String,
    description: String,
    category: String,
    brand: String,
    price: String,
    salePrice: Number,
    totalStock: Number,
} , {timeStamps: true})

module.exports = mongoose.model('Product', ProductsSchema)
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');
var Schema = mongoose.Schema;

var OrderSchema = mongoose.Schema({
    book_id: { type: Schema.Types.ObjectId, ref: 'books' },
    customer_name: {
        type: String,
        required: true
    },
    payment_mode: {
        type: String,
        enum: ['card', 'cash']
    },
    quantity: Number,
    amount_paid: Number
})

mongoose.exports = mongoose.model('orders', OrderSchema);
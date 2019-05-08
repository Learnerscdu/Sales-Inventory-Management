const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');
var Schema = mongoose.Schema;

const BooksSchema = mongoose.Schema({
    author: {
        type: String,
        required: true
    },
    publisher: String,
    title: {
        type: String,
        required: true
    },
    ISBN: {
        type: String,
        required: true
    },
    genre: {
        type: String
    },
    publication_year: Date,
    price: Number,
    availability_location: {
        type: Schema.Types.ObjectId,
        ref: 'locations',
        required: true
    },
    quantity: Number,
    cover_pic: String
}, { timestamps: true })

mongoose.exports = mongoose.model('books', BooksSchema);
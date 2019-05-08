const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/user');
const mongoose = require('mongoose');
const Orders = mongoose.model('orders');
const objectId = mongoose.Types.ObjectId;
const HttpStatus = require('http-status-codes');

router.post('/create', (req, res) => {
    let data = req.body;
    if (data.book_id && data.customer_name && data.payment_mode && data.amount_paid && data.quantity ) {
        Orders.create(req.body)
            .then((response) => {
                if (response) {
                    res.status(200).json({
                        error: '0',
                        message: 'Order placed successfully'
                    })
                }
                else {
                    res.status(404).json({
                        error: '1',
                        message: 'Not found'
                    })
                }
            })
            .catch((err) => {
                res.status(500).json({
                    error: '1',
                    message: 'Internal server error'
                })
            })
    }
})

router.get('/get_orders', (req, res) => {
    Orders.find({})
    .populate('book_id')
    .select('customer_name payment_mode quanitity amount_paid')
    .then((response) => {
        if (response) {
            res.status(200).json({
                error: '0',
                message: 'Orders fetched successfully',
                data: response
            })
        }
        else {
            res.status(404).json({
                error: '1',
                message: 'Not found'
            })
        }
    })
    .catch((err) => {
        res.status(500).json({
            error: '1',
            message: 'Internal server error'
        })
    })
})

router.post('/get_order_by_id', (req, res) => {
    let data = req.body;
    Orders.findOne({ _id: data.order_id})
    .populate('book_id')
    .select('customer_name payment_mode quanitity amount_paid')
    .then((response) => {
        if (response) {
            res.status(200).json({
                error: '0',
                message: 'Order fetched successfully',
                data: response
            })
        }
        else {
            res.status(404).json({
                error: '1',
                message: 'Not found'
            })
        }
    })
    .catch((err) => {
        res.status(500).json({
            error: '1',
            message: 'Internal server error'
        })
    })
})

router.post('/remove_order', (req, res) => {
    let query = { _id: objectId(req.body.order_id) };
    Orders.remove(query)
      .then((response) => {
        if (response) {
          res.status(HttpStatus.CREATED).json({ error: "0", message: "Successfully deleted order." });
        }
        else {
          res.status(HttpStatus.NOT_FOUND).json({ error: "1", message: "Id " + HttpStatus.getStatusText(HttpStatus.NOT_FOUND) });
        }
      })
      .catch((error) => {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: "2", message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) });
      });
  })

module.exports = router;
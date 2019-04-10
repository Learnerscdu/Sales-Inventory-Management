const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/user');
const mongoose = require('mongoose');
const Locations = mongoose.model('locations');

router.post('/add_location', (req, res) => {
    let data = req.body;
    if (data.name) {
        Locations.create(req.body)
        .then((response) => {
            if (response) {
                res.status(200).json({
                    error: '0',
                    message: 'Location added successfully'
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

router.get('/get_locations', (req, res) => {
    Locations.find({}).select('name')
    .then((response) => {
        if (response) {
            res.status(200).json({
                error: '0',
                message: 'Locations fetched successfully',
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

module.exports = router;
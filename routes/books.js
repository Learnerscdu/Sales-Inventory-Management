const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/user');
const mongoose = require('mongoose');
const Books = mongoose.model('books');
const objectId = mongoose.Types.ObjectId;
const HttpStatus = require('http-status-codes');

router.post('/add_book', (req, res) => {
    let data = req.body;
    if (data.title && data.author && data.publisher && data.ISBN && data.genre && data.publication_year && data.price && data.availability_location && data.quantity) {
        Books.create(req.body)
            .then((response) => {
                if (response) {
                    res.status(200).json({
                        error: '0',
                        message: 'Book added successfully'
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

router.get('/get_books', (req, res) => {
    Books.find({}).select('author title publisher ISBN genre publication_year price availability_location quantity')
    .then((response) => {
        if (response) {
            res.status(200).json({
                error: '0',
                message: 'Books fetched successfully',
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

//Get books by location API
router.post('/get_books_by_location', (req, res) => {
    Books.find({availability_location: req.body.location}).populate('availability_location').select('author title publisher ISBN genre publication_year price availability_location quantity')
    .then((response) => {
        if (response) {
            res.status(200).json({
                error: '0',
                message: 'Books fetched successfully',
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

//Update book details API
router.post('/update_book', (req, res) => {
    let data = req.body;
    let query = {_id: data._id};
    Books.findByIdAndUpdate(query, data, { new: true })
    .populate('availability_location')
    .select('author title publisher ISBN genre publication_year price availability_location quantity')
    .then((response) => {
        if (response) {
            res.status(200).json({
                error: '0',
                message: 'Book details updated successfully',
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

router.post('/remove_book', (req, res) => {
    let query = { _id: objectId(req.body.book_id) };
    Books.remove(query)
      .then((response) => {
        if (response) {
          res.status(HttpStatus.CREATED).json({ error: "0", message: "Successfully deleted book." });
        }
        else {
          res.status(HttpStatus.NOT_FOUND).json({ error: "1", message: "Id " + HttpStatus.getStatusText(HttpStatus.NOT_FOUND) });
        }
      })
      .catch((error) => {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: "2", message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) });
      });
  })


router.post('/get_all_books_employee', (req, res) => {  
    console.log(req.body, 'searchparamss', req.query);
    let query;
    let sk;
    let lt;
    let data_query = req.body.search;
    console.log(data_query);
    if(data_query.skip){
        sk=Number(data_query.skip);
    }else{
        sk = 0;   
    }
  
    if(data_query.limit){
        lt=Number(data_query.limit);
    }else{
        lt = 20;   
    }
  
  
    if (data_query.search) {
        let search_query = {
            "$or": [
                { "title" : { "$regex": data_query.search, "$options":"i"} },
                { "author" : { "$regex": data_query.search, "$options":"i"} },
                { "genre": { "$regex": data_query.search, "$options": "i" } }
            ]
        };
  
        if (data_query.service_type) {
          query =  Object.assign({ "service_type" : { "$regex": data_query.service_type, "$options":"i"} },search_query)
        }else{
          query =  Object.assign({},search_query)
        }
           
    } else {
  
        if (data_query.service_type) {
          query =  Object.assign({ "service_type" : { "$regex": data_query.service_type, "$options":"i"} })
        }else{
          query =  Object.assign({})
        }
       
    }
    
    let sortquery = "";
    if(data_query.sort){
       
        let sortname = data_query.sort;
        if(sortname == "title" ){
        sortquery = { title : data_query.order };
        }
        else{
          sortquery = {signupDate : "-1"};
        }
        
    }else{
        sortquery = {signupDate : 1};
    }
    
    Books
      .find(query)
      .sort(sortquery)
      .limit(lt || '')
      .skip(sk || '')
      .lean()
      .exec(function (err, books_result) {
        if (err) {
            console.log(err);
            return res.send(500, err);
        }
        if (!books_result) {
            
            res.send({
                "status": 200,
                "message": "books not found",
                "message": "failure",
                "franchisees_list": []
            }, 404);
        }
        else {
          Books
            .find(query)
            .count()
            .lean()
            .exec(function (err, count) {
              if (err) {
                  
                  return res.send(500, err);
              }
              if (!count) {
                  
                  res.send({
                      "status": 200,
                      "message": "books not found",
                      "items": []
                  }, 404);
              }
              else {
                let data = [];
                books_result.forEach((resp) => {
                  if(resp.prof_pic_url){
                  resp.prof_pic_url = getPreSignedURL(resp.prof_pic_url);
                  }
                  data.push(resp);
                });
                  res.send({
                      status: "200",
                      state: "success",
                      items: data,
                      count: count,
                      skip:sk
                  }, 200);
              }
          })
        }
    })
  })
  

module.exports = router;
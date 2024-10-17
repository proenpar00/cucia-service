var express = require('express');
var router = express.Router();

var image = [
  {"id":1 ,
    "cells": [
      {"cell": 1, "classification": "Negative"},
      {"cell": 2, "classification": "Negative"},
      {"cell": 3, "classification": "Negative"},
      {"cell": 4, "classification": "SCH"},
      {"cell": 5, "classification": "SCH"},
      {"cell": 6, "classification": "HSIL"},
      {"cell": 7, "classification": "HSIL"}]
}
] 
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send(image);
});

/*POST image */
router.post('/', function(req, res, next) {
  var newImage = req.body;
  image.push(newImage);
  res.sendStatus(201);
})

/*GET image/id */
router.get('/:id', function(req, res, next) {
  var id = req.params.id;
  var result = image.find(c => {
    return c.id == id;
  })
  if (result){
    res.send(result);
  } else {
    res.sendStatus(404);
  }
})
module.exports = router;
 
var express = require('express');
var router = express.Router();


const contacts =  [
  { id:0, Mb: "11111111"},
  { id:1, Mb : "111116767"},
  { id:2, Mb : "45678956789"},
  { id:3, Mb : "7898e67"}
];



router.get('/', function(req, res, next) {
  res.status(200).json(contacts);
  //res.send('respond with a resource');
});

module.exports = router;

var express = require('express');
var router = express.Router();


const users =  [
  { id:0, name : "Richa"},
  { id:1, name : "Sajal"},
  { id:2, name : "Manish"},
  { id:3, name : "Renu"}
];

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.status(200).json(users);
  //res.send('respond with a resource');
});
router.post('/test', function(req, res, next) {
      let payload = { reqPayload: { Headers: req.headers, ReqBody: req.body }, url: req.originalUrl, statusCode: res.statusCode, method: req.method }
      console.log(payload)
      logDataInDb(payload)
    res.json({ Headers: req.headers ,ReqBody:req.body })
  //res.send('respond with a resource');
});

function logDataInDb(logDataNew) {

  const FullUrl = logDataNew.url
  const pathSegments = FullUrl.split('/');
  const ModuleName = pathSegments[2];
  const APIName = pathSegments[3];

  // const APIDateTime1 =  new Date().toLocaleString(); 
  // console.log(APIDateTime1)
  const APIDateTime2 = new Date().toISOString()
  const APIDateTime5 = new Date(APIDateTime2)

  const APIStatus = logDataNew.statusCode + ": " + logDataNew.error_msg
  const ErrorMsg = logDataNew.error_msg
  const PayloadData = JSON.stringify(logDataNew.reqPayload)
  console.log(PayloadData)
  const ResponseError = logDataNew.error_msg

  

     
}
module.exports = router;

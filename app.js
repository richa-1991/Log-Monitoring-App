var express = require('express');
const router = express.Router();
const fs= require('fs')
const JSONStream=require('JSONStream')
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const sql = require("mssql");
const request = require('request');
const auth = require('http-auth');
var dbConnection = require('./config/dbConnection');
//const auth = require('express-basic-auth');
const statusMonitor = require('express-status-monitor')
const uuid = require('uuid')
const verifyAuth = require('./config/verifyAuth');

// const basic = auth.basic({ realm: 'Monitor Area' }, (user, pass, callback) => {
//  callback(user === 'ttttttt' && pass === 'tttttttt');
// });
//const statusMonitor = require('express-status-monitor')({ path: '' });

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var contactRouter = require('./routes/contact');
const { verifyToken } = require('./middleware/verifyToken');
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;


var app = express();
//app.use(auth.basic())

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

// const config = {
//     title: 'Express Status',
//     path: '/status',
//     spans: [{
//       interval: 1,
//       retention: 60
//     }, {
//       interval: 5,
//       retention: 60
//     }, {
//       interval: 15,
//       retention: 60
//     }],
//     chartVisibility: {
//       cpu: true,
//       mem: true,
//       load: true,
//       responseTime: true,
//       rps: true,
//       statusCodes: true
//     },
//     healthChecks: [
//       {
//         protocol: 'http',
//         host: 'localhost',
//         path: '/my-post-endpoint',
//         port: '3002',
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         }
//       },
//       {
//         protocol: 'http',
//         host: 'localhost',
//         path: '/contact',
//         port: '3002'
//       }
//     ],
//     //ignoreStartsWith: '/admin'
// }

app.post('/my-post-endpoint',(req,res,next)=>{
  res.status(200).send('POst respond with a resource');
})

app.get('/my-get-endpoint',(req,res)=>{
  res.status(200).send('GET respond with a resource');
  //req.monitor('api_get_req')

})
app.get('/GetAPIsLogInfo', verifyAuth,function (req, res, next) {

  var request = new sql.Request();
  request
    .execute('GetAPIsLogInfo').then(val => {
      res.json({ data: val.recordsets, success: true });
      res.end();
    }).catch(function (err) {
      res.json({ msg: err, success: false });
      res.end();
    });
});
app.get('/APIMonitoringMail', verifyAuth,function (req, res, next) {
  var options = {
    'method': 'POST',
    'url': "https://del5wfisuixap01.fnfis.com:3061/api1/",
    
  };
  // console.log(get_all_service)
  request(options, function (error, response, body) {
    if(error){
      var APIName= "";
      var BodyPart= "Intelhub APIs down, please rectify them on highest priority " 
      var request = new sql.Request();
      request
        .input('vAPINames', sql.VarChar(200), APIName)
        .input('BodyPart', sql.VarChar(200), BodyPart)
        .execute('SP_APIMonitoringMail').then(val => {
          res.json({ data: val.recordsets, success: true });
          res.end();
        }).catch(function (err) {
          res.json({ msg: err, success: false });
          res.end();
        });
    }else{
      res.status(response.statusCode).json({ 'success': false, 'msg': 'No response!' })
      res.end()
    }
  })
});



app.use(statusMonitor({
  title: 'Express Status',
  path: '/status',
  //socketPath: '/socket.io', // In case you use a custom path
  //websocket: existingSocketIoInstance,
  interval : 60,
 
    chartVisibility: {
      cpu: true,
      mem: true,
      load: true,
      eventLoop: true,
      heap: true,
      responseTime: true,
      rps: true,
      statusCodes: true
    },
  
  healthChecks: [
    // {
    //   protocol: 'http',
    //   host: 'localhost',
    //   path: '/my-get-endpoint',
    //   port: '3002',
    //   method: 'GET',
    // },
    // {
    //   protocol: 'http',
    //   host: 'localhost',
    //   path: '/my-post-endpoint',
    //   port: '3002',
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   }
    // }
  ]
}));
 

//app.use('/', indexRouter);
//app.use('/users', usersRouter);
//app.use('/contact', contactRouter);

//app.use(statusMonitor().middleware);
//app.get('/status', auth.conn(basic), statusMonitor.pageRoute);
//app.get('/status', basic.check(statusMonitor.pageRoute)); 


// app.post('/statusPage',verifyToken,(req,res)=>{
//   res.status(200).send(res)
//   //res.status(200).json({result:"success"})
// });

// app.post('/test',verifyToken,(req,res)=>{
//   res.status(200).json({result:"success"})
// });


app.post("/epicToIntelhubRedirect", function (req, res) {

 
    //console.log('Encripted token::: '+ req.body.id_token);
    //var token = decryptiondata(req.body.id_token);
    //decryptiondata(req.body.id_token)

    // decryptiondata(req.body.id_token).then(function (value) {
    //   var token = value;
    //   console.log("Decripted Toke :::" + token);
    //   var decoded_token = jwtDecode(token);
    //   console.log(decoded_token);
    //   var accessToken=decoded_token.accessToken;
    //   var firmName=decoded_token.iss
      const uniqueRandomID = uuid.v4()
      console.log(uniqueRandomID);
      
      var options = {
        'method': 'GET',
        'url': 'https://ih-system.fisdev.local/xpressng/plainrest/idpcld1uat/idp/'+firmName+'/rest/1.0/authenticatedUser',
        
        'headers': {
          'source-id': "epic",
          'organization-id':"",
          'uuid': uniqueRandomID, // uuid has prescribed format of random no. – xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx ( for each request uuid is unique )
          'Accept':"application/json"
        }                                                          
      };
      request(options, function (error, response, val) {
        res.status(500).json([JSON.parse(val)]);
        res.end();
      })
      return;
      var encrypted_email = encode(decoded_token.EmailAddress);
      var db_request = new sql.Request()
        .input("EmailId", sql.VarChar(255), decoded_token.EmailAddress)
        .input("FirmName", sql.VarChar(255), decoded_token.iss)
        .input("LoginName", sql.VarChar(255), decoded_token.LoginName)
        .input("accessToken", sql.VarChar(255), accessToken)
        .execute("VerifyExternalUser")
        .then(function (val) {
          if (val.recordset[0].IsAccessible == 1) {
            res.send(
                process.env.REDIRECT +
                "/#/recieveurl/?t=" +
                encode(token) +
                "&e=" +
                encrypted_email +
                "&id=" +
                decoded_token.iss +
                "&ln=" +
                encode(decoded_token.LoginName),
            );
            res.end();
          } else {
            res.send({status:false,Msg:"Unauthorized"});
            res.end();
          }
        })
        .catch(function (err) {
          payload.error_msg= "Invalid Input!"
          logger.error(payload)
          logDataInDb(payload)
          console.log(err);
          res.json({
            msg: "Invalid Input!",
          });
          res.end();
        });
});
  
    module.exports = app;

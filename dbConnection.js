const sql = require('mssql');
require('dotenv').config();
//const configSett=require('./app.json');
const config = {
    options: {multiSubnetFailover: true},
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    server: process.env.DB_HOST, 
    database: process.env.DB_NAME,
    trustServerCertificate: true,
  }
  sql.connect(config).then(function() {
    console.log('db connected')
  });
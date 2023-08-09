require('dotenv').config();
const sql = require('mssql');
const jwt = require('jsonwebtoken');
const jwtDecode = require('jwt-decode');
const _ = require('lodash')
const decipher = salt => {
    const textToChars = text => text.split('').map(c => c.charCodeAt(0));
    const applySaltToChar = code => textToChars(salt).reduce((a, b) => a ^ b, code);
    return encoded => encoded.match(/.{1,2}/g)
        .map(hex => parseInt(hex, 16))
        .map(applySaltToChar)
        .map(charCode => String.fromCharCode(charCode))
        .join('');
}

function encode(pass) {
    const cipher = salt => {
        const textToChars = text => text.split('').map(c => c.charCodeAt(0));
        const byteHex = n => ("0" + Number(n).toString(16)).substr(-2);
        const applySaltToChar = code => textToChars(salt).reduce((a, b) => a ^ b, code);
        return text => text.split('')
            .map(textToChars)
            .map(applySaltToChar)
            .map(byteHex)
            .join('');
    }
    const myCipher = cipher('fisintelhub');
    let incrpassord = myCipher(pass);
    return incrpassord
}

const myDecipher = decipher('fisintelhub');
let authorization = (req, res, next) => {
    var token = req.headers['authorization'];
   
    var encrypted_email = req.headers['guardid'];
   
    var hEmail = myDecipher(encrypted_email);
    

    var enc_token = myDecipher(token);
    
    var decoded_token = jwtDecode(enc_token);
    
    var email = decoded_token.userid;
   
    if(hEmail.toLowerCase()==email.toLowerCase()){
        next();
    }else{
        res.status(401).json({ auth: false, message: 'Unauthorized!' });
        res.end();
    }
    }
module.exports = authorization;
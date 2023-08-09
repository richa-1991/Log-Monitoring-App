const jwt = require("jsonwebtoken");
const secretKey="Richa"
exports.verifyToken = (req, res, next) => {
    console.log("hi")
    const token =req.body.token || req.query.token || req.headers["x-access-token"];
    console.log(token);

    if (!token) {
        return res.status(403).send("A token is required for authentication");
    }
    else{
     next()
    }
    //    jwt.verify(token, secretKey, function (err, decoded) {
    //         if (err) {
    //             res.status(401).json({ auth: false, message: 'Unauthorized.' });
    //             res.end();
    //         }            
    //         next()       
    // })
       
 
};
const userModel = require('../models/user');
const jwt = require('jsonwebtoken');

module.exports = async function(req, res, next){
    if(!req.cookies.token){
        return res.redirect('/');
    }


    
    try {
        let decoded = jwt.verify(req.cookies.token, "secretString");
        let user = await userModel
        .findOne({email: decoded.email})
        .select("-password");
        req.user = user;
        next();
    } catch (err) {
        console.log(err);
        
    }
}

const jwt = require('jsonwebtoken');
const config = require('../config');

module.exports = function (req, res, next) {
    let token = req.header('token');
    if (token != null){
        jwt.verify(token, config.secret, function (err, success) {
            if(err){
                return res.json({
                    success: false,
                    message: 'Failed to authenticate token'
                });
            }
            req.decoded = success;
            next();
        });
    }
    else{
        return res.status(403).json({
            success: false,
            message: 'No token provided.'
        });
    }
};
const router = require('express').Router();
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const Order = require('../models/order');
const config = require('../config');

const checkJwt = require('../middlewares/check-jwt');

router.post('/signup', (req, res, next) => {
   let user = new User();
   user.name = req.body.name;
   user.email = req.body.email;
   user.password = req.body.password;
   user.picture = user.gravatar();
   user.isSeller = req.body.isSeller;

   User.findOne({email: user.email}, (err, existingUser) => {
       if (existingUser){
           res.json({
               success: false,
               Message: 'Email already used by another account.'
           });
       }
       else {
           user.save();
           const token = jwt.sign({
               user: user
           }, config.secret, {
               expiresIn: '7d'
           });
           res.json({
               success: true,
               message: 'Successfully registered.',
               token: token
           });
       }
   });
});

router.post('/login', (req, res, next) => {
    User.findOne({email:req.body.email}, (err, user) => {
        if (err) {
            return res.json({
                success: false,
                message: err
            });
        }

        if (!user){
            return res.json({
                success: false,
                message: "Authentication failed, User doesn't exist."
            });
        }

        let validPassword = user.comparePassword(req.body.password);
        if (!validPassword){
            return res.json({
                success: false,
                message: "Authentication failed, Wrong password."
            });
        }

        const token = jwt.sign({
            user: user
        }, config.secret, {
            expiresIn: '7d'
        });

        return res.json({
            success: true,
            message: "Successfully logged in!",
            token: token
        });
    });
});

router.route("/profile")
    .get(checkJwt, (req, res, next) => {
        User.findOne({_id: req.decoded.user._id}, (err, user) => {
            if (err)
            {
                return res.json({
                    success: false,
                    message: "Unknown error"
                })
            }

            return res.json({
                success: true,
                message: "successful",
                user: user
            });
        })
    })
    .post(checkJwt, (req, res, next) => {
        User.findOne({_id: req.decoded.user._id}, (err, user) => {
            if (err)
                return next(err.message);

            if(req.body.name) user.name = req.body.name;
            // if(req.body.email) user.email = req.body.email;
            if(req.body.newPassword) user.password = req.body.newPassword;
            // user.isSeller = res.body.isSeller;
            user.save();

            return res.json({
                success: true,
                message: "successfully updated user profile."
            });
        })
    });

router.route("/address")
    .get(checkJwt, (req, res, next) => {
        User.findOne({_id: req.decoded.user._id}, (err, user) => {
            if (err)
            {
                return res.json({
                    success: false,
                    message: "Unknown error"
                })
            }
            return res.json({
                success: true,
                message: "successful",
                address: user.address
            });
        })
    })
    .post(checkJwt, (req, res, next) => {
        User.findOne({_id: req.decoded.user._id}, (err, user) => {
            if (err)
                return next(err);
            if(req.body.addressLine1) user.address.addressLine1 = req.body.addressLine1;
            if(req.body.addressLine2) user.address.addressLine2 = req.body.addressLine2;
            if(req.body.city) user.address.city = req.body.city;
            if(req.body.state) user.address.state = req.body.state;
            if(req.body.country) user.address.country = req.body.country;
            if(req.body.postCode) user.address.postCode = req.body.postCode;

            user.save();

            return res.json({
                success: true,
                message: "successfully updated user address."
            });
        })
    });

    router.get('/orders', checkJwt, (req, res, next) => {
        Order.find({ owner: req.decoded.user._id })
            .populate('products.product')
            .populate('owner')
            .exec((err, orders) => {
                if(err){
                    res.json({
                        success: false,
                        message: "Could not find your order"
                    });
                } else {
                    res.json({
                        success: false,
                        message: 'Found your order',
                        orders: orders
                    });
                }
            });
    });

    router.get('/orders/:id', checkJwt, (req, res, next) => {
        Order.findOne({ _id: req.params.id })
            .deepPopulate('products.product.owner')
            .populate('owner')
            .exec((err, order) => {
                if(err){
                    res.json({
                        success: false,
                        message: "Could not find your order"
                    });
                } else {
                    res.json({
                        success: false,
                        message: 'Found your order',
                        order: order
                    });
                }
            });
    });

module.exports = router;

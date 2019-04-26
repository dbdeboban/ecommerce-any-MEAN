const router = require('express').Router();
const async = require('async');
const stripe = require('stripe')('sk_test_CeRAE0TzcjJUYFvuY0o3l82A00ejsRGOPB')

const Category = require('../models/category');
const Product = require('../models/product');
const Review = require('../models/review');
const checkJwt = require('../middlewares/check-jwt');
const Order = require('../models/order');


router.route('/categories')
.get((req, res, next) => {
    Category.find({}, (error, all) => {
        res.json({
            success: true,
            message: "Request successful.",
            categories: all
        });
    })
})
.post((req, res, next) => {
    let category = new Category();
    category.name = req.body.category;
    category.save();
    res.json({
        success: true,
        message: "Category successfully saved."
    });
});

router.get('/categories/:id', (req, res, next) => {
    const resultPerPage = 10;
    const page = req.query.page;

    async.parallel([
        function (callback) {
            Product.count({category: req.params.id}, (err, totalProductCount) => {
                callback(err, totalProductCount);
            });
        },
        function(callback){
            Product.find({category: req.params.id})
                .skip(resultPerPage * page)
                .limit(resultPerPage)
                .populate('category')
                .populate('owner')
                .populate('review')
                .exec((err, products) => {
                    if (err) return next(err);
                    callback(err, products);
                });
        },
        function (callback) {
            Category.findOne({_id: req.params.id}, (err, category) =>{
                callback(err, category);
            });
        }
    ], function (err, results) {
        if (err){
            return res.json({
                success: false,
                message: err
            });
        }
        let totalProductCount = results[0];
        let products = results[1];
        let category = results[2];
        console.log(category);
        res.json({
            success: true,
            message: 'category',
            products: products,
            categoryName: category.name,
            totalProducts: totalProductCount,
            pages: Math.ceil(totalProductCount / resultPerPage)
        });

    });

    // Product.find({categoryId: req.param.id})
    //     .populate('category')
    //     .exec((err, products)=>{
    //         Product.count({categoryId:req.params.id}, (err, totalProducts) => {
    //             res.json({
    //                 success: true,
    //                 message: 'successful',
    //                 products: products,
    //                 categoryName: products[0].category.name,
    //                 totalProducts: totalProducts,
    //                 pages: Math.ceil(totalProducts/ resultPerPage)
    //             });
    //         });
    //     });
});

router.get('/products', (req, res, next) => {
    const resultPerPage = 10;
    const page = req.query.page;

    async.parallel([
        function (callback) {
            Product.count({}, (err, totalProductCount) => {
                callback(err, totalProductCount);
            });
        },
        function(callback){
            Product.find({})
                .skip(resultPerPage * page)
                .limit(resultPerPage)
                .populate('category')
                .populate('owner')
                .exec((err, products) => {
                    if (err) return next(err);
                    callback(err, products);
                });
        }
    ], function (err, results) {
        let totalProductCount = results[0];
        let products = results[1];
        res.json({
            success: true,
            message: 'products',
            products: products,
            totalProducts: totalProductCount,
            pages: Math.ceil(totalProductCount / resultPerPage)
        });

    });

});

router.get('/products/:id', (req, res, next)=>{
    Product.findById({_id: req.params.id})
        .populate('category')
        .populate('owner')
        .deepPopulate('reviews.owner')
        .exec((err, product) => {
            if (err){
                res.json({
                    success: false,
                    message: 'Product not found!'
                });
            }
            else{
                if (product){
                    res.json({
                        success: true,
                        product: product
                    });
                }
            }
        });
});



router.post('/reviews', checkJwt, (req, res, next) => {
    async.waterfall([
        function (callback) {
            Product.findOne({_id: req.body.productId}, (err, product) => {
                if(err) {
                    next(err);
                }
                if (product){
                    callback(err, product);
                }
            })
        },
        function (product) {
            let review = new Review();
            review.owner = req.decoded.user._id;

            if (req.body.title) review.title = req.body.title;
            if(req.body.description) review.description = req.body.description;
            review.rating = req.body.rating;

            product.reviews.push(review);

            product.save();
            review.save();
            res.json({
                success: true,
                message: "Review Successfully added!"
            });
        }
    ]);
});

router.post('/payment', checkJwt, (req, res, next) =>{
    const stripeToken = req.body.stripeToken;
    const currentCharges  = Math.round(req.body.totalPrice *100);

    stripe.customers
        .create({
            source:stripeToken.id
        })
        .then(function(charge){
            const products = req.body.products;
            let order = new Order();
            order.owner = req.decoded.user._id;
            order.totalPrice = currentCharges;

            products.map(product => {
                order.products.push({
                    product: product.product,
                    quantity: product.quantity
                });
            });
            order.save();
            res.json({
                success:true,
                message: "Succesfully made a payment"
            });
        });
});



module.exports = router;
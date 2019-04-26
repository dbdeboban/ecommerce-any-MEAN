const router = require('express').Router();
const multer = require('multer');
const Product = require('../models/product');
const checkJWT = require('../middlewares/check-jwt');
const path = require('path');

const faker = require('faker');

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        if (file)
            callback(null, './files/img/product/');
    },
    filename: function (req, file, callback) {
        if (file)
            callback(null, Date.now().toString() + path.extname(file.originalname));
    }
});
const upload = multer({storage: storage});

router.route('/products')
    .get(checkJWT,  (req, res, next) => {
        Product.find({owner: req.decoded.user._id})
            .populate('owner')
            .populate('category')
            .exec((err, products) => {
                if (products){
                    res.json({
                        success: true,
                        message: 'Products',
                        products: products
                    });
                }
            });
    })
    .post([checkJWT, upload.single('product_picture')], (req, res, next) => {
        let product = new Product();
        product.owner = req.decoded.user._id;
        console.log(req.decoded._id, req.decoded.name);
        product.category = req.body.categoryId;
        product.name = req.body.name;
        product.price = req.body.price;
        product.description = req.body.description;
        if (req.file)
            product.image = req.protocol + "://" + req.hostname + ":" + req.socket.localPort + "/img/product/" + req.file.filename;

        product.save();

        res.json({
            success: true,
            message: 'Successfully Added the product.'
        });
    });

// for testing
router.get('/faker/test', (req, res, next) => {
    for (i = 0; i<50; i++){
        let product = new Product();
        product.owner = '5cc073931f78161bcc8d6825';
        product.category = "5cbf6bddd82ba81ad02811c9";
        product.image = faker.image.fashion();
        product.name = faker.commerce.productName();
        product.description = faker.lorem.words();
        product.price = faker.commerce.price();
        product.save();
    }
    res.json({
        success: true,
        message: '20 product added'
    });
});

module.exports = router;
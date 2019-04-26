const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const deepPopulate = require('mongoose-deep-populate')(mongoose);
const mongooseAlgolia = require('mongoose-algolia');

const ProductSchema = new Schema({
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
    reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
    image: String,
    name: String,
    description: String,
    price: Number,
    created: { type: Date, default: Date.now() }
}, {
        toObject: { virtuals: true },
        toJSON: { virtuals: true }
    }
);

ProductSchema
    .virtual('averageRating')
    .get(function () {
        var rating = 0;
        if (this.reviews.length == 0) {
            rating = 0;
        } else {
            this.reviews.map((review) => {
                rating += review.rating;
            });
            rating = rating / this.reviews.length;
        }

        return rating;
    });

ProductSchema.plugin(deepPopulate);
ProductSchema.plugin(mongooseAlgolia, {
    appId: 'F8MZ1VDN98',
    apiKey: '7efe6c5e9d6f078bc84890c4956c1ec1',
    indexName: 'zamonov1',
    selector: '_id name title image reviews description price owner created averageRating', 
    populate: {
        path: 'owner reviews',
        select: 'name rating'
    },
    defaults: {
        author: 'unknown'
    },
    mappings: {
        name: function (value) {
            return `${value}`
        }
    },
    virtuals: {
        averageRating: function (doc) {
            var rating = 0;
            if (doc.reviews.length == 0) {
                rating = 0;
            } else {
                doc.reviews.map((review) => {
                    rating += review.rating;
                });
                rating = rating / doc.reviews.length;
            }

            return rating;
        }
    },
    debug: true
});
let Model = mongoose.model('Product', ProductSchema);
Model.SyncToAlgolia();
Model.SetAlgoliaSettings({
    searchableAttributes: ['name']
});
module.exports = Model
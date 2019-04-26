const router = require('express').Router();

const algoliaSearch = require('algoliasearch');
const client = algoliaSearch('F8MZ1VDN98', '7efe6c5e9d6f078bc84890c4956c1ec1');
const index = client.initIndex('zamonov1');

router.get('/', (req, res, next) =>{
    if(req.query.query) {
        index.search({
            query: req.query.query,
            page: req.query.page,
        }, (err, content) => {
            res.json({
                success:true,
                message: "Here is your search",
                status: 200,
                content:content,
                search_result: req.query.query
            });
        });
    }
});

module.exports = router;
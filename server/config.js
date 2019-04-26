
module.exports = {
    database: 'mongodb://root:admin@cluster0-shard-00-00-4vyfp.mongodb.net:27017,cluster0-shard-00-01-4vyfp.mongodb.net:27017,cluster0-shard-00-02-4vyfp.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true',
    port: process.env.PORT || 3000,
    secret: 'this will use in jwt.'
}
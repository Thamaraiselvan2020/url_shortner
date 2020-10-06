const mongodb = require('mongodb')

const MongoClient = mongodb.MongoClient

const url = "mongodb://localhost:27017"

const dbname = "shortener"

const ObjectId = mongodb.ObjectID

module.exports = {MongoClient, url, dbname,ObjectId}
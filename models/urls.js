const mongoose = require('mongoose')
const urlSchema = mongoose.Schema({

    longUrl : {
        type:String,
        required : true
    },

    shortUrl :{
        type : String,
        required : true
       
    },
    click : {
        type : Number,
        default : 0
    }
})

const urlModel = mongoose.model('urlShorts',urlSchema)

module.exports = {urlModel}
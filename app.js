var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cors = require('cors')
var bcrypt = require('bcrypt')
var {MongoClient, url, dbname,ObjectId} = require('./config')


const mongoose = require('mongoose')


mongoose.connect("mongodb://localhost:27017/myurlshortener")

const {urlModel} = require('./models/urls')


var app = express();
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())  // 
app.set('view engine',"ejs")
app.use(bodyParser.urlencoded({extended : true}))


app.get('/signup',(req,res) =>{

    res.sendFile('signup.html', { root: path.join(__dirname, './public') });
})

app.post('/sign-up',async function (req,res){

let client;
try{

    client = await MongoClient.connect(url)

    let db = client.db(dbname)

    let salt =   await bcrypt.genSalt(10)

    let hash = await bcrypt.hash(req.body.password,salt)

    req.body.password = hash; 

    db.collection("user").insertOne(req.body)

    client.close()

    res.json({

        message : "done"
    })

}catch(error){

if(client) client.close()
console.log(error)
}

})

app.post('/login', async function (req,res) {


    let client;
    try{
  
        client = await MongoClient.connect(url)
      
          let db = client.db(dbname)

           // find the user with email

          let user = await db.collection("user").findOne({email : req.body.email})  

          console.log(user)

          if(user){       // if email is correct

            let result = await bcrypt.compare(req.body.password,user.password)
            
               if(result)  // if password is correct
            
            {
                client.close()

                res.json({
              
                    message : "success"
                    
                })   
              }
              else              // if password is incorrect
              client.close()
              
                res.json({
              
                    message : "username and password not wrong"
                })   
              }
                 else{        // if email is incorrect
              
                  res.status(404).json({
              
                    message : "user not found"
                  })
                 }
                                  
                
                }
                catch(error){
              
                    if(client) client.close()
                    console.log(error);
                }

})


app.get('/home', function(req,res){

    let allUrl = urlModel.find(function(err,final){

        res.render("home" , {

            urlResult : final
        })

    })
})

app.post('/create',function(req,res){

   
    let urlShorts = new urlModel ({

        longUrl : req.body.longurl,
        shortUrl : generateurl()
    })

    urlShorts.save(function(err,data){
 
        if(err) throw err;

        res.redirect('/home')


    })
})
app.get('/:urlId', function (req, res) {

    urlModel.findOne({ shortUrl: req.params.urlId }, function (err, data) {
        if (err) throw err;

        urlModel.findByIdAndUpdate({ _id: data.id }, { $inc: { clickCount: 1 } }, function (err, updatedData) {
            if (err) throw err;
            res.redirect(data.longUrl)
        })


    })
})


app.get('/delete/:id',function(req,res){
    urlModel.findByIdAndDelete({_id:req.params.id},function(err,deleteData){
        if(err) throw err;
        res.redirect('/home')
    })
})


function generateurl(){


    var result = ""
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  var charlength = characters.length

  for(var i =0 ;i<5;i++){

    result += characters.charAt(
        Math.floor(Math.random() *charlength)
    )
  }
  console.log(result)
return result
  
}

app.listen(3000 , ()=>{

    console.log("server listing to port  3000")
} );











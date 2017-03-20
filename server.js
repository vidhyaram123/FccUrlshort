var express = require('express');
var path = require('path');
var validurl = require('valid-url')
var urlmodel = require('./schema.js')
var  app = express();
console.log('start');
var mongoose = require('mongoose')
var mongourl = process.env.MONGODB_URI
console.log('Mongo url: '+mongourl)
var bodyParser = require('body-parser')


app.use(bodyParser.urlencoded({extended: false}))
mongoose.connect(mongourl);

mongoose.connection.on('error', function(err) {
    console.error('MongoDB connection error: ' + err);
    process.exit(-1);
  }
);

app.get('/new',function(req,res){
    
    res.sendFile(path.join(__dirname,'index.html'),function(err){
        
        if(err){
            res.status(err.status).end();
        }
        else{
            console.log("Sent Index file ");
        }
    });
    
    
    
})

app.get('/',function(req,res){
    
    res.redirect('/new');
    
})

app.post('/new',function(req,res){
    //console.log("url request"+ req.body);
    var urll = String(req.body.longurl);
    checkAndInsert(urll,res);
})


app.get('/:id',function(req,res){
    
     urlmodel.find({_id:req.params.id},function(err,doc){
       if(err)
             return res.send(err);
             
        if(doc && doc.length){
            
            res.redirect(doc[0].lurl);
        }
        
        else {
            
            res.send("Not a valid short URL");
        }
      
         
     })
    
    
})
app.get('/new/*?',function(req,res){
    
     var url_to_shorten = req.params[0];
     checkAndInsert(url_to_shorten,res);
     
     
})
     
   function checkAndInsert(url_to_shorten,res){
       
   
    if(url_to_shorten && validurl.isUri(url_to_shorten)){
       
       
       urlmodel.find({lurl:url_to_shorten},function(err,doc){
           
           if(err)
             return res.send(err);
           if(doc && doc.length){
               console.log("Doc in find"+ doc);
               console.log("ID of doc "+ doc[0]._id);
               console.log("lurl :"+ doc[0].lurl);
               console.log("url_to_shorten : "+url_to_shorten);
              res.status(201).json({"lonvvg_url": url_to_shorten, "hello": "hello","short_url": doc[0]._id});
             //  res.redirect(doc[0].lurl);
           }
           
            else { 
                
                urlmodel.create({lurl : url_to_shorten}, function(err,myurl){
           
           
           if(err)
           return(res.send());
    
           console.log("ERR" + err);
           console.log("URL"+ myurl._id);
          // res.end("yes");
           res.status(201).json({"long_url":url_to_shorten, "short_url": myurl._id});
          // res.send();
       })
    }
       
       
   })
   
   

    
   }

    
}

function handleError(res, err) {
  return res.status(500).send(err);
}

app.listen(process.env.PORT||8080,function(req,res){
    console.log('Server started at 8080');
})

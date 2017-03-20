var mongoose = require('mongoose');
var schema = mongoose.Schema;

var counterSchema = schema({
    
    _id:{type:String, required :true},
    seq : {type: Number, default : 0}
})

var counter = mongoose.model('counters', counterSchema);
var urlSchema = new schema({
    
    _id : {type : Number, index:true},
    lurl : String
   // created_date :  Date
    
})



urlSchema.pre('save', function(next){
    
    
    var doc = this;
    counter.findByIdAndUpdate({_id:'url_count'}, { $inc :{seq : 1 }}, function(err,counter){
        
        if(err)
         return next(err);
         
         console.log("Inside func");
         console.log(counter + "counter")
         doc._id = counter.seq;
        // this.created_date = new Date();
         next();
    })
    
    
})


var url = mongoose.model('url', urlSchema,'url');

module.exports = url;
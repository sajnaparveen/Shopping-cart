const mongoose=require('mongoose');
const crypto=require('crypto');
const { string } = require('joi');



const mobileShema=new mongoose.Schema({
    uuid: {type: String, required:false}, 
    productName:{type:String,required:true},
    Description:{type:String,required:true},
    Price:{type:String,required:true},
    quantity:{type:String,required:true},
    userUuid:{type:String,required:true}
},{
    timestamps:true
});

mobileShema.pre('save',function(next){
    this.uuid = 'PROD-'+crypto.pseudoRandomBytes(6).toString('hex').toString()
    next()
})

module.exports=mongoose.model('mobile',mobileShema,'mobile');
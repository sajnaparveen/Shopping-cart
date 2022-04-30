const joi = require('joi');


//userjoischema
const userJoiSchema = joi.object({
     firstName:joi.string().required(),
     lastName:joi.string().required(),
    userName:joi.string().pattern(new RegExp(/^[A-Za-z]+[0-9]+$/)).min(4).max(20).required(), 
    email:joi.string().pattern(new RegExp(/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/)).required(),
    mobileNumber:joi.string().length(10).pattern(new RegExp(/^[0-9]+$/)).required(),
     password:joi.string().min(6).required(),
    //  role:joi.string().required()
});

module.exports= {
    userJoiSchema
}
const express=require('express');
const cors=require('cors');
const mongoose=require('mongoose');
require('dotenv').config();
const axios=require('axios');
const userRouter=require('./routes/user.route')
const mobileRouter=require('./routes/mobile.route')
const cartRouter=require('./routes/cart');
const { render } = require('express/lib/response');
const { baseModelName } = require('./model/user.model');
const bodyParser=require('body-parser')
const mobileSchema=require('./model/mobile.model')
const port=process.env.port || 7000;
const categorySchema=require('./model/category.model')
const app=express();
app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.json())
app.set("view engine","ejs") 
app.use(express.static('./img'))
// app.use(express.static(__dirname + '/img'));
app.get("/signup",(req,res)=>{

    res.render("signup.ejs")

})
app.get("/news",(req,res)=>{

    res.render("newspaper.ejs")

})
app.get("/login",(req,res)=>{
    res.render("loginpage.ejs")
})

//  let ary = [{off:"50",name:"bala",desc:"aarifa",price:"10",img:"card4.png"},{off:"50",name:"bala",desc:"aarifa",price:"10",img:"card2.png"},{off:"50",name:"bala",desc:"aarifa",price:"10",img:"card3.png"},{off:"50",name:"bala",desc:"aarifa",price:"10",img:"card5.png"},{off:"50",name:"bala",desc:"aarifa",price:"10",img:"card7.png"},{off:"50",name:"bala",desc:"aarifa",price:"10",img:"card6.png"}] 
let productDetails={}
 click=async (uuid)=>{
   
    productDetails =await  mobileSchema.find({categoryUuid:uuid}).exec();
    console.log("details",uuid)
}

app.get("/",async(req,res)=>{
    //  mobileSchema.find({},function(err,data){
    //      res.render("home.ejs",{productList:data})
    // })                                                    
    // productDetails =await  mobileSchema.find().exec();
 
 let categoryDetails =await  categorySchema.find().exec();


    res.render("home.ejs",{productDetails:productDetails,categoryDetails:categoryDetails})
})



//  app.get("/",(req,res)=>{
//       mobileSchema.find({},function(err,productDetails){
//           if(err){
//             console.log(err);
//           }else{
//               categorySchema.find({},function(err,categoryDetails){
//                   if(err){
//                     console.log(err);
//                   }
//                   else{
//                     res.render("home.ejs",{productDetails,categoryDetails})
//                   }
//                 })
        
//           }
//  })
// })
mongoose.connect(process.env.dburl,{
    useNewUrlParser: true,
    useUnifiedTopology: true
    
}).then(data=>{
    console.log("database connected");
}).catch(err=>{
    console.log(err.message);
    process.exit(1);
})

app.use('/api/v1/user',userRouter);
app.use('/api/v2/mobile',mobileRouter);
app.use('/api/v3/cart',cartRouter);




app.listen(port, ()=>{
    console.log(`http://127.0.0.1:${port}`)
});
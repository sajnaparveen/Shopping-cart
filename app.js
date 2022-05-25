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
app.get("/login",(req,res)=>{
    res.render("loginpage.ejs")
})

 let ary = [{off:"50",name:"bala",desc:"aarifa",price:"10",img:"card4.png"},{off:"50",name:"bala",desc:"aarifa",price:"10",img:"card2.png"},{off:"50",name:"bala",desc:"aarifa",price:"10",img:"card3.png"},{off:"50",name:"bala",desc:"aarifa",price:"10",img:"card5.png"},{off:"50",name:"bala",desc:"aarifa",price:"10",img:"card7.png"},{off:"50",name:"bala",desc:"aarifa",price:"10",img:"card6.png"}] 

app.get("/",(req,res)=>{
    
    res.render("home.ejs",{ary})
})



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
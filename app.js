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

const port=process.env.port || 7000;

const app=express();
app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.json())
app.set("view engine","ejs") 
app.get("/signup",(req,res)=>{

    res.render("signup.ejs")

})
app.get("/test",(req,res)=>{

    res.render("test.ejs")

})
app.get("/login",(req,res)=>{
    res.render("loginpage.ejs")
})
app.get("/",(req,res)=>{
    res.render("home.ejs")
})
// axios.get(`http://localhost:7000/api/v1/user/signupPage`).then(res=>{

//     console.log(res.data)
// }).catch(error=>{
//     console.log(error)
// })
// home=()=>{

// }
//}

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
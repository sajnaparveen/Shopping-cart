const express=require('express');
const cors=require('cors');
const mongoose=require('mongoose');
require('dotenv').config();

const userRouter=require('./routes/user.route')
const mobileRouter=require('./routes/mobile.route')
const cartRouter=require('./routes/cart')
const orderRouter=require('./routes/order')
const port=process.env.port || 7000;

const app=express();
app.use(cors());
app.use(express.json())

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
app.use('/api/v3/cart',cartRouter)
app.use('/api/v4/orderitems',orderRouter)

app.listen(port, ()=>{
    console.log(`http://127.0.0.1:${port}`)
});
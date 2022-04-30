const express=require('express');
const cors=require('cors');
const mongoose=require('mongoose');
require('dotenv').config();

const userRouter=require('./routes/user.route')
const mobileRouter=require('./routes/mobile.route')
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

app.listen(port, ()=>{
    console.log(`http://127.0.0.1:${port}`)
});
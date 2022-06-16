const router = require('express').Router();
const moment = require('moment');
const userschema = require('../model/user.model');
const mobileShema = require('../model/mobile.model');
const { authVerify, isAdmin,isUser } = require("../middleware/auth");
const { response } = require('express');
const categorySchema=require('../model/category.model')

const multer = require('multer');
const xlsx = require('xlsx');

const store = require("../middleware/multer");
const path =require('path');
const upload = multer({storage : store.storage});


router.post('/add', isAdmin, async (req, res) => {
    try {
        const data = new mobileShema(req.body);
        const result = await data.save();
        return res.status(200).json({ 'status': 'success', "message": " successfully added", "result": result })
    } catch (error) {
        console.log(error.message);
        return res.status(400).json({ "status": 'failure', 'message': error.message })
    }
});
// get all product 
router.get("/get", async(req,res)=>{
    try{
        const productDetails = await mobileShema.find().exec();
        if(productDetails.length > 0){
            return res.status(200).json({'status': 'success', message: "Product details fetched successfully", 'result': productDetails});
        }else{
            return res.status(404).json({'status': 'failure', message: "No Product details available",result:productDetails})
        }
    }catch(error){
        console.log(error.message);
        return res.status(400).json({"status": 'failure', 'message': error.message})
    }
});

// get individual product details
router.get("/getIndiProd", authVerify, async(req,res)=>{
    try {
        const productDetails = await mobileShema.findOne({"uuid" : req.query.product_uuid}).exec();
        if(productDetails){
            return res.status(200).json({'status': 'success', message: "Product details fetched successfully", 'result': productDetails});
        }else{
            return res.status(404).json({'status': 'failure', message: "No Product details available"})
        }
    } catch (error) {
        console.log(error.message);
        return res.status(400).json({"status": 'failure', 'message': error.message})
    }
});


router.get("/getcategory", async(req,res)=>{
    try{
        const productDetails = await categorySchema.find().exec();
        if(productDetails.length > 0){
            return res.status(200).json({'status': 'success', message: "Product details fetched successfully", 'result': productDetails});
        }else{
            return res.status(404).json({'status': 'failure', message: "No Product details available",result:productDetails})
        }
    }catch(error){
        console.log(error.message);
        return res.status(400).json({"status": 'failure', 'message': error.message})
    }
});
router.post('/addCategory', isAdmin, async(req,res)=>{
    try{
        const data = new categorySchema(req.body);
        const result = await data.save()
        return res.status(200).json({status: "success", message: 'category added successfully', result: result})
    }catch(error){
        console.log(error.message);
        return res.status(400).json({"status": 'failure', 'message': error.message})
    }
})
router.put("/update", isAdmin, async (req, res) => {
    try {
        let condition = { "uuid": req.body.uuid }
        let updateData = req.body.updateData;
        let option = { new: true }
        const data = await mobileShema.findOneAndUpdate(condition, updateData, option).exec();
        return res.status(200).json({ 'status': 'success', message: "  successfully updated", 'result': data });
    } catch (error) {
        console.log(error.message);
        return res.status(400).json({ "status": 'failure', 'message': error.message })
    }
});
router.delete("/delete/:product_uuid", isAdmin, async (req, res) => {
    try {
        console.log(req.params.product_uuid)
        await mobileShema.findOneAndDelete({ uuid: req.params.product_uuid }).exec();
        return res.status(200).json({ 'status': 'success', message: "successfully deleted" });
    } catch (error) {
        console.log(error.message);
        return res.status(400).json({ "status": 'failure', 'message': error.message })
    }
})



router.get('/categoryBassedItem',async(req,res)=>{
    try{
        const details =  await categorySchema.aggregate([
            {
                $lookup:{
                    from : 'products',
                    localField : 'uuid',
                    foreignField : 'categoryUuid',
                    as:'product_details'
                },      
                
            },
            {
                $lookup:{
                    from:'users',
                    localField:'userUuid',
                    foreignField:'uuid',
                    as:'user_deatils'
                }
            },
            {
                $project:{
                    "_id":0,
                    "userUuid":0,
                    "createdAt":0,
                    "updatedAt":0,
                    "__v":0
                }
            },
            {
                $sort:{category:-1}
            },
        ])
    if(details.length>0){
        res.json.status(200)({status:'success',message:'category bassed all items fetched successfully!','result':details})
    }else{
        res.json.status(200)({status:'failure',message:"product details not available"})
    }
}catch(error){
    console.log(error.message);
    return res.status(500).json({"status": 'failure', 'message': error.message})
}
})
router.get("/listingpage", async (req, res) => {
    try {
        let mobileDetails = await userschema.aggregate([
            {
                $match: {
                    $and: [
                        { "uuid": req.query.userUuid }
                    ]
                }
            },
            {
                '$lookup': {
                    from: 'mobile',
                    localField: 'uuid',
                    foreignField: 'userUuid',
                    as: 'mobileDetails'
                }
            },
            {
                '$unwind': {
                    path: '$mobileDetails',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    "_id": 0,
                    "userName": 1,
                    "mobileDetails.productName": 1,
                }
            },
            {
                $skip: parseInt(req.query.skip),
            },
            {
                $limit: parseInt(req.query.limit)
            }
        ])
        if (mobileDetails.length > 0) {
            return res.status(200).json({ 'status': 'success', message: "Product details fetched successfully", 'result': mobileDetails });
        } else {
            return res.status(404).json({ 'status': 'failure', message: "No Product details available" })
        }
    } catch (error) {
        return res.status(400).json({ "status": 'failure', 'message': error.message })
    }
})

router.get("/searchproduct/:key", async (req, res) => {
    console.log(JSON.stringify( req.params.key))
    try {
        let data = await mobileShema.find({
            "$or": [
                { productName: { $regex: req.params.key, $options:"i"} }
            ]
        })
        // res.send(data)
        if (data.length > 0) {
           
            return res.status(200).json({ 'status': 'success', message: "Product details fetched successfully", 'result': data });
        } else {
            return res.status(404).json({ 'status': 'failure', message: "No Product details available" })
        }
    } catch (error) {
        return res.status(200).json({ "status": "failure", "message": error.message })
    }
})

router.get("/filteritembyprice",async(req,res)=>{
    try{

        
        const startprice=req.query.startprice;
        const endprice=req.query.endprice;
        console.log(req.query)
        
      const filterprice={
        Price:{$gte:parseInt(startprice), $lte:parseInt(endprice)}
       
      }

    
      const product=await mobileShema.find(filterprice)
     
     console.log("mobile",product)
     if(product){
        
        return res.status(200).json({"status": 'true', 'message': product})
     }else{
        return res.status(400).json({"status": 'failure',message:"no products available in this price"})
     }

    }catch(error){
        console.log(error.message);
        return res.status(400).json({"status": 'failure', 'message': error.message})
    }
})

// // read bulkdata and upload bulk data in db
// router.post("/bulk-upload",upload.single('file'), async(req,res)=>{
//     try {
//         let path = './uploads/'+ req.file.filename;
//         console.log("path=", path)
//         let datas = xlsx.readFile(path);
//         console.log("data",datas)
//         let sheetname = datas.SheetNames
//         console.log("sheetname=", sheetname)
//         console.log("_".repeat(100))
//         let resultdata = xlsx.utils.sheet_to_json(datas.Sheets[sheetname[0]]);
//         console.log(resultdata)
        
//          for (let i = 0; i < resultdata; i++) {
//             console.log("i =",i)
//        const findData=await mobileShema.findOne({productName:i.productName})
//        if(findData){
//            updateData=await mobileShema.findOneAndUpdate({productName:i.productName},{quantity:findData.quantity+i.quantity},{new:true})
//            console.log("product already exist")
//        }else{
//         const data = new mobileShema(i);
//         const result = await data.save();
//         console.log("result",result)
//     }
//           }
//         return res.status(200).json({"status":"success","message":" upload process completed"})
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({status: "failure", message: error.message}) 
//     }
// })
        
router.post("/bulk-upload",upload.array('file',4), async(req,res)=>{
    try {
        console.log("request",req.files)
        let path = './uploads/'+ req.files[1].filename;
        console.log("path=", path)
        let datas = xlsx.readFile(path);
        let sheetname = datas.SheetNames
        console.log("sheetname=", sheetname)
        console.log("_".repeat(100))
        let resultdata = xlsx.utils.sheet_to_json(datas.Sheets[sheetname[0]]);
        //console.log(resultdata)
        console.log("".repeat(100))
        for(let x of resultdata){
            //console.log(x)
            console.log("".repeat(100))
            const finddata = await mobileShema.findOne({productName:x.productName})
            if(finddata){
                updatedata = await mobileShema.findOneAndUpdate({productName:x.productName},{quantity:finddata.quantity+x.quantity},{new:true})
                //console.log("product already exist")
            }else{
            const data = new mobileShema(x);
            const result = await data.save();
            console.log(result)
        }
         }
        return res.status(200).json({"status":"success","message":" upload process completed"})
    } catch (error) {
        console.log(error);
        return res.status(500).json({status: "failure", message: error.message}) 
    }
})


router.get('/get-product',async(req,res)=>{
    try{
        console.log("gvuyyu",req.query)
        const cat_id = req.query.cat_id
        const items = await mobileShema.find({categoryUuid:cat_id}).exec()
        console.log(items)
        if(items.length !== 0){
            console.log("success");
            res.json({status:"success",'result':items})
        }else{
            res.json({status:'failure',message:'This product not avalible!'})
        }

    }catch(err){
        res.json({"error":err.message})
    }
})

module.exports = router;
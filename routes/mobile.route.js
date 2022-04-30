const router = require('express').Router();
const moment = require('moment');
const userschema = require('../model/user.model');
const mobileShema = require('../model/mobile.model');
const { authVerify, isAdmin } = require("../middleware/auth");
const { response } = require('express');


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
    try {
        let data = await mobileShema.find({
            "$or": [
                { productName: { $regex: req.params.key } }
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

        
        const {startprice,endprice}=req.query;
        console.log(req.query)
        
      const filterprice={
        Price:{$gte:startprice,$lte:endprice}
       
      }

      const product=await mobileShema.find(filterprice)
       
     console.log("mobile",product)
     if(product.length>0){
        return res.status(200).json({"status": 'true', 'message': product})
     }else{
        return res.status(400).json({"status": 'failure',message:"no products available in this price"})
     }

    }catch(error){
        console.log(error.message);
        return res.status(400).json({"status": 'failure', 'message': error.message})
    }
})

module.exports = router;
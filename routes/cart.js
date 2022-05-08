const cart = require("../model/cart");
const router = require("express").Router();
const { authVerify, isAdmin, isUser } = require("../middleware/auth");
//ADD-TO-CART
router.post("/addtocart", async (req, res) => {
  try {
  const order = await cart.find();
  console.log("order",order)
  if(order.length === 0){
    const newCart = new cart(req.body);
    const savedCart = await newCart.save();
    return res.status(200).json({ 'status': 'success', "message": "Order created!", "result": savedCart })
  }else{
    let takenOrder =  order[0].products
  let updateOrder =takenOrder.push(req.body.products);
  console.log("takenOrder",takenOrder)
  console.log("userUuid:order[0].userUuid", order[0].userUuid)
  const findUpdateOrder = await cart.findOneAndUpdate({userUuid:order[0].userUuid},{products:takenOrder},{new:true}).exec();
  console.log("findUpdateOrder",findUpdateOrder)
    return res.status(200).json({ 'status': 'success', "message": "Order Updateds!",result:findUpdateOrder })

  }
   
  } catch (err) {
    res.status(500).json(err);
  }
});                      

//DELETE PRODUCT FROM CART
router.delete("/deletecart", async (req, res) => {
  try {
    const savedCart = await cart.findOneAndDelete({ _id: req.params._id }).exec();
    res.status(200).json({'status': 'success', "message": "product removed from cart" ,"result": savedCart});
  } catch (err) {
    res.status(500).json(err);
  }
});


//UPDATECART
router.put("/update", async (req, res) => {
  try {
    const updatedCart = await cart.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedCart);
  } catch (err) {
    res.status(500).json(err);
  }
});

//ORDERPLACED
router.get('/orderplaced',isUser,async(req,res)=>{
  try{
      const _id = req.body._id
     const data = await cart.find({_id:_id}).exec()
          const address = data.address
      const takeOrder = await cart.findOneAndUpdate({_id:_id},{status:'order placed '},{new:true}).exec()
        console.log("takeOrder",takeOrder)
          res.json({status:'success',message:'your order successfully',result:takeOrder}) 

  }catch(err){
      res.json({'err':err.message})
  }
})
//CANCEL-ORDER
router.get('/cancel',isUser,async(req,res)=>{
  try{
      const _id = req.body._id
     const data= await cart.findOneAndUpdate({userUuid:uuid},{status:'cancelled'},{new:true}).exec()
    
      return res.status(200).json({"status":'success',message:'order is cancelled',result:data}) 
  }catch (error) {
    console.log(error.message);
    return res.status(400).json({ "status": 'failure', 'message': error.message })
}
})
module.exports = router;
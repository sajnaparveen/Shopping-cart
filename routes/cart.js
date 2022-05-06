const cart = require("../model/cart");
const router = require("express").Router();

//CREATE
router.post("/createcart", async (req, res) => {
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
    return res.status(200).json({ 'status': 'success', "message": "Order Updataeds!",result:findUpdateOrder })

  }
   
  } catch (err) {
    res.status(500).json(err);
  }
});                      

//DELETE
router.delete("/deletecart", async (req, res) => {
  try {
    await cart.findOneAndDelete({ _id: req.params._id }).exec();
    res.status(200).json({'status': 'success', "message": "product removed" ,"result": savedCart});
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET ALL
router.get("/getallcart", async (req, res) => {
    try {
      const carts = await cart.find();
      res.status(200).json({'status': 'success',"result":carts});
    } catch (err) {
      res.status(500).json(err);
    }
  });  
module.exports = router;
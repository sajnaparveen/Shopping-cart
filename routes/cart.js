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

// router.post("/placeorder",async (req, res) => {
//   await cart.findById(req.body._id)
//     .then(async cart => {
//     // await cart.findOneAndDelete({ _id: req.params._id }).exec();
//       if (!cart) {
// return res.status(404).json({message: "Product not found"});
//       }
//       const order = new cart({
//         _id: req.body._id
//       });
//       return cart.save();
//     })
//     .then(result => {
//       console.log(result);
//       res.status(200).json({message: "Order placed",
//         request: {
//           type: "GET",
//           url: "http://localhost:7000/cart/" + result
//         }
//       });
//     })
//     .catch(err => {
//       console.log(err);
//       res.status(500).json({error: err});
//     });
// });


//DELETE CART
router.delete("/deletecart", async (req, res) => {
    try {
        console.log(req.params._id)
        await cart.findOneAndDelete({ uuid: req.params._id }).exec();
        return res.status(200).json({ 'status': 'success', message: "Order has been deleted" });
    } catch (error) {
        console.log(error.message);
        return res.status(400).json({ "status": 'failure', 'message': error.message })
    }
})
module.exports = router;
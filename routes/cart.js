const Cart = require("../model/cart");
const router = require("express").Router();
const { authVerify, isAdmin, isUser } = require("../middleware/auth");
const { mailsending } = require("../middleware/mailer");
const userSchema = require("../model/user.model");
//ADD-TO-CART
// router.post("/addtocart", async (req, res) => {
//   try {
//   const order = await cart.find();
//   console.log("order",order)
//   if(order.length === 0){
//     const newCart = new cart(req.body);
//     const savedCart = await newCart.save();
//     return res.status(200).json({ 'status': 'success', "message": "Order created!", "result": savedCart })
//   }else{
//     let takenOrder =  order[0].products
//   let updateOrder =takenOrder.push(req.body.products);
//   console.log("takenOrder",takenOrder)
//   console.log("userUuid:order[0].userUuid", order[0].userUuid)
//   const findUpdateOrder = await cart.findOneAndUpdate({userUuid:order[0].userUuid},{products:takenOrder},{new:true}).exec();
//   console.log("findUpdateOrder",findUpdateOrder)
//     return res.status(200).json({ 'status': 'success', "message": "Order Updateds!",result:findUpdateOrder })

//   }
   
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });                      

// //DELETE PRODUCT FROM CART
// router.delete("/deletecart", async (req, res) => {
//   try {
//     const savedCart = await cart.findOneAndDelete({ _id: req.params._id }).exec();
//     res.status(200).json({'status': 'success', "message": "product removed from cart" ,"result": savedCart});
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });


// //UPDATECART
// router.put("/update", async (req, res) => {
//   try {
//     const updatedCart = await cart.findByIdAndUpdate(
//       req.params.id,
//       {
//         $set: req.body,
//       },
//       { new: true }
//     );
//     res.status(200).json(updatedCart);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

// //ORDERPLACED
// router.get('/orderplaced',isUser,async(req,res)=>{
//   try{
//   //   const email = req.body.email;
//   //  let emailid = await userSchema.findOne({ email:email }).exec();

//   //   const mailData = {
//   //     to: email,
//   //     subject: "ORDER CONFIRMATION",
//   //     text: "order placed successfully",
//   //     details: {
//   //       date: new Date(),
//   //     //  product:req.body.products.product,
//   //       product :req.body.price
//   //     }
//   //   };
 
//       const _id = req.body._id
//      const data = await cart.find({_id:_id}).exec()
         
//        //   let mailRes = mailsending(mailData);
//       const takeOrder = await cart.findOneAndUpdate({_id:_id},{status:'order placed '},{new:true}).exec()
//         console.log("takeOrder",takeOrder)
//           res.json({status:'success',message:'your order successfully',result:takeOrder}) 

//   }catch(err){
//       res.json({'err':err.message})
//   }
// })
// //CANCEL-ORDER
// router.get('/cancel',isUser,async(req,res)=>{
//   try{
//       const _id = req.body._id
//      const data= await cart.findOneAndUpdate({userUuid:uuid},{status:'cancelled'},{new:true}).exec()
    
//       return res.status(200).json({"status":'success',message:'order is cancelled',result:data}) 
//   }catch (error) {
//     console.log(error.message);
//     return res.status(400).json({ "status": 'failure', 'message': error.message })
// }
// })

router.post("/addtocart", async (req, res) => {
  const { productId, quantity, name, price } = req.body;

  const userId = req.body.userId; //TODO: the logged in user id

  try {
    let cart = await Cart.findOne({userId:userId });

    if (cart) {
      //cart exists for user
      let itemIndex = cart.products.findIndex(p => p.productId == productId);

      if (itemIndex > -1) {
        //product exists in the cart, update the quantity
        let productItem = cart.products[itemIndex];
        productItem.quantity = quantity;
        cart.products[itemIndex] = productItem;
      } else {
        //product does not exists in cart, add new item
        cart.products.push({ productId, quantity, name, price });
      }
      cart = await cart.save();
      return res.status(201).send(cart);
    } else {
      //no cart for user, create new cart
      const newCart = await Cart.create({
        userId: userId,
        products: [{ productId, quantity, name, price }]
      });

      return res.status(201).send(newCart);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong");
  }
});
module.exports = router;



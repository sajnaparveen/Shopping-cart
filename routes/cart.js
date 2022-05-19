const cart = require("../model/cart");
const router = require("express").Router();
const { authVerify, isAdmin, isUser } = require("../middleware/auth");
const { mailsending } = require("../middleware/mailer");
const userSchema = require("../model/user.model");
//ADD-TO-CART
router.post("/addtocart", async (req, res) => {
  try {
  const order = await cart.find();
  console.log("order",order)
  if(order.length === 0){
    const newCart = new cart(req.body);
    const savedCart = await newCart.save();
    return res.status(200).json({ 'status': 'success', "message": "product add from cart", "result": savedCart })
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




router.post("/add-to-cart", async (req, res) => {
  const { productUuid, quantity, name, price } = req.body;

  const userUuid = req.body.userUuid; //TODO: the logged in user id

  try {
    let cart = await Cart.findOne({userUuid: userUuid });

    if (cart) {
      //cart exists for user
      let itemIndex = cart.products.findIndex(p => p.productUuid == productUuid);

      if (itemIndex > -1) {
        //product exists in the cart, update the quantity
        let productItem = cart.products[itemIndex];
        productItem.quantity = quantity;
        cart.products[itemIndex] = productItem;
      } else {
        //product does not exists in cart, add new item
        cart.products.push({ productUuid, quantity, name, price });
      }
      cart = await cart.save();
      return res.status(201).send(cart);
    } else {
      //no cart for user, create new cart
      const newCart = await Cart.create({
        userUuid:userUuid,
        products: [{ productUuid, quantity, name, price }]
      });

      return res.status(201).send(newCart);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});
module.exports = router;



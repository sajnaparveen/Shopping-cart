const Order = require("../model/order");
const router = require("express").Router();

// CREATE ORDER 
router.post("/createorder", async (req, res) => {
    const newOrder = new Order(req.body);
  
    try {
      const savedOrder = await newOrder.save();
      return res.status(200).json({ 'status': 'success', "result": savedOrder })
    } catch (err) {
      res.status(500).json(err);
    }
  });


module.exports = router;
const express = require("express");

const {addToCart , updateCartItems , fetchCartItems , deleteCartItems} = require("../../controllers/shop/cart-controller");

const router = express.Router();

router.post("/add" , addToCart);
router.get("/get-cartitems/:userId" , fetchCartItems);
router.put("/update-cartItems" , updateCartItems);
router.delete("/delete-cartItems/:userId/:productId" , deleteCartItems)


module.exports = router;
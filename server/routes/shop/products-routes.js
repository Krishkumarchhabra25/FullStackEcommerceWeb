const express = require("express");

const {
  getFilterProducts,
  getProductsDetails
} = require("../../controllers/shop/products-controller");

const router = express.Router();

router.get("/filter-products", getFilterProducts);
router.get("/product-details/:id", getProductsDetails);
module.exports = router;

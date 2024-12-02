const express = require('express');

const {handleImageUpload , addProduct ,fetchAllProducts , deleteProducts , editProducts} = require('../../controllers/admin/products-controller');

const {upload} = require('../../helpers/cloudinary')

const router = express.Router();

router.post('/upload-image' , upload, handleImageUpload);

router.post('/add-product' , addProduct);
router.put('/edit-product/:id' , editProducts);
router.delete('/delete-product/:id' , deleteProducts);
router.get('/all-product' , fetchAllProducts);
module.exports = router;
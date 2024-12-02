const { ImageUploadUtil } = require("../../helpers/cloudinary");
const Products = require("../../models/Products");


const handleImageUpload = async(req, res)=>{
    try {
        const b64 = Buffer.from(req.file.buffer).toString("base64");
        const url = "data:" + req.file.mimetype + ";base64," + b64;
        const result = await ImageUploadUtil(url);
        res.json({
            success: true,
            result,
        })
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
        message: "Error occurred",
        error: error.message  // Sends the error message for debugging
        })
    }
};

// Add a new Product
const addProduct = async(req, res)=>{
    try {
        const {image, title , description, category , brand , price , salePrice , totalStocks} = req.body;

        const newlyCreatedProducts = new Products({
            image, title , description, category , brand , price , salePrice , totalStocks  
        });

        await newlyCreatedProducts.save();
        res.status(201).json({
            success: true , 
            data: newlyCreatedProducts
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false , 
            message: 'Error occured'
        })
    }
}
// Fetch all Products
const fetchAllProducts = async(req, res)=>{
    try {
        const listofProducts = await Products.find({});
        res.status(200).json({
            success: true , 
            message: listofProducts
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false , 
            message: 'Error occured'
        })
    }
}
// Edit a products
const editProducts = async (req, res) => {
    try {
      const { id } = req.params;
      const { image, title, description, category, brand, price, salePrice, totalStock } = req.body;
  
      console.log("ID:", id);
      console.log("Request Body:", req.body);
  
      let findProducts = await Products.findById(id);
      if (!findProducts) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }
  
      // Update fields
      findProducts.title = title || findProducts.title;
      findProducts.description = description || findProducts.description;
      findProducts.category = category || findProducts.category;
      findProducts.brand = brand || findProducts.brand;
      findProducts.price = price === '' ? 0 : price || findProducts.price;
      findProducts.salePrice = salePrice === '' ? 0 : salePrice || findProducts.salePrice;
      findProducts.totalStock = totalStock || findProducts.totalStock;
      findProducts.image = image || findProducts.image;
  
      await findProducts.save();
      res.status(200).json({ success: true, data: findProducts });
    } catch (error) {
      console.error("Error in editProducts:", error);
      res.status(500).json({ success: false, message: 'Error occurred' });
    }
  };
  
//delete a products
const deleteProducts = async(req, res)=>{
    try {
        const {id} = req.params
        const product = await Products.findByIdAndDelete(id);

        if(!product) return res.status(404).json({
            success: false , 
            message: 'Product not found'
        });

        res.status(200).json({
            success: true , 
            message: 'Product deleted successfully'
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false , 
            message: 'Error occured'
        })
    }
}  


module.exports = {handleImageUpload , addProduct ,editProducts , deleteProducts , fetchAllProducts}
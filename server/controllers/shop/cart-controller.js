const Cart = require("../../models/Cart")
const Product = require("../../models/Products");


const addToCart = async(req, res)=>{
    try {
        
        const {userId , productId , quantity}= req.body;
        console.log("Received Request Body:", req.body);
        if (!userId || !productId || !quantity) {
            return res.status(400).json({ success: false, message: "Invalid data provided" });
        }
        

        const product = await Product.findById(productId);

        if(!product){
           return res.status(404).json({
              success: false ,
              message: "Product not found "
           }) 
        }

        let cart = await Cart.findOne({userId});

        if(!cart){
            cart = new Cart({userId , items:[]})
        }

        const findCurrentProductIndex = cart.items.findIndex(item => item.productId.toString() === productId)

        if(findCurrentProductIndex === -1){
            cart.items.push({productId , quantity})
        }else{
            cart.items[findCurrentProductIndex].quantity += quantity
        }

        await cart.save();
        res.status(200).json({
            success: true,
           data: cart
        });


    } catch (error ) { 
         console.log(error);
         res.status(500).json({
            success: false ,
            message: "Error occured"
         })
 } 
}

const fetchCartItems = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(404).json({
                success: false,
                message: "User id is mandatory"
            });
        }

        // Find the cart and populate the productId details
        const cart = await Cart.findOne({ userId }).populate({
            path: 'items.productId', // Populate the productId field to get product data
            select: 'image title price salePrice' // Select relevant fields from the product
        });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found!"
            });
        }

        // Filter out invalid items
        const validItems = cart.items.filter(productItems => productItems.productId);

        if (validItems.length < cart.items.length) {
            cart.items = validItems;
            await cart.save();
        }

        // Populate the items array with necessary data, including quantity
        const populateCartItems = validItems.map(item => ({
            productId: item.productId._id, // Accessing the productId field from populated data
            image: item.productId.image,
            title: item.productId.title,
            price: item.productId.price,
            quantity: item.quantity, // Accessing the quantity directly from the item
        }));

        res.status(200).json({
            success: true,
            data: {
                ...cart._doc, // Spread the rest of the cart data
                items: populateCartItems // Add populated items to the response
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error occurred"
        });
    }
};


const updateCartItems = async(req, res)=>{
    try {
        const {userId , productId , quantity}= req.body;

        if(!userId || productId || quantity){
            return res.status(400).json({success: false , message: "Invalid data provided"})
        }

        const cart = await Cart.findOne({userId});

        if(!cart){
            return res.status(404).json({
                success: false,
                message: "Cart not found!"
            });
        }
        const findCurrentProductIndex = cart.items.findIndex(item=> item.productId.toString === productId);

        if(findCurrentProductIndex === -1){
            return res.status(404).json({
                success: false ,
                message: "Cart item not present !"
            })
        }

        cart.items[findCurrentProductIndex].quantity = quantity
        await cart.save();

        await cart.populate({
            path: `items.productId`,
            select: `image title price salePrice`
        })

        const populateCartItems = cart.items.map(item => ({
            productId: item.productId ? item.productId._id : null,
            image: item.productId ?  item.productId.image : null,
            title: item.productId ?  item.productId.title : "Product nt found",
            price: item.productId ?  item.productId.price : null,
            quantity: item.quantity  ? item.productId.quantity : null,

        }));

        res.status(200).json({
            success: true ,
            data: {
                ...cart._doc,
                items: populateCartItems
            }
        })

    } catch (error) {
         console.log(error);
         res.status(500).json({
            success: false ,
            message: "Error occured"
         })
 } 
}

const deleteCartItems = async(req, res)=>{
    try {
        
        const {userId , productId} = req.params;
        if(!userId || productId || quantity){
            return res.status(400).json({success: false , message: "Invalid data provided"})
        }

        const cart = await Cart.findOne({userId}).populate({
              path: `items.productId`,
            select: `image title price salePrice`
        });

        if(!cart){
            return res.status(404).json({
                success: false,
                message: "Cart not found!"
            });
        }
        cart.items = cart.items.filter(item => item.productId._id.toString() !== productId);

        await cart.save();


        Cart.populate({
            path: `items.productId`,
          select: `image title price salePrice`
      });
     
      const populateCartItems = cart.items.map(item => ({
        productId: item.productId ? item.productId._id : null,
        image: item.productId ?  item.productId.image : null,
        title: item.productId ?  item.productId.title : "Product nt found",
        price: item.productId ?  item.productId.price : null,
        quantity: item.productId  ? item.productId.quantity : null,

    }));

    res.status(200).json({
        success: true ,
        data: {
            ...cart._doc,
            items: populateCartItems
        }
    })
    } catch (error) {
         console.log(error);
         res.status(500).json({
            success: false ,
            message: "Error occured"
         })
  } 
}

module.exports ={addToCart , fetchCartItems, updateCartItems , deleteCartItems}
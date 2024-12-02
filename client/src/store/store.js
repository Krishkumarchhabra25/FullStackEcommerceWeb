import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./auth-slice";
import adminProductsSlice from  "./admin/products-slice"
import ShopProductSlice from "./shop/product-slice"
import ShopCartSlice from "./shop/cart-slice"
const store = configureStore({
    reducer:{
        auth: authReducer,
        adminProducts: adminProductsSlice,
        shopProducts: ShopProductSlice,
        cart: ShopCartSlice
    },
});

export default store;
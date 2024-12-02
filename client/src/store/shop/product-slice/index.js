import { createSlice , createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";

const initialState ={
    isLoading: false , 
    productList: [], 
    productDetails: null
}

export const fetchFilteredProducts = createAsyncThunk('/products/fetchAllProducts' , async ({filterParams , sortParams})=>{
    const query = new URLSearchParams({
        ...filterParams,
        sortBy: sortParams
    })
    const result = await axios.get(`http://localhost:5000/api/shop/products/filter-products?${query}`);
      return result?.data
  }
  );

  export const fetchProductsDetails = createAsyncThunk('/products/fetchProductDetails' , async (id)=>{

    const result = await axios.get(`http://localhost:5000/api/shop/products/product-details/${id}`);
      return result?.data
  }
  );

const ShopProductSlice = createSlice({
    name: 'shoppingProducts',
    initialState ,
    reducers: {} , 
    extraReducers : (builder) => {
       builder.addCase(fetchFilteredProducts.pending ,(state, action)=> {
          state.isLoading = true
       }).addCase(fetchFilteredProducts.fulfilled ,(state, action)=> {
        console.log(action.payload)
        state.isLoading = false
        state.productList = action.payload.data
     }).addCase(fetchFilteredProducts.rejected ,(state, action)=> {
        state.isLoading = false
        state.productList = []
     })
     .addCase(fetchProductsDetails.pending ,(state, action)=> {
        state.isLoading = true
     }).addCase(fetchProductsDetails.fulfilled ,(state, action)=> {
      console.log(action.payload)
      state.isLoading = false
      state.productDetails = action.payload.data
   }).addCase(fetchProductsDetails.rejected ,(state, action)=> {
      state.isLoading = false
      state.productDetails = null
   })
    }
})

export default ShopProductSlice.reducer;
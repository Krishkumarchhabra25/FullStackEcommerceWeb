import { createSlice , createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";



const initialState = {
  cartItems: [],
  isLoading: false,
};

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ userId, productId, quantity }, { rejectWithValue }) => {
      try {
          const response = await axios.post("http://localhost:5000/api/shop/cart/add", {
              userId,
              productId,
              quantity,
          });
          return response.data;
      } catch (error) {
          console.error("Axios Error:", error.response?.data || error.message);
          return rejectWithValue(error.response?.data || error.message);
      }
  }
);


export const getCartItems = createAsyncThunk(
  "cart/getCartItems",
  async (userId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/shop/cart/get-cartitems/${userId}`
      );
      console.log("API Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching cart items:", error);
      throw error;
    }
  }
  
);


export const editCartItems = createAsyncThunk(
  "cart/editcartItems",
  async ({ userId, productId, quantity }) => {
    const response = await axios.put(
      "http://localhost:5000/api/shop/cart/update-cartItems",
      {
        userId,
        productId,
        quantity,
      }
    );
    return response.data;
  }
);

export const deleteCartItems = createAsyncThunk(
  "cart/deleteCartItems",
  async ({ userId, productId }) => {
    const response = await axios.delete(
      `http://localhost:5000/api/shop/cart/delete-cartItems/${userId}/${productId}`,
      {
        userId,
        productId,
      }
    );
    return response.data;
  }
);

const shoppingCartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data;
      })
      .addCase(addToCart.rejected, (state , action) => {
        console.log("addcnsleredux",action)
        state.isLoading = false;
        state.cartItems = [];
        state.error = action.payload || action.error.message;
      })


      .addCase(getCartItems.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCartItems.fulfilled, (state, action) => {
        state.isLoading = false;
        console.log("actionconsole.", action)
        state.cartItems = action.payload.data;
      })
      .addCase(getCartItems.rejected, (state) => {
        state.isLoading = false;
        state.cartItems = [];
      })

      .addCase(editCartItems.pending, (state) => {
        state.isLoading = true;
      })
    
      .addCase(editCartItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data;
      })


      .addCase(deleteCartItems.pending, (state) => {
        state.isLoading = false;
        state.cartItems = [];
      })
      .addCase(deleteCartItems.fulfilled, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteCartItems.rejected, (state) => {
        state.isLoading = true;
      })


     
  },
});

export default shoppingCartSlice.reducer;
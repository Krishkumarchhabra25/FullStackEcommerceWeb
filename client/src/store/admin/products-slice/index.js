import {createAsyncThunk, createSlice} from "@reduxjs/toolkit"
import axios from "axios";


const initialState ={
    isLoading: false,
    productList: []
}

export const addNewProduct = createAsyncThunk('/products/addnewproducts' , async (formData)=>{
  const result = await axios.post("http://localhost:5000/api/admin/products/add-product" , formData,
    {
        headers: {
            "Content-Type": "application/json",
        }
    });
    return result?.data
}
);

export const fetchAllProducts = createAsyncThunk('/products/fetchAllProducts' , async ()=>{
    const result = await axios.get("http://localhost:5000/api/admin/products/all-product");
      return result?.data
  }
  );

  export const editProduct = createAsyncThunk(
    '/products/editproducts',
    async ({ id, formData }) => {
      const result = await axios.put(
        `http://localhost:5000/api/admin/products/edit-product/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return result?.data;
    }
  );
  

  export const deleteProduct = createAsyncThunk('/products/deleteproducts' , async (id ,formData)=>{
    const result = await axios.delete(`http://localhost:5000/api/admin/products/delete-product/${id}` , formData,
      {
          headers: {
              "Content-Type": "application/json",
          }
      });
      return result?.data
  }
  );


const AdminProductsSlice = createSlice({
    name: 'adminProducts',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder.addCase(fetchAllProducts.pending, (state)=>{
        state.isLoading = true
      }).addCase(fetchAllProducts.fulfilled, (state, action) => {
        console.log(action.payload.message); // Check that this logs the array of products
        state.isLoading = false;
        state.productList = action.payload.message; // Assign only the products array
      }).addCase(fetchAllProducts.rejected,(state)=>{
        state.isLoading = false
        state.productList = []
      })
    },
});

export default AdminProductsSlice.reducer;
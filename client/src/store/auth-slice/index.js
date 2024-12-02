import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";


const initialState = {
    isAuthenticated: false,
    isLoading: true,
    user: null,
  };

export const resgisterUserAction = createAsyncThunk(
  "/auth/register",
  async (formData) => {
    const response = await axios.post(
      "http://localhost:5000/api/auth/register",
      formData,
      {
        withCredentials: true,
      }
    );
    return response.data;
  }
);

export const loginUserAction = createAsyncThunk(
  "/auth/login",
  async (formData) => {
    const response = await axios.post(
      "http://localhost:5000/api/auth/login",
      formData,
      {
        withCredentials: true,
      }
    );
    return response.data;
  }
);

export const logoutOutUserAction = createAsyncThunk(
  "/auth/logout",
  async () => {
    const response = await axios.post(
      "http://localhost:5000/api/auth/logout",{},
      
      {
        withCredentials: true,
      }
    );
    return response.data;
  }
);

export const checkAuthUserAction = createAsyncThunk(
  "/auth/check-auth",
  async () => {
    const response = await axios.get(
      "http://localhost:5000/api/auth/check-auth",
      {
        withCredentials: true,
        headers: {
          'Cache-Control' : 'no-store , no-cache , must-revalidate , proxy-revalidate',
        
        }
      }
    );
    return response.data;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {},
  },
  extraReducers:(builder)=>{
    builder

    //RegistratinAddCase
    .addCase(resgisterUserAction.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(resgisterUserAction.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = null;
      state.isAuthenticated = false;
    })
    .addCase(resgisterUserAction.rejected, (state, action) => {
      state.isLoading = false;
      state.user = null;
      state.isAuthenticated = false;
    })
    //LoginUserAddCase
    .addCase(loginUserAction.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(loginUserAction.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload.success ? action.payload.user : null;
      state.isAuthenticated = action.payload.success;
    })
    .addCase(loginUserAction.rejected, (state, action) => {
      state.isLoading = false;
      state.user = null;
      state.isAuthenticated = false;
    })
   //MiddlewareAddCase
    .addCase(checkAuthUserAction.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(checkAuthUserAction.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload.success ? action.payload.user : null;
      state.isAuthenticated = action.payload.success;
    })
    .addCase(checkAuthUserAction.rejected, (state, action) => {
      state.isLoading = false;
      state.user = null;
      state.isAuthenticated = false;
    })
    .addCase(logoutOutUserAction.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = null;
      state.isAuthenticated = false;
    })
  }
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;

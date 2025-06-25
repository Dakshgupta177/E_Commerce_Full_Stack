import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: null,
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    getProducts: (state, action) => {
      state.products = action.payload.products;
    },
  },
});

export const { getProducts } = productSlice.actions;
export default productSlice.reducer;
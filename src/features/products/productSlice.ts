import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type{ Product } from "../../types";

interface ProductState {
  products: Product[];
}

const initialState: ProductState = {
  products: [],
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
    },
  },
});

export const { setProducts } = productSlice.actions;
export default productSlice.reducer;
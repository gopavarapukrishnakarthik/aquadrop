import { createSlice} from "@reduxjs/toolkit";
import type { CartItemType, Product } from "../../types";
import type { PayloadAction } from '@reduxjs/toolkit'

interface CartState {
  items: CartItemType[];
  totalAmount: number;
}

const initialState: CartState = {
  items: [],
  totalAmount: 0,
};

const calculateTotal = (items: CartItemType[]) =>
  items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({
          ...action.payload,
          quantity: 1,
        });
      }

      state.totalAmount = calculateTotal(state.items);
    },

    removeFromCart: (
      state,
      action: PayloadAction<string>
    ) => {
      state.items = state.items.filter(
        (item) => item.id !== action.payload
      );

      state.totalAmount = calculateTotal(state.items);
    },

    clearCart: (state) => {
      state.items = [];
      state.totalAmount = 0;
    },

    updateQuantity: (
      state,
      action: PayloadAction<{
        id: string;
        quantity: number;
      }>
    ) => {
      const item = state.items.find(
        (i) => i.id === action.payload.id
      );

      if (item) {
        item.quantity = action.payload.quantity;
      }

      state.totalAmount = calculateTotal(state.items);
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  clearCart,
  updateQuantity,
} = cartSlice.actions;

export default cartSlice.reducer;
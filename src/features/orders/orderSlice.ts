import { createSlice } from "@reduxjs/toolkit";
import type { Order, OrderStatus } from "../../types";
import type { PayloadAction } from '@reduxjs/toolkit'


interface OrderState {
  orders: Order[];
}

const initialState: OrderState = {
  orders: [],
};

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    placeOrder: (state, action: PayloadAction<Order>) => {
      state.orders.unshift(action.payload);
    },

    updateOrderStatus: (
      state,
      action: PayloadAction<{
        orderId: string;
        status: OrderStatus;
      }>
    ) => {
      const order = state.orders.find(
        (o) => o.id === action.payload.orderId
      );

      if (order) {
        order.status = action.payload.status;
      }
    },
  },
});

export const {
  placeOrder,
  updateOrderStatus,
} = orderSlice.actions;

export default orderSlice.reducer;
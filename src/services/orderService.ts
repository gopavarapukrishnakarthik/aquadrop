// src/services/orderService.ts

import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

export const fetchOrders = async () => {
  const snapshot = await getDocs(collection(db, "orders"));

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const getTotalSales = (orders: any[]) => {
  return orders.reduce(
    (sum, order) => sum + order.total,
    0
  );
};

export const getCompletedOrders = (orders: any[]) => {
  return orders.filter(
    (order) => order.status === "Completed"
  ).length;
};

export const getPendingOrders = (orders: any[]) => {
  return orders.filter(
    (order) => order.status === "Pending"
  ).length;
};

export const getSalesByDeliverySlot = (
  orders: any[]
) => {
  return {
    Morning: orders.filter(
      (o) => o.deliverySlot === "Morning"
    ).length,

    Afternoon: orders.filter(
      (o) => o.deliverySlot === "Afternoon"
    ).length,

    Evening: orders.filter(
      (o) => o.deliverySlot === "Evening"
    ).length,
  };
};

export const getBestSellingProducts = (
  orders: any[]
) => {
  const productSales: Record<string, number> = {};

  orders.forEach((order) => {
    order.items?.forEach((item: any) => {
      productSales[item.name] =
        (productSales[item.name] || 0) +
        item.quantity;
    });
  });

  return Object.entries(productSales)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
};
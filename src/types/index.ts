import type { Timestamp } from "firebase/firestore";

export type UserRole = "customer" | "admin" | "delivery";

export interface User {
  uid?: string;
  name: string;
    email: string;
  role: UserRole;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  sold: number;
  createdAt: Timestamp,
  updatedAt: Timestamp,
  isActive: boolean,
  category: string;
  image?: string;
}

export interface CartItemType {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  image?: string;
  quantity: number;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export interface Order {
  id: string;
  items: CartItemType[];
  total: number;
  status: OrderStatus;
  createdAt: string;
}
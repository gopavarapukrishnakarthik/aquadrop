// src/services/productService.ts

import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Product } from "../types";

/* ---------------- FETCH PRODUCTS ---------------- */
export const fetchProducts = async (): Promise<
  Product[]
> => {
  try {
    const snapshot = await getDocs(
      collection(db, "Products")
    );

    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...(docSnap.data() as Omit<
        Product,
        "id"
      >),
    }));
  } catch (error) {
    console.error(
      "Error fetching products:",
      error
    );
    return [];
  }
};

/* ---------------- ADD PRODUCT ---------------- */
type NewProductInput = Omit<
  Product,
  "id" | "createdAt" | "updatedAt" | "isActive"
>;

export const addProduct = async (
  product: NewProductInput
) => {
  try {
    await addDoc(collection(db, "Products"), {
      ...product,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      isActive: true,
    });
  } catch (error) {
    console.error(
      "Error adding product:",
      error
    );
  }
};

/* ---------------- UPDATE STOCK ---------------- */
export const updateProductStock = async (
  productId: string,
  stock: number
) => {
  try {
    const productRef = doc(
      db,
      "Products",
      productId
    );

    await updateDoc(productRef, {
      stock,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error(
      "Error updating stock:",
      error
    );
  }
};

/* ---------------- UPDATE PRODUCT ---------------- */
export const updateProduct = async (
  productId: string,
  updatedData: Partial<Product>
) => {
  try {
    const productRef = doc(
      db,
      "Products",
      productId
    );

    await updateDoc(productRef, {
      ...updatedData,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error(
      "Error updating product:",
      error
    );
  }
};
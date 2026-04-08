// src/services/dashboardService.ts

import type { Product } from "../types";

export const getTotalProducts = (products: Product[]) =>
  products.length;

export const getLowStockCount = (
  products: Product[],
  threshold = 10
) =>
  products.filter(
    (product) => product.stock < threshold
  ).length;

export const getLowStockProducts = (
  products: Product[],
  threshold = 10
) =>
  products.filter(
    (product) => product.stock < threshold
  );

export const getTotalRevenue = (
  products: Product[]
) =>
  products.reduce(
    (sum, product) =>
      sum + product.price * product.stock,
    0
  );

export const getBestSellingProducts = (
  products: Product[],
  limit = 4
) =>
  [...products]
    .sort(
      (a, b) =>
        (b.sold || 0) - (a.sold || 0)
    )
    .slice(0, limit);

export const getInventoryHealth = (
  products: Product[]
) => {
  const total = products.length || 1;

  const inStock = products.filter(
    (p) => p.stock >= 10
  ).length;

  const lowStock = products.filter(
    (p) => p.stock > 0 && p.stock < 10
  ).length;

  const outOfStock = products.filter(
    (p) => p.stock === 0
  ).length;

  return {
    inStock: Math.round(
      (inStock / total) * 100
    ),
    lowStock: Math.round(
      (lowStock / total) * 100
    ),
    outOfStock: Math.round(
      (outOfStock / total) * 100
    ),
  };
};


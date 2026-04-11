import { useEffect, useState } from "react";
import type { Product } from "../types";

import {
  fetchProducts as fetchProductsService,
  addProduct as addProductService,
  updateProductStock,
} from "../services/productService";

import {
  getTotalProducts,
  getLowStockCount,
  getLowStockProducts,
  getTotalRevenue,
  getBestSellingProducts,
  getInventoryHealth,
} from "../services/dashboardService";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const Admin = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [newProduct, setNewProduct] = useState({
    name: "",
    price: 0,
    stock: 0,
    category: "",
    image: "",
  });

  const loadProducts = async () => {
    setLoading(true);
    const data = await fetchProductsService();
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleAddProduct = async () => {
    await addProductService({
      ...newProduct,
      sold: 0,
    });

    setNewProduct({
      name: "",
      price: 0,
      stock: 0,
      category: "",
      image: "",
    });

    loadProducts();
  };

  const updateStockInline = async (productId: string, stock: number) => {
    await updateProductStock(productId, stock);

    setProducts((prev) =>
      prev.map((product) =>
        product.id === productId ? { ...product, stock } : product,
      ),
    );
  };

  const totalProducts = getTotalProducts(products);

  const lowStockCount = getLowStockCount(products);

  const revenue = getTotalRevenue(products);

  const bestProducts = getBestSellingProducts(products);

  const lowStockProducts = getLowStockProducts(products);

  const health = getInventoryHealth(products);

  const graphData = products.map((product) => ({
    name: product.name,
    stock: product.stock,
    sold: product.sold || 0,
  }));

  return (
    <div className="min-h-screen bg-muted/30 p-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold">AquaDrop Admin Dashboard</h1>
          <p className="text-muted-foreground">Inventory • Sales • Analytics</p>
        </div>

        <div className="flex gap-3">
          {/* Add Product */}
          <Dialog>
            <DialogTrigger asChild>
              <Button>Add Product</Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <Input
                  placeholder="Product Name"
                  value={newProduct.name}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      name: e.target.value,
                    })
                  }
                />

                <Input
                  type="number"
                  placeholder="Price"
                  value={newProduct.price}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      price: Number(e.target.value),
                    })
                  }
                />

                <Input
                  type="number"
                  placeholder="Stock"
                  value={newProduct.stock}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      stock: Number(e.target.value),
                    })
                  }
                />

                <Input
                  placeholder="Category"
                  value={newProduct.category}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      category: e.target.value,
                    })
                  }
                />

                <Input
                  placeholder="Image URL"
                  value={newProduct.image}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      image: e.target.value,
                    })
                  }
                />

                <Button onClick={handleAddProduct}>Save Product</Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Update Inventory */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Update Inventory</Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Update Inventory</DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between gap-4">
                    <span className="w-40">{product.name}</span>

                    <Input
                      type="number"
                      defaultValue={product.stock}
                      onBlur={(e) =>
                        updateStockInline(product.id, Number(e.target.value))
                      }
                      className="w-24"
                    />
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>

          {/* Analytics */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="secondary">View Analytics</Button>
            </DialogTrigger>

            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Inventory Analytics</DialogTitle>
              </DialogHeader>

              <div className="space-y-8">
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={graphData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="stock" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={graphData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Line dataKey="sold" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <p>Total Products</p>
            <h2 className="text-3xl font-bold">{totalProducts}</h2>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p>Low Stock Items</p>
            <h2 className="text-3xl font-bold">{lowStockCount}</h2>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p>Total Revenue</p>
            <h2 className="text-3xl font-bold">₹{revenue}</h2>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p>In Stock</p>
            <h2 className="text-3xl font-bold">{health.inStock}%</h2>
          </CardContent>
        </Card>
      </div>

      {/* Best Selling + Low Stock */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Best Selling Products</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {bestProducts.map((product) => (
              <div key={product.id} className="flex justify-between">
                <span>{product.name}</span>
                <span>{product.sold || 0} sold</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Low Stock Alerts</CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            {lowStockProducts.length > 0 ? (
              lowStockProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex justify-between items-center">
                  <span>{product.name}</span>

                  <Badge variant="destructive">{product.stock} left</Badge>
                </div>
              ))
            ) : (
              <p className="text-green-600 text-sm">
                All products are well stocked
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle>Live Inventory Table</CardTitle>
        </CardHeader>

        <CardContent>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Sold</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>₹{product.price}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>{product.sold || 0}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Admin;

import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../services/firebase";
import type { Product } from "../types";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

  const fetchProducts = async () => {
    try {
      const snapshot = await getDocs(collection(db, "Products"));

      const list: Product[] = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...(docSnap.data() as Omit<Product, "id">),
      }));

      setProducts(list);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = async () => {
    try {
      await addDoc(collection(db, "Products"), {
        ...newProduct,
        image: newProduct.image || "https://dummyimage.com/400x300",
      });

      setNewProduct({
        name: "",
        price: 0,
        stock: 0,
        category: "",
        image: "",
      });

      fetchProducts();
    } catch (error) {
      console.error(error);
    }
  };

  const updateStockInline = async (productId: string, stock: number) => {
    try {
      const productRef = doc(db, "Products", productId);

      await updateDoc(productRef, {
        stock,
      });

      fetchProducts();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 justify-items-center p-8">
      <h1 className="text-4xl font-bold mb-8">Admin Inventory</h1>

      {/* Add Product */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Add New Product</CardTitle>
        </CardHeader>

        <CardContent className="grid md:grid-cols-2 gap-4">
          <Input
            placeholder="Product Name"
            value={newProduct.name}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
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
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
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
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setNewProduct({
                ...newProduct,
                stock: Number(e.target.value),
              })
            }
          />

          <Input
            placeholder="Category"
            value={newProduct.category}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setNewProduct({
                ...newProduct,
                category: e.target.value,
              })
            }
          />

          <Input
            placeholder="Image URL"
            value={newProduct.image}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setNewProduct({
                ...newProduct,
                image: e.target.value,
              })
            }
            className="md:col-span-2"
          />

          <Button onClick={handleAddProduct} className="md:col-span-2">
            Add Product
          </Button>
        </CardContent>
      </Card>

      {/* Inventory */}
      <Card className="w-1/2">
        <CardHeader>
          <CardTitle>Live Inventory</CardTitle>
        </CardHeader>

        <CardContent>
          {loading ? (
            <p>Loading inventory...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Stock</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <img
                        src={product.image || "https://dummyimage.com/80x80"}
                        alt={product.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    </TableCell>

                    <TableCell>{product.name}</TableCell>

                    <TableCell>₹{product.price}</TableCell>

                    <TableCell>
                      <Badge>{product.category}</Badge>
                    </TableCell>

                    <TableCell>
                      <Input
                        type="number"
                        defaultValue={product.stock}
                        onBlur={(e: ChangeEvent<HTMLInputElement>) =>
                          updateStockInline(product.id, Number(e.target.value))
                        }
                        className="w-24"
                      />
                    </TableCell>
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

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../services/firebase";
import type { Product } from "../types";

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
    <div className="min-h-screen bg-slate-100 p-8">
      <h1 className="text-4xl font-bold mb-8 tracking-tight">
        🛠️ Admin Dashboard
      </h1>

      {/* Add Product Card */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 mb-10">
        <h2 className="text-2xl font-semibold mb-6">Add New Product</h2>

        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Product Name"
            value={newProduct.name}
            onChange={(e) =>
              setNewProduct({
                ...newProduct,
                name: e.target.value,
              })
            }
            className="border border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-blue-400 outline-none"
          />

          <input
            type="number"
            placeholder="Price"
            value={newProduct.price}
            onChange={(e) =>
              setNewProduct({
                ...newProduct,
                price: Number(e.target.value),
              })
            }
            className="border border-gray-200 rounded-xl p-4"
          />

          <input
            type="number"
            placeholder="Stock"
            value={newProduct.stock}
            onChange={(e) =>
              setNewProduct({
                ...newProduct,
                stock: Number(e.target.value),
              })
            }
            className="border border-gray-200 rounded-xl p-4"
          />

          <input
            type="text"
            placeholder="Category"
            value={newProduct.category}
            onChange={(e) =>
              setNewProduct({
                ...newProduct,
                category: e.target.value,
              })
            }
            className="border border-gray-200 rounded-xl p-4"
          />

          <input
            type="text"
            placeholder="Image URL"
            value={newProduct.image}
            onChange={(e) =>
              setNewProduct({
                ...newProduct,
                image: e.target.value,
              })
            }
            className="border border-gray-200 rounded-xl p-4 md:col-span-2"
          />
        </div>

        <button
          onClick={handleAddProduct}
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-medium shadow-lg transition">
          Add Product
        </button>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
        <h2 className="text-2xl font-semibold mb-6">Live Inventory</h2>

        {loading ? (
          <p>Loading inventory...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left text-gray-600">
                  <th className="p-4">Image</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Stock</th>
                </tr>
              </thead>

              <tbody>
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b hover:bg-gray-50 transition">
                    <td className="p-4">
                      <img
                        src={product.image || "https://dummyimage.com/80x80"}
                        alt={product.name}
                        className="w-16 h-16 rounded-xl object-cover"
                      />
                    </td>

                    <td className="p-4 font-medium">{product.name}</td>

                    <td className="p-4">₹{product.price}</td>

                    <td className="p-4">
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                        {product.category}
                      </span>
                    </td>

                    <td className="p-4">
                      <input
                        type="number"
                        defaultValue={product.stock}
                        onBlur={(e) =>
                          updateStockInline(product.id, Number(e.target.value))
                        }
                        className="border rounded-xl px-3 py-2 w-24 text-center"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;

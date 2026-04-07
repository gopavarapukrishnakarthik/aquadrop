import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../services/firebase";
import type { Product } from "../types";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { addToCart } from "../features/cart/cartSlice";

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const cartItems = useAppSelector((state) => state.cart.items);
  const orders = useAppSelector((state) => state.orders.orders);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchProducts = async () => {
    try {
      const snapshot = await getDocs(collection(db, "Products"));

      const productList: Product[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Product, "id">),
      }));

      setProducts(productList);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [orders]);

  const deliveredCount = orders.filter(
    (order) => order.status === "delivered",
  ).length;

  const totalStockAvailable = products.reduce(
    (sum, product) => sum + product.stock,
    0,
  );

  const totalCartItems = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navbar */}
      <div className="bg-white shadow-sm px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-2xl font-bold">AquaDrop</h1>

        <p className="text-sm">Logged in as: {user?.role}</p>

        <div className="flex gap-3">
          <button
            onClick={() => navigate("/cart")}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg">
            Cart ({cartItems.length})
          </button>

          <button
            onClick={() => navigate("/orders")}
            className="bg-green-500 text-white px-4 py-2 rounded-lg">
            Orders ({orders.length})
          </button>
        </div>
      </div>

      {/* Hero section */}
      <div className="px-6 py-8">
        <h2 className="text-3xl font-bold mb-2">
          Fresh Water Delivered to Your Door 🚰
        </h2>
        <p className="text-gray-600">
          Order mineral water cans and bottles instantly
        </p>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 px-6 mb-8">
        <div
          onClick={() => navigate("/cart")}
          className="bg-white rounded-2xl shadow-md p-6 cursor-pointer hover:shadow-lg">
          <h3 className="text-xl font-semibold">🛒 Cart</h3>
          <p className="text-gray-500 mt-2">{totalCartItems} items</p>
        </div>

        <div
          onClick={() => navigate("/orders")}
          className="bg-white rounded-2xl shadow-md p-6 cursor-pointer hover:shadow-lg">
          <h3 className="text-xl font-semibold">📦 Orders</h3>
          <p className="text-gray-500 mt-2">{orders.length} placed</p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6">
          <h3 className="text-xl font-semibold">🚚 Delivered</h3>
          <p className="text-gray-500 mt-2">{deliveredCount} completed</p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6">
          <h3 className="text-xl font-semibold">🏪 Stock</h3>
          <p className="text-gray-500 mt-2">{totalStockAvailable} units left</p>
        </div>
      </div>

      {/* Products */}
      <div className="px-6 pb-8">
        <h2 className="text-2xl font-bold mb-4">Products</h2>

        {loading ? (
          <p>Loading products...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl shadow-md p-5">
                <img
                  src={product.image || "https://dummyimage.com/400x300"}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-xl mb-4"
                />

                <h2 className="text-xl font-semibold">{product.name}</h2>

                <p className="text-gray-600">{product.category}</p>

                <p className="text-lg font-bold mt-2">₹{product.price}</p>

                <p className="text-sm text-gray-500">Stock: {product.stock}</p>

                <button
                  onClick={() => dispatch(addToCart(product))}
                  className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg">
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Product } from "../types";

import { fetchProducts } from "../services/productService";

import { Card, CardContent} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";


import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";

import { addToCart } from "../features/cart/cartSlice";

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const user = useAppSelector((state) => state.auth.user);

  const cartItems = useAppSelector((state) => state.cart.items);

  const orders = useAppSelector((state) => state.orders.orders);

  const [products, setProducts] = useState<Product[]>([]);

  const [loading, setLoading] = useState(true);

  const loadProducts = async () => {
    const data = await fetchProducts();

    setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    loadProducts();
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
  <div className="min-h-screen bg-slate-50">
    {/* Premium Navbar */}
    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AquaDrop</h1>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="rounded-xl"
            onClick={() => navigate("/orders")}>
            Orders ({orders.length})
          </Button>

          <Button
            className="rounded-xl shadow-sm"
            onClick={() => navigate("/cart")}>
            Cart ({cartItems.length})
          </Button>

          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center font-semibold">
            {user?.role?.[0]?.toUpperCase() || "U"}
          </div>
        </div>
      </div>
    </header>

    <main className="max-w-7xl mx-auto px-6 py-8 space-y-10">
      {/* Hero Section */}
      <section className="rounded-3xl bg-white shadow-sm border p-8">
        <div className="space-y-3">
          <h2 className="text-4xl font-bold tracking-tight">
            Fresh Water Delivered to Your Door
          </h2>

          <p className="text-muted-foreground text-lg">
            Mineral water cans, bottles, and bulk packs delivered instantly.
          </p>

          <div className="flex gap-3 pt-3">
            <Button
              size="lg"
              className="rounded-xl"
              onClick={() => navigate("/cart")}>
              View Cart
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="rounded-xl"
              onClick={() => navigate("/orders")}>
              Track Orders
            </Button>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="rounded-3xl shadow-sm hover:shadow-md transition-all">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Cart Items</p>
            <h3 className="text-3xl font-bold mt-2">{totalCartItems}</h3>
          </CardContent>
        </Card>

        <Card className="rounded-3xl shadow-sm hover:shadow-md transition-all">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Total Orders</p>
            <h3 className="text-3xl font-bold mt-2">{orders.length}</h3>
          </CardContent>
        </Card>

        <Card className="rounded-3xl shadow-sm hover:shadow-md transition-all">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Delivered</p>
            <h3 className="text-3xl font-bold mt-2">{deliveredCount}</h3>
          </CardContent>
        </Card>

        <Card className="rounded-3xl shadow-sm hover:shadow-md transition-all">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Stock Left</p>
            <h3 className="text-3xl font-bold mt-2">{totalStockAvailable}</h3>
          </CardContent>
        </Card>
      </section>

      {/* Products */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Products</h2>

          <Badge className="rounded-xl px-4 py-1">
            {products.length} Available
          </Badge>
        </div>

        {loading ? (
          <p>Loading products...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card
                key={product.id}
                className="rounded-3xl border shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="h-56 rounded-2xl bg-white border flex items-center justify-center mb-5">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">{product.name}</h3>

                    <Badge variant="secondary">{product.category}</Badge>

                    <p className="text-2xl font-bold">₹{product.price}</p>

                    <p className="text-sm text-muted-foreground">
                      {product.stock} units left
                    </p>

                    <Button
                      className="w-full mt-4 rounded-xl"
                      onClick={() => dispatch(addToCart(product))}>
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </main>
  </div>
);
};

export default Home;

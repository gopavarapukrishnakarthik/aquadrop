import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";

import {
  removeFromCart,
  clearCart,
  updateQuantity,
} from "../features/cart/cartSlice";

import { placeOrder } from "../features/orders/orderSlice";

import { doc, updateDoc, increment } from "firebase/firestore";

import { db } from "../services/firebase";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";

const Cart = () => {
  const dispatch = useAppDispatch();

  const { items, totalAmount } = useAppSelector((state) => state.cart);

  const handlePlaceOrder = async () => {
    if (!items.length) return;

    try {
      for (const item of items) {
        const productRef = doc(db, "Products", item.id);

        await updateDoc(productRef, {
          stock: item.stock - item.quantity,
          sold: increment(item.quantity),
        });
      }

      dispatch(
        placeOrder({
          id: Date.now().toString(),
          items,
          total: totalAmount,
          status: "pending",
          createdAt: new Date().toISOString(),
        }),
      );

      dispatch(clearCart());
    } catch (error) {
      console.error("Order failed:", error);
    }
  };

  const handleQuantityChange = (id: string, quantity: number) => {
    if (quantity < 1) return;

    dispatch(
      updateQuantity({
        id,
        quantity,
      }),
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Shopping Cart</h1>

        <p className="text-muted-foreground mt-1">
          Review your items before placing the order
        </p>
      </div>

      {items.length === 0 ? (
        <Card className="rounded-3xl shadow-sm">
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground text-lg">
              Your cart is empty 🛒
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {items.map((item) => (
              <Card
                key={item.id}
                className="rounded-3xl shadow-sm hover:shadow-md transition-all">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-semibold">{item.name}</h2>

                      <p className="text-muted-foreground">₹{item.price}</p>

                      <p className="font-medium mt-2">
                        Total: ₹{item.price * item.quantity}
                      </p>
                    </div>

                    <Button
                      variant="destructive"
                      onClick={() => dispatch(removeFromCart(item.id))}>
                      Remove
                    </Button>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3 mt-5">
                    <Button
                      variant="outline"
                      onClick={() =>
                        handleQuantityChange(item.id, item.quantity - 1)
                      }>
                      -
                    </Button>

                    <span className="font-semibold text-lg">
                      {item.quantity}
                    </span>

                    <Button
                      variant="outline"
                      onClick={() =>
                        handleQuantityChange(item.id, item.quantity + 1)
                      }>
                      +
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div>
            <Card className="rounded-3xl shadow-sm sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>

              <CardContent className="space-y-5">
                <div className="flex justify-between">
                  <span>Items</span>
                  <span>{items.length}</span>
                </div>

                <div className="flex justify-between">
                  <span>Grand Total</span>
                  <span className="font-bold text-xl">₹{totalAmount}</span>
                </div>

                <Button
                  className="w-full rounded-xl"
                  onClick={handlePlaceOrder}>
                  Place Order
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;

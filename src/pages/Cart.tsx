import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import {
  removeFromCart,
  clearCart,
  updateQuantity,
} from "../features/cart/cartSlice";
import { placeOrder } from "../features/orders/orderSlice";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../services/firebase";

const Cart = () => {
  const dispatch = useAppDispatch();

  const { items, totalAmount } = useAppSelector((state) => state.cart);

  const handlePlaceOrder = async () => {
    if (!items.length) return;

    try {
      // reduce stock in firestore
      for (const item of items) {
        const productRef = doc(db, "Products", item.id);

        await updateDoc(productRef, {
          stock: item.stock - item.quantity,
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

    dispatch(updateQuantity({ id, quantity }));
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">🛒 Cart</h1>

      {items.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          {items.map((item) => (
            <div key={item.id} className="bg-white shadow rounded-2xl p-4 mb-4">
              <h2 className="text-xl font-semibold">{item.name}</h2>

              <p>₹{item.price}</p>

              {/* Quantity controls */}
              <div className="flex items-center gap-3 mt-3">
                <button
                  onClick={() =>
                    handleQuantityChange(item.id, item.quantity - 1)
                  }
                  className="bg-gray-200 px-3 py-1 rounded">
                  -
                </button>

                <span className="font-semibold">{item.quantity}</span>

                <button
                  onClick={() =>
                    handleQuantityChange(item.id, item.quantity + 1)
                  }
                  className="bg-gray-200 px-3 py-1 rounded">
                  +
                </button>
              </div>

              <p className="mt-2 font-medium">
                Total: ₹{item.price * item.quantity}
              </p>

              <button
                onClick={() => dispatch(removeFromCart(item.id))}
                className="mt-3 bg-red-500 text-white px-4 py-2 rounded-lg">
                Remove
              </button>
            </div>
          ))}

          <h2 className="text-2xl font-bold mt-6">
            Grand Total: ₹{totalAmount}
          </h2>

          <button
            onClick={handlePlaceOrder}
            className="mt-4 bg-green-500 text-white px-5 py-3 rounded-xl">
            Place Order
          </button>
        </>
      )}
    </div>
  );
};

export default Cart;

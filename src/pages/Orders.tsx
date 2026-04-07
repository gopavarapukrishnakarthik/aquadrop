import { useAppSelector, useAppDispatch } from "../hooks/reduxHooks";
import { updateOrderStatus } from "../features/orders/orderSlice";

const Orders = () => {
  const dispatch = useAppDispatch();

  const orders = useAppSelector((state) => state.orders.orders);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Orders List</h1>

      {orders.map((order) => (
        <div key={order.id} className="border rounded-xl p-4 mb-4">
          <p>Order ID: {order.id}</p>
          <p>Status: {order.status}</p>
          <p>Total: ₹{order.total}</p>

          <button
            onClick={() =>
              dispatch(
                updateOrderStatus({
                  orderId: order.id,
                  status: "delivered",
                }),
              )
            }
            className="mt-2 bg-blue-500 text-white px-3 py-1 rounded">
            Mark Delivered
          </button>
        </div>
      ))}
    </div>
  );
};

export default Orders;

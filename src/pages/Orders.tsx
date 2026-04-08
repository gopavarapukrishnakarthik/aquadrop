import { useAppSelector, useAppDispatch } from "../hooks/reduxHooks";

import { updateOrderStatus } from "../features/orders/orderSlice";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const Orders = () => {
  const dispatch = useAppDispatch();

  const orders = useAppSelector((state) => state.orders.orders);

  const deliveredOrders = orders.filter(
    (order) => order.status === "delivered",
  ).length;

  const pendingOrders = orders.length - deliveredOrders;

  return (
    <div className="min-h-screen bg-slate-50 p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Orders Dashboard</h1>

        <p className="text-muted-foreground mt-1">
          Track and manage all customer orders
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="rounded-3xl shadow-sm">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Total Orders</p>

            <h2 className="text-3xl font-bold mt-2">{orders.length}</h2>
          </CardContent>
        </Card>

        <Card className="rounded-3xl shadow-sm">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Delivered</p>

            <h2 className="text-3xl font-bold mt-2">{deliveredOrders}</h2>
          </CardContent>
        </Card>

        <Card className="rounded-3xl shadow-sm">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Pending</p>

            <h2 className="text-3xl font-bold mt-2">{pendingOrders}</h2>
          </CardContent>
        </Card>
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        {orders.length === 0 ? (
          <Card className="rounded-3xl shadow-sm">
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No orders found</p>
            </CardContent>
          </Card>
        ) : (
          orders.map((order) => (
            <Card
              key={order.id}
              className="rounded-3xl shadow-sm hover:shadow-md transition-all">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Order #{order.id}</CardTitle>

                  <Badge
                    variant={
                      order.status === "delivered" ? "default" : "secondary"
                    }>
                    {order.status}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <p>
                    <span className="font-semibold">Total:</span> ₹{order.total}
                  </p>

                  <p>
                    <span className="font-semibold">Status:</span>{" "}
                    {order.status}
                  </p>
                </div>

                {order.status !== "delivered" && (
                  <Button
                    className="rounded-xl"
                    onClick={() =>
                      dispatch(
                        updateOrderStatus({
                          orderId: order.id,
                          status: "delivered",
                        }),
                      )
                    }>
                    Mark Delivered
                  </Button>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Orders;

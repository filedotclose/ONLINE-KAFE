
"use client";

import { useEffect, useState } from "react";
import Navbar from "@/app/components/Navbar";

interface OrderItem {
  menuItem: string;
  quantity: number;
  price: number;
}

interface Order {
  _id: string;          // isko monogId ki tarah 
  orderId: string;      
  orderItems: OrderItem[];
  totalprice: number;
  payment: "paid" | "unpaid" | "rejected";
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const res = await fetch("/api/admin/orders", {
        method : "GET",
        headers: {
          "authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();
      setOrders(data.orders || []);
      setLoading(false);
    };

    fetchOrders();
  }, []);

  const updatePayment = async (
    mongoId: string,
    payment: "paid" | "unpaid" | "rejected"
  ) => {
    const res = await fetch(`/api/admin/update/${mongoId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "authorization": `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ payment }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Update failed");
      return;
    }

    setOrders((prev) =>
      prev.map((o) => (o._id === mongoId ? data.order : o))
    );
  };

  return (
    <>
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-center text-emerald-600 mb-12">
          Manage Orders
        </h1>

        {loading ? (
          <p className="text-center text-gray-500">Loading…</p>
        ) : orders.length === 0 ? (
          <p className="text-center text-gray-500">No orders</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white border border-emerald-600 rounded-xl p-6 shadow-sm"
              >
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="font-semibold text-sm">Order</p>
                    <p className="text-gray-500 text-sm">
                      {order.orderId}
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      order.payment === "paid"
                        ? "bg-green-100 text-green-700"
                        : order.payment === "rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {order.payment}
                  </span>
                </div>

                {/* Items */}
                <div className="space-y-2 text-sm mb-4">
                  {order.orderItems.map((item, i) => (
                    <div key={i} className="flex justify-between">
                      <span>
                        {item.menuItem} × {item.quantity}
                      </span>
                      <span>₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="flex justify-between font-semibold border-t pt-3 mb-4">
                  <span>Total</span>
                  <span>₹{order.totalprice}</span>
                </div>

                {/* Actions */}
                {order.payment === "unpaid" && (
                  <div className="flex gap-3">
                    <button
                      onClick={() =>
                        updatePayment(order._id, "paid")
                      }
                      className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded-lg text-sm"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() =>
                        updatePayment(order._id, "rejected")
                      }
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg text-sm"
                    >
                      Reject
                    </button>
                  </div>
                )}

                {order.payment === "paid" && (
                  <button
                    onClick={() =>
                      updatePayment(order._id, "unpaid")
                    }
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-lg text-sm"
                  >
                    Undo
                  </button>
                )}

                {order.payment === "rejected" && (
                  <p className="text-center text-red-600 text-sm font-medium">
                    Order rejected
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

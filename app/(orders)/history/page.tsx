"use client";

import { useEffect, useState } from "react";
import Navbar from "@/app/components/Navbar";
import { useRouter } from "next/navigation";



export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/orders/history", {
        method: "GET",
        headers: {
          "authorization": token ? `Bearer ${token}` : "",
          "Content-Type": "application/json"
        },
      });

      if (!res.ok) {
        console.log(res)
        console.log("Failed to fetch orders");
        setOrders([]);
        return;
      }

      const data = await res.json();
      setOrders(data.orders || []);
    } catch (err) {
      console.log("Error fetching orders:", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchOrders();
  }, []);
  console.log(orders);
  const clearHistory = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch("/api/orders/history/delete", {
        method: "DELETE",
        headers: {
          Authorization: token ? `Bearer ${token}` : " ",
          "Content-Type": "application/json"
        }
      })
      if (res.ok) {
        const data = await res.json();
        console.log(data);
        //setOrders(data.orders);
      }
    } catch (err) {
      console.log("error is", err)
    } finally {
      setLoading(false);
      fetchOrders();
    }
  }


  return (
    <main className="max-w-7xl mx-auto px-6 py-6 relative">
      <Navbar />

      <h1 className="text-3xl sm:text-4xl font-extrabold mt-8 mb-8 text-emerald-600">
        Order history so far...
      </h1>

      <div className="bg-white border border-emerald-200 rounded-2xl shadow-sm">
        {loading ? (
          <div className="py-16 text-center text-gray-500">
            Loading your orders...
          </div>
        ) : orders?.length == 0 ? (
          <div className="py-16 text-center text-gray-500">
            You have not placed any orders yet.
          </div>
        ) : (
          <>
            {orders?.map(order => (
              <div
                key={order._id}
                className="border-b border-emerald-100 last:border-b-0 px-6 py-5"
              >
                {/* Order header line */}
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-semibold text-lg text-gray-800">
                      Order ID: {order.orderId}
                    </p>
                    <p className="text-sm text-gray-500">
                      Date :{(order.iat).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-emerald-600">
                      ₹{order.totalprice}
                    </p>
                    <span
                      className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full ${order.payment === "rejected" ? "bg-white border border-red-500 text-red-600" : ""} ${order.payment === "paid"
                          ? "bg-white border border-green-500 text-emerald-700"
                          : "bg-white border border-yellow-400 text-yellow-700"
                        }`}
                    >
                      {order.payment}
                    </span>
                  </div>
                </div>

                {/* Items list*/}
                <div className="mt-2 rounded-xl border border-emerald-100 bg-emerald-50/30 px-4 py-3">
                  {order.orderItems.map((item, idx) => (
                    <div
                      key={item._id || `${order._id}-${idx}`}
                      className="flex items-center justify-between text-sm py-1"
                    >
                      <div>
                        <p className="font-medium text-gray-800">
                          {item.menuItem || item.name || "Item"}
                        </p>
                        <p className="text-xs text-gray-500">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="font-semibold text-emerald-600">
                        ₹{Number(item.price) * item.quantity}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      <div className="mt-8 flex gap-4">
        <button
          className="bg-emerald-600 text-white font-semibold px-6 py-2 rounded-full hover:bg-emerald-700 transition"
          onClick={() => router.push("/dashboard")}
        >
          Menu
        </button>
        <button
          className="bg-emerald-600 text-white font-semibold px-6 py-2 rounded-full hover:bg-emerald-700 transition"
          onClick={() => {
            clearHistory();
          }}
        >
          Clear Last Purchase
        </button>
        <button
          className="bg-emerald-600 text-white font-semibold px-6 py-2 rounded-full hover:bg-emerald-700 transition"
          onClick={() => router.push("/dashboard/cart")}
        >
          Cart
        </button>
      </div>
    </main>
  );
}

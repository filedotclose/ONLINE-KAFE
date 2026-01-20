"use client";

import { useEffect, useState } from "react";
import Navbar from "@/app/components/Navbar";
import { useRouter } from "next/navigation";

type CheckoutStep =
  | "cart"
  | "waiting-admin"
  | "payment-success"
  | "payment-failed";

interface CartItem {
  _id?: string;
  menuItem?: string;
  name?: string;
  quantity: number;
  price: number;
}

export default function Checkout() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("cart");

  const [orderMongoId, setOrderMongoId] = useState("");
  const [orderDisplayId, setOrderDisplayId] = useState("");

  const router = useRouter();

  /* ---------------- FETCH CART ---------------- */
  useEffect(() => {
    const fetchCart = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/cart", {
        headers: { "authorization": token ? `Bearer ${token}` : "" },
      });

      if (res.ok) {
        const data = await res.json();
        setCartItems(data.items || []);
      }
      setLoading(false);
    };

    fetchCart();
  }, []);

  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  /* ---------------- PLACE ORDER ---------------- */
  const handlePlaceOrder = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "authorization": token ? `Bearer ${token}` : "",
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      alert("Failed to place order");
      return;
    }

    const data = await res.json();

    setOrderMongoId(data.newOrder._id);      // MongoDB _id
    setOrderDisplayId(data.newOrder.orderId); // ORDER123
    setCurrentStep("waiting-admin");
  };

  /* ---------------- POLL ADMIN PAYMENT UPDATE ---------------- */
  useEffect(() => {
    if (!orderMongoId || currentStep !== "waiting-admin") return;

    const interval = setInterval(async () => {
      const token = localStorage.getItem("token");

      const res = await fetch(`/api/orders/status/${orderMongoId}`, {
        headers: { "authorization": token ? `Bearer ${token}` : "" },
      });

      if (!res.ok) return;

      const data = await res.json();

      if (data.payment === "paid") {
        setCurrentStep("payment-success");
        clearInterval(interval);
      }

      if (data.payment === "rejected") {
        setCurrentStep("payment-failed");
        clearInterval(interval);
      }
    }, 5000); // poll every 5 sec

    return () => clearInterval(interval);
  }, [orderMongoId, currentStep]);

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <main className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex flex-1 flex-col items-center justify-center">
          <div className="relative">
            <div className="w-14 h-14 rounded-full border-4 border-emerald-200" />
            <div className="absolute top-0 left-0 w-14 h-14 rounded-full border-4 border-emerald-600 border-t-transparent animate-spin" />
          </div>
          <p className="mt-6 text-gray-600 text-lg animate-pulse">
            Preparing checkout…
          </p>
        </div>
      </main>
    );
  }



  return (
    <main className="max-w-7xl mx-auto px-6 py-1">
      <Navbar />
      <div className="mt-6 max-w-4xl mx-auto px-6">

        {/* CART */}
        {currentStep === "cart" && (
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-6 text-emerald-600">
              Checkout
            </h1>

            <div className="bg-white rounded-3xl shadow-xl p-8 border border-emerald-600">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>

              <ul className="space-y-4 mb-6">
                {cartItems.map((item, i) => (
                  <li
                    key={i}
                    className="flex justify-between bg-gray-50 p-4 rounded-xl"
                  >
                    <div>
                      <p className="font-semibold">
                        {item.menuItem || item.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="font-bold text-emerald-600">
                      ₹{item.price * item.quantity}
                    </p>
                  </li>
                ))}
              </ul>

              <div className="flex justify-between font-bold text-xl mb-6">
                <span>Total</span>
                <span className="text-emerald-600">₹{cartTotal}</span>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={cartItems.length === 0}
                className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold hover:bg-emerald-700 disabled:opacity-50"
              >
                Place Order
              </button>
            </div>
          </div>
        )}

        {/* WAITING FOR ADMIN */}
        {currentStep === "waiting-admin" && (
          <div className="text-center mt-24">
            <h2 className="text-2xl font-bold text-emerald-600">
              Waiting for Admin Approval
            </h2>
            <p className="mt-4 text-gray-600">
              Order #{orderDisplayId}
            </p>
            <div className="mt-8 flex flex-col items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-ping" />
                <div className="w-3 h-3 bg-emerald-500 rounded-full absolute" />
                <span className="text-gray-600 text-sm">
                  Checking admin status…
                </span>
              </div>

              <p className="text-gray-500 text-sm">
                This page will update automatically
              </p>
            </div>

          </div>
        )}

        {/* SUCCESS (UNCHANGED) */}
        {currentStep === "payment-success" && (
          <div className="text-center mt-16">
            <div className="bg-white rounded-3xl shadow-2xl border-2 border-emerald-600 p-8">
              <img
                className="mx-auto mb-6"
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${orderDisplayId}`}
                alt="QR"
              />
              <h1 className="text-4xl font-bold mb-4">
                Order Confirmed!
              </h1>
              <p className="text-lg mb-2">Order #{orderDisplayId}</p>
              <p className="text-2xl font-bold text-emerald-600 mb-6">
                ₹{cartTotal}
              </p>
              <button
                onClick={() => router.push("/dashboard")}
                className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-700"
              >
                Buy more?
              </button>
            </div>
          </div>
        )}

        {/* FAILED */}
        {currentStep === "payment-failed" && (
          <div className="text-center mt-20">
            <h2 className="text-2xl font-bold text-red-600 mb-4">
              Order Rejected
            </h2>
            <button
              onClick={() => setCurrentStep("cart")}
              className="mt-6 border px-6 py-3 rounded-xl"
            >
              Back to Cart
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

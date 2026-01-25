"use client";

import { useEffect, useState, useRef } from "react";
import Navbar from "@/app/components/Navbar";
import { useRouter } from "next/navigation";
import { array } from "zod";

/* ---------------- TYPES ---------------- */

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

/* ---------------- COMPONENT ---------------- */

export default function Checkout() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("cart");

  // MongoDB _id (for backend polling)
  const [orderMongoId, setOrderMongoId] = useState("");
  // Display order ID (ORDER123)
  const [orderDisplayId, setOrderDisplayId] = useState("");

  // Prevent duplicate state transitions
  const transitionLock = useRef(false);

  const router = useRouter();

  /* ---------------- FETCH CART ---------------- */

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/cart", {
          headers: {
            "authorization": token ? `Bearer ${token}` : "",
          },
        });

        if (res.ok) {
          const data = await res.json();
          setCartItems(data.items || []);
        }
      } catch (err) {
        console.error("Cart fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );



  const handlePlaceOrder = async () => {
    try {
      transitionLock.current = false;

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

      setOrderMongoId(data.newOrder._id);       // MongoDB ID
      setOrderDisplayId(data.newOrder.orderId); // ORDER123
      setCurrentStep("waiting-admin");
    } catch (err) {
      console.error("Order creation error:", err);
    }
  };



  useEffect(() => {
    if (!orderMongoId || currentStep !== "waiting-admin") return;

    let cancelled = false;

    const pollStatus = async () => {
      if (cancelled || transitionLock.current) return;

      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`/api/admin/orders/status/${orderMongoId}`, {
          headers: {
            "authorization": token ? `Bearer ${token}` : "",
          },
        });

        if (!res.ok) throw new Error("Polling failed");

        const data = await res.json();

        if (data.payment === "paid") {
          transitionLock.current = true;
          setCurrentStep("payment-success");
          return;
        }

        if (data.payment === "rejected") {
          transitionLock.current = true;
          setCurrentStep("payment-failed");
          return;
        }


        setTimeout(pollStatus, 2000);
      } catch (err) {
        console.error("Polling error:", err);
        setTimeout(pollStatus, 4000);
      }
    };

    pollStatus();

    return () => {
      cancelled = true;
    };
  }, [orderMongoId, currentStep]);

  /* ---------------- LOADING SCREEN ---------------- */

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



  /* ---------------- UI ---------------- */

  return (
    <main className="max-w-7xl mx-auto px-6 py-1">
      <Navbar />

      <div className="mt-6 max-w-4xl mx-auto px-6 transition-all duration-500">

        {/* CART */}
        {currentStep === "cart" && (
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-6 text-emerald-600">
              Checkout
            </h1>

            <div className="bg-white rounded-3xl shadow-xl p-8 border border-emerald-600 mb-10">
              <h2 className="text-xl font-bold mb-8">Order Summary</h2>

              <ul className="space-y-4 mb-6">
                {cartItems.length === 0 ? (
                  <p className="text-center text-red-400 font-medium">YOU DO NOT HAVE ANY ORDERS</p>
                ) : (
                  cartItems.map((item, i) => (
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
                  ))
                )}
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
          <div className="text-center mt-24 transition-all duration-500">
            <h2 className="text-2xl font-bold text-emerald-600">
              Pay at this QR / upi id and wait for approval
            </h2>
            <p>
              <img src="/qrcode.png" alt="" />
            </p>
            <p className="mt-4 text-gray-600">
              Order #{orderDisplayId}
            </p>

            <div className="mt-8 flex flex-col items-center gap-4">
              <div className="flex items-center gap-3">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-600"></span>
                </span>
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

        {/* SUCCESS */}
        {currentStep === "payment-success" && (
          <div className="text-center mt-16 transition-all duration-500 mb-14">
            <div className="bg-white rounded-3xl shadow-2xl border-2 border-emerald-600 p-8 flex flex-col justify-center items-center">
              <img
                className="mx-auto mb-6"
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${orderDisplayId}`}
                alt="QR"
              />
              <p className="text-lg mb-2 font-sans">Order #{orderDisplayId}</p>
              <h1 className="text-4xl font-bold mb-4 text-green-700">
                Order Confirmed!
              </h1>
              <p className="text-2xl font-bold text-emerald-600 mb-6">
                You paid : ₹{cartTotal}
              </p>
              <p className="text-center text-xl p-1 px-3 rounded-xl hover:bg-red-500 hover:text-white transition ease-in font-bold text-green-700 border border-green-600  mb-6">
                Please collect your order
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
          <div className="text-center mt-20 transition-all duration-500">
            <h2 className="text-2xl font-bold text-red-600 mb-4">
              Order Rejected
            </h2>
            <button
              onClick={() => {
                transitionLock.current = false;
                setCurrentStep("cart");
                router.push("/dashboard")
              }}
              className="mt-6 border px-6 py-3 rounded-xl"
            >
              Back to Home
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

"use client";
import { useEffect, useState } from "react";
import Navbar from "@/app/components/Navbar";
import { useRouter } from "next/navigation";


type CheckoutStep = "cart" | "payment" | "verification" | "payment-success" | "payment-failed";

export default function Checkout() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("cart");
  const [orderId, setOrderId] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/cart", {
        method: "GET",
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });

      if (res.ok) {
        const data = await res.json();
        setCartItems(data.items || []);
      }
    } catch (err) {
      console.error("Error fetching cart:", err);
    } finally {
      setLoading(false);
    }
  };

  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);


  const handlePlaceOrder = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        const data = await res.json();
        console.log(data.newOrder.orderId)
        console.log("hello")
        setOrderId(data.newOrder.orderId);
        //setCurrentStep("payment");
      } else {
        alert("Failed to create order");
      }
    } catch (err) {
      alert("Order creation failed");
    }
  };


  const handlePayment = (method: "success" | "failed") => {
    handlePlaceOrder()
    setTimeout(() => {
      if (method === "success") {
        setCurrentStep("verification");
      } else {
        setCurrentStep("payment-failed");
      }
    }, 2000);
  };

  const handleVerificationSuccess = async () => {
    setCurrentStep("payment-success");
    try {
      const token = localStorage.getItem('token');
      const res = await fetch("/api/orders/update", {
      method: "PATCH",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderId: orderId,
        payment: "paid"
      }),
    });
      if (res.ok) {
        console.log("payment marked as paid");
      }
    } catch (err) {
      console.log(err);
    }}

  if (loading) {
    return (
      <main className="max-w-7xl mx-auto px-6 py-1 shadow-emerald-600">
        <Navbar />
        <div className="mt-6 max-w-4xl mx-auto px-6 py-20 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-6" />
          <p className="text-lg text-gray-600">Loading checkout...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-1 shadow-emerald-600">
      <Navbar />
      <div className="mt-6 max-w-4xl mx-auto px-6">

        {/* Step Indicator */}
        <div className="flex justify-center mb-5">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${currentStep === "cart" ? "bg-emerald-600 text-white" : "bg-gray-200"}`}>
              1
            </div>
            <span>Cart</span>
            <div className="w-8 h-1 bg-gray-200" />
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${["payment", "verification", "payment-failed"].includes(currentStep) ? "bg-emerald-600 text-white" : "bg-gray-200"}`}>
              2
            </div>
            <span>Payment</span>
            <div className="w-8 h-1 bg-gray-200" />
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${["verification", "payment-success"].includes(currentStep) ? "bg-emerald-600 text-white" : "bg-gray-200"}`}>
              3
            </div>
            <span>Complete</span>
          </div>
        </div>

        {/* Step 1: Cart Review */}
        {currentStep === "cart" && (
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r mb-5 from-emerald-600 to-green-600 bg-clip-text text-transparent ">
              Checkout
            </h1>

            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 max-w-2xl mx-auto border border-emerald-600">
              <h2 className="text-xl font-bold text-gray-900 mb-8">Order Summary</h2>

              <ul className="space-y-4 mb-8">
                {cartItems.map((item, index) => (
                  <li key={item._id || item.menuItemId || index} className="flex items-center justify-between py-1 px-6 bg-white/50 rounded-2xl">
                    <div>
                      <p className="font-semibold text-gray-900">{item.menuItem || item.name}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-xl font-bold text-emerald-600">₹{item.price * item.quantity}</p>
                  </li>
                ))}
              </ul>

              <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-6 rounded-2xl border-2 border-emerald-200 mb-8">
                <div className="flex justify-between text-2xl font-bold">
                  <span>Total</span>
                  <span className="text-emerald-600">₹{cartTotal}</span>
                </div>
              </div>

              <button
                onClick={() => setCurrentStep("payment")}
                disabled={cartItems.length === 0}
                className="w-full bg-gradient-to-r from-emerald-600 to-green-600 text-white py-4 px-8 rounded-2xl text-xl font-bold shadow-xl hover:shadow-2xl hover:from-emerald-700 hover:to-green-700 transition-all duration-200 disabled:opacity-50"
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Payment */}
        {currentStep === "payment" && (
          <div className="text-center max-w-md mx-auto">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/50">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment</h2>
              <p className="text-lg text-gray-600 mb-8">
                Total: ₹{cartTotal}
              </p>

              <div className="space-y-3 mb-8">
                <button
                  onClick={() => handlePayment("success")}
                  className="w-full bg-gradient-to-r from-emerald-600 to-green-600 text-white py-4 px-6 rounded-2xl font-semibold shadow-lg hover:shadow-xl hover:from-emerald-700 hover:to-green-700 transition-all"
                >
                  Pay with UPI/Card (Success)
                </button>
                <button
                  onClick={() => { handlePayment("failed") }}
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-4 px-6 rounded-2xl font-semibold shadow-lg hover:shadow-xl hover:from-red-600 hover:to-red-700 transition-all"
                >
                  Failed Payment
                </button>
              </div>

              <button
                onClick={() => setCurrentStep("cart")}
                className="text-emerald-600 hover:text-emerald-700 font-semibold underline"
              >
                ← Back to Cart
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Verification */}
        {currentStep === "verification" && (
          <div className="text-center max-w-md mx-auto">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/50">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-emerald-100 to-green-100 rounded-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-2 border-emerald-500 border-t-transparent"></div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Verifying Payment...</h2>
              <p className="text-lg text-gray-600 mb-8">
                Order #{orderId}
              </p>
              <button
                onClick={handleVerificationSuccess}
                className="bg-emerald-600 text-white py-3 px-8 rounded-xl font-semibold hover:bg-emerald-700 transition-all"
              >
                Payment Verified ✓
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Success */}
        {currentStep === "payment-success" && (
          <div className="text-center max-w-2xl mx-auto">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-emerald-600 border-emerald-600 border-2 border-opacity-50 p-7 border-white/50">
              <div className="w-28 h-28 mx-auto mb-8 bg-gradient-to-r from-emerald-100 to-green-100 rounded-2xl flex items-center justify-center shadow-lg">
                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${orderId}`} alt="" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Order Confirmed!</h1>
              <p className="text-xl text-gray-600 mb-2">Order #{orderId}</p>
              <p className="text-2xl font-bold text-emerald-600 ">₹{cartTotal}</p>
              <div className="space-y-3 mb-2 flex flex-col justify-center items-center p-4 ">
                <p className="text-emerald-600 max-w-max rounded-full px-3 py-2">Order placed successfully</p>
                <p className="text-emerald-600 max-w-max rounded-full px-3 py-2">Payment verified</p>
                <p className="text-red-600 max-w-max rounded-full px-3 py-2">Please collect your Order</p>
              </div>
              <button
                onClick={() => router.push("/dashboard")}
                className="bg-emerald-600 text-white px-5 py-2 rounded-2xl text-xl font-bold shadow-xl hover:shadow-2xl hover:bg-emerald-700 transition-all"
              >
                Buy more?
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Failed */}
        {currentStep === "payment-failed" && (
          <div className="text-center max-w-md mx-auto">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/50">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-red-100 to-rose-100 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment Failed</h2>
              <p className="text-lg text-gray-600 mb-8">
                Order #{orderId} - Please try again
              </p>
              <div className="space-y-3 mb-8">
                <button
                  onClick={() => setCurrentStep("payment")}
                  className="w-full bg-emerald-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-emerald-700"
                >
                  Retry Payment
                </button>
                <button
                  onClick={() => setCurrentStep("cart")}
                  className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-50"
                >
                  Edit Cart
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

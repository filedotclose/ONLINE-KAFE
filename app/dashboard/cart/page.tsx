"use client";

import { useEffect, useState } from "react";
import Navbar from "@/app/components/Navbar";
import { useRouter } from "next/navigation";


export default function Cart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/cart", {
          method: "GET",
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        });

        if (!res.ok) {
          console.log("Error fetching cart", res);
          setLoading(false);
          return;
        }

        const data = await res.json();
        setItems(data.items || []);
      } catch (err) {
        console.error("Error fetching cart:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  async function clearCart() {
    setLoading(true)
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/cart/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      if (!res.ok) {
        console.error("Error deleting cart");
        setLoading(false);
        return;
      }
      const data = await res.json;
      console.log(data);
      setItems([])
    } catch (e) {
      console.log("error deleting cart", e);
    } finally {
      setLoading(false);
    }
  }

  const handleConfirm = async () => {
    if(!(items.length == 0)){
    await clearCart();
  }
    router.push(`/dashboard`);
  }
  

  const cartTotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <main className="max-w-7xl mx-auto px-6 py-1 shadow-emerald-600">
      <Navbar />

      <h1 className="text-3xl font-extrabold mt-6 mb-4 text-emerald-600">
        Items in cart so far...
      </h1>

      {loading ? (
        <p className="text-emerald-500">Loading cart...</p>
      ) : items.length === 0 ? (
        <p className="text-emerald-500">You have no items in your cart yet.</p>
      ) : (
        <>
          <ul className="divide-y divide-gray-200 mt-4 border-2 p-4 border-emerald-600 border-opacity-30 rounded-2xl">
            {items.map((item, index) => (
              <li
                key={item._id || item.menuItemId || `${item.menuItem || item.name}-${index}`}
                className="flex justify-between py-3 active:scale-95 ease-in transition-all"
              >
                <div>
                  <p className="font-semibold">
                    {item.menuItem || item.name || "Item"}
                  </p>
                  <p className="text-sm text-gray-500">
                    Qty: {item.quantity}
                  </p>
                </div>
                <p className="font-semibold text-emerald-600">
                  ₹{item.price * item.quantity}
                </p>
              </li>
            ))}
          </ul>

          <div className="mt-6 mb-6 border-t pt-4 flex justify-between">
            <span className="font-bold text-lg">Total</span>
            <span className="font-bold text-lg text-emerald-600">
              ₹{cartTotal}
            </span>
          </div>
        </>
      )}
      {/* buttons  */}
      <div
        className="flex flex-row justify-center items-center space-x-4"
        id="buttons"
      >
        <button className="bg-emerald-600 text-white px-3 py-2 font-bold transition ease-in rounded-full hover:scale-105"
          onClick={() =>
            setShowModal(true)
          }
        >Menu</button>
        <button className="bg-emerald-600 text-white px-3 py-2 font-bold transition ease-in rounded-full hover:scale-105"
          onClick={clearCart}
        >Clear Cart</button>
        <button className="bg-emerald-600 text-white px-3 py-2 font-bold transition ease-in rounded-full hover:scale-105"
        onClick={()=>{
          if(items.length !=0){
          router.push("/checkout")}
          else{
            window.alert("cart is empty");
          }
        }}
        >
          Checkout</button>
      </div>
      {/* pop-up  */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80 text-center border-emerald-600 border-2 border-opacity-30">
            <h2 className="text-emerald-600 text-xl font-bold mb-4">
              If you go back to menu, your cart will be deleted. Are you sure?
            </h2>
            <div className="flex justify-around mt-4">
              <button
                onClick={handleConfirm}
                className="bg-emerald-600 text-white px-4 py-2 rounded transition-all ease-in hover:bg-red-700 hover:scale-105"
              >
                Yes
              </button>
              <button
                onClick={() => {setShowModal(false)}}
                className="bg-gray-300 text-black px-4 py-2 rounded transition-all ease-in hover:bg-gray-400 hover:scale-105"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

    </main >
  );


}

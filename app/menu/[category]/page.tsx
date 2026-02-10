"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/app/components/Navbar";
import { useRouter } from "next/navigation";
import { DiVim } from "react-icons/di";
import { setDefaultAutoSelectFamily } from "net";

export default function Menu() {
  const { category } = useParams();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await fetch(`/api/menu/${category}`, {
          method: "GET",
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          console.log("Error fetching data");
          return;
        }

        const data = await res.json();
        setItems(data.cat || []);
      } catch (err) {
        console.error("Error fetching categories:", err);
      } finally {
        setLoading(false);
      }
    };

    if (category) fetchItems();
  }, [category]);

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

        if (!res.ok) return;
        const data = await res.json();
        setCart(data.items || []);
      } catch (err) {
        console.error("Error fetching cart:", err);
      }
    };

    fetchCart();
  }, []);


  // purely react ka joh tha: add / increment item
  const addToCart = (item: MenuItem) => {
    setCart(prevCart => {
      // all entries must already have menuItemId
      const existingIndex = prevCart.findIndex(
        ci => ci.menuItemId === item._id
      );

      if (existingIndex !== -1) {
        const newCart = [...prevCart];
        newCart[existingIndex] = {
          ...newCart[existingIndex],
          quantity: newCart[existingIndex].quantity + 1,
        };
        return newCart;
      }

      return [
        ...prevCart,
        {
          menuItemId: item._id,
          menuItem: item.name,
          price: item.price,
          quantity: 1,
        },
      ];
    });

    setIsCartOpen(true);
  };

  //  change quantity
  const updateQuantity = (menuItemId: string, delta: number) => {
    setCart(prevCart => {
      const index = prevCart.findIndex(ci => ci.menuItemId === menuItemId);
      if (index === -1) return prevCart;

      const updated = [...prevCart];
      const newQty = updated[index].quantity + delta;

      // do not go below 1
      if (newQty < 1) return prevCart;

      updated[index] = {
        ...updated[index],
        quantity: newQty,
      };

      return updated;
    });
  };

  // remove item from react csrt
  const removeFromCart = (menuItemId: string) => {
    setCart(prevCart => prevCart.filter(ci => ci.menuItemId !== menuItemId));
  };


  const saveCartToBackend = async () => {
    try {
      setSaving(true);
      // remove duplicares
      const deduped: CartItem[] = [];
      cart.forEach(item => {
        const i = deduped.findIndex(d => d.menuItemId === item.menuItemId);
        if (i !== -1) {
          deduped[i] = {
            ...deduped[i],
            quantity: deduped[i].quantity + item.quantity,
          };
        } else {
          deduped.push({ ...item });
        }
      });

      const token = localStorage.getItem("token");
      const res = await fetch("/api/cart/insert", {
        method: "POST",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cartItems: deduped }),
      });

      const data = await res.json();
      if (!res.ok) {
        console.error("Save cart failed:", res.status, data);
        return;
      }

      setCart(data.items || []);
    } finally {
      setSaving(false);
    }
  };


  // total
  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[90vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-6 relative">
      <Navbar />
      <div className="hidden h-12 w-12 sm:flex justify-center items-center bg-emerald-600 absolute mt-5 rounded-full hover:scale-105 cursor-pointer"
        onClick={() => {
          router.push('/dashboard');
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M440-240 200-480l240-240 56 56-183 184 183 184-56 56Zm264 0L464-480l240-240 56 56-183 184 183 184-56 56Z" /></svg>
      </div>
      <h1 className="text-4xl font-extrabold text-center mt-6 mb-10 text-emerald-600">
        {typeof category === "string" ? category.toUpperCase() : ""} MENU
      </h1>

      {/* Menu Grid */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.length > 0 ? (
          items.map(item => (
            <div
              key={item._id}
              className={`bg-white rounded-xl shadow-lg overflow-hidden transition duration-300
          ${item.available ? "hover:scale-105 hover:shadow-2xl" : "opacity-70"}
        `}
            >
              <div className="h-48 w-full overflow-hidden relative">
                <img
                  src={`/${item.imageUrl}`}
                  alt={item.name}
                  className={`w-full h-full object-cover transition
              ${!item.available ? "grayscale" : ""}
            `}
                />

                {!item.available && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <span className="text-white font-semibold text-lg">
                      Out of Stock
                    </span>
                  </div>
                )}
              </div>

              <div className="p-5 flex flex-col justify-between h-52">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    {item.name}
                  </h2>
                  <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                    {item.description || "Delicious and freshly prepared!"}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <span className="text-lg font-semibold text-emerald-600">
                    ₹{item.price}
                  </span>

                  <button
                    onClick={() => addToCart(item)}
                    disabled={!item.available}
                    className={`px-4 py-2 rounded-lg shadow-md transition duration-300
                ${item.available
                        ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                        : "bg-gray-400 text-gray-700 cursor-not-allowed"
                      }
              `}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">
            No items found in this category.
          </p>
        )}
      </div>

      {/* button to move to cart */}
      <div className="w-full flex justify-center items-center mt-6">
        <button
          className="bg-emerald-600 block text-white text-2xl font-bold px-4 pt-1 pb-2 rounded-full hover:scale-105 transition-all ease-in duration-100 active:bg-emerald-900"
          onClick={() => {
            router.push('/dashboard/cart');
          }}
        >Proceed to Cart</button>
      </div>
      {/* cart side bar  */}
      {isCartOpen && (
        <div className="fixed right-0 rounded-xl border-2 border-green-600 top-36 h-full w-80 bg-white shadow-2xl p-6 overflow-y-auto transition-transform duration-300">
          <h2 className="text-2xl font-bold mb-4 text-emerald-600">
            Your Order
          </h2>
          {cart.length > 0 ? (
            cart.map((item: any, index: any) => (
              <div
                key={item.menuItemId || item._id || `${item.menuItem}-${index}`}
                className="flex items-center justify-between mb-4 border-b pb-2"
              >
                <div>
                  <h3 className="font-semibold">{item.menuItem}</h3>
                  <p className="text-sm text-gray-500">₹{item.price}</p>
                  <div className="flex items-center mt-2">
                    <button
                      onClick={() => updateQuantity(item.menuItemId, -1)}
                      className="px-2 py-1 bg-gray-200 rounded"
                    >
                      -
                    </button>
                    <span className="px-3">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.menuItemId, 1)}
                      className="px-2 py-1 bg-gray-200 rounded"
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => removeFromCart(item.menuItemId)}
                  className="text-red-500 hover:text-red-700"
                >
                  ✕
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500">Your cart is empty.</p>
          )}

          <div className="mt-6 border-t pt-4">
            <p className="text-lg font-bold">
              Total: <span className="text-emerald-600">₹{cartTotal}</span>
            </p>

            {/* Save Cart button */}
            <button
              onClick={saveCartToBackend}
              disabled={saving || cart.length === 0}
              className="w-full mt-4 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-300 text-white py-2 rounded-lg"
            >
              {saving ? "Saving..." : "Save Cart"}
            </button>

            <button
              onClick={() => setIsCartOpen(false)}
              className="w-full mt-2 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded-lg"
            >
              Close Cart
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

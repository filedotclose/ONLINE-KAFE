"use client";

import { useEffect, useState } from "react";
import Navbar from "@/app/components/Navbar";
import { useRouter } from "next/navigation";
export default function MenuItemsPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [ImageUrl, setImageUrl] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [description, setDescription] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await fetch("/api/category");
      const data = await res.json();
      setCategories(data.categories || []);
    };

    fetchCategories();
  }, []);


  useEffect(() => {
    if (!selectedCategory) return;

    const fetchMenuItems = async () => {
      const res = await fetch(
        `/api/menu-items/fetch/${selectedCategory}`,
        {
          method: "GET",
          headers: {
            "authorization": `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await res.json();
      setMenuItems(data.items || []);
    };

    fetchMenuItems();
  }, [selectedCategory]);


  const addMenuItem = async () => {
    if (!name || !price || !selectedCategory) {
      alert("Please fill all required fields");
      return;
    }

    const res = await fetch("/api/menu-items/insert", {
      method: "POST",
      headers: {
        "authorization": `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        price,
        categoryId: selectedCategory,
        description,
        ImageUrl,
        available: true,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert("Failed to add item");
      return;
    }

    setMenuItems((prev) => [...prev, data.item]);
    setName("");
    setPrice(0);
    setDescription("");
    setImageUrl("");
  };
  const toggleAvailability = async (id: string) => {
    const res = await fetch(`/api/menu-items/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      alert("Failed to update item");
      return;
    }

    setMenuItems((prev) =>
      prev.map((item) => (item._id === id ? data.item : item))
    );
  };

  return (
    <>
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Page Title */}
        <h1 className="text-3xl font-bold text-center text-emerald-600 mb-12">
          Manage Menu Items
        </h1>

        <div className="hidden h-12 w-12 sm:flex justify-center items-center mb-4 bg-emerald-600  mt-5 rounded-full hover:scale-105 cursor-pointer"
          onClick={() => {
            router.push('/admin');
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M440-240 200-480l240-240 56 56-183 184 183 184-56 56Zm264 0L464-480l240-240 56 56-183 184 183 184-56 56Z" /></svg>
        </div>
        {/* Category Selector */}
        <div className="bg-white border border-emerald-600 rounded-xl shadow-sm p-6 mb-10">
          <label className="block mb-3 font-semibold text-emerald-700">
            Select Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full border border-green-300  focus:border-emerald-500 focus:ring-emerald-500 rounded-lg p-3"
          >
            <option className="text-green-600" value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Add Menu Item */}
        {selectedCategory && (
          <div className="bg-white border border-emerald-600 rounded-xl shadow-md p-6 mb-12">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">
              Add Menu Item
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="text"
                placeholder="Item name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border border-gray-300 rounded-lg p-3 focus:ring-emerald-500 focus:border-emerald-500"
              />

              <input
                type="number"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="border border-gray-300 rounded-lg p-3 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <input
                placeholder="Description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border border-gray-300 rounded-lg p-3 focus:ring-emerald-500 focus:border-emerald-500"
              />

              <input
                type="text"
                placeholder="Image URL"
                value={ImageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="border border-gray-300 rounded-lg p-3 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <button
              onClick={addMenuItem}
              className="mt-8 w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-lg transition"
            >
              Add Item
            </button>
          </div>
        )}

        {/* Menu Items Table */}
        {selectedCategory && (
          <div className="bg-white border border-emerald-600 rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">
              Existing Menu Items
            </h2>

            {menuItems.length === 0 ? (
              <p className="text-gray-500 text-center py-6">
                No items in this category.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b text-gray-600">
                      <th className="py-3">Name</th>
                      <th>Price</th>
                      <th>Status</th>
                      <th className="text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {menuItems.map((item) => (
                      <tr
                        key={item._id}
                        className="border-b hover:bg-gray-50 transition"
                      >
                        <td className="py-3 font-medium">{item.name}</td>
                        <td>₹{item.price}</td>
                        <td>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${item.available
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                              }`}
                          >
                            {item.available ? "Available" : "Disabled"}
                          </span>
                        </td>
                        <td className="text-center">
                          <button
                            onClick={() => toggleAvailability(item._id)}
                            className={`px-4 py-2 rounded-lg text-white font-medium transition ${item.available
                                ? "bg-red-500 hover:bg-red-600"
                                : "bg-emerald-500 hover:bg-emerald-600"
                              }`}
                          >
                            {item.available ? "Disable" : "Enable"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

"use client";

import { useEffect, useState } from "react";
import Navbar from "@/app/components/Navbar";

export default function MenuItemsPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [ImageUrl, setImageUrl] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [description, setDescription] = useState("");

  
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
          method : "GET",
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
        available : true,
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

      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-center text-green-600 mb-10">
          Manage Menu Items
        </h1>

        
        <div className="mb-8">
          <label className="block mb-2 font-medium">
            Select Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full border border-emerald-600 rounded-lg p-2"
          >
            <option>Select a category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        
        {selectedCategory && (
          <div className="bg-white border border-emerald-600 rounded-xl shadow-md p-6 mb-10">
            <h2 className="text-xl font-semibold mb-4">
              Add Menu Item
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Item name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border rounded p-2"
              />

              <input
                type="number"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="border rounded p-2"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border rounded p-2 w-full mt-4"
            />

              <input 
              type="text" 
              placeholder="Image Url"
              value = {ImageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className = "border rounded p-2 w-full mt-4"
              />

            </div>

            <button
              onClick={addMenuItem}
              className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg"
            >
              Add Item
            </button>
          </div>
        )}

       
        {selectedCategory && (
          <div className="bg-white border border-emerald-600 rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">
              Existing Menu Items
            </h2>

            {menuItems.length === 0 ? (
              <p className="text-gray-500">
                No items in this category.
              </p>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b">
                    <th className="py-2">Name</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {menuItems.map((item) => (
                    <tr key={item._id} className="border-b">
                      <td className="py-2">{item.name}</td>
                      <td>₹{item.price}</td>
                      <td>
                        {item.available ? (
                          <span className="text-green-600 font-medium">
                            Available
                          </span>
                        ) : (
                          <span className="text-red-600 font-medium">
                            Disabled
                          </span>
                        )}
                      </td>
                      <td>
                        <button
                          onClick={() => toggleAvailability(item._id)}
                          className={`px-4 py-1 rounded text-white ${
                            item.available
                              ? "bg-red-500 hover:bg-red-600"
                              : "bg-green-500 hover:bg-green-600"
                          }`}
                        >
                          {item.available ? "Disable" : "Enable"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </>
  );
}

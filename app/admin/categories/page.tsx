"use client";

import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import { useRouter } from "next/navigation";
export default function AdminPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newName, setNewName] = useState("");
  const [newIcon, setNewIcon] = useState("");
  const [deleteName, setDeleteName] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const router = useRouter();
  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/category");
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async () => {
    if (!newName || !newIcon) {
      setMessage("⚠️ Please fill in all fields.");
      return;
    }
    const token = localStorage.getItem("token");
    const res = await fetch("/api/category/Insert", {
      method: "POST",
      headers: {
        "authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name: newName, icon: newIcon }),
    });

    const data = await res.json();
    setMessage(data.message || data.error);

    if (res.ok) {
      setNewName("");
      setNewIcon("");
      fetchCategories();
    }
  };

  const handleDeleteCategory = async () => {
    if (!deleteName) {
      setMessage(" Enter a category name to delete.");
      return;
    }
    const token = localStorage.getItem("token");
    const res = await fetch("/api/category/delete", {
      method: "DELETE",
      headers: {
        "authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name: deleteName }),
    });

    const data = await res.json();
    setMessage(data.message || data.error);

    if (res.ok) {
      setDeleteName("");
      fetchCategories();
    }
  };

  return (
    <main className="min-h-screen">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-4xl font-bold text-center text-emerald-600 mb-10">
          Admin Dashboard
        </h1>

        <div className="hidden h-12 w-12 sm:flex justify-center items-center bg-emerald-600  mt-5 rounded-full hover:scale-105 cursor-pointer"
          onClick={() => {
            router.push('/admin');
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M440-240 200-480l240-240 56 56-183 184 183 184-56 56Zm264 0L464-480l240-240 56 56-183 184 183 184-56 56Z" /></svg>
        </div>
        {/* Feedback */}
        {message && (
          <div className="mb-6 text-center">
            <div className="inline-block px-5 py-2 rounded-lg bg-white shadow text-gray-700">
              {message}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {/* Add Category */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold text-emerald-600 mb-4">
              ➕ Add Category
            </h2>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Category name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-400"
              />

              <input
                type="text"
                placeholder="Icon (emoji / text)"
                value={newIcon}
                onChange={(e) => setNewIcon(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-400"
              />

              <button
                onClick={handleAddCategory}
                className="w-full bg-emerald-500 text-white py-2 rounded-lg hover:bg-emerald-600 transition"
              >
                Add Category
              </button>
            </div>
          </div>

          {/* Delete Category */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold text-red-600 mb-4">
              🗑️ Delete Category
            </h2>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Category name"
                value={deleteName}
                onChange={(e) => setDeleteName(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-400"
              />

              <button
                onClick={handleDeleteCategory}
                className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
              >
                Delete Category
              </button>
            </div>
          </div>
        </div>

        {/* Categories Table */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            📦 Existing Categories
          </h2>

          {loading ? (
            <p className="text-gray-500">Loading categories...</p>
          ) : categories.length === 0 ? (
            <p className="text-gray-500">No categories found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse rounded-lg overflow-hidden">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-4 py-2 text-left">Name</th>
                    <th className="border px-4 py-2 text-center">Icon</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat) => (
                    <tr
                      key={cat._id}
                      className="hover:bg-gray-50 transition"
                    >
                      <td className="border px-4 py-2">{cat.name}</td>
                      <td className="border px-4 py-2 text-center text-lg">
                        {cat.icon}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

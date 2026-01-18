"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";



export default function Dashboard() {

  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [newIcon, setNewIcon] = useState("");
  const [deleteName, setDeleteName] = useState("");

  const router = useRouter();
  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser.name && parsedUser.name.includes("Admin")) {
            setIsAdmin(true);
          }
        } catch (err) {
          console.error("Error parsing user from localStorage:", err);
        }
      }
      const res = await fetch("/api/category", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      if (!res.ok) {
        console.log("error fetching data");
      }
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/category/Insert", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newName, icons: newIcon }),
      });
      const data = await res.json();
      console.log(data.message || data.error);
      fetchCategories();
    }
    catch (err) {
      console.log("Error" + err);
    } finally {
      setLoading(false);

    }
  };

   const handleDeleteCategory = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch("/api/category/delete", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: deleteName }),
      });
      const data = await res.json();
      console.log(data.message || data.error);
    } catch (err) {
      console.log("Error" + err);
    } finally {
      setLoading(false);
      fetchCategories();
    }
  };



  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-1 shadow-emerald-600">
      <Navbar />
      <h1 className="lg:text-7xl  my-5 sm:text-4xl font-extrabold text-emerald-600 mb-10 text-center">From the best to the best, for the KIITIANS!</h1>
      <h2 className="text-3xl my-5 sm:text-4xl font-extrabold text-emerald-600 mb-10 text-center">
        Explore Our Categories
      </h2>
      {/* admin use */}
      
      <div className="grid gap-8  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 mb-20">
        {categories.map((cat) => (
          <div
            key={cat._id}
            onClick={() => {
              router.push(`/menu/${cat.name}`);
            }}
            className="group relative bg-white rounded-2xl shadow-lg hover:shadow-emerald-400/50 transition-all duration-300 overflow-hidden cursor-pointer border border-gray-100 hover:border-emerald-500"
          >

            <img
              src={`/${cat.name}.png`}
              alt="issue"
              className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <span className="text-white text-lg font-semibold tracking-wide">
                View {cat.name}
              </span>
            </div>

            <div className="p-4">
              <h3 className="text-xl font-semibold text-gray-800 group-hover:text-emerald-600 transition-colors text-center duration-300">
                {cat.name}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

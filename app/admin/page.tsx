"use client";

import Link from "next/link";
import Navbar from "../components/Navbar";

export default function AdminPage() {
    return (
        <main className="min-h-fit">
            <Navbar />
            <div className="max-w-6xl mx-auto px-4 py-10">
                <h1 className="text-4xl font-bold text-center text-emerald-600 mb-24">
                    Admin Dashboard
                </h1>

                <div className="flex flex-col md:flex-row gap-6">
                    <div className="bg-white rounded-xl border border-emerald-600 shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-2">
                            Manage Categories
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Add or delete food categories for the canteen.
                        </p>
                        <Link href="/admin/categories">
                            <button className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg">
                                Go to Categories
                            </button>
                        </Link>
                    </div>
                    <div className="bg-white rounded-xl border border-emerald-600 shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-2">
                            Manage Menu Items
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Add or remove menu items under each category.
                        </p>
                        <Link href="/admin/menu-items">
                            <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg">
                                Go to Menu Items
                            </button>
                        </Link>
                    </div>
                    <div className="bg-white rounded-xl border border-emerald-600  shadow-md p-6 md:col-span-2">
                        <h2 className="text-xl font-semibold mb-2">
                            Manage Orders
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Approve or reject user orders and payments.
                        </p>
                        <Link href="/admin/orders">
                            <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-lg">
                                Go to Orders
                            </button>
                        </Link>
                    </div>

                </div>
            </div>
        </main>

    );
}

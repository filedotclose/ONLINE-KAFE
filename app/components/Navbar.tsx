"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { IoIosLogOut } from "react-icons/io";


export default function Navbar() {
    const router = useRouter();
    const [user, setUser] = useState<UserType | null>(null);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) setUser(JSON.parse(storedUser));
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token"); 
        setUser(null);
        router.push("/login");
    };

    return (

        <nav className="bg-white/95 backdrop-blur-sm border border-green-500 shadow-lg  sticky top-4 mx-4 mt-8 rounded-2xl z-50">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
                <div className="flex justify-between items-center h-14 sm:h-16 md:h-18 lg:h-20">
                    <h1 className="text-lg sm:text-xl md:text-2xl lg:text-2xl xl:text-3xl font-extrabold truncate text-emerald-500">
                        KIIT KAFE
                    </h1>
                    <div className="flex items-center gap-1 sm:gap-2 md:gap-3 lg:gap-4 relative">
                        <div className="relative flex items-center group">
                            <div className="mr-3 hidden sm:block text-emerald-600 font-semibold [text-shadow:0_0_12px_rgba(5,150,105,0.8)]">
                                <h1>Welcome {user?.name.split(' ')[0]}!</h1>
                            </div>
                            <div id="avatar" onClick={()=> setOpen(open => !open)} className="rounded-full cursor-pointer hover:scale-110 active:bg-emerald-900 bg-emerald-600 w-10 h-10 flex items-center justify-center font-semibold text-white transition ease-out">
                                {user?.name.charAt(0).toUpperCase()}
                            </div>
                        </div>
                        {open && (
                            <div className="absolute transition-all ease-in flex flex-col right-0 mt-2 w-40 bg-white shadow-lg rounded-xl 
                        border border-gray-200 py-2 z-50 animate-fadeIn translate-y-20">
                                <a href="/history" className="w-full text-left px-4 py-2 hover:bg-gray-100 transition text-emerald-600">
                                    Order Histroy
                                </a>
                                <a href="/dashboard/cart"
                                 className="w-full text-left px-4 py-2 hover:bg-gray-100 transition text-emerald-600"
                                 >
                                    Cart
                                </a>
                            </div>
                        )}

                        <button
                            className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 text-red-600 hover:text-red-700 bg-[#c8c8c840] hover:bg-red-50 rounded-md transition-all duration-200 hover:scale-105 cursor-pointer"
                            aria-label="Logout"
                            onClick={handleLogout}
                        >
                            <IoIosLogOut className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}


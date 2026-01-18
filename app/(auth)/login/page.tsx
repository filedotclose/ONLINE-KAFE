"use client"


import React, { ReactEventHandler, useState } from "react"
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"

export default function LoginPage() {

  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!password || !email || !name) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/login', {
        method: "POST",
        headers:{
          "Content-Type" : "application/json"
        },
        body: JSON.stringify({ email, password })
      })
      console.log(res);

      const data = await res.json();

      console.log(data.user.name);
      if (!res.ok) {
        setError(data.error);
        console.log(data.error);
        setLoading(false);
      } else {
        console.log(data.message);
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        if (data.user?.name?.includes("Admin") || data.user?.email?.includes("admin")) {
          localStorage.setItem("Admin", JSON.stringify(data.user));
          router.push("/admin");
        } else {
          router.push("/dashboard")
        }


      }
    } catch (err) {
      console.log("this is the error", err);
      setLoading(false);
      setError("An error has occured");
    }
  }
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-lime-300 to-emerald-400">
      <div className="mx-4 w-full max-w-md ">
        <div className="hidden lg:block absolute top-10 left-10 bg-white px-5 py-2 rounded-2xl transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:shadow-2xl">
          <Link href={'/'}>
            <Image
              className=" "
              src={'/logo.png'}
              alt="logo"
              width={150}
              height={150}
            ></Image>
          </Link>
        </div>
        <div className="rounded-3xl p-[3px] bg-gradient-to-r from-[#8AF35C] to-[#C9F27A] shadow-xl">
          <div className="rounded-[26px] bg-white px-6 py-8 sm:px-8 sm:py-10">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-center text-emerald-700">
              Login to your account
            </h1>
            <p className="mt-2 text-sm text-center text-gray-600">
              Login with your KIIT email to start ordering.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Full name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full rounded-full border border-emerald-100 bg-emerald-50/30 px-4 py-2.5 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  KIIT email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}

                  onChange={(e) => setEmail(e.target.value)}
                  className=" mt-1 w-full rounded-full border border-emerald-100 bg-emerald-50/30 px-4 py-2.5 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
                  placeholder="you@kiit.ac.in"
                />
              </div>

              <div className="relative flex flex-col">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 w-full rounded-full border border-emerald-100 bg-emerald-50/30 px-4 py-2.5 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
                  placeholder="••••••••"
                />
                <span className="absolute right-3 top-11 transform -translate-y-1/2 text-gray-500 hover:text-gray-700">
                  {showPassword ? (
                    <FaRegEye
                      onClick={() => setShowPassword(false)} />) :
                    (
                      <FaRegEyeSlash
                        onClick={() => setShowPassword(true)}
                      />
                    )
                  }
                </span>
              </div>

              {error && (<p className="text-sm text-center text-red-600 mt-1">{error}</p>)}

              <button
                type="submit"
                disabled={loading}
                className="mt-3 w-full inline-flex items-center justify-center rounded-full bg-[#1f6c16] px-6 py-2.5 text-sm font-semibold tracking-wide text-white shadow-[0_6px_0_#155010] hover:translate-y-[1px] hover:shadow-[0_4px_0_#155010] active:translate-y-[2px] active:shadow-[0_2px_0_#155010] disabled:opacity-70 disabled:cursor-not-allowed transition-all"
              >
                {loading ? "Logging in..." : "Log in"}
              </button>
              <p className="mt-4 text-xs text-center text-gray-500">
                Dont have an account?{" "}
                <a href="/register" className="font-medium text-emerald-700 hover:underline">
                  Register
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </main>
  )
}

// components/LandingHero.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
export default function LandingHero() {
  return (
    <div className="relative h-screen w-full rounded-[40px] p-8 shadow-xl/30">
        
      <section className="w-full h-full rounded-[36px] bg-white flex flex-col items-center justify-center px-6 py-12 sm:py-16">
        <div className="absolute top-14 left-14">
            <Image
            className=" "
            src={'/logo.png'}
            alt="logo"
            width={150}
            height={150}
        >
        </Image>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold uppercase  text-[#2b7a1f] text-center drop-shadow-[0_2px_0_#b2ff8b] ">
          Welcome to KIIT KAFE
        </h1>

        <p className="mt-6 border px-3 text-white font-extrabold py-1 rounded-full bg-[#2b7a1f] shadow-green-500 shadow-2xl sm:text-lg  text-center">
          One stop solution for all the snacks
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-full bg-[#1f6c16] px-10 py-3 text-sm font-semibold  text-white shadow-[0_6px_0_#155010] hover:translate-y-[1px] hover:shadow-[0_4px_0_#155010] active:translate-y-[2px]  transition-all"
          >
            LOGIN
          </Link>

          <Link
            href="/register"
            className="inline-flex items-center justify-center rounded-full bg-[#1f6c16] px-10 py-3 text-sm font-semibold  text-white shadow-[0_6px_0_#155010] hover:translate-y-[1px] hover:shadow-[0_4px_0_#155010] active:translate-y-[2px] transition-all"
          >
            REGISTER
          </Link>
        </div>
      </section>
    </div>
  );
}

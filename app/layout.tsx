//isme metadata title use kiya aur antialiased hai""
import "./globals.css";
import type { ReactNode } from "react";
export const metadata = {
  title: "KIIT KAFE",
  description: "Online canteen for KIIT students",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased min-h-screen flex flex-col">
        <main className="flex-grow">
          {children}
        </main>
        <footer className="bg-emerald-600 text-white py-6 px-4">
          <div className="text-center text-4xl font-bold font-serif tracking-wider">
            <p>Made with love</p>
          </div>
          <div className="mt-6 text-center text-xs">
            © {new Date().getFullYear()} KIIT Canteen. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}

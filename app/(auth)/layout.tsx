//isme metadata title use kiya aur antialiased hai
import "../globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "KIIT KAFE",
  description: "Online canteen for KIIT students",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body>
        {children}
        </body>
    </html>
  );
}

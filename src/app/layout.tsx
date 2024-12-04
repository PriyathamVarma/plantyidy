// app/layout.js
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import { ReactNode } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "LeafScan | Plant Identifier",
  description: "AI-powered plant identification and care companion",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-gradient-to-br from-green-50 to-emerald-100 min-h-screen`}
      >
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
            {children}
          </main>
          <footer className="bg-white/50 backdrop-blur-md py-6 border-t border-green-100">
            <div className="container mx-auto max-w-6xl flex justify-between items-center">
              <p className="text-green-800 font-medium">© 2024 LeafScan</p>
              <div className="space-x-4 text-green-700">
                <a href="#" className="hover:text-green-900 transition">
                  Privacy
                </a>
                <a href="#" className="hover:text-green-900 transition">
                  Terms
                </a>
                <a href="#" className="hover:text-green-900 transition">
                  Contact
                </a>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}

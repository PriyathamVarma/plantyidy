// app/components/Navbar.js
import Link from "next/link";
import { Leaf, Scan } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-lg">
      <div className="container mx-auto max-w-6xl flex justify-between items-center py-4 px-4">
        <Link href="/" className="flex items-center space-x-3 group">
          <Leaf className="h-8 w-8 text-green-600 group-hover:rotate-6 transition-transform" />
          <span className="text-2xl font-bold text-green-900 tracking-tight">
            Vruksha Vidya
          </span>
        </Link>
        <div className="flex items-center space-x-6">
          <Link
            href="/"
            className="text-green-800 font-medium hover:text-green-600 transition flex items-center space-x-2"
          >
            <Scan className="h-5 w-5" />
            <span>Identify</span>
          </Link>
          <Link
            href="/guide"
            className="text-green-800 font-medium hover:text-green-600 transition flex items-center space-x-2"
          >
            <Leaf className="h-5 w-5" />
            <span>Plant Guide</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}

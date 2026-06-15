"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { ShoppingBag, Menu, X, Sparkles } from "lucide-react"
import { useState } from "react"
import { useCartStore } from "@/store/cart"

export default function Header() {
  const { data: session } = useSession()
  const [menuOpen, setMenuOpen] = useState(false)
  const itemCount = useCartStore((s) => s.itemCount())

  return (
    <header className="sticky top-0 z-50 glass border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-teal-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold gradient-text">
              SSS
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/products"
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-all"
            >
              Catalog
            </Link>
            {session?.user ? (
              <>
                <Link
                  href="/orders"
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-all"
                >
                  My Orders
                </Link>
                {session.user.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    className="px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 rounded-lg hover:bg-indigo-50 transition-all"
                  >
                    Admin
                  </Link>
                )}
                <Link href="/cart" className="relative p-2 text-gray-600 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-all">
                  <ShoppingBag className="w-5 h-5" />
                  {itemCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-gradient-to-br from-indigo-500 to-teal-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
                      {itemCount}
                    </span>
                  )}
                </Link>
                <button
                  onClick={() => signOut()}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-red-600 rounded-lg hover:bg-red-50 transition-all"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/cart" className="relative p-2 text-gray-600 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-all">
                  <ShoppingBag className="w-5 h-5" />
                  {itemCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-gradient-to-br from-indigo-500 to-teal-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
                      {itemCount}
                    </span>
                  )}
                </Link>
                <Link
                  href="/auth/signin"
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-all"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/register"
                  className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-teal-500 rounded-lg hover:from-indigo-600 hover:to-teal-600 transition-all shadow-md hover:shadow-lg"
                >
                  Register
                </Link>
              </>
            )}
          </nav>

          <div className="md:hidden flex items-center gap-2">
            <Link href="/cart" className="relative p-2 text-gray-600">
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-gradient-to-br from-indigo-500 to-teal-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
                  {itemCount}
                </span>
              )}
            </Link>
            <button
              className="p-2 text-gray-600 hover:text-indigo-600 rounded-lg hover:bg-indigo-50"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden pb-4 space-y-1 animate-fade-in-up">
            <Link
              href="/products"
              className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-all"
              onClick={() => setMenuOpen(false)}
            >
              Catalog
            </Link>
            {session?.user ? (
              <>
                <Link
                  href="/orders"
                  className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-all"
                  onClick={() => setMenuOpen(false)}
                >
                  My Orders
                </Link>
                {session.user.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    className="block px-4 py-2.5 text-sm font-medium text-indigo-600 rounded-lg hover:bg-indigo-50 transition-all"
                    onClick={() => setMenuOpen(false)}
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={() => { signOut(); setMenuOpen(false) }}
                  className="block w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-red-600 rounded-lg hover:bg-red-50 transition-all"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-all"
                  onClick={() => setMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/register"
                  className="block px-4 py-2.5 text-sm font-semibold text-indigo-600 rounded-lg hover:bg-indigo-50 transition-all"
                  onClick={() => setMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  )
}

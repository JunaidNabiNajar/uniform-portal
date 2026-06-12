"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { ShoppingBag, Menu, X } from "lucide-react"
import { useState } from "react"
import { useCartStore } from "@/store/cart"

export default function Header() {
  const { data: session } = useSession()
  const [menuOpen, setMenuOpen] = useState(false)
  const itemCount = useCartStore((s) => s.itemCount())

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold text-gray-900">
            UniformPortal
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/products" className="text-sm font-medium text-gray-700 hover:text-gray-900">
              Catalog
            </Link>
            {session?.user ? (
              <>
                <Link href="/orders" className="text-sm font-medium text-gray-700 hover:text-gray-900">
                  My Orders
                </Link>
                {session.user.role === "ADMIN" && (
                  <Link href="/admin" className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
                    Admin
                  </Link>
                )}
                <Link href="/cart" className="relative text-gray-700 hover:text-gray-900">
                  <ShoppingBag className="w-5 h-5" />
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </Link>
                <button
                  onClick={() => signOut()}
                  className="text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/cart" className="relative text-gray-700 hover:text-gray-900">
                  <ShoppingBag className="w-5 h-5" />
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </Link>
                <Link
                  href="/auth/signin"
                  className="text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/register"
                  className="text-sm font-medium bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                >
                  Register
                </Link>
              </>
            )}
          </nav>

          <button
            className="md:hidden text-gray-700"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link
              href="/products"
              className="block text-sm font-medium text-gray-700 py-2"
              onClick={() => setMenuOpen(false)}
            >
              Catalog
            </Link>
            {session?.user ? (
              <>
                <Link
                  href="/orders"
                  className="block text-sm font-medium text-gray-700 py-2"
                  onClick={() => setMenuOpen(false)}
                >
                  My Orders
                </Link>
                {session.user.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    className="block text-sm font-medium text-indigo-600 py-2"
                    onClick={() => setMenuOpen(false)}
                  >
                    Admin
                  </Link>
                )}
                <Link
                  href="/cart"
                  className="block text-sm font-medium text-gray-700 py-2"
                  onClick={() => setMenuOpen(false)}
                >
                  Cart ({itemCount})
                </Link>
                <button
                  onClick={() => { signOut(); setMenuOpen(false) }}
                  className="block text-sm font-medium text-gray-700 py-2"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/cart"
                  className="block text-sm font-medium text-gray-700 py-2"
                  onClick={() => setMenuOpen(false)}
                >
                  Cart ({itemCount})
                </Link>
                <Link
                  href="/auth/signin"
                  className="block text-sm font-medium text-gray-700 py-2"
                  onClick={() => setMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/register"
                  className="block text-sm font-medium text-indigo-600 py-2"
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

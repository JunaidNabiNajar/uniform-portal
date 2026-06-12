"use client"

import Link from "next/link"
import Image from "next/image"
import { Trash2, Minus, Plus, ShoppingBag, ArrowLeft } from "lucide-react"
import { useCartStore } from "@/store/cart"
import { formatPrice } from "@/lib/utils"

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, itemCount } = useCartStore()

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <ShoppingBag className="w-16 h-16 mx-auto text-gray-300" />
        <h1 className="mt-4 text-2xl font-bold text-gray-900">Your cart is empty</h1>
        <p className="mt-2 text-gray-500">Add some products to get started.</p>
        <Link
          href="/products"
          className="mt-6 inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800"
        >
          <ArrowLeft className="w-4 h-4" />
          Continue Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
      <p className="mt-1 text-gray-500">{itemCount()} item(s)</p>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={`${item.productId}-${item.size}-${item.color}`}
              className="flex items-center gap-4 bg-white rounded-xl border border-gray-200 p-4"
            >
              <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={80}
                    height={80}
                    className="object-cover rounded-lg"
                  />
                ) : (
                  <span className="text-gray-400 text-lg">{item.name[0]}</span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <Link
                  href={`/products/${item.productId}`}
                  className="text-sm font-medium text-gray-900 hover:text-indigo-600 truncate block"
                >
                  {item.name}
                </Link>
                <p className="text-xs text-gray-500 mt-1">
                  {item.size && `Size: ${item.size}`}
                  {item.size && item.color && " | "}
                  {item.color && `Color: ${item.color}`}
                </p>
                <p className="text-sm font-medium text-gray-900 mt-1">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    updateQuantity(item.productId, item.size, item.color, item.quantity - 1)
                  }
                  className="p-1 rounded hover:bg-gray-100"
                >
                  <Minus className="w-4 h-4 text-gray-500" />
                </button>
                <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                <button
                  onClick={() =>
                    updateQuantity(item.productId, item.size, item.color, item.quantity + 1)
                  }
                  className="p-1 rounded hover:bg-gray-100"
                >
                  <Plus className="w-4 h-4 text-gray-500" />
                </button>
              </div>

              <button
                onClick={() => removeItem(item.productId, item.size, item.color)}
                className="p-2 text-gray-400 hover:text-red-500"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 h-fit">
          <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
          <div className="mt-4 space-y-3">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal ({itemCount()} items)</span>
              <span>{formatPrice(total())}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Shipping</span>
              <span>Calculated at checkout</span>
            </div>
            <div className="border-t pt-3 flex justify-between text-base font-semibold text-gray-900">
              <span>Total</span>
              <span>{formatPrice(total())}</span>
            </div>
          </div>
          <Link
            href="/checkout"
            className="mt-6 w-full flex items-center justify-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Proceed to Checkout
          </Link>
          <Link
            href="/products"
            className="mt-3 w-full flex items-center justify-center text-sm text-indigo-600 hover:text-indigo-800"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}

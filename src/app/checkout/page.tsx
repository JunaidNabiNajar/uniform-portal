"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { ShoppingBag, ArrowLeft, QrCode, Banknote } from "lucide-react"
import { useCartStore } from "@/store/cart"
import { formatPrice } from "@/lib/utils"

type PaymentMethod = "SCAN_PAY" | "COD"

export default function CheckoutPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const { items, total, clearCart } = useCartStore()
  const [submitting, setSubmitting] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("COD")
  const [form, setForm] = useState({
    shippingName: "",
    shippingAddress: "",
    shippingCity: "",
    shippingState: "",
    shippingZip: "",
    shippingPhone: "",
  })

  if (!session?.user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Sign in to checkout</h1>
        <Link
          href="/auth/signin"
          className="mt-4 inline-flex items-center text-indigo-600 hover:text-indigo-800"
        >
          Sign In
        </Link>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <ShoppingBag className="w-16 h-16 mx-auto text-gray-300" />
        <h1 className="mt-4 text-2xl font-bold text-gray-900">Your cart is empty</h1>
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, paymentMethod }),
      })

      if (!res.ok) {
        const data = await res.json()
        alert(data.error || "Checkout failed")
        setSubmitting(false)
        return
      }

      const order = await res.json()
      clearCart()

      if (paymentMethod === "SCAN_PAY") {
        router.push(`/orders/${order.id}?payment=scan`)
      } else {
        router.push(`/orders/${order.id}`)
      }
    } catch {
      alert("Something went wrong")
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900">Shipping Information</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  required
                  value={form.shippingName}
                  onChange={(e) => setForm({ ...form, shippingName: e.target.value })}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <input
                  type="text"
                  required
                  value={form.shippingAddress}
                  onChange={(e) => setForm({ ...form, shippingAddress: e.target.value })}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">City</label>
                <input
                  type="text"
                  required
                  value={form.shippingCity}
                  onChange={(e) => setForm({ ...form, shippingCity: e.target.value })}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">State</label>
                <input
                  type="text"
                  required
                  value={form.shippingState}
                  onChange={(e) => setForm({ ...form, shippingState: e.target.value })}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">ZIP Code</label>
                <input
                  type="text"
                  required
                  value={form.shippingZip}
                  onChange={(e) => setForm({ ...form, shippingZip: e.target.value })}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone (optional)</label>
                <input
                  type="tel"
                  value={form.shippingPhone}
                  onChange={(e) => setForm({ ...form, shippingPhone: e.target.value })}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900">Payment Method</h2>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setPaymentMethod("SCAN_PAY")}
                className={`flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${
                  paymentMethod === "SCAN_PAY"
                    ? "border-indigo-600 bg-indigo-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className={`p-2 rounded-lg ${paymentMethod === "SCAN_PAY" ? "bg-indigo-100" : "bg-gray-100"}`}>
                  <QrCode className={`w-6 h-6 ${paymentMethod === "SCAN_PAY" ? "text-indigo-600" : "text-gray-600"}`} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Scan & Pay</p>
                  <p className="text-xs text-gray-500 mt-0.5">Pay via UPI, GPay, PhonePe</p>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("COD")}
                className={`flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${
                  paymentMethod === "COD"
                    ? "border-indigo-600 bg-indigo-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className={`p-2 rounded-lg ${paymentMethod === "COD" ? "bg-indigo-100" : "bg-gray-100"}`}>
                  <Banknote className={`w-6 h-6 ${paymentMethod === "COD" ? "text-indigo-600" : "text-gray-600"}`} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Cash on Delivery</p>
                  <p className="text-xs text-gray-500 mt-0.5">Pay when order arrives</p>
                </div>
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 transition-colors"
          >
            {submitting ? "Processing..." : `Place Order - ${formatPrice(total())}`}
          </button>
        </form>

        <div className="bg-white rounded-xl border border-gray-200 p-6 h-fit">
          <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
          <div className="mt-4 space-y-3">
            {items.map((item) => (
              <div key={`${item.productId}-${item.size}-${item.color}`} className="flex justify-between text-sm">
                <span className="text-gray-600 truncate mr-2">
                  {item.name} x{item.quantity}
                  {item.size && ` (${item.size})`}
                </span>
                <span className="text-gray-900 font-medium">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
            <div className="border-t pt-3 flex justify-between text-base font-semibold text-gray-900">
              <span>Total</span>
              <span>{formatPrice(total())}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

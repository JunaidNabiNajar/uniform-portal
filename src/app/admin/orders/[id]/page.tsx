"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { formatPrice, parseImageString } from "@/lib/utils"

type OrderWithItems = {
  id: string
  status: string
  total: number
  paymentMethod: string
  shippingName: string
  shippingAddress: string
  shippingCity: string
  shippingState: string
  shippingZip: string
  shippingPhone: string | null
  createdAt: string
  user: { email: string; name: string | null }
  items: {
    id: string
    quantity: number
    size: string | null
    color: string | null
    price: number
    product: { id: string; name: string; slug: string; images: string }
  }[]
}

export default function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const router = useRouter()
  const [orderId, setOrderId] = useState("")
  const [order, setOrder] = useState<OrderWithItems | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    params.then((p) => setOrderId(p.id))
  }, [params])

  useEffect(() => {
    if (!orderId) return
    fetch(`/api/admin/orders/${orderId}`)
      .then((r) => r.json())
      .then((data) => {
        setOrder(data)
        setLoading(false)
      })
  }, [orderId])

  const updateStatus = async (status: string) => {
    setUpdating(true)
    const res = await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
    if (res.ok) {
      const updated = await res.json()
      setOrder(updated)
    }
    setUpdating(false)
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-bold text-gray-900">Order not found</h1>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-3xl">
      <Link
        href="/admin/orders"
        className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-6"
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        Back to Orders
      </Link>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Order #{order.id.slice(0, 8)}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Placed on {new Date(order.createdAt).toLocaleDateString()} by {order.user.email}
          </p>
          <span className={`mt-2 inline-block px-3 py-1 rounded-full text-sm font-medium ${
            order.status === "PENDING" ? "bg-yellow-100 text-yellow-800" :
            order.status === "PROCESSING" ? "bg-blue-100 text-blue-800" :
            order.status === "SHIPPED" ? "bg-purple-100 text-purple-800" :
            order.status === "DELIVERED" ? "bg-green-100 text-green-800" :
            order.status === "CANCELLED" ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-800"
          }`}>
            {order.status}
          </span>
        </div>
      </div>

      {order.status !== "CANCELLED" && order.status !== "DELIVERED" && (
        <div className="mt-6 flex flex-wrap gap-3">
          {order.status === "PENDING" && (
            <button
              onClick={() => updateStatus("PROCESSING")}
              disabled={updating}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 text-sm font-medium"
            >
              Accept Order
            </button>
          )}
          {order.status === "PROCESSING" && (
            <button
              onClick={() => updateStatus("SHIPPED")}
              disabled={updating}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 text-sm font-medium"
            >
              Mark as Shipped
            </button>
          )}
          {order.status === "SHIPPED" && (
            <button
              onClick={() => updateStatus("DELIVERED")}
              disabled={updating}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 text-sm font-medium"
            >
              Mark as Delivered
            </button>
          )}
          <button
            onClick={() => updateStatus("CANCELLED")}
            disabled={updating}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 text-sm font-medium"
          >
            Cancel Order
          </button>
        </div>
      )}

      <div className="mt-8 bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900">Items</h2>
        <div className="mt-4 space-y-4">
          {order.items.map((item) => {
            const images = parseImageString(item.product.images)
            return (
              <div key={item.id} className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  {images[0] ? (
                    <img
                      src={images[0]}
                      alt={item.product.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <span className="text-gray-400">{item.product.name[0]}</span>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{item.product.name}</p>
                  <p className="text-xs text-gray-500">
                    {item.size && `Size: ${item.size}`}
                    {item.size && item.color && " | "}
                    {item.color && `Color: ${item.color}`}
                    {` | Qty: ${item.quantity}`}
                  </p>
                </div>
                <p className="text-sm font-medium text-gray-900">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>
            )
          })}
        </div>
      </div>

      <div className="mt-6 bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900">Payment</h2>
        <div className="mt-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            order.paymentMethod === "SCAN_PAY"
              ? "bg-indigo-100 text-indigo-800"
              : "bg-green-100 text-green-800"
          }`}>
            {order.paymentMethod === "SCAN_PAY" ? "Scan & Pay" : "Cash on Delivery"}
          </span>
        </div>
      </div>

      <div className="mt-6 bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900">Shipping Details</h2>
        <div className="mt-4 text-sm text-gray-600 space-y-1">
          <p>{order.shippingName}</p>
          <p>{order.shippingAddress}</p>
          <p>{order.shippingCity}, {order.shippingState} {order.shippingZip}</p>
          {order.shippingPhone && <p>{order.shippingPhone}</p>}
        </div>
      </div>

      <div className="mt-6 bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex justify-between text-lg font-semibold text-gray-900">
          <span>Total</span>
          <span>{formatPrice(order.total)}</span>
        </div>
      </div>
    </div>
  )
}

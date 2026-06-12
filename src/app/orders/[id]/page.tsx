import { Metadata } from "next"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { formatPrice, parseImageString } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Order Details - UniformPortal",
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  const { id } = await params

  if (!session?.user?.id) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Sign in to view order</h1>
        <Link href="/auth/signin" className="mt-4 text-indigo-600 hover:text-indigo-800 inline-block">
          Sign In
        </Link>
      </div>
    )
  }

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: { include: { product: true } },
    },
  })

  if (!order || (order.userId !== session.user.id && session.user.role !== "ADMIN")) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Order not found</h1>
        <Link href="/orders" className="mt-4 text-indigo-600 hover:text-indigo-800 inline-block">
          Back to Orders
        </Link>
      </div>
    )
  }

  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    PROCESSING: "bg-blue-100 text-blue-800",
    SHIPPED: "bg-purple-100 text-purple-800",
    DELIVERED: "bg-green-100 text-green-800",
    CANCELLED: "bg-red-100 text-red-800",
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/orders"
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
            Placed on {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            statusColors[order.status] || "bg-gray-100 text-gray-800"
          }`}
        >
          {order.status}
        </span>
      </div>

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
                  </p>
                  <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
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
        <h2 className="text-lg font-semibold text-gray-900">Shipping Details</h2>
        <div className="mt-4 text-sm text-gray-600 space-y-1">
          <p>{order.shippingName}</p>
          <p>{order.shippingAddress}</p>
          <p>
            {order.shippingCity}, {order.shippingState} {order.shippingZip}
          </p>
          {order.shippingPhone && <p>{order.shippingPhone}</p>}
        </div>
      </div>

      <div className="mt-6 bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900">Payment</h2>
        <div className="mt-4 flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            order.paymentMethod === "SCAN_PAY"
              ? "bg-indigo-100 text-indigo-800"
              : "bg-green-100 text-green-800"
          }`}>
            {order.paymentMethod === "SCAN_PAY" ? "Scan & Pay" : "Cash on Delivery"}
          </span>
          {order.paymentMethod === "SCAN_PAY" && order.status === "PENDING" && (
            <span className="text-xs text-yellow-600 font-medium">Awaiting Payment</span>
          )}
          {order.paymentMethod === "SCAN_PAY" && order.status !== "PENDING" && order.status !== "CANCELLED" && (
            <span className="text-xs text-green-600 font-medium">Paid</span>
          )}
        </div>

        {order.paymentMethod === "SCAN_PAY" && order.status === "PENDING" && (
          <div className="mt-4 p-4 bg-indigo-50 rounded-xl border border-indigo-200">
            <p className="text-sm font-medium text-indigo-900">Complete your payment</p>
            <p className="text-xs text-indigo-700 mt-1">
              Scan the QR code below using any UPI app (GPay, PhonePe, PayTM) to pay{" "}
              <strong>{formatPrice(order.total)}</strong>.
            </p>
            <div className="mt-4 flex justify-center">
              <div className="bg-white p-4 rounded-xl shadow-sm">
                <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <svg className="w-32 h-32 mx-auto text-gray-800" viewBox="0 0 100 100">
                      <rect x="5" y="5" width="38" height="38" fill="currentColor" rx="4" />
                      <rect x="57" y="5" width="38" height="38" fill="currentColor" rx="4" />
                      <rect x="5" y="57" width="38" height="38" fill="currentColor" rx="4" />
                      <rect x="30" y="30" width="15" height="15" fill="#fff" rx="2" />
                      <rect x="55" y="55" width="15" height="15" fill="#fff" rx="2" />
                      <rect x="30" y="55" width="10" height="10" fill="#fff" rx="1" />
                      <rect x="55" y="30" width="10" height="10" fill="#fff" rx="1" />
                      <rect x="20" y="60" width="8" height="8" fill="#fff" rx="1" />
                      <rect x="60" y="20" width="8" height="8" fill="#fff" rx="1" />
                      <rect x="7" y="49" width="36" height="4" fill="currentColor" />
                      <rect x="49" y="49" width="6" height="4" fill="currentColor" />
                      <rect x="59" y="49" width="36" height="4" fill="currentColor" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-3 text-center">
              <p className="text-xs font-mono text-indigo-800 bg-indigo-100 px-3 py-1.5 rounded-lg inline-block">
                uniform@upi
              </p>
            </div>
            <p className="mt-3 text-xs text-gray-500 text-center">
              The order will be processed once payment is confirmed.
            </p>
          </div>
        )}
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

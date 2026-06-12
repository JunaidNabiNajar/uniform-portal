import { Metadata } from "next"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { formatPrice } from "@/lib/utils"

export const metadata: Metadata = {
  title: "My Orders - UniformPortal",
}

export default async function OrdersPage() {
  const session = await auth()
  if (!session?.user?.id) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Sign in to view orders</h1>
        <Link href="/auth/signin" className="mt-4 text-indigo-600 hover:text-indigo-800 inline-block">
          Sign In
        </Link>
      </div>
    )
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: {
      items: { include: { product: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    PROCESSING: "bg-blue-100 text-blue-800",
    SHIPPED: "bg-purple-100 text-purple-800",
    DELIVERED: "bg-green-100 text-green-800",
    CANCELLED: "bg-red-100 text-red-800",
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>

      {orders.length === 0 ? (
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-lg">No orders yet.</p>
          <Link
            href="/products"
            className="mt-4 inline-flex items-center text-indigo-600 hover:text-indigo-800"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/orders/${order.id}`}
              className="block bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    Order #{order.id.slice(0, 8)}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    statusColors[order.status] || "bg-gray-100 text-gray-800"
                  }`}
                >
                  {order.status}
                </span>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  {order.items.length} item(s)
                </p>
                <p className="text-lg font-semibold text-gray-900">
                  {formatPrice(order.total)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

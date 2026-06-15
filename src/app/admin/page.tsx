import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Package, ShoppingBag, Users, IndianRupee, TrendingUp, Plus, Eye, ArrowRight } from "lucide-react"
import { formatPrice } from "@/lib/utils"

export default async function AdminDashboard() {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/auth/signin")
  }

  const [productCount, orderCount, userCount, totalRevenue] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.user.count(),
    prisma.order.aggregate({ _sum: { total: true } }),
  ])

  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { user: true },
  })

  const stats = [
    { label: "Products", value: productCount, icon: Package, gradient: "from-indigo-500 to-teal-500", shadow: "shadow-indigo-500/25" },
    { label: "Orders", value: orderCount, icon: ShoppingBag, gradient: "from-blue-500 to-cyan-500", shadow: "shadow-blue-500/25" },
    { label: "Users", value: userCount, icon: Users, gradient: "from-purple-500 to-pink-500", shadow: "shadow-purple-500/25" },
    { label: "Revenue", value: `₹${Math.round((totalRevenue._sum.total || 0) / 100).toLocaleString("en-IN")}`, icon: IndianRupee, gradient: "from-amber-500 to-orange-500", shadow: "shadow-amber-500/25" },
  ]

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Welcome back, {session.user.name || "Admin"}</p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-teal-500 text-white font-semibold rounded-xl hover:from-indigo-600 hover:to-teal-600 transition-all shadow-lg shadow-indigo-500/25"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 p-6 card-hover">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg ${stat.shadow}`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs text-green-600">
              <TrendingUp className="w-3 h-3" />
              <span>Active</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
              <p className="text-sm text-gray-500">Latest 5 orders</p>
            </div>
            <Link href="/admin/orders" className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="space-y-3">
            {recentOrders.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">No orders yet</p>
            ) : (
              recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-teal-500 flex items-center justify-center text-white text-xs font-bold">
                      #{order.id.slice(0, 3)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        #{order.id.slice(0, 8)}
                      </p>
                      <p className="text-xs text-gray-500">{order.user.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      {formatPrice(order.total)}
                    </p>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      order.status === "PENDING" ? "bg-yellow-100 text-yellow-700" :
                      order.status === "PROCESSING" ? "bg-blue-100 text-blue-700" :
                      order.status === "SHIPPED" ? "bg-purple-100 text-purple-700" :
                      order.status === "DELIVERED" ? "bg-green-100 text-green-700" :
                      "bg-red-100 text-red-700"
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
            <p className="text-sm text-gray-500 mt-1">Common tasks</p>
          </div>
          <div className="mt-6 space-y-3">
            <Link
              href="/admin/products/new"
              className="group flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-teal-50 border border-indigo-100 hover:from-indigo-100 hover:to-teal-100 transition-all"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-teal-500 flex items-center justify-center shadow-md">
                <Plus className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">Add New Product</p>
                <p className="text-xs text-gray-500">Create a new catalog item</p>
              </div>
              <ArrowRight className="w-4 h-4 text-indigo-400 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/admin/products"
              className="group flex items-center gap-3 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all border border-gray-100"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-md">
                <Package className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">Manage Products</p>
                <p className="text-xs text-gray-500">Edit or remove items</p>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/admin/orders"
              className="group flex items-center gap-3 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all border border-gray-100"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-md">
                <Eye className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">View All Orders</p>
                <p className="text-xs text-gray-500">Manage customer orders</p>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

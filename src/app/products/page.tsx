import { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import ProductCard from "@/components/ProductCard"
import { LayoutGrid, Sparkles } from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Catalog - SSS Online Shopping",
  description: "Browse our complete collection of uniforms.",
}

const categoryGradients: Record<string, string> = {
  shirts: "from-blue-500 to-cyan-500",
  pants: "from-amber-500 to-orange-500",
  blazers: "from-purple-500 to-indigo-500",
  accessories: "from-emerald-500 to-teal-500",
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; featured?: string }>
}) {
  const { category, featured } = await searchParams
  const categories = await prisma.category.findMany()

  const where: Record<string, unknown> = {}
  if (category) where.category = { slug: category }
  if (featured === "true") where.featured = true

  const products = await prisma.product.findMany({
    where,
    include: { category: true },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-teal-500 flex items-center justify-center shadow-lg">
          <LayoutGrid className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Catalog</h1>
          <p className="text-sm text-gray-500">{products.length} product{products.length !== 1 ? "s" : ""} found</p>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        <Link
          href="/products"
          className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            !category && !featured
              ? "bg-gradient-to-r from-indigo-500 to-teal-500 text-white shadow-lg shadow-indigo-500/25"
              : "bg-white text-gray-600 hover:text-indigo-600 border border-gray-200 hover:border-indigo-200 shadow-sm"
          }`}
        >
          All
        </Link>
        {categories.map((cat) => {
          const gradient = categoryGradients[cat.slug] || "from-indigo-500 to-teal-500"
          const isActive = category === cat.slug
          return (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                isActive
                  ? `bg-gradient-to-r ${gradient} text-white shadow-lg`
                  : "bg-white text-gray-600 hover:text-indigo-600 border border-gray-200 hover:border-indigo-200 shadow-sm"
              }`}
            >
              {cat.name}
            </Link>
          )
        })}
        <Link
          href="/products?featured=true"
          className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all inline-flex items-center gap-1.5 ${
            featured === "true"
              ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/25"
              : "bg-white text-gray-600 hover:text-amber-600 border border-gray-200 hover:border-amber-200 shadow-sm"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          Featured
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="mt-16 text-center">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
            <LayoutGrid className="w-8 h-8 text-gray-300" />
          </div>
          <p className="text-gray-500 text-lg font-medium">No products found in this category.</p>
          <Link
            href="/products"
            className="mt-4 inline-flex items-center px-5 py-2.5 text-sm font-semibold text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-all"
          >
            View All Products
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              slug={product.slug}
              price={product.price}
              images={product.images}
              category={product.category}
            />
          ))}
        </div>
      )}
    </div>
  )
}

import { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import ProductCard from "@/components/ProductCard"

export const metadata: Metadata = {
  title: "Catalog - UniformPortal",
  description: "Browse our complete collection of uniforms.",
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
      <h1 className="text-3xl font-bold text-gray-900">Catalog</h1>

      <div className="mt-6 flex flex-wrap gap-2">
        <a
          href="/products"
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            !category && !featured
              ? "bg-indigo-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          All
        </a>
        {categories.map((cat) => (
          <a
            key={cat.id}
            href={`/products?category=${cat.slug}`}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              category === cat.slug
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {cat.name}
          </a>
        ))}
      </div>

      {products.length === 0 ? (
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-lg">No products found.</p>
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

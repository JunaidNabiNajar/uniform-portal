import Link from "next/link"
import { prisma } from "@/lib/prisma"
import ProductCard from "@/components/ProductCard"
import { ArrowRight, Sparkles, Shield, Truck, RotateCcw } from "lucide-react"

export const dynamic = "force-dynamic"

const categoryIcons = ["👔","🧥","👖","🧢","🎒","👞","🧣","👕"]

const categoryGradients: Record<string, string> = {
  shirts: "from-blue-500 to-cyan-400",
  pants: "from-amber-500 to-orange-400",
  blazers: "from-purple-500 to-indigo-400",
  accessories: "from-emerald-500 to-teal-400",
}

export default async function HomePage() {
  const categories = await prisma.category.findMany()
  const featuredProducts = await prisma.product.findMany({
    where: { featured: true },
    include: { category: true },
    take: 8,
  })

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-indigo-500/5 to-teal-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-sm text-white/80 mb-8 animate-fade-in-up">
              <Sparkles className="w-4 h-4 text-teal-400" />
              New Collection Available
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-tight animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              Premium Uniforms
              <br />
              <span className="bg-gradient-to-r from-indigo-400 to-teal-400 bg-clip-text text-transparent">
                Built to Impress
              </span>
            </h1>
            <p className="mt-6 text-lg text-slate-300 max-w-xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              Discover our curated collection of premium school and corporate uniforms. 
              Quality fabrics, perfect fits, and styles that make a statement.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
              <Link
                href="/products"
                className="group inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-indigo-500 to-teal-500 text-white font-semibold rounded-xl hover:from-indigo-600 hover:to-teal-600 transition-all shadow-xl hover:shadow-2xl shadow-indigo-500/25"
              >
                Explore Collection
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/products?featured=true"
                className="inline-flex items-center px-8 py-3.5 border-2 border-white/20 text-white font-semibold rounded-xl hover:bg-white/10 transition-all backdrop-blur-sm"
              >
                View Featured
              </Link>
            </div>
          </div>
        </div>

        <div className="relative border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { icon: Truck, label: "Free Shipping", desc: "On orders over $50" },
                { icon: Shield, label: "Quality Guaranteed", desc: "Premium materials" },
                { icon: RotateCcw, label: "Easy Returns", desc: "30-day return policy" },
                { icon: Sparkles, label: "New Arrivals", desc: "Weekly updates" },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <div className="w-12 h-12 mx-auto rounded-xl bg-white/5 flex items-center justify-center mb-3">
                    <item.icon className="w-5 h-5 text-indigo-400" />
                  </div>
                  <p className="text-sm font-semibold text-white">{item.label}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Shop by <span className="gradient-text">Category</span>
          </h2>
          <p className="mt-3 text-gray-500">Find exactly what you need</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat, i) => {
            const gradient = categoryGradients[cat.slug] || "from-indigo-500 to-teal-500"
            return (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className="group relative h-48 rounded-2xl overflow-hidden card-hover"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-90 group-hover:opacity-100 transition-opacity`} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                <div className="relative h-full p-6 flex flex-col justify-end">
                  <span className="text-3xl mb-2">{categoryIcons[i % categoryIcons.length]}</span>
                  <h3 className="text-xl font-bold text-white group-hover:translate-x-1 transition-transform">
                    {cat.name}
                  </h3>
                  <p className="text-sm text-white/70 flex items-center gap-1 group-hover:gap-2 transition-all">
                    View collection <ArrowRight className="w-3 h-3" />
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {featuredProducts.length > 0 && (
        <section className="bg-gradient-to-b from-white to-gray-50/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="flex items-end justify-between mb-12">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                  Featured <span className="gradient-text">Products</span>
                </h2>
                <p className="mt-3 text-gray-500">Our most popular picks</p>
              </div>
              <Link
                href="/products"
                className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors group"
              >
                View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
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
            <div className="mt-10 text-center sm:hidden">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-50 text-indigo-600 font-semibold rounded-xl hover:bg-indigo-100 transition-all"
              >
                View All Products <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

import Link from "next/link"
import { formatPrice, parseImageString } from "@/lib/utils"
import { Star } from "lucide-react"

type ProductCardProps = {
  id: string
  name: string
  slug: string
  price: number
  images: string
  category: { name: string; slug: string }
}

export default function ProductCard({ name, slug, price, images, category }: ProductCardProps) {
  const imageList = parseImageString(images)

  const categoryGradients: Record<string, string> = {
    shirts: "from-blue-500 to-cyan-500",
    pants: "from-amber-500 to-orange-500",
    blazers: "from-purple-500 to-indigo-500",
    accessories: "from-emerald-500 to-teal-500",
  }

  const badgeGradient = categoryGradients[category.slug] || "from-indigo-500 to-teal-500"

  return (
    <Link
      href={`/products/${slug}`}
      className="group block bg-white rounded-2xl border border-gray-100 overflow-hidden card-hover"
    >
      <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden">
        <div className={`absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full text-[10px] font-semibold text-white uppercase tracking-wider bg-gradient-to-r ${badgeGradient} shadow-md`}>
          {category.name}
        </div>
        {imageList[0] ? (
          <img
            src={imageList[0]}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500"
          />
        ) : (
          <span className="text-gray-300 text-6xl font-light group-hover:scale-110 transition-transform">
            {name[0]}
          </span>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-3 right-3 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-lg text-xs font-bold text-gray-900 shadow-lg opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          Quick View
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center gap-1 mb-1.5">
          {[1,2,3,4,5].map((i) => (
            <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
          ))}
        </div>
        <h3 className="text-sm font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors leading-snug">
          {name}
        </h3>
        <div className="mt-2 flex items-center justify-between">
          <p className="text-lg font-bold gradient-text">
            {formatPrice(price)}
          </p>
          <span className="text-xs text-gray-400">Free shipping</span>
        </div>
      </div>
    </Link>
  )
}

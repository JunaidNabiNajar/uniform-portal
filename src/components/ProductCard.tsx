import Link from "next/link"
import { formatPrice, parseImageString } from "@/lib/utils"

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

  return (
    <Link
      href={`/products/${slug}`}
      className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
        {imageList[0] ? (
          <img
            src={imageList[0]}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
        ) : (
          <span className="text-gray-400 text-4xl font-light">{name[0]}</span>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs text-indigo-600 font-medium uppercase tracking-wide">
          {category.name}
        </p>
        <h3 className="mt-1 text-sm font-semibold text-gray-900 group-hover:text-indigo-600">
          {name}
        </h3>
        <p className="mt-1 text-sm font-medium text-gray-900">{formatPrice(price)}</p>
      </div>
    </Link>
  )
}

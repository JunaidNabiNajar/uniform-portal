"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { ShoppingCart, ChevronLeft } from "lucide-react"
import { useCartStore } from "@/store/cart"
import { formatPrice, parseSizeString, parseColorString, parseImageString } from "@/lib/utils"
import type { ProductWithCategory } from "@/types"

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = useResolvedParams(params)
  const { data: session } = useSession()
  const addItem = useCartStore((s) => s.addItem)
  const [product, setProduct] = useState<ProductWithCategory | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedColor, setSelectedColor] = useState("")
  const [added, setAdded] = useState(false)

  useEffect(() => {
    if (!id) return
    fetch(`/api/products/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Product not found")
        return r.json()
      })
      .then((data) => {
        setProduct(data)
        setLoading(false)
      })
      .catch(() => {
        setProduct(null)
        setLoading(false)
      })
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Product not found</h1>
        <Link href="/products" className="mt-4 text-indigo-600 hover:text-indigo-800 inline-block">
          Back to catalog
        </Link>
      </div>
    )
  }

  const sizes = product.sizes ? parseSizeString(product.sizes) : []
  const colors = product.colors ? parseColorString(product.colors) : []
  const images = product.images ? parseImageString(product.images) : []

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: images[0] || "",
      size: selectedSize || sizes[0] || "",
      color: selectedColor || colors[0] || "",
      quantity: 1,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/products"
        className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-6"
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        Back to Catalog
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center">
          {images[0] ? (
            <img
              src={images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-gray-400 text-6xl font-light">{product.name[0]}</span>
          )}
        </div>

        <div>
          <p className="text-sm text-indigo-600 font-medium uppercase tracking-wide">
            {product.category.name}
          </p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">{product.name}</h1>
          <p className="mt-4 text-2xl font-semibold text-gray-900">
            {formatPrice(product.price)}
          </p>
          <p className="mt-4 text-gray-600 leading-relaxed">{product.description}</p>

          {sizes.length > 0 && (
            <div className="mt-8">
              <h3 className="text-sm font-medium text-gray-900">Size</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-lg border text-sm font-medium ${
                      selectedSize === size
                        ? "border-indigo-600 bg-indigo-50 text-indigo-600"
                        : "border-gray-300 text-gray-700 hover:border-gray-400"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {colors.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-900">Color</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 rounded-lg border text-sm font-medium ${
                      selectedColor === color
                        ? "border-indigo-600 bg-indigo-50 text-indigo-600"
                        : "border-gray-300 text-gray-700 hover:border-gray-400"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 flex items-center gap-4">
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {added ? "Added!" : product.inStock ? "Add to Cart" : "Out of Stock"}
            </button>
          </div>

          {!session?.user && (
            <p className="mt-4 text-sm text-gray-500">
              <Link href="/auth/signin" className="text-indigo-600 hover:underline">
                Sign in
              </Link>{" "}
              to save your cart.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

function useResolvedParams(params: Promise<{ id: string }>) {
  const [resolved, setResolved] = useState<{ id: string }>({ id: "" })
  useEffect(() => {
    params.then(setResolved)
  }, [params])
  return resolved
}

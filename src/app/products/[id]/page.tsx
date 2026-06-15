"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { ShoppingCart, ChevronLeft, Star, MessageSquare } from "lucide-react"
import { useCartStore } from "@/store/cart"
import { formatPrice, parseSizeString, parseColorString, parseImageString } from "@/lib/utils"
import type { ProductWithCategory } from "@/types"

type Review = {
  id: string
  rating: number
  comment: string
  createdAt: string
  user: { name: string | null; email: string }
}

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

  const [reviews, setReviews] = useState<Review[]>([])
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewComment, setReviewComment] = useState("")
  const [reviewSubmitting, setReviewSubmitting] = useState(false)
  const [reviewError, setReviewError] = useState("")

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

  useEffect(() => {
    if (!id) return
    fetch(`/api/products/${id}/reviews`)
      .then((r) => r.json())
      .then(setReviews)
  }, [id])

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    setReviewSubmitting(true)
    setReviewError("")

    const res = await fetch(`/api/products/${id}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating: reviewRating, comment: reviewComment }),
    })

    if (res.ok) {
      const newReview = await res.json()
      setReviews([newReview, ...reviews])
      setShowReviewForm(false)
      setReviewComment("")
      setReviewRating(5)
    } else {
      const data = await res.json()
      setReviewError(data.error || "Failed to submit review")
    }
    setReviewSubmitting(false)
  }

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

  const avgRating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null

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
        <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden flex items-center justify-center">
          {images[0] ? (
            <img
              src={images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-gray-300 text-6xl font-light">{product.name[0]}</span>
          )}
        </div>

        <div>
          <p className="text-sm text-indigo-600 font-semibold uppercase tracking-wider">
            {product.category.name}
          </p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">{product.name}</h1>

          {avgRating && (
            <div className="mt-2 flex items-center gap-2">
              <div className="flex">
                {[1,2,3,4,5].map((i) => (
                  <Star key={i} className={`w-4 h-4 ${i <= Math.round(+avgRating) ? "fill-amber-400 text-amber-400" : "text-gray-200"}`} />
                ))}
              </div>
              <span className="text-sm text-gray-500">{avgRating} ({reviews.length})</span>
            </div>
          )}

          <p className="mt-4 text-3xl font-bold gradient-text">
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
                    className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
                      selectedSize === size
                        ? "border-indigo-500 bg-indigo-50 text-indigo-600 shadow-sm"
                        : "border-gray-200 text-gray-700 hover:border-gray-300"
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
                    className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
                      selectedColor === color
                        ? "border-indigo-500 bg-indigo-50 text-indigo-600 shadow-sm"
                        : "border-gray-200 text-gray-700 hover:border-gray-300"
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
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-teal-500 text-white font-semibold rounded-xl hover:from-indigo-600 hover:to-teal-600 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-500/25"
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
              to save your cart and leave a review.
            </p>
          )}
        </div>
      </div>

      <div className="mt-16 border-t border-gray-100 pt-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-indigo-500" />
              Customer Reviews
            </h2>
            {avgRating && (
              <p className="text-sm text-gray-500 mt-1">{avgRating} out of 5 stars ({reviews.length} reviews)</p>
            )}
          </div>
          {session?.user && (
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-teal-500 text-white font-semibold rounded-xl hover:from-indigo-600 hover:to-teal-600 transition-all shadow-lg shadow-indigo-500/25 text-sm"
            >
              Write a Review
            </button>
          )}
        </div>

        {showReviewForm && (
          <form onSubmit={handleSubmitReview} className="mb-10 p-6 bg-gradient-to-br from-indigo-50 to-teal-50 rounded-2xl border border-indigo-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Share Your Feedback</h3>
            {reviewError && (
              <div className="mb-4 px-4 py-2.5 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">
                {reviewError}
              </div>
            )}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
              <div className="flex gap-1">
                {[1,2,3,4,5].map((i) => (
                  <button key={i} type="button" onClick={() => setReviewRating(i)} className="p-1">
                    <Star className={`w-8 h-8 ${i <= reviewRating ? "fill-amber-400 text-amber-400" : "text-gray-300"} transition-colors`} />
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Comment</label>
              <textarea
                required
                minLength={10}
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Share your experience with this product..."
                rows={4}
                className="block w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={reviewSubmitting}
                className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-teal-500 text-white font-semibold rounded-xl hover:from-indigo-600 hover:to-teal-600 disabled:opacity-50 transition-all text-sm"
              >
                {reviewSubmitting ? "Submitting..." : "Submit Review"}
              </button>
              <button
                type="button"
                onClick={() => setShowReviewForm(false)}
                className="px-5 py-2.5 text-gray-600 font-medium rounded-xl hover:bg-gray-100 transition-all text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {reviews.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-2xl">
            <MessageSquare className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">No reviews yet</p>
            <p className="text-sm text-gray-400 mt-1">Be the first to share your feedback</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="p-6 bg-white rounded-2xl border border-gray-100 card-hover">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-teal-500 flex items-center justify-center text-white text-sm font-bold">
                      {(review.user.name || review.user.email)[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{review.user.name || "Anonymous"}</p>
                      <p className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString("en-IN")}</p>
                    </div>
                  </div>
                  <div className="flex">
                    {[1,2,3,4,5].map((i) => (
                      <Star key={i} className={`w-4 h-4 ${i <= review.rating ? "fill-amber-400 text-amber-400" : "text-gray-200"}`} />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
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

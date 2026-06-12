export type CartItemWithProduct = {
  id: string
  quantity: number
  size: string | null
  color: string | null
  product: {
    id: string
    name: string
    slug: string
    price: number
    images: string
    sizes: string
    colors: string
    inStock: boolean
  }
}

export type OrderWithItems = {
  id: string
  status: string
  total: number
  paymentMethod: string
  shippingName: string
  shippingAddress: string
  shippingCity: string
  shippingState: string
  shippingZip: string
  shippingPhone: string | null
  createdAt: Date
  items: {
    id: string
    quantity: number
    size: string | null
    color: string | null
    price: number
    product: {
      id: string
      name: string
      slug: string
      images: string
    }
  }[]
}

export type ProductWithCategory = {
  id: string
  name: string
  slug: string
  description: string
  price: number
  images: string
  sizes: string
  colors: string
  inStock: boolean
  featured: boolean
  createdAt: Date
  category: {
    id: string
    name: string
    slug: string
  }
}

declare module "next-auth" {
  interface User {
    role?: string
  }
  interface Session {
    user: User & {
      id: string
      role: string
    }
  }
}



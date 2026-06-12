import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { name, slug, description, price, images, sizes, colors, categoryId, inStock, featured } =
    await req.json()

  try {
    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price,
        images: images || "",
        sizes: sizes || "S,M,L,XL",
        colors: colors || "White,Navy,Black",
        categoryId,
        inStock: inStock !== false,
        featured: featured || false,
      },
    })
    return NextResponse.json(product, { status: 201 })
  } catch (err: any) {
    if (err?.code === "P2002") {
      return NextResponse.json({ error: "A product with this slug already exists" }, { status: 409 })
    }
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}

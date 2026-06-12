import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const category = searchParams.get("category")
  const featured = searchParams.get("featured")

  const where: Record<string, unknown> = {}
  if (category) where.category = { slug: category }
  if (featured === "true") where.featured = true

  const products = await prisma.product.findMany({
    where,
    include: { category: true },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(products)
}

import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const reviews = await prisma.review.findMany({
    where: { productId: id },
    include: { user: { select: { name: true, email: true } } },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(reviews)
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const { rating, comment } = await req.json()

  if (!rating || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 })
  }

  if (!comment || comment.trim().length < 10) {
    return NextResponse.json({ error: "Comment must be at least 10 characters" }, { status: 400 })
  }

  const existing = await prisma.review.findUnique({
    where: { userId_productId: { userId: session.user.id, productId: id } },
  })

  if (existing) {
    return NextResponse.json({ error: "You have already reviewed this product" }, { status: 409 })
  }

  const review = await prisma.review.create({
    data: {
      rating,
      comment,
      userId: session.user.id,
      productId: id,
    },
    include: { user: { select: { name: true, email: true } } },
  })

  return NextResponse.json(review, { status: 201 })
}

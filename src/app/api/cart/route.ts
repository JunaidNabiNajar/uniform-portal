import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const items = await prisma.cartItem.findMany({
    where: { userId: session.user.id },
    include: { product: true },
  })

  return NextResponse.json(items)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { productId, quantity, size, color } = await req.json()

  const existing = await prisma.cartItem.findUnique({
    where: {
      userId_productId_size_color: {
        userId: session.user.id,
        productId,
        size: size || "",
        color: color || "",
      },
    },
  })

  if (existing) {
    const updated = await prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: existing.quantity + (quantity || 1) },
    })
    return NextResponse.json(updated)
  }

  const item = await prisma.cartItem.create({
    data: {
      userId: session.user.id,
      productId,
      quantity: quantity || 1,
      size: size || null,
      color: color || null,
    },
  })

  return NextResponse.json(item, { status: 201 })
}

export async function DELETE(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")

  if (!id) {
    return NextResponse.json({ error: "Item ID required" }, { status: 400 })
  }

  await prisma.cartItem.deleteMany({
    where: { id, userId: session.user.id },
  })

  return NextResponse.json({ success: true })
}

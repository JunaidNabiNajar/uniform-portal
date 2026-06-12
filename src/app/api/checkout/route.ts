import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { shippingName, shippingAddress, shippingCity, shippingState, shippingZip, shippingPhone } =
    await req.json()

  if (!shippingName || !shippingAddress || !shippingCity || !shippingState || !shippingZip) {
    return NextResponse.json(
      { error: "All shipping fields are required" },
      { status: 400 }
    )
  }

  const cartItems = await prisma.cartItem.findMany({
    where: { userId: session.user.id },
    include: { product: true },
  })

  if (cartItems.length === 0) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 })
  }

  const total = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  )

  const order = await prisma.order.create({
    data: {
      userId: session.user.id,
      status: "PENDING",
      total,
      shippingName,
      shippingAddress,
      shippingCity,
      shippingState,
      shippingZip,
      shippingPhone: shippingPhone || null,
      items: {
        create: cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          price: item.product.price,
        })),
      },
    },
  })

  await prisma.cartItem.deleteMany({
    where: { userId: session.user.id },
  })

  return NextResponse.json(order, { status: 201 })
}

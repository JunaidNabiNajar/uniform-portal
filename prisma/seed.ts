import { PrismaClient } from "@prisma/client"
import { hash } from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  const adminPassword = await hash("admin123", 12)
  const userPassword = await hash("user123", 12)

  const admin = await prisma.user.upsert({
    where: { email: "admin@uniformportal.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@uniformportal.com",
      password: adminPassword,
      role: "ADMIN",
    },
  })

  const user = await prisma.user.upsert({
    where: { email: "user@example.com" },
    update: {},
    create: {
      name: "John Doe",
      email: "user@example.com",
      password: userPassword,
      role: "CUSTOMER",
    },
  })

  const shirts = await prisma.category.upsert({
    where: { slug: "shirts" },
    update: {},
    create: { name: "Shirts", slug: "shirts" },
  })

  const pants = await prisma.category.upsert({
    where: { slug: "pants" },
    update: {},
    create: { name: "Pants", slug: "pants" },
  })

  const blazers = await prisma.category.upsert({
    where: { slug: "blazers" },
    update: {},
    create: { name: "Blazers", slug: "blazers" },
  })

  const accessories = await prisma.category.upsert({
    where: { slug: "accessories" },
    update: {},
    create: { name: "Accessories", slug: "accessories" },
  })

  const products = [
    {
      name: "Classic White Dress Shirt",
      slug: "classic-white-dress-shirt",
      description: "A timeless white dress shirt crafted from premium cotton. Perfect for school uniforms and formal occasions.",
      price: 2999,
      images: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400",
      sizes: "XS,S,M,L,XL,XXL",
      colors: "White",
      categoryId: shirts.id,
      featured: true,
    },
    {
      name: "Navy Blue Polo Shirt",
      slug: "navy-blue-polo-shirt",
      description: "Classic navy blue polo shirt made from breathable cotton blend. Features a ribbed collar and two-button placket.",
      price: 2499,
      images: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400",
      sizes: "XS,S,M,L,XL,XXL",
      colors: "Navy",
      categoryId: shirts.id,
      featured: true,
    },
    {
      name: "Light Blue Oxford Shirt",
      slug: "light-blue-oxford-shirt",
      description: "Preppy light blue Oxford shirt in durable cotton. Button-down collar and chest pocket.",
      price: 3499,
      images: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=400",
      sizes: "XS,S,M,L,XL,XXL",
      colors: "Light Blue",
      categoryId: shirts.id,
      featured: false,
    },
    {
      name: "Khaki Chino Pants",
      slug: "khaki-chino-pants",
      description: "Comfortable khaki chino pants made from stretch cotton twill. Classic straight-leg fit.",
      price: 3999,
      images: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400",
      sizes: "28,30,32,34,36,38",
      colors: "Khaki,Beige,Navy",
      categoryId: pants.id,
      featured: true,
    },
    {
      name: "Black Formal Trousers",
      slug: "black-formal-trousers",
      description: "Sleek black formal trousers in wrinkle-resistant fabric. Flat front with a modern slim fit.",
      price: 4499,
      images: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400",
      sizes: "28,30,32,34,36,38",
      colors: "Black,Charcoal",
      categoryId: pants.id,
      featured: false,
    },
    {
      name: "Navy Blue Blazer",
      slug: "navy-blue-blazer",
      description: "Premium navy blue blazer with gold buttons. Fully lined with two-button closure and notch lapels.",
      price: 8999,
      images: "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=400",
      sizes: "S,M,L,XL,XXL",
      colors: "Navy,Black,Charcoal",
      categoryId: blazers.id,
      featured: true,
    },
    {
      name: "School Tie - Striped",
      slug: "school-tie-striped",
      description: "Traditional striped school tie in school colors. Quality polyester silk.",
      price: 1499,
      images: "https://images.unsplash.com/photo-1589756823695-278bc923f962?w=400",
      sizes: "Regular,Long",
      colors: "Navy/Red,Burgundy/Green,Black/Gold",
      categoryId: accessories.id,
      featured: false,
    },
    {
      name: "V-Neck Sweater - Navy",
      slug: "v-neck-sweater-navy",
      description: "Classic V-neck sweater in navy blue. Soft acrylic blend with ribbed cuffs.",
      price: 3999,
      images: "https://images.unsplash.com/photo-1434389677669-e08b4cda3a9b?w=400",
      sizes: "XS,S,M,L,XL,XXL",
      colors: "Navy,Burgundy,Grey,Black",
      categoryId: accessories.id,
      featured: true,
    },
  ]

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    })
  }

  console.log("Seed data created successfully")
  console.log(`Admin: admin@uniformportal.com / admin123`)
  console.log(`User: user@example.com / user123`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())

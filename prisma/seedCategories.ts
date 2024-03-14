import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const categoriesData = [
  { name: "Jordan", slug: "jordan" },
  { name: "Sneakers", slug: "sneakers" },
  { name: "Basketball Shoes", slug: "basketball-shoes" },
  { name: "Men's Shoes", slug: "mens-shoes" },
];

async function seedCategories() {
  try {
    const createdCategories = await prisma.category.createMany({
      data: categoriesData,
    });
    console.log("Categories created successfully!", createdCategories);
  } catch (error) {
    console.error("Error creating categories:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedCategories();

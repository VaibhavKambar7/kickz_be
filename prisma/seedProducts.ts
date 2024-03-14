import { products } from "../seedData/products";
import { PrismaClient, Category } from "@prisma/client";

const prisma = new PrismaClient();

async function seedProduct() {
  try {
    for (const product of products) {
      const categories = await fetchOrCreateCategories(product.categories);

      await prisma.product.create({
        data: {
          ...product,
          categories: {
            connect: categories,
          },
        },
      });
    }

    console.log("Products seeded successfully!");
  } catch (error) {
    console.error("Error seeding products:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

async function fetchOrCreateCategories(
  categoryNames: string[]
): Promise<Category[]> {
  const existingCategories = await prisma.category.findMany({
    where: {
      name: {
        in: categoryNames,
      },
    },
  });

  const categoryNamesToCreate = categoryNames.filter(
    (name) => !existingCategories.some((c) => c.name === name)
  );

  if (categoryNamesToCreate.length > 0) {
    const newCategories = (await prisma.category.createMany({
      data: categoryNamesToCreate.map((name) => ({
        name,
        slug: name.toLowerCase(),
      })),
    })) as unknown as Category[];

    return [...existingCategories, ...newCategories];
  } else {
    return existingCategories;
  }
}

seedProduct();

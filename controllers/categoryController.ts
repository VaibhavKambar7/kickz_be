import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function getCategories(req: Request, res: Response) {
  try {
    const categories = await prisma.category.findMany({
      include: {
        products: true,
      },
    });

    const formattedCategories = categories.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      products: category.products.map((product) => ({
        id: product.id,
        name: product.name,
        price: product.price,
        description: product.description,
        size: product.size,
        images: product.images,
        thumbnail: product.thumbnail,
        original_price: product.original_price,
        slug: product.slug,
      })),
    }));

    res.json(formattedCategories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export default getCategories;

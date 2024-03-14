import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function getProducts(req: Request, res: Response) {
  try {
    const products = await prisma.product.findMany({
      include: {
        categories: true,
      },
    });

    const formattedProducts = products.map((product) => ({
      id: product.id,
      name: product.name,
      price: product.price,
      description: product.description,
      size: product.size,
      images: product.images,
      thumbnail: product.thumbnail,
      original_price: product.original_price,
      slug: product.slug,
      categories: product.categories.map((category) => ({
        id: category.id,
        name: category.name,
        slug: category.slug,
      })),
    }));

    res.json(formattedProducts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export default getProducts;

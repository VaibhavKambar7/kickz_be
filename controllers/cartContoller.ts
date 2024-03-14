import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const createCartItemsForUser = async (req: Request, res: Response) => {
  const { matchedProduct, selectedSize, quantity, userEmail } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: userEmail,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const createdCartItem = await prisma.cartItem.create({
      data: {
        user: {
          connect: {
            id: user.id,
          },
        },
        name: matchedProduct.name,
        price: matchedProduct.price,
        subtitle: matchedProduct.subtitle,
        size: matchedProduct.size,
        thumbnail: matchedProduct.thumbnail,
        selectedSize,
        quantity,
      },
    });

    return res.status(201).json(createdCartItem);
  } catch (error) {
    console.error("Error creating cart item:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getCartItemsForUser = async (req: Request, res: Response) => {
  const { userEmail } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: userEmail,
      },
      include: {
        cartItems: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const cartItems = user.cartItems;

    return res.status(200).json(cartItems);
  } catch (error) {
    console.error("Error fetching cart items:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const updateCartItem = async (req: Request, res: Response) => {
  const { matchedProduct, selectedSize, quantity, userEmail } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: userEmail,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const existingCartItem = await prisma.cartItem.findFirst({
      where: { userId: user.id, name: matchedProduct.name, selectedSize },
    });

    if (!existingCartItem) {
      return res.status(404).json({ error: "Cart item not found" });
    }

    const updatedCartItem = await prisma.cartItem.update({
      where: {
        id: existingCartItem.id,
      },
      data: {
        quantity: existingCartItem.quantity + quantity,
        price: matchedProduct.price * (existingCartItem.quantity + quantity),
      },
    });

    return res.status(200).json(updatedCartItem);
  } catch (error) {
    console.error("Error updating cart item:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const deleteCartItem = async (req: Request, res: Response) => {
  const { id } = req.body;

  try {
    const item = await prisma.cartItem.delete({
      where: {
        id: parseInt(id),
      },
    });

    return res.status(200).json(item);
  } catch (error) {
    console.error("Error deleting cart item:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export {
  createCartItemsForUser,
  getCartItemsForUser,
  updateCartItem,
  deleteCartItem,
};

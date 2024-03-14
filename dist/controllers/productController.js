"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function getProducts(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const products = yield prisma.product.findMany({
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
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
}
exports.default = getProducts;

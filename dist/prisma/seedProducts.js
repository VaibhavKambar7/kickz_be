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
const products_1 = require("../seedData/products");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function seedProduct() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            for (const product of products_1.products) {
                const categories = yield fetchOrCreateCategories(product.categories);
                yield prisma.product.create({
                    data: Object.assign(Object.assign({}, product), { categories: {
                            connect: categories,
                        } }),
                });
            }
            console.log("Products seeded successfully!");
        }
        catch (error) {
            console.error("Error seeding products:", error);
            process.exit(1);
        }
        finally {
            yield prisma.$disconnect();
        }
    });
}
function fetchOrCreateCategories(categoryNames) {
    return __awaiter(this, void 0, void 0, function* () {
        const existingCategories = yield prisma.category.findMany({
            where: {
                name: {
                    in: categoryNames,
                },
            },
        });
        const categoryNamesToCreate = categoryNames.filter((name) => !existingCategories.some((c) => c.name === name));
        if (categoryNamesToCreate.length > 0) {
            const newCategories = (yield prisma.category.createMany({
                data: categoryNamesToCreate.map((name) => ({
                    name,
                    slug: name.toLowerCase(),
                })),
            }));
            return [...existingCategories, ...newCategories];
        }
        else {
            return existingCategories;
        }
    });
}
seedProduct();

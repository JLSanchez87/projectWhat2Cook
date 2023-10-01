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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const categories_json_1 = __importDefault(require("./data/categories.json"));
const users_json_1 = __importDefault(require("./data/users.json"));
const products_json_1 = __importDefault(require("./data/products.json"));
const recipes_json_1 = __importDefault(require("./data/recipes.json"));
const productOnUsers_json_1 = __importDefault(require("./data/productOnUsers.json"));
const productOnRecipes_json_1 = __importDefault(require("./data/productOnRecipes.json"));
const prisma = new client_1.PrismaClient();
const seed = () => __awaiter(void 0, void 0, void 0, function* () {
    for (let i = 0; i < products_json_1.default.length; i++) {
        yield prisma.product.create({ data: products_json_1.default[i] });
    }
    for (let i = 0; i < users_json_1.default.length; i++) {
        yield prisma.user.create({ data: users_json_1.default[i] });
    }
    for (let i = 0; i < productOnUsers_json_1.default.length; i++) {
        yield prisma.productOnUser.create({ data: productOnUsers_json_1.default[i] });
    }
    for (let i = 0; i < categories_json_1.default.length; i++) {
        yield prisma.category.create({ data: categories_json_1.default[i] });
    }
    for (let i = 0; i < recipes_json_1.default.length; i++) {
        yield prisma.recipe.create({ data: recipes_json_1.default[i] });
    }
    for (let i = 0; i < productOnRecipes_json_1.default.length; i++) {
        yield prisma.productOnRecipe.create({ data: productOnRecipes_json_1.default[i] });
    }
});
seed();

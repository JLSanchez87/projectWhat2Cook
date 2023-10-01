import { PrismaClient } from "@prisma/client";
import categories from "./data/categories.json";
import users from "./data/users.json";
import products from "./data/products.json";
import recipes from "./data/recipes.json";
import productOnUsers from "./data/productOnUsers.json";
import productOnRecipes from "./data/productOnRecipes.json";

const prisma = new PrismaClient();

const seed = async () => {
  for (let i = 0; i < products.length; i++) {
    await prisma.product.create({ data: products[i] });
  }

  for (let i = 0; i < users.length; i++) {
    await prisma.user.create({ data: users[i] });
  }

  for (let i = 0; i < productOnUsers.length; i++) {
    await prisma.productOnUser.create({ data: productOnUsers[i] });
  }

  for (let i = 0; i < categories.length; i++) {
    await prisma.category.create({ data: categories[i] });
  }

  for (let i = 0; i < recipes.length; i++) {
    await prisma.recipe.create({ data: recipes[i] });
  }

  for (let i = 0; i < productOnRecipes.length; i++) {
    await prisma.productOnRecipe.create({ data: productOnRecipes[i] });
  }
};

seed();

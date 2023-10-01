"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const cors_1 = __importDefault(require("cors"));
const express_1 = __importStar(require("express"));
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const middleware_1 = require("./auth/middleware");
const jwt_1 = require("./auth/jwt");
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
app.use((0, express_1.json)());
app.use((0, cors_1.default)());
const port = 3001;
app.listen(port, () => {
    console.log(`You're now listening on port: ${port}`);
});
// GET - User information
app.get("/me", middleware_1.AuthMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    if (userId === undefined) {
        res.status(500).send({ message: "Something went terribly wrong!" });
        return;
    }
    const currentUser = yield prisma.user.findUnique({
        select: {
            id: true,
            username: true,
            email: true,
            userImg: true,
            Fridge: true,
        },
        where: {
            id: userId,
        },
    });
    res.send(currentUser);
}));
// POST - New user registration
const registrationValidator = zod_1.z
    .object({
    username: zod_1.z.string().nonempty().max(20),
    password: zod_1.z.string().min(10),
    email: zod_1.z.string().email({ message: "Invalid email address" }),
    // userImg: z
    //   .string()
    //   .url({
    //     message: "Invalid URL, please use a valid URL or skip this part",
    //   })
    //   .optional(),
})
    .strict();
app.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const requestBody = req.body;
    const parsedBody = registrationValidator.safeParse(requestBody);
    if (parsedBody.success) {
        try {
            const newUser = yield prisma.user.create({
                data: parsedBody.data,
            });
            res.status(201).send(newUser);
        }
        catch (error) {
            res.status(500).send({ message: "Something went wrong!" });
        }
    }
    else {
        res.status(500).send(parsedBody.error.flatten());
    }
}));
// POST - User login
const loginValidator = zod_1.z
    .object({
    username: zod_1.z.string().nonempty().max(20),
    password: zod_1.z
        .string()
        .min(10, { message: "password must be 10 or more characters" }),
})
    .strict();
app.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const requestBody = req.body;
    const parsedBody = loginValidator.safeParse(requestBody);
    if (parsedBody.success) {
        try {
            const userToLogin = yield prisma.user.findUnique({
                where: {
                    username: requestBody.username,
                },
            });
            if (userToLogin && userToLogin.password === requestBody.password) {
                const token = (0, jwt_1.toToken)({ userId: userToLogin.id });
                res.status(200).send({ token: token });
                return;
            }
            res.status(400).send({ message: "Login failed" });
        }
        catch (_a) {
            res.status(500).send({ message: "Something went wrong!" });
        }
    }
    else {
        res
            .status(400)
            .send({ message: "'Username' and 'Password' are required!" });
    }
}));
// POST - Add Item to User
const addProductOnUserValidator = zod_1.z.object({
    productId: zod_1.z.array(zod_1.z.number().int()),
});
app.post("/fridge", middleware_1.AuthMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const requestBody = req.body;
    const userThatMadeRequest = Number(req.userId);
    // Only the productId from the body data
    const parsedBody = addProductOnUserValidator.safeParse(requestBody);
    // Set user ID in the backend only, so we need to acquire the userId from our Middleware
    const parsedUserId = zod_1.z.number().safeParse(userThatMadeRequest);
    if (parsedBody.success && parsedUserId.success) {
        try {
            // Clear existing entries for the user
            yield prisma.productOnUser.deleteMany({
                where: {
                    userId: parsedUserId.data,
                },
            });
            // Create new entries for the selected items
            for (let i = 0; i < parsedBody.data.productId.length; i++) {
                const newFridgeItem = yield prisma.productOnUser.create({
                    data: {
                        userId: parsedUserId.data,
                        productId: parsedBody.data.productId[i],
                        productCount: 1,
                    },
                });
            }
            res.status(200).send("Items added");
        }
        catch (error) {
            console.error(error);
            res.status(500).send({ message: "Failed to create fridge item(s)!" });
        }
    }
    else if (!parsedBody.success) {
        res.status(400).send(parsedBody.error.flatten());
    }
    else if (!parsedUserId.success) {
        res.status(401).send(parsedUserId.error.flatten());
    }
}));
// GET - List all the items in the user's fridge
app.get("/fridge", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield prisma.productOnUser.findMany();
    res.send(products);
}));
// GET - List of all available recipes
app.get("/available-recipes", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const availableRecipes = yield prisma.productOnRecipe.findMany();
    res.send(availableRecipes);
}));
// GET - List of all products
app.get("/products", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield prisma.product.findMany();
    res.send(products);
}));
// GET - list of all recipes
app.get("/recipes", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const recipes = yield prisma.recipe.findMany({
        include: { category: true, ingredients: true },
    });
    res.send(recipes);
}));
// GET - random recipe
app.get("/recipe/random", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const recipeId = yield prisma.recipe.findMany();
    const randomIndex = Math.floor(Math.random() * recipeId.length);
    const randomRecipe = recipeId[randomIndex];
    res.send(randomRecipe);
}));
// GET - recipe detail page
app.get("/recipes/:recipeId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const recipeId = parseInt(req.params.recipeId);
    if (isNaN(recipeId)) {
        res.status(400).send({ message: "Wrong request! Recipe ID needed!" });
    }
    else {
        const recipeFromDb = yield prisma.recipe.findUnique({
            where: {
                id: recipeId,
            },
            include: {
                category: true,
                ingredients: {
                    include: {
                        product: {
                            select: {
                                productname: true,
                            },
                        },
                    },
                },
            },
        });
        if (recipeFromDb === null) {
            res
                .status(400)
                .send({ mesasge: `Can't find recipe with ID ${recipeId}` });
        }
        else {
            res.send(recipeFromDb);
        }
    }
}));
// GET - user's available recipes
app.get("/compare-products", middleware_1.AuthMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    if (userId === undefined) {
        res.status(500).send({ message: "Something went terribly wrong!" });
        return;
    }
    try {
        // Find all productIds in user's Fridge
        const userFridge = yield prisma.productOnUser.findMany({
            where: { userId },
            select: {
                productId: true,
            },
        });
        const recipes = yield prisma.recipe.findMany({
            include: { category: true, ingredients: true },
        });
        const matchingRecipeIds = [];
        for (const recipe of recipes) {
            const requiredIngredients = recipe.ingredients;
            const requiredProductIds = requiredIngredients.map((reqPId) => reqPId.productId);
            // Check if all required products exist in the user's fridge
            const allIngredientsInFridge = requiredProductIds.every((requiredProductId) => userFridge.some((userProduct) => userProduct.productId === requiredProductId));
            if (allIngredientsInFridge) {
                matchingRecipeIds.push(recipe.id);
            }
        }
        res.send({ matchingRecipeIds });
    }
    catch (error) {
        console.error("Error: ", error);
        res.status(500).send({ error: "Internal server error" });
    }
}));

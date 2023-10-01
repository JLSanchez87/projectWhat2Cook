export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  userImg?: string;
  Fridge: ProductOnUser[];
}

export interface ProductOnUser {
  id: number;
  user: User;
  userId: number;
  product: Product[];
  productId: number;
  productCount: number;
}

export interface Product {
  id: number;
  productname: string;
  portionSize: number;
  productOnRecipe: ProductOnRecipe[];
  productOnUser: ProductOnUser[];
}

export interface ProductOnRecipe {
  id: number;
  recipe: Recipe[];
  recipeId: number;
  product: Product[];
  productId: number;
  recipeCount: number;
}

export interface Recipe {
  id: number;
  recipename: string;
  recipeImg?: string;
  description: string;
  instructions: string;
  prepTime?: number;
  serves?: number;
  category: [
    {
      categoryname: string;
      categoryImg: string;
    }
  ];
  ingredients: [
    {
      productId: number;
      id: number;
      product: {
        id: number;
        productname: string;
      };
    }
  ];
}

export interface Category {
  id: number;
  categoryname: string;
  categoryImg?: string;
  recipe: Recipe[];
}

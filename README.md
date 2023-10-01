# What2Cook

We've all been there... You come home all tired and trying to make your way to the kitchen, but then you realize... You have no idea

        What2Cook

This is for all the people that just want to have an easy time to decide what they want to eat.

In essense this is a pantry/refrigerator inventory management app. Just fill in your inventory and the app will recommend several recipes that is match based on what you have in your inventory.

## Easy of use:

- Just click or search for the available item and it will be added to your inventory
- When you've filled in your inventory just press `Save Fridge`
- The page will reload and at the top you'll have your recipes.
- Visit the recipe page voor detailed description/instruction & ingredients list.
  - When done with a recipe, you can click on `Eaten` and the items that are on the ingredients list will be removed from your inventory.

## Future planned updates:

- Search on cuisine for recipes and products
- User add items
- User add recipes
- User comment on other user's recipes
- User rate other user's recipes
- An overview recipes you've liked and created

# Model Schema

Here's a summary of the relationships within the model schema:

- User - Fridge Relation:

  - Each User can have a "fridge" which contains products. This establishes a one-to-many relationship between

- User and ProductOnUser.

  - The relation is formed by the Fridge field in the User model, which is an array of ProductOnUser objects.

- Product - ProductOnUser Relation:

  - The ProductOnUser table represents the products that a user has in their fridge. It has a many-to-one relationship with both User and Product.
  - The user field in the ProductOnUser model references the User model using the userId field, and the product field references the Product model using the productId field.

- Product - ProductOnRecipe Relation:

  - Similarly, the ProductOnRecipe table represents the products required for a specific recipe. It has a many-to-one relationship with both Recipe and Product.
  - The recipe field in the ProductOnRecipe model references the Recipe model using the recipeId field, and the product field references the Product model using the productId field.

- Recipe - Ingredients Relation:

  - Each Recipe can have multiple ingredients, represented by the ProductOnRecipe table. This creates a many-to-many relationship between Recipe and Product.
  - The ingredients field in the Recipe model is an array of ProductOnRecipe objects.

- Recipe - Category Relation:

  - Each Recipe can belong to multiple categories, establishing a many-to-many relationship between Recipe and Category.
  - The category field in the Recipe model is an array of Category objects.

- Category - Recipe Relation:

  - The Category model has a field called recipe, which creates a one-to-many relationship between Category and Recipe. Each category can have multiple associated recipes.

- ProductOnUser - User Relation (Inverse):

  - The ProductOnUser model has a field called user, which references the User model using the userId field. This represents the many-to-one relationship between ProductOnUser and User.

- ProductOnUser - Product Relation (Inverse):

  - Similarly, the ProductOnUser model has a field called product, which references the Product model using the productId field. This represents the many-to-one relationship between ProductOnUser and Product.

- ProductOnRecipe - Recipe Relation (Inverse):

  - The ProductOnRecipe model has a field called recipe, which references the Recipe model using the recipeId field. This represents the many-to-one relationship between ProductOnRecipe and Recipe.

- ProductOnRecipe - Product Relation (Inverse):
  - Similarly, the ProductOnRecipe model has a field called product, which references the Product model using the productId field. This represents the many-to-one relationship between ProductOnRecipe and Product.

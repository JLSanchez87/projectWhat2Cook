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

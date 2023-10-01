import Wrapper from "@/components/Wrapper";
import { ProductOnUser, Recipe } from "@/types/Interfaces";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

const Recipe = () => {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [token, setToken] = useState<null | string>(null);
  const [isRemoved, setIsRemoved] = useState<boolean>(false);
  const router = useRouter();
  const recipeIdFromUrl = router.query.recipeId;

  useEffect(() => {
    if (recipeIdFromUrl === undefined) {
      return;
    }

    const getRecipeFromApi = async () => {
      try {
        const response = await axios.get(
          `${process.env["NEXT_PUBLIC_API_URL"]}/recipes/${recipeIdFromUrl}`
        );
        setRecipe(response.data);
      } catch (error) {
        console.log("Error fetching recipe:", error);
      }
    };
    getRecipeFromApi();
  }, [recipeIdFromUrl]);

  // get token auth from Ls
  useEffect(() => {
    const tokenFromLs = localStorage.getItem("token");

    if (tokenFromLs) {
      setToken(tokenFromLs);
    }
  }, []);

  useEffect(() => {
    console.log(isRemoved);
  }, [isRemoved]);

  const handleRecipeEaten = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!recipe || !recipe.ingredients || !Array.isArray(recipe.ingredients)) {
      return; // Handle invalid cases
    }

    // Fetch the user's inventory
    try {
      const response = await axios.get(
        `${process.env["NEXT_PUBLIC_API_URL"]}/fridge`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const userInventory: ProductOnUser[] = response.data;

      // Map recipeIngredients to unique IDs in user's inventory
      const uniqueIdsToDelete = recipe.ingredients.map((ingredient) => {
        const matchingInventoryItem = userInventory.find(
          (inventoryItem: ProductOnUser) =>
            inventoryItem.productId === ingredient.productId
        ) as ProductOnUser;
        return matchingInventoryItem ? matchingInventoryItem.id : null;
      });

      // Filter out any null values (items not found in inventory)
      const filteredUniqueIds = uniqueIdsToDelete.filter((id) => id !== null);

      if (filteredUniqueIds.length === 0) {
        console.log("No matching items found in the user's inventory.");
        return;
      }

      // Send a delete request with the filtered unique IDs
      await axios.delete(`${process.env["NEXT_PUBLIC_API_URL"]}/fridge`, {
        data: {
          id: filteredUniqueIds,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Items removed!");
      setIsRemoved(true);
    } catch (error) {
      console.error("Error handling recipe eaten:", error);
    }
  };

  if (recipe === null) {
    return <p>Loading recipe, please wait...</p>;
  }

  return (
    <Wrapper>
      <div className="mx-2" key={recipe.id}>
        <div className="flex flex-row flex-wrap items-end justify-between mt-10 mb-4 md:mx-auto md:w-2/3">
          <div className="mb-4">
            <span className="text-4xl underline font-lobster">
              {recipe.recipename}
            </span>
            <br />
            {recipe.category.map((category) => (
              <Badge
                key={recipe.id}
                className="w-auto mt-2"
                variant={"default"}
              >
                {category.categoryname}
              </Badge>
            ))}
          </div>
          <div className="flex justify-between w-full mb-4 md:w-auto md:justify-end">
            <span className="md:mr-8">
              Time to cook: {recipe.prepTime} minutes
            </span>
            <span>
              Serves:
              {recipe.serves === undefined
                ? "no serving ☹️"
                : "♨".repeat(recipe.serves)}
            </span>
          </div>
          <p>{recipe.description}</p>
        </div>

        <img
          className="mx-auto my-4 border-2 w-100 border-header rounded-3xl md:w-2/3"
          src={recipe.recipeImg}
          alt={recipe.description}
        />
        <div>
          <div className="grid grid-cols-1 m-auto md:grid-cols-3 md:w-2/3 md:mb-16">
            <div className="col-span-2 md:pr-2">
              <p className="mb-4 font-lobster">Do the cooking by the book!</p>
              <p className="mb-4">{recipe.instructions}</p>
            </div>
            <div className="border-t-2 md:pl-2 md:border-l-2 md:border-t-0 border-header">
              <p className="mb-4 font-lobster">Ingredients</p>
              <ul>
                {recipe.ingredients.map((ingredient) => (
                  <li key={ingredient.id}>{ingredient.product.productname}</li>
                ))}
              </ul>
              <div>
                <form onSubmit={handleRecipeEaten}>
                  {isRemoved === true ? (
                    <motion.button
                      whileHover={{
                        scale: 1.05,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 17,
                      }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 mt-2 bg-lilia text-raven by rounded-xl"
                      type="submit"
                      disabled={isRemoved}
                    >
                      Ingredients removed!
                    </motion.button>
                  ) : (
                    <motion.button
                      whileHover={{
                        scale: 1.05,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 17,
                      }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 mt-2 text-white bg-ruby rounded-xl"
                      type="submit"
                      disabled={isRemoved}
                    >
                      Remove ingredients from Fridge
                    </motion.button>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default Recipe;

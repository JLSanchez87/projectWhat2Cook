import { Recipe } from "@/types/Interfaces";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ScrollArea } from "@radix-ui/react-scroll-area";

const RecipeList = () => {
  const [token, setToken] = useState<null | string>(null);
  const [recipes, setRecipes] = useState<Recipe[] | null>(null);
  const [randomRecipe, setRandomRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    const tokenFromLs = localStorage.getItem("token");
    if (tokenFromLs) {
      setToken(tokenFromLs);
    }

    const getRecipeIdFromApi = async () => {
      try {
        const response = await axios.get(
          `${process.env["NEXT_PUBLIC_API_URL"]}/compare-products`,
          {
            headers: {
              Authorization: `Bearer ${tokenFromLs}`,
            },
          }
        );

        // Get the ID's from the comparison endpoint
        const matchingRecipeIds = response.data.matchingRecipeIds;

        // Get the recipes
        const matchingRecipes = await axios.get(
          `${process.env["NEXT_PUBLIC_API_URL"]}/recipes`
        );

        // filter our the recipes that doesn't correspond with the comparison endpoint
        const filteredRecipes = matchingRecipes.data.filter((recipe: Recipe) =>
          matchingRecipeIds.includes(recipe.id)
        );

        // Set the matching recipes to the state
        setRecipes(filteredRecipes);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    };
    getRecipeIdFromApi();
  }, []);

  useEffect(() => {
    if (recipes && recipes.length > 0) {
      const randomIndex = Math.floor(Math.random() * recipes.length);
      setRandomRecipe(recipes[randomIndex]);
    }
  }, [recipes]);

  return (
    <div>
      {randomRecipe === null ? (
        <div>
          <div
            className="relative my-4 overflow-hidden bg-center bg-cover rounded-2xl bg-raven "
            style={{ backgroundImage: 'url("/landing-bg.jpg")' }}
          >
            <div className="absolute inset-0 bg-black/40" />
            <div className="relative flex flex-col h-96 rounded-2xl">
              <h2 className="p-2 text-2xl font-bold text-white md:pt-4 md:pl-4 md:text-6xl">
                Welcome to your Fridge
              </h2>
              <p className="p-2 text-white bg-ruby md:pl-4">
                Click{" "}
                <Link href={"/#searchInput"}>
                  <span className="hover:underline">here</span>
                </Link>{" "}
                to start adding items to your inventory!
              </p>
            </div>
          </div>
          <p>Please add (more) items in your Fridge</p>
        </div>
      ) : (
        <div key={randomRecipe.id}>
          <div
            className="relative my-4 overflow-hidden bg-center bg-cover rounded-2xl bg-raven "
            style={{ backgroundImage: `url(${randomRecipe.recipeImg})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/50" />
            <div className="relative flex flex-col items-start justify-start h-96 rounded-2xl">
              <h2 className="p-2 text-2xl font-bold text-white md:pt-4 md:pl-4 md:text-6xl">
                How about this recipe?
              </h2>
              <Link href={`recipes/${randomRecipe.id}`}>
                <div className="border-b-4 border-r-4 border-raven hover:border-lilia bg-ruby">
                  <p className="p-2 text-white md:pl-4 md:pr-4">
                    {randomRecipe.recipename}
                  </p>
                </div>
              </Link>
            </div>
          </div>
          <p>other available recipes:</p>
        </div>
      )}

      <ScrollArea className="flex flex-row w-full py-4 overflow-auto rounded-2xl snap-x">
        {recipes === null ? (
          <p>Loading recipes..</p>
        ) : (
          recipes.map((recipe) => {
            return (
              <Link key={recipe.id} href={`recipes/${recipe.id}`}>
                <div
                  key={recipe.id}
                  className="flex flex-row around w-[340px] mr-4 border-2 bg-kelly border-solid border-header rounded-xl drop-shadow-lg scroll-m-3 snap-start"
                >
                  <img
                    className="object-cover object-center w-20 h-20 rounded-xl"
                    src={recipe.recipeImg}
                    alt={recipe.description}
                  />
                  <div className="flex flex-col justify-between w-full px-4 py-1 text-darkIndigo text-cta">
                    <span className="font-bold">{recipe.recipename}</span>
                    <div className="flex flex-row justify-between text-xs">
                      <span>🕑: {recipe.prepTime}mins</span>
                      <span>
                        {recipe.serves === undefined
                          ? "no serving ☹️"
                          : "♨".repeat(recipe.serves)}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </ScrollArea>
    </div>
  );
};

export default RecipeList;

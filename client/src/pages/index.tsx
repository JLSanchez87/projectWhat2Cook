import ProductList from "@/components/ProductList";
import RecipeList from "@/components/RecipeList";
import WithToken from "@/components/WithToken";

const Home = () => {
  return (
    <WithToken>
      <div className="flex flex-col items-center justify-center w-full bg-center bg-cover md:mx-8 md:mb-8 md:rounded-b-2xl bg-lilia">
        <div className="flex flex-col w-full px-1 py-8 border-2 border-t-0 border-b-0 md:p-8 md:rounded-b-2xl md:border-b-2 border-darkAlice">
          <RecipeList />
        </div>
      </div>
      <div className="w-full">
        <div className="flex flex-col items-center p-8 px-1 border-2 border-solid md:rounded-2xl border-darkAlice bg-lilia">
          <h1 className="text-lg font-bold">Your Fridge & Pantry</h1>
          <p>Click on the items to add or remove to/from your inventory</p>
          <ProductList />
        </div>
      </div>
    </WithToken>
  );
};

export default Home;

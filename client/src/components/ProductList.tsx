import { Product } from "@/types/Interfaces";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: "0px" },
  show: { opacity: 1, x: "0px" },
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const ProductList = () => {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [token, setToken] = useState<null | string>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const searchContainerRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const query = event.target.value;
    setSearchQuery(query);

    if (products === null) {
      return;
    } else {
      const filteredItems = products.filter((product) =>
        product.productname.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredProducts(filteredItems);
    }
  };

  // Get token from Ls and sort products
  useEffect(() => {
    const tokenFromLs = localStorage.getItem("token");

    if (tokenFromLs) {
      setToken(tokenFromLs);
    }

    const getProductsFromApi = async () => {
      const productsResponse = await axios.get(
        `${process.env["NEXT_PUBLIC_API_URL"]}/products`
      );
      const userFridgeResponse = await axios.get(
        `${process.env["NEXT_PUBLIC_API_URL"]}/me`,
        {
          headers: {
            Authorization: `Bearer ${tokenFromLs}`,
          },
        }
      );

      const sortedProducts = productsResponse.data.sort(
        (a: Product, b: Product) => a.productname.localeCompare(b.productname)
      );

      setProducts(sortedProducts);

      if (sortedProducts) {
        setFilteredProducts(sortedProducts);
      }

      const initialSelectedIds = userFridgeResponse.data.Fridge.map(
        (item: any) => {
          return item.productId;
        }
      );

      setSelectedIds(initialSelectedIds);
    };

    getProductsFromApi();
  }, []);

  // Re-sort the sorted products while checking checked state. If checked it will send the product to the other column
  useEffect(() => {
    if (products) {
      const sortedProducts = [...products];
      sortedProducts.sort((a, b) => {
        const isASelected = selectedIds.includes(a.id);
        const isBSelected = selectedIds.includes(b.id);

        if (isASelected && !isBSelected) {
          return -1;
        } else if (!isASelected && isBSelected) {
          return 1;
        }
        return 0;
      });

      setProducts(sortedProducts);
    }
  }, [selectedIds]);

  // Search input
  useEffect(() => {
    const searchInput = document.getElementById("searchInput");

    if (searchInput && searchContainerRef.current) {
      searchInput.addEventListener("click", () => {
        searchContainerRef.current?.scrollIntoView({ behavior: "smooth" });
      });
    }
  }, []);

  // Send post request to the backend and send token auth with it
  const handleFridgeSubmit = async () => {
    await axios.post(
      `${process.env["NEXT_PUBLIC_API_URL"]}/fridge`,
      {
        productId: selectedIds,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    router.push("/");
    window.location.href = "/";
  };

  return (
    <>
      <div className="w-full">
        <form className="w-full min-h-screen">
          <div className="grid mt-4 mb-10 md:grid-cols-2 md:px-8 around">
            <div
              className="sticky top-0 z-40 w-full mb-4 md:col-span-2 "
              ref={searchContainerRef}
            >
              <input
                type="text"
                placeholder="Search by product name..."
                value={searchQuery}
                onChange={handleSearchInputChange}
                className="relative w-full h-12 p-1 border-b-2 bg-background border-header"
                id="searchInput"
              />
            </div>
            <div className="col-span-1 p-4 pr-2 md:border-2 md:border-r-0 md:w-full bg-background border-kelly rounded-l-xl">
              <p className="mb-4">Your inventory:</p>
              {filteredProducts.length === 0 ? (
                <p>No matching products found...</p>
              ) : (
                <motion.div
                  className="flex flex-row flex-wrap w-full"
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                >
                  {filteredProducts.map((product, index) => {
                    if (selectedIds.includes(product.id)) {
                      return (
                        <motion.div
                          whileHover={{
                            scale: 1.1,
                          }}
                          transition={{
                            type: "spring",
                            stiffness: 200,
                            damping: 17,
                          }}
                          whileTap={{ scale: 0.95 }}
                          variants={itemVariants}
                          key={index}
                          className="relative items-start px-2 mb-2 mr-2 text-white border-2 border-solid border-darkIndigo bg-kelly rounded-xl"
                        >
                          <label
                            htmlFor={product.id.toString()}
                            key={product.id}
                          >
                            <input
                              className="absolute left-0 w-10 h-6 appearance-none text-raven -z-10 checked:bg-gradient-to-r from-ruby checked:border-none rounded-l-xl"
                              type="checkbox"
                              id={product.id.toString()}
                              value={product.id}
                              checked={true}
                              onChange={(event) =>
                                setSelectedIds(
                                  selectedIds.filter((i) => i !== product.id)
                                )
                              }
                            />
                            {product.productname}
                          </label>
                        </motion.div>
                      );
                    }
                    return null;
                  })}
                </motion.div>
              )}
            </div>

            <div className="col-span-1 p-4 pl-2 md:w-full md:border-2 md:border-l-0 border-darkIndigo bg-fg md:rounded-r-xl">
              <p className="mb-4">Add these items:</p>
              {filteredProducts.length === 0 ? (
                <p>No matching products found...</p>
              ) : (
                <motion.div
                  className="flex flex-row flex-wrap w-full"
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                >
                  {filteredProducts.map((product, index) => {
                    if (!selectedIds.includes(product.id)) {
                      return (
                        <motion.div
                          whileHover={{
                            scale: 1.1,
                          }}
                          transition={{
                            type: "spring",
                            stiffness: 200,
                            damping: 17,
                          }}
                          whileTap={{ scale: 0.95 }}
                          variants={itemVariants}
                          key={index}
                          className="relative items-start px-2 mb-2 mr-2 bg-white border-2 border-solid border-kelly rounded-xl"
                        >
                          <label htmlFor={product.id.toString()}>
                            <input
                              className="absolute left-0 w-10 h-6 appearance-none max-w-content -z-10 checked:bg-gradient-to-r from-darkAlice to-bg-transparent checked:border-none rounded-l-xl active:scale-95"
                              type="checkbox"
                              id={product.id.toString()}
                              value={product.id}
                              checked={false}
                              onChange={(event) =>
                                setSelectedIds([...selectedIds, product.id])
                              }
                            />
                            {product.productname}
                          </label>
                        </motion.div>
                      );
                    }
                    return null;
                  })}
                </motion.div>
              )}
            </div>
          </div>
          <div className="w-100 md:pl-8">
            <button
              className="fixed bottom-0 z-50 p-2 pb-8 text-white transition ease-in-out border-2 border-solid rounded-t-lg border-darkIndigo bg-ruby text-cta active:bg-cta active:text-fg active:scale-105 w-60 hover:-translate-y-1 hover:scale-110 hover:bg-fg hover:text-cta"
              type="button"
              onClick={handleFridgeSubmit}
            >
              Save Fridge
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ProductList;

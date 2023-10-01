import { User } from "@/types/Interfaces";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Logo from "./Logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const NavBar = () => {
  const [token, setToken] = useState<null | string>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const tokenFromLs = localStorage.getItem("token");
    if (tokenFromLs) {
      setToken(tokenFromLs);
    }
  }, []);

  useEffect(() => {
    const getUserInfo = async () => {
      if (token) {
        try {
          const response = await axios.get(
            `${process.env["NEXT_PUBLIC_API_URL"]}/me`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const userData = response.data;
          setUser(userData);
        } catch (error) {
          console.log("Error fetching user information:", error);
        }
      }
    };
    getUserInfo();
  }, [token]);

  const router = useRouter();

  const handleClick = () => {
    localStorage.removeItem("token");
    setToken(null);
    window.location.reload();
    router.push("/");
  };

  if (user === null) {
    return;
  }

  return (
    <nav className="p-2 md:p-9 md:rounded-b-3xl md:h-32 md:w-[80%] md:mx-auto bg-darkAlice">
      <div className="flex flex-row justify-between mx-auto">
        <Link href="/">
          <div className="flex flex-row items-baseline">
            <Logo height="1.8rem" />
            <p className="z-10 ml-1 text-3xl font-lobster text-lilia">
              what2cook
            </p>
          </div>
        </Link>

        <div className="hidden text-lg text-white md:flex md:flex-row">
          <span className="mx-4 transition ease-in-out hover:underline hover:scale-105">
            <Link href="/#searchInput">My fridge</Link>
          </span>
          <span className="mx-4 transition ease-in-out hover:underline hover:scale-105">
            {token ? (
              <Link href="/">{user.username}</Link>
            ) : (
              <Link href="/register">Register</Link>
            )}
          </span>
          <span className="ml-4 font-bold transition ease-in-out hover:underline hover:scale-110">
            {token ? (
              <Link href="/" onClick={handleClick}>
                Logout
              </Link>
            ) : (
              <Link href="/login">Login</Link>
            )}
          </span>
        </div>
        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <svg
                height="2rem"
                version="1.1"
                id="_x32_"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <g>
                  <path
                    fill="var(--lilia)"
                    d="M495.957,390.227H16.044C7.185,390.227,0,397.401,0,406.249v26.685c0,54.749,114.619,47.804,256,47.804
		s256-2.185,256-47.804v-26.685C512,397.401,504.815,390.227,495.957,390.227z"
                  />
                  <path
                    fill="var(--lilia)"
                    d="M42.934,353.858h426.13c15.913,0,28.794-12.891,28.794-28.794v-25.272c0-15.891-12.881-28.771-28.794-28.771
		H430.37l-61.163,61.152c-15.652,15.662-41.033,15.662-56.696,0l-61.152-61.152H42.934c-15.913,0-28.793,12.88-28.793,28.771v25.272
		C14.141,340.967,27.022,353.858,42.934,353.858z"
                  />
                  <path
                    fill="var(--lilia)"
                    d="M256,30.977c-141.38,0-256,74.13-256,172.554v20.739c0,8.848,7.185,16.032,16.044,16.032h479.913
		c8.858,0,16.043-7.185,16.043-16.032v-20.739C512,105.107,397.38,30.977,256,30.977z M128.706,144.118
		c-9.38,0-16.967-7.586-16.967-16.967c0-9.37,7.587-16.978,16.967-16.978c9.37,0,16.978,7.609,16.978,16.978
		C145.684,136.532,138.076,144.118,128.706,144.118z M205.076,93.205c-9.37,0-16.967-7.598-16.967-16.967
		c0-9.381,7.598-16.967,16.967-16.967c9.38,0,16.978,7.586,16.978,16.967C222.054,85.608,214.456,93.205,205.076,93.205z
		 M256,161.097c-9.37,0-16.978-7.609-16.978-16.978c0-9.37,7.609-16.967,16.978-16.967c9.37,0,16.978,7.598,16.978,16.967
		C272.978,153.488,265.369,161.097,256,161.097z M306.924,93.205c-9.38,0-16.978-7.598-16.978-16.967
		c0-9.381,7.598-16.967,16.978-16.967c9.37,0,16.967,7.586,16.967,16.967C323.891,85.608,316.293,93.205,306.924,93.205z
		 M383.293,144.118c-9.37,0-16.978-7.586-16.978-16.967c0-9.37,7.609-16.978,16.978-16.978c9.381,0,16.967,7.609,16.967,16.978
		C400.26,136.532,392.674,144.118,383.293,144.118z"
                  />
                </g>
              </svg>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-lilia border-darkAlice text-darkAlice">
              <DropdownMenuLabel>
                <span>
                  {token ? (
                    <Link href="/">{user.username}</Link>
                  ) : (
                    <Link href="/register">Register</Link>
                  )}
                </span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <span>
                  <Link href="/#searchInput">My fridge</Link>
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span>
                  {token ? (
                    <Link href="/" onClick={handleClick}>
                      Logout
                    </Link>
                  ) : (
                    <Link href="/login">Login</Link>
                  )}
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;

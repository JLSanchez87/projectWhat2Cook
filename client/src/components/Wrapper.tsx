import { ReactNode } from "react";
import NavBar from "./NavBar";

interface WrapperProps {
  children: ReactNode;
}

const Wrapper = (props: WrapperProps) => {
  return (
    <>
      <NavBar />
      <main className="relative flex flex-col justify center items-center mx-auto -top-5 -z-10 w-full md:max-w-[80%]">
        {props.children}
      </main>
    </>
  );
};

export default Wrapper;

import { ReactNode, useEffect, useState } from "react";
import Wrapper from "./Wrapper";
import Welcome from "./Welcome";

interface WithTokenProps {
  children: ReactNode;
}

type checkState = "checking" | "hasToken" | "noToken";

const WithToken = (props: WithTokenProps) => {
  const [checked, setChecked] = useState<checkState>("checking");

  useEffect(() => {
    const tokenFromLs = localStorage.getItem("token");
    if (!tokenFromLs) {
      setChecked("noToken");
    } else {
      setChecked("hasToken");
    }
  }, []);

  if (checked === "checking") {
    return (
      <Wrapper>
        <p>Checking authorization...</p>
      </Wrapper>
    );
  }

  if (checked === "noToken") {
    return <Welcome />;
  }

  if (checked === "hasToken") {
    return <Wrapper>{props.children}</Wrapper>;
  } else {
    return null;
  }
};

export default WithToken;

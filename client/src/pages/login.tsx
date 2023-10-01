import Wrapper from "@/components/Wrapper";
import LoginForm from "@/components/LoginForm";

const Login = () => {
  return (
    <Wrapper>
      <div className="flex flex-col p-8">
        <h1>Login</h1>
        <LoginForm />
      </div>
    </Wrapper>
  );
};

export default Login;

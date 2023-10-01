import axios from "axios";
import { useRouter } from "next/router";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const loginFormValidator = z
  .object({
    username: z.string().nonempty().max(20),
    password: z
      .string()
      .min(10, { message: "password must be 10 or more characters" }),
  })
  .strict();

type DataFromLoginForm = z.infer<typeof loginFormValidator>;

const LoginForm = () => {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const handleLoginFormSubmit = async (data: DataFromLoginForm) => {
    try {
      const response = await axios.post(
        `${process.env["NEXT_PUBLIC_API_URL"]}/login`,
        {
          username: data.username,
          password: data.password,
        }
      );
      localStorage.setItem("token", response.data.token);
      router.push("/");
      window.location.href = "/";
    } catch (error) {
      setError("Incorrect username or password.");
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DataFromLoginForm>({
    resolver: zodResolver(loginFormValidator),
  });

  return (
    <>
      <form
        id="login-form"
        onSubmit={handleSubmit(handleLoginFormSubmit)}
        className="flex flex-col"
      >
        <CardContent className="space-y-2">
          <div className="space-y-1">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              {...register("username")}
              autoComplete="username"
            />
            {errors.username && (
              <p className="text-red-400">{errors.username.message}</p>
            )}
          </div>
          <div className="space-y-1">
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              {...register("password")}
              autoComplete="current-password"
            />
            {errors.password && (
              <p className="text-red-400">{errors.password.message}</p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit">Login</Button>
          {error && <p className="text-red-400">{error}</p>}
        </CardFooter>
      </form>
    </>
  );
};

export default LoginForm;

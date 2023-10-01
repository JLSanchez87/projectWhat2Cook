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

const registrationValidator = z
  .object({
    username: z.string().nonempty().max(20),
    password: z.string().min(10),
    email: z.string().email({ message: "Invalid email address" }),
  })
  .strict();

type DataFromRegistrationForm = z.infer<typeof registrationValidator>;

const Registration = () => {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const handleRegistrationFormSubmit = async (
    data: DataFromRegistrationForm
  ) => {
    try {
      const response = await axios.post(
        `${process.env["NEXT_PUBLIC_API_URL"]}/register`,
        {
          username: data.username,
          password: data.password,
          email: data.email,
        }
      );
      router.push("/");
      window.location.href = "/";
    } catch (error) {
      setError("Incorrect information has been entered");
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DataFromRegistrationForm>({
    resolver: zodResolver(registrationValidator),
  });

  return (
    <>
      <form
        id="login-form"
        onSubmit={handleSubmit(handleRegistrationFormSubmit)}
        className="flex flex-col"
      >
        <CardContent className="space-y-2">
          <div className="space-y-1">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              {...register("username")}
              autoComplete="username"
              placeholder="max. 20 characters"
            />
            {errors.username && (
              <p className="text-red-400">{errors.username.message}</p>
            )}
          </div>
          <div className="space-y-1">
            <Label htmlFor="password">E-mail</Label>
            <Input
              type="email"
              id="email"
              {...register("email")}
              autoComplete="email"
              placeholder="please provide a valid email"
            />
            {errors.email && (
              <p className="text-red-400">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              {...register("password")}
              autoComplete="new-password"
              placeholder="min. 10 characters"
            />
            {errors.password && (
              <p className="text-red-400">{errors.password.message}</p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit">Create account</Button>
          {error && <p className="text-red-400">{error}</p>}
        </CardFooter>
      </form>
    </>
  );
};

export default Registration;

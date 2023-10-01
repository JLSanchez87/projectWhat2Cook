import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from "./LoginForm";
import Register from "./Register";
import Logo from "./Logo";

const Welcome = () => {
  return (
    <main className="flex flex-col items-center min-h-screen bg-fixed bg-center bg-cover bg-gradient-to-b from-[var(--header)] to-[var(--div-color)]">
      <div
        className="absolute z-10 w-screen min-h-screen bg-fixed bg-center bg-cover"
        style={{
          backgroundImage: `url('landing-bg.jpg')`,
          opacity: 0.1,
        }}
      />
      <div className="md:w-[75%] grid grid-cols-1 md:grid-cols-2">
        <div className="flex flex-col items-center px-2 md:min-h-screen md:px-8 bg-lilia">
          <h1 className="z-10 pt-10 mb-16 font-bold text-ruby text-7xl">
            Want to make your life easier?
          </h1>
          <p className="mb-8 text-xl">
            <span className="text-2xl font-bold text-darkIndigo">
              Personalized Meal Suggestions:
            </span>{" "}
            Gives meal ideas tailored to each user&apos;s dietary preferences,
            available ingredients, and cooking skills.
          </p>
          <p className="mb-8 text-xl">
            <span className="text-2xl font-bold text-darkIndigo">
              Quick and Easy Recipes:
            </span>{" "}
            Emphasis on recipes that can be prepared in 30 minutes or less, with
            step-by-step instructions.
          </p>
          <p className="mb-8 text-xl">
            <span className="text-2xl font-bold text-darkIndigo">
              Time-Saving Tips:
            </span>{" "}
            Provides kitchen hacks, meal prep strategies, and tips to save time
            during cooking and cleanup.
          </p>
        </div>
        <div className="flex flex-col items-center px-2 md:min-h-screen md:px-4 md:bg-darkAlice">
          <h1 className="z-10 pt-10 mb-4 font-serif text-xl">
            The app for people who don&apos;t know..
          </h1>
          <div className="flex flex-row items-baseline">
            <Logo height="4rem" />
            <p className="z-10 mb-5 ml-2 text-7xl font-lobster text-darkIndigo">
              what2cook
            </p>
          </div>
          <p className="z-10 mb-8 text-6xl font-bold font-lobster text-amber-400">
            🍔 🍖 🍗 🍝
            <br />
            🥦 🧀 🍞 🧂
          </p>
          <Tabs defaultValue="login" className="z-10 w-[400px]">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>Login</CardTitle>
                  <CardDescription>
                    Fill in your login information to access your Fridge!
                  </CardDescription>
                </CardHeader>
                <LoginForm />
              </Card>
            </TabsContent>

            <TabsContent value="register">
              <Card>
                <CardHeader>
                  <CardTitle>Create a new account!</CardTitle>
                  <CardDescription>
                    Create your account here, after registering you can log in!
                  </CardDescription>
                </CardHeader>
                <Register />
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  );
};

export default Welcome;

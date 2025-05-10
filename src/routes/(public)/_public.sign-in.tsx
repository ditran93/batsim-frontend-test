import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  signInSchema,
  type SignInSchemaType,
} from "@/features/auth/schemas/sign-in-schema";
import { useSignIn } from "@/features/auth/hooks/use-sign-in";

export const Route = createFileRoute("/(public)/_public/sign-in")({
  component: SignInPage,
});

function SignInPage() {
  const form = useForm<SignInSchemaType>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const { mutate: login } = useSignIn();

  function onSubmit(values: SignInSchemaType) {
    console.log(values);
    login(values);
  }
  return (
    <div className="flex flex-col items-center">
      <div className="text-center mb-6 animate-fade-in">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome to Book Store
        </h1>
        <p className="text-gray-600 text-lg">Please sign in to continue.</p>
      </div>
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle className="font-bold text-2xl">Log In</CardTitle>
          <CardDescription>Please enter username and password</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Submit</Button>
            </form>
          </Form>

          <div className="flex items-center gap-x-2 pt-4">
            <p>Don't have an account?</p>
            <Link to={"/sign-up"} className="text-blue-500 underline">
              Sign Up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

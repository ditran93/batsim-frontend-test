import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  signupSchema,
  type SignupSchemaType,
} from "@/features/auth/schemas/sign-up-schema";
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
import { useSignUp } from "@/features/auth/hooks/use-sign-up";

export const Route = createFileRoute("/(public)/_public/sign-up")({
  component: SignUpPage,
});

function SignUpPage() {
  const { mutate: createUser } = useSignUp();

  const form = useForm<SignupSchemaType>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  function onSubmit(values: SignupSchemaType) {
    console.log(values);
    createUser(values);
  }
  return (
    <div className="flex flex-col items-center">
      <div className="text-center mb-6 animate-fade-in">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome to Book Store
        </h1>
        <p className="text-gray-600 text-lg">Please sign up to continue.</p>
      </div>
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle className="font-bold text-2xl">Register</CardTitle>
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
            <p>Already have an account?</p>
            <Link to={"/sign-in"} className="text-blue-500 underline">
              Sign In
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

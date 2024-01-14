import { Link } from "@remix-run/react";
import { badRequest } from "remix-utils";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import Button from "~/components/button";
import Input from "~/components/input";

import { createUserSession, login } from "~/utils/session.server";
import loginSchema from "~/schemas/login.schema";
import FormGroup from "~/components/form-group";

const classes = {
  title: "text-5xl font-black mb-6",
  form: "relative flex h-full bg-white dark:bg-dark shadow flex-col items-center justify-center gap-y-4 text-sm",
  formGroup: "flex flex-col gap-y-1",
  fieldErrorMessage: "text-red",
};

export default function LoginPage() {
  const {
    register,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(loginSchema),
    mode: "onBlur",
  });

  return (
    <div className="grid h-[100svh] grid-cols-[7fr_3fr]">
      <div className="flex h-full flex-col justify-center p-16">
        <h1 className={classes.title}>
          Welcome, and join us to build your league!
        </h1>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborum
          officia tempore obcaecati aliquam fugit eligendi pariatur repudiandae
          eius nemo mollitia, eaque dolorum aut voluptatibus accusamus dicta,
          minima perspiciatis. Similique nesciunt odio autem totam quo tenetur.
          Ipsam nihil suscipit quibusdam earum libero perspiciatis molestias
          necessitatibus ex, animi officia dolores et odit!
        </p>
      </div>
      <form className={classes.form} method="POST">
        <FormGroup label="E-mail" error={errors.email?.message}>
          <Input type="email" {...register("email")} />
        </FormGroup>
        <FormGroup label="Password" error={errors.password?.message}>
          <Input type="password" {...register("password")} />
        </FormGroup>
        
        <Button type="submit" disabled={!isValid}>
          Login
        </Button>

        <p className="absolute bottom-8 text-center">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="text-blue-500 underline">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}

export const action = async ({ request }: { request: Request }) => {
  const form = await request.formData();

  const email = form.get("email") as string;
  const password = form.get("password") as string;

  const user = await login({ email, password });

  if (!user) {
    return badRequest({
      error: "Username and/or password are invalid",
    });
  }

  return createUserSession(user.id, "/dashboard");
};

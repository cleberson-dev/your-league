import { badRequest } from "remix-utils";
import { Link, useActionData } from "@remix-run/react";
import { ActionFunction } from "@remix-run/server-runtime";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "~/components/button";
import { createUserSession, register } from "~/utils/session.server";
import Input from "~/components/input";
import registerSchema from "~/schemas/register.schema";
import FormGroup from "~/components/form-group";

const classes = {
  title: "text-5xl font-black mb-6",
  form: "relative flex h-full bg-white dark:bg-dark shadow flex-col items-center justify-center gap-y-4 text-sm",
  formGroup: "flex flex-col gap-y-1",
  fieldErrorMessage: "text-red-500",
};

export default function Register() {
  const {
    register,
    formState: { isValid, errors },
  } = useForm({
    resolver: yupResolver(registerSchema),
  });

  const actionData = useActionData();

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
        <FormGroup label="Name" error={errors.name?.message}>
          <Input {...register("name")} />
        </FormGroup>
        <FormGroup label="E-mail" error={errors.email?.message}>
          <Input type="email" {...register("email")} />
        </FormGroup>
        <FormGroup label="Password" error={errors.password?.message}>
          <Input type="password" {...register("password")} />
        </FormGroup>
        <FormGroup label="Confirm your password" error={errors.passwordConfirmation?.message}>
          <Input type="password" {...register("passwordConfirmation")} />
        </FormGroup>

        <p className={classes.fieldErrorMessage}>
          <small>{actionData?.error}</small>
        </p>

        <Button type="submit" disabled={!isValid}>
          Create
        </Button>

        <p className="absolute bottom-8 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 underline">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}

export const action: ActionFunction = async ({ request }: { request: Request }) => {
  const form = await request.formData();

  const user = await register({
    name: form.get("name") as string,
    email: form.get("email") as string,
    password: form.get("password") as string,
  });

  if (!user) {
    return badRequest({
      error: "Username and/or password invalid",
    });
  }

  return createUserSession(user.id, "/dashboard");
};

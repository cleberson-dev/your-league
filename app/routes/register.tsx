import { badRequest } from "remix-utils";
import { Link, useActionData } from "@remix-run/react";
import { ActionFunction } from "@remix-run/server-runtime";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "~/components/button";
import { createUserSession, register } from "~/utils/session.server";
import Input from "~/components/input";

const schema = yup.object({
  name: yup.string().min(3).max(32).required(),
  email: yup.string().email().required(),
  password: yup.string().min(8).max(16).required(),
  passwordConfirmation: yup
    .string()
    .oneOf([yup.ref("password"), undefined], "Passwords must match")
    .required(),
});

const classes = {
  title: "text-5xl font-black mb-6",
  form: "relative flex h-full bg-white shadow flex-col items-center justify-center gap-y-4 text-sm",
  formGroup: "flex flex-col gap-y-1",
  fieldErrorMessage: "text-red-500",
};

export default function Register() {
  const {
    register,
    formState: { isValid, errors },
  } = useForm({
    resolver: yupResolver(schema),
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
        <div className={classes.formGroup}>
          <label>Name</label>
          <Input {...register("name")} />
          <p className={classes.fieldErrorMessage}>
            <small>{errors.name?.message}</small>
          </p>
        </div>
        <div className={classes.formGroup}>
          <label>E-mail</label>
          <input type="email" {...register("email")} />
          <p className={classes.fieldErrorMessage}>
            <small>{errors.email?.message}</small>
          </p>
        </div>
        <div className={classes.formGroup}>
          <label>Password</label>
          <input type="password" {...register("password")} />
          <p className={classes.fieldErrorMessage}>
            <small>{errors.password?.message}</small>
          </p>
        </div>
        <div className={classes.formGroup}>
          <label>Confirm your password</label>
          <input type="password" {...register("passwordConfirmation")} />
          <p className={classes.fieldErrorMessage}>
            <small>{errors.passwordConfirmation?.message}</small>
          </p>
        </div>
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

export const action: ActionFunction = async ({ request }: any) => {
  const form = await request.formData();

  const user = await register({
    name: form.get("name"),
    email: form.get("email"),
    password: form.get("password"),
  });

  if (!user) {
    return badRequest({
      error: "Username and/or password invalid",
    });
  }

  return createUserSession(user.id, "/dashboard");
};

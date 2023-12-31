import { badRequest } from "remix-utils";
import { Link, useActionData } from "@remix-run/react";
import { ActionFunction } from "@remix-run/server-runtime";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "~/components/button";
import { createUserSession, register } from "~/utils/session.server";

const schema = yup.object({
  name: yup.string().min(3).max(32).required(),
  email: yup.string().email().required(),
  password: yup.string().min(8).max(16).required(),
  passwordConfirmation: yup
    .string()
    .oneOf([yup.ref("password"), undefined], "Passwords must match")
    .required(),
});

export default function Register() {
  const {
    register,
    formState: { isValid, errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const actionData = useActionData();

  return (
    <form
      className="flex min-h-[100svh] flex-col items-center justify-center gap-y-4"
      method="POST"
    >
      <h1 className="text-2xl font-bold">Register right now!!</h1>
      <div>
        <label className="block">Name</label>
        <input {...register("name")} />
        <p className="text-red-500">
          <small>{errors.name?.message}</small>
        </p>
      </div>
      <div>
        <label className="block">E-mail</label>
        <input type="email" {...register("email")} />
        <p className="text-red-500">
          <small>{errors.email?.message}</small>
        </p>
      </div>
      <div>
        <label className="block">Password</label>
        <input type="password" {...register("password")} />
        <p className="text-red-500">
          <small>{errors.password?.message}</small>
        </p>
      </div>
      <div>
        <label className="block">Confirm your password</label>
        <input type="password" {...register("passwordConfirmation")} />
        <p className="text-red-500">
          <small>{errors.passwordConfirmation?.message}</small>
        </p>
      </div>
      <p className="text-red-500">
        <small>{actionData?.error}</small>
      </p>
      <Button type="submit" disabled={!isValid}>
        Create
      </Button>
      <Link to="/login" className="text-blue-500 underline">
        Login
      </Link>
    </form>
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

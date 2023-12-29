import { Link } from "@remix-run/react";
import { badRequest } from "remix-utils";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import Button from "~/components/button";
import { createUserSession, login } from "~/utils/session.server";

const schema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().min(8).max(16).required(),
});

export default function LoginPage() {
  const {
    register,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur",
  });

  return (
    <form
      className="flex min-h-[100svh] flex-col items-center justify-center gap-y-4"
      method="POST"
    >
      <h1 className="text-2xl font-bold">Login</h1>

      <div>
        <label className="block">E-mail</label>
        <input type="email" {...register("email")} />
        {errors.email && (
          <p className="text-red-500">
            <small>{errors.email.message}</small>
          </p>
        )}
      </div>
      <div>
        <label className="block">Password</label>
        <input type="password" {...register("password")} />
        {errors.password && (
          <p className="text-red-500">
            <small>{errors.password.message}</small>
          </p>
        )}
      </div>
      <Button type="submit" disabled={!isValid}>
        Login
      </Button>

      <Link to="/register" className="text-blue-500 underline">
        Register
      </Link>
    </form>
  );
}

export const action = async ({ request }: any) => {
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

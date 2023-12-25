import { ActionFunction } from '@remix-run/server-runtime'
import { Form, useActionData } from "@remix-run/react";
import { PrismaClient } from "@prisma/client";
import { compare } from 'bcrypt';
import { createUserSession, login } from '~/utils/session.server';
import { badRequest } from 'remix-utils';

export default function Register() {
  const actionData = useActionData<typeof action>();

  return (
    <Form className="flex flex-col gap-y-4 justify-center items-center min-h-[100svh]" method="POST">
      <h1 className="font-bold text-2xl">Login</h1>
      <input placeholder="Enter your e-mail address" type="email" name="email" required />
      <input placeholder="Enter your password" type="password" name="password" required minLength={8} maxLength={16} />
      <button type="submit">Login</button>
      <p className="text-xs text-red-400">{actionData?.error}</p>
    </Form>
  );
}

export const action: ActionFunction = async ({
  request,
}: any) => {
  const form = await request.formData();

  const data = {
    email: form.get("email"),
    password: form.get("password"),
  }

  const user = await login({ email: data.email, password: data.password });

  if (!user) {
    return badRequest({
      error: 'Username and/or password are invalid',
    });
  }

  return createUserSession(user.id, "/dashboard");
}

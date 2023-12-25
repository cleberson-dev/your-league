import { ActionFunction } from '@remix-run/server-runtime'
import { Form, useActionData } from "@remix-run/react";
import { PrismaClient } from "@prisma/client";
import { compare } from 'bcrypt';

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
  const db = new PrismaClient();
  const form = await request.formData();

  const data = {
    email: form.get("email"),
    password: form.get("password"),
  }

  const user = await db.user.findUnique({ where: { email: data.email } });
  if (!user) {
    return { ok: false, error: "User not found" };
  }
  
  const doPasswordsMatch = await compare(data.password, user.password);
  if (!doPasswordsMatch) {
    return { ok: false, error: "E-mail and Password invalids" };
  }

  console.log('User logged in', user);

  return { ok: true };
}


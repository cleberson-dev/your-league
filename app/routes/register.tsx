import { ActionFunction } from '@remix-run/server-runtime'
import { Form, useActionData } from "@remix-run/react";
import { PrismaClient } from "@prisma/client";
import { hash } from 'bcrypt';

export default function Register() {
  const actionData = useActionData<typeof action>();

  return (
    <Form className="flex flex-col gap-y-4 justify-center items-center min-h-[100svh]" method="POST">
      <h1 className="font-bold text-2xl">Register right now!!</h1>
      <input placeholder="Enter your Name" name="name" required maxLength={32} />
      <input placeholder="Enter your e-mail address" type="email" name="email" required />
      <input placeholder="Enter your password" type="password" name="password" required minLength={8} maxLength={16} />
      <input placeholder="Re-enter your password" type="password" name="password_2" required minLength={8} maxLength={16} />
      <button type="submit">Create</button>
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
    name: form.get("name"),
    email: form.get("email"),
    password: form.get("password"),
    password2: form.get("password_2"),
  }

  if (data.password !== data.password2) {
    return { ok: false, error: "Passwords don't match" };
  };

  const hashedPassword = await hash(data.password, 10);

  const result = await db.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
    },
  });

  console.log('User created', result);

  return { ok: true };
}


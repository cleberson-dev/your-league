import { createCookieSessionStorage, redirect } from "@remix-run/node";
import { db } from "./db.server";
import * as bcrypt from "bcrypt";

type LoginForm = {
  email: string;
  password: string;
};

type RegisterForm = LoginForm & { name: string; };

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET should be set");
}

export const register = async ({ name, email, password }: RegisterForm) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await db.user.create({
    data: { name, email, password: hashedPassword },
  });

  return { id: user.id, name: user.name, email: user.email };
}

export const login = async ({ email, password }: LoginForm) => {
  const user = await db.user.findUnique({ where: { email } });
  if (!user) return null;

  const isCorrectPassword = await bcrypt.compare(password, user.password);
  if (!isCorrectPassword) return null;

  return { id: user.id, name: user.name, email: user.email };
};

export const logout = async (request: Request) => {
  const session = await getUserSession(request);
  return redirect("/login", {
    headers: {
      "Set-Cookie": await storage.destroySession(session),
    },
  });
};

const storage = createCookieSessionStorage({
  cookie: {
    name: "YL_Session",
    secure: process.env.NODE_ENV === "production",
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
});

export const createUserSession = async (userId: string, redirectTo: string) => {
  const session = await storage.getSession();
  session.set("userId", userId);

  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
};

export const getUserSession = async (request: Request) => {
  return storage.getSession(request.headers.get("Cookie"));
};

export const getUser = async (request: Request) => {
  const userId = await getUserId(request);
  if (typeof userId !== "string") return null;

  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true },
    });
    return user;
  } catch {
    throw logout(request);
  }
};

export const getUserId = async (request: Request) => {
  const session = await getUserSession(request);
  const userId = session.get("userId");

  if (!userId || typeof userId !== "string") return null;
  return userId;
};

export const requireUserId = async (request: Request, redirectTo: string = new URL(request.url).pathname) => {
  const session = await getUserSession(request);
  const userId = session.get("userId");

  if (!userId || typeof userId !== "string") {
    const searchParams = new URLSearchParams([
      ["redirectTo", redirectTo],
    ]);
    throw redirect(`/login?${searchParams}`);
  }

  return userId;
}

// It's not a dashboard, but I couldn't figure out a name hihi

import { useLoaderData } from "@remix-run/react";
import { getUser, requireUserId } from "~/utils/session.server"

export const loader = async ({ request }: any) => {
  await requireUserId(request);
  const user = await getUser(request);

  return { user };
}

export default function Dashboard() {
  const { user } = useLoaderData<typeof loader>();
  return (
    <>
      <h1 className="font-bold text-4xl">Hello, { user?.name }!</h1>
      <form action="/logout" method="POST">
        <button type="submit" className="bg-red-500 p-2 text-white">Logout</button>
      </form>
    </>
  )
}

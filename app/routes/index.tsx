import { MetaFunction } from "@remix-run/react/dist/routeModules";
import { redirect } from "@remix-run/server-runtime";
import { requireUserId } from "~/utils/session.server";

export const meta: MetaFunction = () => ({
  title: "Home | Your League",
});

export const loader = async ({ request }: { request: Request }) => {
  await requireUserId(request);

  return redirect("/dashboard");
};

export default function Index() {
  return (
    <div className="min-h-[100svh] px-16 py-12">
      <h1>Home Page</h1>
    </div>
  );
}

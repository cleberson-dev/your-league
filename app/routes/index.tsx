import { MetaFunction } from "@remix-run/react/dist/routeModules";

export const meta: MetaFunction = () => ({
  title: "Home | Your League",
});

export default function Index() {
  return (
    <div className="min-h-[100svh] py-12 px-16">
      <h1>Home Page</h1>
    </div>
  );
}

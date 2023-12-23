import { MetaFunction } from "@remix-run/react/dist/routeModules";
import TableAndFixtures from "~/components/table-fixtures";

export let meta: MetaFunction = () => {
  return {
    title: "Remix Template",
  };
};

export default function Index() {
  return (
    <div className="flex min-h-[100svh] flex-col items-center justify-center">
      <h1 className="text-4xl font-bold my-8">It's YOUR LEAGUE!</h1>
      <TableAndFixtures />
    </div>
  );
}

import { MetaFunction } from "@remix-run/react/dist/routeModules";
import PaginationControls from "~/components/pagination-controls";
import LeaguesList from "~/components/leagues-list";
import TeamsList from "~/components/teams-list";
import Button from "~/components/button";

export let meta: MetaFunction = () => {
  return {
    title: "Your League",
  };
};

export default function Index() {
  return (
    <div className="min-h-[100svh] py-12 px-16">
     <h1>Home Page</h1>
    </div>
  );
}

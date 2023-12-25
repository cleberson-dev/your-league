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

      {/* User Leagues */}
      <div className="mb-16">
        <div className="flex justify-between items-center mb-2">
          <h1 className="font-bold text-2xl">Your leagues</h1>
          <Button>+ Create a new League</Button>
        </div>
        <PaginationControls isNext />
        <LeaguesList />
      </div>

      {/* User Teams */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h1 className="font-bold text-2xl">Your teams</h1>
          <Button>+ Create a new Team</Button>
        </div>
        <PaginationControls isNext />
        <TeamsList />
      </div>
    </div>
  );
}

// It's not a dashboard, but I couldn't figure out a name hihi

import { useLoaderData } from "@remix-run/react";
import Button from "~/components/button";
import LeaguesList from "~/components/leagues-list";
import PaginationControls from "~/components/pagination-controls";
import TeamsList from "~/components/teams-list";
import { db } from "~/utils/db.server";
import { getUser, requireUserId } from "~/utils/session.server"

export const loader = async ({ request }: any) => {
  const userId = await requireUserId(request);
  const user = await getUser(request);
  const leagues = await db.league.findMany({ where: { userId } });
  const teams = await db.team.findMany({ where: { userId }});

  console.log({ userId, leagues, teams });

  return { user };
}

export default function Dashboard() {
  const { user } = useLoaderData<typeof loader>();
  return (
    <div className="min-h-[100svh]">
      <h1 className="font-bold text-4xl">Hello, { user?.name }!</h1>
      <form action="/logout" method="POST">
        <button type="submit" className="bg-red-500 p-2 text-white">Logout</button>
      </form>
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
  )
}

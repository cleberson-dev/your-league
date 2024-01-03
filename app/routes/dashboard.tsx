// It's not a dashboard, but I couldn't figure out a name hihi

import { useLoaderData } from "@remix-run/react";
import Button from "~/components/button";
import LeaguesList from "~/components/leagues-list";
import TeamsList from "~/components/teams-list";
import { db } from "~/utils/db.server";
import { getUser, requireUserId } from "~/utils/session.server";
import * as service from "~/utils/service.server";
import CreateLeagueModal from "~/components/create-league.modal";
import CreateTeamModal from "~/components/create-team.modal";
import { useModal } from "~/contexts/Modal.context";

export const meta = () => ({
  title: "Dashboard | Your League",
});

export const loader = async ({ request }: any) => {
  const userId = await requireUserId(request);
  const user = await getUser(request);
  const leagues = (
    await db.league.findMany({
      where: { userId },
      select: { id: true, name: true, teamIDs: true },
      orderBy: { createdAt: "desc" },
    })
  ).map((league) => ({
    ...league,
    teamIDs: undefined,
    teamsCount: league.teamIDs.length,
  }));
  const teams = await db.team.findMany({
    where: { userId },
    select: { id: true, name: true, logoFiletype: true },
    orderBy: { createdAt: "desc" },
  });

  return { user, leagues, teams };
};

export const action = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const actionType = formData.get("actionType");

  switch (actionType) {
    case "createTeam":
      return service.createTeam(request, formData);
    case "createLeague":
      return service.createLeague(request, formData);
    default:
      return { ok: true };
  }
};

export default function Dashboard() {
  const { user, teams, leagues } = useLoaderData<typeof loader>();
  const { setModal, destroyModal } = useModal();

  const openCreateLeagueModal = () =>
    setModal(<CreateLeagueModal teams={teams} onClose={destroyModal} />);

  const openCreateTeamModal = () =>
    setModal(<CreateTeamModal onClose={destroyModal} />);

  return (
    <>
      <header className="fixed top-0 flex w-full justify-end p-2">
        <form action="/logout" method="POST">
          <button
            type="submit"
            className="rounded p-2 text-xs font-medium text-red-500 transition-colors hover:bg-red-500 hover:text-white"
          >
            Logout
          </button>
        </form>
      </header>
      <div className="min-h-[100svh] px-16 py-12">
        <h1 className="mb-16 text-4xl font-bold">
          Welcome, <span className="text-purple-500">{user?.name}!</span>
        </h1>

        {/* User Leagues */}
        <div className="mb-16">
          <div className="mb-2 flex items-center justify-between">
            <h1 className="text-2xl font-bold">Your leagues</h1>
            <Button onClick={openCreateLeagueModal}>
              + Create a new League
            </Button>
          </div>
          <LeaguesList leagues={leagues} removable />
        </div>

        {/* User Teams */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <h1 className="text-2xl font-bold">Your teams</h1>
            <Button onClick={openCreateTeamModal}>+ Create a new Team</Button>
          </div>
          <TeamsList teams={teams} />
        </div>
      </div>
    </>
  );
}

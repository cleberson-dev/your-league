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
import Logo from "~/components/logo";

export const meta = () => ({
  title: "Dashboard | Your League",
});

export const loader = async ({ request }: { request: Request }) => {
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
  const { showModal, hideModal } = useModal();

  const openCreateLeagueModal = () =>
    showModal(<CreateLeagueModal teams={teams} onClose={hideModal} />);

  const openCreateTeamModal = () =>
    showModal(<CreateTeamModal onClose={hideModal} />);

  return (
    <>
      <header className="fixed top-0 flex w-full items-center justify-center bg-white p-3 dark:bg-dark">
        <Logo className="h-6" />
      </header>
      <div className="min-h-[100svh] px-16 py-12 pl-20 pt-20">
        <h1 className="mb-16 text-4xl font-bold">
          Welcome, <span className="text-violet">{user?.name}!</span>
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
          <TeamsList teams={teams} removable />
        </div>
      </div>
    </>
  );
}

// It's not a dashboard, but I couldn't figure out a name ><

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

const className = {
  header: "fixed top-0 flex w-full items-center justify-center bg-white p-3 dark:bg-dark",
  logo: "h-6",
  content: "min-h-[100svh] px-16 py-12 pl-20 pt-20",
  title: "mb-16 text-4xl font-bold",
  userName: "text-violet",
  sectionTitle: "text-2xl font-bold",
  userLeaguesContainer: "mb-16",
  sectionHeader: "mb-2 flex items-center justify-between",
};

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
      <header className={className.header}>
        <Logo className={className.logo} />
      </header>
      <div className={className.content}>
        <h1 className={className.title}>
          Welcome, <span className={className.userName}>{user?.name}!</span>
        </h1>

        {/* User Leagues */}
        <div className={className.userLeaguesContainer}>
          <div className={className.sectionHeader}>
            <h1 className={className.sectionTitle}>Your leagues</h1>
            <Button onClick={openCreateLeagueModal}>
              + Create a new League
            </Button>
          </div>
          <LeaguesList leagues={leagues} removable />
        </div>

        {/* User Teams */}
        <div>
          <div className={className.sectionHeader}>
            <h1 className={className.sectionTitle}>Your teams</h1>
            <Button onClick={openCreateTeamModal}>+ Create a new Team</Button>
          </div>
          <TeamsList teams={teams} removable />
        </div>
      </div>
    </>
  );
}

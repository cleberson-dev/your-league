// It's not a dashboard, but I couldn't figure out a name hihi

import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import Button from "~/components/button";
import LeaguesList from "~/components/leagues-list";
import TeamsList from "~/components/teams-list";
import { db } from "~/utils/db.server";
import { getUser, getUserId, requireUserId } from "~/utils/session.server";
import { writeFile } from "fs/promises";
import path from "path";
import { badRequest } from "remix-utils";
import Select from "react-select";

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
  const name = formData.get("name") as string;

  const logo = formData.get("logo") as Blob;
  const hasLogo = logo.size > 0;
  const isValidLogoType = logo.type.match(/jpg|jpeg|png/);
  
  if (!name) return badRequest({ message: "Invalid form" });

  if (hasLogo && !isValidLogoType) {
    return badRequest({ message: "Invalid form" });
  }

  const logoType = logo.type.split("/").at(-1) || "";
  const userId = (await getUserId(request)) as string;
  const createdTeam = await db.team.create({
    data: { name, userId, logoFiletype: hasLogo ? logoType : undefined },
  });
  if (logo) {
    const buffer = Buffer.from(await logo.arrayBuffer());
    const filename = `${createdTeam.id}.${logoType}`;
    await writeFile(path.join("public", "team-logos", filename), buffer);
  }

  return createdTeam;
};

export default function Dashboard() {
  const { user, teams, leagues } = useLoaderData<typeof loader>();
  const [createLeagueModal, setCreateLeagueModal] = useState(false);
  const [createTeamModal, setCreateTeamModal] = useState(false);

  const [selectedTeamIds, setSelectedTeamIds] = useState<(string | null)[]>([null]);

  return (
    <>
      <header className="fixed top-0 w-full flex justify-end p-2">
        <form action="/logout" method="POST">
          <button type="submit" className="text-red-500 p-2 text-xs font-medium rounded hover:bg-red-500 hover:text-white transition-colors">
            Logout
          </button>
        </form>
      </header>
      <div className="min-h-[100svh] px-16 py-12">
        <h1 className="text-4xl font-bold mb-16">Welcome, <span className="text-purple-500">{user?.name}!</span></h1>
        
        {/* User Leagues */}
        <div className="mb-16">
          <div className="mb-2 flex items-center justify-between">
            <h1 className="text-2xl font-bold">Your leagues</h1>
            <Button onClick={() => setCreateLeagueModal(true)}>
              + Create a new League
            </Button>
          </div>
          <LeaguesList leagues={leagues} />
        </div>

        {/* User Teams */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <h1 className="text-2xl font-bold">Your teams</h1>
            <Button onClick={() => setCreateTeamModal(true)}>
              + Create a new Team
            </Button>
          </div>
          <TeamsList teams={teams} />
        </div>

        {/* TODO AFTER SUCCESSFULLY CREATE TEAMS THROUGH MODAL */}
        {
        createLeagueModal && (
          <div className="h-[100svh] w-full absolute top-0 left-0 bg-black/10 flex justify-center items-center">
            <form className="rounded w-3/4 h-3/4 bg-white shadow p-8 flex flex-col">
              <h1 className="font-bold text-2xl mb-10">Create your league</h1>
              <div className="flex flex-grow flex-col gap-y-8 overflow-auto">
                <div>
                  <label className="block">Name</label>
                  <input
                    required
                    name="name"
                    className="w-60 rounded border border-solid border-black/10"
                  />
                </div>
                <div>
                  <label className="block">Teams ({selectedTeamIds.filter(id => id !== null).length} included)</label>
                  <div className="flex flex-col gap-y-2 mb-2">
                    {selectedTeamIds.map((id, idx) => (
                      <Select
                        name={`teamIDs[${idx}]`} 
                        placeholder={`Team ${idx + 1}`}
                        options={
                          teams.filter(team => !selectedTeamIds.slice(0, idx).includes(team.id)).map(team => ({ value: team.id, label: team.name }))
                        }
                        onChange={e => {
                          setSelectedTeamIds(prev => prev.map((teamId, teamIdIdx) => teamIdIdx === idx ? e!.value : teamId))
                        }}  
                      />
                      ))
                    }            
                  </div>
                  <Button disabled={selectedTeamIds.length === teams.length} type="button" onClick={() => setSelectedTeamIds(prev => [...prev, null])}>+</Button>
                </div>
              </div>
              <div className="flex justify-end gap-x-2">
                <Button type="submit">Create</Button>
                <Button type="button" onClick={() => setCreateLeagueModal(false)}>
                  Close
                </Button>
              </div>
            </form>
          </div>
        )
      }

        {createTeamModal && (
          <div className="fixed left-0 top-0 flex h-[100svh] w-full items-center justify-center bg-black/10">
            <form
              encType="multipart/form-data"
              className="flex h-3/4 w-3/4 flex-col rounded bg-white p-8 shadow"
              method="POST"
            >
              <h1 className="mb-8 text-2xl font-bold">Create your team</h1>
              <div className="flex flex-grow flex-col gap-y-8">
                <div>
                  <label className="block">Name</label>
                  <input
                    required
                    name="name"
                    className="w-60 rounded border border-solid border-black/10"
                  />
                </div>
                <div>
                  <label className="block">Logo</label>
                  <input
                    type="file"
                    name="logo"
                    accept="image/jpeg,image/png"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-x-2">
                <Button type="submit">Create</Button>
                <Button type="button" onClick={() => setCreateTeamModal(false)}>
                  Close
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </>
  );
}

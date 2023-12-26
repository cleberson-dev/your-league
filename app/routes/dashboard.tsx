// It's not a dashboard, but I couldn't figure out a name hihi

import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import Button from "~/components/button";
import LeaguesList from "~/components/leagues-list";
import PaginationControls from "~/components/pagination-controls";
import TeamsList from "~/components/teams-list";
import { db } from "~/utils/db.server";
import { getUser, getUserId, requireUserId } from "~/utils/session.server";
import { writeFile } from 'fs/promises';
import path from "path";
import { badRequest } from "remix-utils";

export const loader = async ({ request }: any) => {
  const userId = await requireUserId(request);
  const user = await getUser(request);
  const leagues = (await db.league.findMany({ where: { userId }, select: { id: true, name: true, teamIDs: true, }, orderBy: { createdAt: "desc" } })).map(league => ({...league, teamIDs: undefined, teamsCount: league.teamIDs.length}));
  const teams = await db.team.findMany({ where: { userId }, select: { id: true, name: true, logoFiletype: true }, orderBy: { createdAt: "desc" } });

  return { user, leagues, teams };
}

export const action = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const name = formData.get("name") as string;
  
  const logo = formData.get("logo") as Blob;
  const logoType = logo.type.split("/").at(-1) || "";
  const isValidLogoType = ["png", "jpeg", "jpg"].includes(logoType);

  if (!name || !logo || !isValidLogoType) return badRequest({
    message: "Invalid form",
  });

  const userId = await getUserId(request) as string;
  const createdTeam = await db.team.create({
    data: { name, userId, logoFiletype: logoType },
  });
  const buffer = Buffer.from(await logo.arrayBuffer());
  const filename = `${createdTeam.id}.${logoType}`;
  await writeFile(path.join("public", "team-logos", filename), buffer);
  
  return createdTeam;
}

export default function Dashboard() {
  const { user, teams, leagues } = useLoaderData<typeof loader>();
  const [createLeagueModal, setCreateLeagueModal] = useState(false);
  const [createTeamModal, setCreateTeamModal] = useState(false);

  return (
    <div className="min-h-[100svh] py-12 px-16">
      <h1 className="font-bold text-4xl">Hello, { user?.name }!</h1>
      <form action="/logout" method="POST">
        <button type="submit" className="bg-red-500 p-2 text-white">Logout</button>
      </form>
       {/* User Leagues */}
       <div className="mb-16">
        <div className="flex justify-between items-center mb-2">
          <h1 className="font-bold text-2xl">Your leagues</h1>
          <Button onClick={() => setCreateLeagueModal(true)}>+ Create a new League</Button>
        </div>
        <LeaguesList leagues={leagues} />
      </div>

      {/* User Teams */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h1 className="font-bold text-2xl">Your teams</h1>
          <Button onClick={() => setCreateTeamModal(true)}>+ Create a new Team</Button>
        </div>
        <TeamsList teams={teams} />
      </div>


      {/* TODO AFTER SUCCESSFULLY CREATE TEAMS THROUGH MODAL */}
      {/* {
        createLeagueModal && (
          <div className="h-[100svh] w-full absolute top-0 left-0 bg-black/10 flex justify-center items-center">
            <form className="rounded w-3/4 h-3/4 bg-white shadow p-8">
              <h1 className="font-bold text-2xl" onClick={() => {
                fetcher.load("/api/leagues");
              }}>Create your league</h1>
              <input placeholder="Name" name="name" />
              <Select 
                options={[
                  { value: '1', label: 'Time 1' },
                  { value: '2', label: 'Time 2' },
                  { value: '3', label: 'Time 3' },
                  { value: '4', label: 'Time 4' },
                  { value: '5', label: 'Time 5' },
                  { value: '6', label: 'Time 6' },
                  { value: '7', label: 'Time 7' },
                  { value: '8', label: 'Time 8' },
                  { value: '9', label: 'Time 9' },
                  { value: '10', label: 'Time 10' },
                ]}
                isMulti 
              />
            </form>
          </div>
        )
      } */}

      {
        createTeamModal && (
          <div className="h-[100svh] w-full fixed top-0 left-0 bg-black/10 flex justify-center items-center">
            <form encType="multipart/form-data" className="rounded w-3/4 h-3/4 bg-white shadow p-8 flex flex-col" method="POST">
              <h1 className="font-bold text-2xl mb-8">Create your team</h1>
              <div className="flex-grow flex flex-col gap-y-8">
                <div>
                  <label className="block">Name</label>
                  <input
                    required 
                    name="name" 
                    className="w-60 border border-solid border-black/10 rounded" />
                </div>
                <div>
                  <label className="block">Logo</label>
                  <input type="file" name="logo" accept="image/jpeg,image/png" />
                </div>
              </div>
              <div className="flex justify-end gap-x-2">
                <Button type="submit">Create</Button>
                <Button type="button" onClick={() => setCreateTeamModal(false)}>Close</Button>
              </div>
            </form>
          </div>
        )
      }
    </div>
  )
}

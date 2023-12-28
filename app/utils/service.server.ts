import path from "path";
import { writeFile } from "fs/promises";
import { badRequest } from "remix-utils";
import { getUserId } from "./session.server";
import { db } from "./db.server";
import { randomizeArray } from ".";
import League from "~/entities/League";
import { redirect } from "@remix-run/node";

export const saveLogo = async (path: string, blob: Blob) => {
  const buffer = Buffer.from(await blob.arrayBuffer());
  await writeFile(path, buffer);
}

export const createTeam = async (request: Request, formData: FormData) => {
  const name = formData.get("name") as string;
  const logo = formData.get("logo") as Blob;

  const hasFileData = logo.size > 0;
  const [logoFiletype] = logo.type.match(/jpg|jpeg|png|svg/) || [];

  if (!name) return badRequest({ message: "Invalid form" });

  if (hasFileData && !logoFiletype) {
    return badRequest({ message: "Invalid form" });
  }

  const userId = (await getUserId(request)) as string;
  const createdTeam = await db.team.create({
    data: { 
      name, 
      logoFiletype, 
      user: { 
        connect: { 
          id: userId 
        } 
      },  
    },
  });

  if (hasFileData) {
    const filename = `${createdTeam.id}.${logoFiletype}`;
    const logoPath = path.join("public", "team-logos", filename);
    saveLogo(logoPath, logo);
  }

  return createdTeam;
};

export const createLeague = async (request: Request, formData: FormData) => {
  const userId = (await getUserId(request))!;

  const name = formData.get("name") as string;
  const teams = formData.getAll("teams").map(team => JSON.parse(team as string));

  if (teams.length % 2 !== 0) return badRequest({ error: "Number of teams must be even" });
  
  const teamsSortedRandomly = randomizeArray(teams);
  const league = await db.league.create({
    data: {
      name,
      teams: {
        connect: teamsSortedRandomly.filter(team => !!team.id).map(team => ({ id: team.id })),
        create: teamsSortedRandomly.filter(team => !team.id && !!team.name).map(team => ({ name: team.name, user: { connect: { id: userId } } })),
      },
      user: {
        connect: {
          id: userId,
        },
      },
    },
    include: {
      teams: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  const entityLeague = League.create(league.name, league.teams);
  await db.league.update({ where: { id: league.id }, data: { fixtures: entityLeague.fixtures.map(randomizeArray) } });


  return redirect(`/leagues/${league.id}`);
}
 
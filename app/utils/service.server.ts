import path from "path";
import { writeFile } from "fs/promises";
import { badRequest } from "remix-utils";
import { getUserId } from "./session.server";
import { db } from "./db.server";

export const saveLogo = async (path: string, blob: Blob) => {
  const buffer = Buffer.from(await blob.arrayBuffer());
  await writeFile(path, buffer);
}

export const createTeam = async (request: Request, formData: FormData) => {
  const name = formData.get("name") as string;
  const logo = formData.get("logo") as Blob;

  const hasFileData = logo.size > 0;
  const isLogo = logo.type.match(/jpg|jpeg|png/);

  if (!name) return badRequest({ message: "Invalid form" });

  if (hasFileData && !isLogo) {
    return badRequest({ message: "Invalid form" });
  }

  const logoFiletype = hasFileData ? logo.type.split("/").at(-1) : undefined;
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
  console.log({ userId, name, teams });

  if (teams.length % 2 !== 0) return badRequest({ error: "Number of teams must be even" });

  await db.league.create({
    data: {
      name,
      teams: {
        connect: teams.filter(team => !!team.id).map(team => ({ id: team.id })),
        create: teams.filter(team => !team.id && !!team.name).map(team => ({ name: team.name, user: { connect: { id: userId } } })),
      },
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });

  return { ok: true };
}

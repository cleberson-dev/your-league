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
    data: { name, userId, logoFiletype },
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
  const teamIDs = [...formData.entries()].filter(([key]) => key.startsWith("teamIDs")).map(([,value]) => value as string);

  if (teamIDs.length % 2 !== 0) return badRequest({ error: "Number of teams must be even" });

  await db.league.create({
    data: {
      name: name,
      teams: {
        connect: teamIDs.map(teamId => ({ id: teamId })),
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
